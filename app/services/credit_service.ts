import User from '#models/user'
import CreditTransaction from '#models/credit_transaction'
import { creditRepository } from '#repositories/credit_repository'
import type { CreditRepository } from '#repositories/credit_repository'

export class CreditService {
  constructor(private readonly repository: CreditRepository = creditRepository) {}

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

    const result = await this.repository.deductCredits(userId, amount, description, metadata)
    if (!result.transaction) {
      throw new Error(
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

  /**
   * Memberikan bonus registrasi awal (10 kredit gratis) untuk user baru
   */
  async grantSignupBonusIfEligible(userId: number): Promise<void> {
    const existingBonus = await CreditTransaction.query()
      .where('userId', userId)
      .where('type', 'signup_bonus')
      .first()

    if (!existingBonus) {
      await this.addCredits(
        userId,
        10,
        'signup_bonus',
        'Bonus 10 Kredit Gratis Selamat Datang di SiapAjar',
        { initial: true }
      )
    }
  }
}

export const creditService = new CreditService()
