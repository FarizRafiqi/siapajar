import User from '#models/user'
import Package from '#models/package'
import type CreditTransaction from '#models/credit_transaction'
import { randomUUID } from 'node:crypto'
import { AiJobStillProcessingError } from '#services/ai_queue_errors'
import {
  creditRepository,
  type CreditBalanceSyncOptions,
  type CreditBalanceSyncResult,
  type CreditRepository,
} from '#repositories/credit_repository'

const TESTING_PACKAGE_NAME = 'internal_testing_unlimited'

export class InsufficientCreditsError extends Error {
  readonly code = 'INSUFFICIENT_CREDITS'
}

export class CreditService {
  constructor(private readonly repository: CreditRepository = creditRepository) {}

  /**
   * Menyamakan cache saldo user dengan transaksi kredit terbaru dalam batch kecil.
   * Dipakai oleh maintenance job, bukan pada setiap request web.
   */
  async synchronizeAllUserBalances(
    options: CreditBalanceSyncOptions = { batchSize: 250 }
  ): Promise<CreditBalanceSyncResult> {
    const requestedBatchSize = Number(options.batchSize)
    const batchSize = Number.isFinite(requestedBatchSize)
      ? Math.min(Math.max(Math.trunc(requestedBatchSize), 50), 500)
      : 250

    return this.repository.synchronizeAllUserBalances({ batchSize })
  }

  /** Sinkronisasi satu user hanya dipakai sebagai recovery saat debit gagal. */
  async synchronizeUserBalance(userId: number): Promise<boolean> {
    return this.repository.synchronizeUserBalance(userId)
  }

  /**
   * Mengambil saldo kredit terkini milik user
   */
  async getBalance(userId: number): Promise<number> {
    const user = await User.findOrFail(userId)
    return user.creditsBalance ?? 0
  }

  /**
   * Memeriksa apakah user memiliki cukup kredit
   */
  async hasEnoughCredits(userId: number, requiredCredits: number = 1): Promise<boolean> {
    const balance = await this.getBalance(userId)
    return balance >= requiredCredits
  }

  /**
   * Akun admin dan paket internal testing tidak menghabiskan saldo kredit.
   * User biasa tetap menggunakan saldo kredit yang tercatat di database.
   */
  async isUnlimitedUser(user: User): Promise<boolean> {
    if (user.role === 'admin') return true
    if (!user.packageId) return false

    const packageRecord = await Package.find(user.packageId)
    return packageRecord?.name === TESTING_PACKAGE_NAME
  }

  async hasEnoughGenerationCredits(user: User, requiredCredits: number = 1): Promise<boolean> {
    if (await this.isUnlimitedUser(user)) return true
    return this.hasEnoughCredits(user.id, requiredCredits)
  }

  /** Mengurangi biaya generator dan mengembalikan saldo terbaru untuk UI navbar. */
  async chargeGeneration(
    user: User,
    amount: number,
    description: string,
    metadata?: Record<string, any>
  ): Promise<number | null> {
    if (await this.isUnlimitedUser(user)) return null

    const transaction = await this.deductCredits(user.id, amount, description, metadata)
    return transaction.balanceAfter
  }

  /**
   * Mengurangi kredit untuk eksekusi generator AI atau download dokumen
   */
  async deductCredits(
    userId: number,
    amount: number,
    description: string,
    metadata?: Record<string, any>
  ): Promise<CreditTransaction> {
    if (amount <= 0) {
      throw new Error('Jumlah kredit yang dikurangi harus lebih dari 0')
    }

    let result = await this.repository.deductCredits(userId, amount, description, metadata)

    // Saldo cache lama mungkin tertinggal dari transaksi terakhir. Recovery ini
    // hanya berjalan setelah debit gagal, sehingga jalur sukses tetap satu transaksi.
    if (!result.transaction && (await this.synchronizeUserBalance(userId))) {
      result = await this.repository.deductCredits(userId, amount, description, metadata)
    }

    if (!result.transaction) {
      throw new InsufficientCreditsError(
        `Saldo kredit tidak mencukupi. Anda memiliki ${result.currentBalance} kredit, dibutuhkan ${amount} kredit.`
      )
    }

    return result.transaction
  }

  /**
   * Menambahkan kredit (Top-up, bonus registrasi, atau refund)
   */
  async addCredits(
    userId: number,
    amount: number,
    type: 'signup_bonus' | 'topup' | 'refund',
    description: string,
    metadata?: Record<string, any>
  ): Promise<CreditTransaction> {
    if (amount <= 0) {
      throw new Error('Jumlah kredit yang ditambahkan harus lebih dari 0')
    }

    return this.repository.addCredits(userId, amount, type, description, metadata)
  }

  async refundGeneration(
    userId: number,
    amount: number,
    reservationKey: string,
    description: string
  ): Promise<CreditTransaction | null> {
    if (amount <= 0 || !reservationKey) return null
    return this.repository.refundUsageOnce(userId, amount, reservationKey, description)
  }

  async attachAiJobToGeneration(input: { userId: number; reservationKey: string; jobKey: string }) {
    return this.repository.attachAiJobToGeneration(input)
  }

  async completeGenerationAiJob(input: {
    userId: number
    reservationKey: string
    jobKey: string
    amount: number
    description: string
  }) {
    return this.repository.completeGenerationAiJob(input)
  }

  async completeGenerationReservation(userId: number, reservationKey: string) {
    return this.repository.settleGenerationReservation({ userId, reservationKey })
  }

  async requestGenerationRefund(
    userId: number,
    amount: number,
    reservationKey: string,
    description: string
  ) {
    if (amount <= 0 || !reservationKey) return null
    return this.repository.requestGenerationRefund({
      userId,
      amount,
      reservationKey,
      description,
    })
  }

  /**
   * Debit the document credit immediately before expensive work and reverse
   * it exactly once if AI/persistence fails. This closes the preflight race
   * where two requests both pass a balance check and only one can debit after
   * paying the provider.
   */
  async withGenerationCredit<T>(
    user: User,
    amount: number,
    description: string,
    operation: string,
    work: (reservationKey: string) => Promise<T>
  ): Promise<T> {
    const reservationKey = `generation:${user.id}:${operation}:${randomUUID()}`
    let charged = false
    try {
      await this.chargeGeneration(user, amount, description, { reservationKey, operation })
      charged = true
      const result = await work(reservationKey)
      await this.repository.settleGenerationReservation({ userId: user.id, reservationKey })
      return result
    } catch (error) {
      if (charged) {
        await this.repository.requestGenerationRefund({
          userId: user.id,
          amount,
          reservationKey,
          description: `Pengembalian kredit: ${description}`,
        })
        if (error instanceof AiJobStillProcessingError) {
          // The job owns settlement after the waiter times out. Its durable
          // terminal hook refunds only after every linked AI job has stopped.
          throw error
        }
      }
      throw error
    }
  }

  /**
   * Memberikan bonus registrasi awal (10 kredit gratis) untuk user baru
   */
  async grantSignupBonusIfEligible(userId: number): Promise<void> {
    await this.repository.addSignupBonusIfEligible(userId)
  }
}

export const creditService = new CreditService()
