import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import CreditTransaction from '#models/credit_transaction'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export type CreditDeductionResult = {
  transaction: CreditTransaction | null
  currentBalance: number
  newBalance: number
}

export type CreditBalanceSyncOptions = {
  batchSize: number
}

export type CreditBalanceSyncResult = {
  batchesProcessed: number
  usersScanned: number
  balancesUpdated: number
  lastUserId: number | null
}

export class CreditRepository {
  async synchronizeUserBalance(userId: number): Promise<boolean> {
    return db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('id', userId).forUpdate().first()
      if (!user) return false

      const latestTransaction = await CreditTransaction.query({ client: trx })
        .where('userId', userId)
        .orderBy('createdAt', 'desc')
        .orderBy('id', 'desc')
        .first()

      if (!latestTransaction || latestTransaction.balanceAfter === user.creditsBalance) {
        return false
      }

      user.creditsBalance = latestTransaction.balanceAfter
      user.useTransaction(trx)
      await user.save()
      return true
    })
  }

  async synchronizeAllUserBalances(
    options: CreditBalanceSyncOptions
  ): Promise<CreditBalanceSyncResult> {
    let lastUserId = 0
    let batchesProcessed = 0
    let usersScanned = 0
    let balancesUpdated = 0

    while (true) {
      const batch = await db.transaction(async (trx) => {
        // Lock only a small batch and skip users currently being charged/top-up'd.
        // This keeps the maintenance job from blocking interactive requests.
        const users = await User.query({ client: trx })
          .select(['id', 'creditsBalance'])
          .where('id', '>', lastUserId)
          .orderBy('id', 'asc')
          .limit(options.batchSize)
          .forUpdate()
          .skipLocked()

        if (users.length === 0) return null

        const userIds = users.map((user) => user.id)
        const currentBalances = new Map(
          users.map((user) => [user.id, user.creditsBalance] as const)
        )
        const latestTransactions = await CreditTransaction.query({ client: trx })
          .select(['userId', 'balanceAfter'])
          .whereIn('userId', userIds)
          .distinctOn('userId')
          .orderBy('userId', 'asc')
          .orderBy('createdAt', 'desc')
          .orderBy('id', 'desc')

        const updates = latestTransactions.filter(
          (transaction) => transaction.balanceAfter !== currentBalances.get(transaction.userId)
        )

        let updatedCount = 0
        if (updates.length > 0) {
          const bindings: number[] = []
          const values = updates
            .map((transaction) => {
              bindings.push(transaction.userId, transaction.balanceAfter)
              return '(?, ?)'
            })
            .join(', ')

          const result = (await trx.rawQuery(
            `
              UPDATE users AS u
              SET credits_balance = latest.balance_after
              FROM (VALUES ${values}) AS latest(user_id, balance_after)
              WHERE u.id = latest.user_id
                AND u.credits_balance IS DISTINCT FROM latest.balance_after
              RETURNING u.id
            `,
            bindings
          )) as { rowCount?: number; rows?: unknown[] }

          updatedCount = Number(result.rowCount ?? result.rows?.length ?? 0)
        }

        return {
          scannedCount: users.length,
          lastUserId: users[users.length - 1].id,
          updatedCount,
        }
      })

      if (!batch) break

      batchesProcessed += 1
      usersScanned += batch.scannedCount
      balancesUpdated += batch.updatedCount
      lastUserId = batch.lastUserId
    }

    return {
      batchesProcessed,
      usersScanned,
      balancesUpdated,
      lastUserId: lastUserId || null,
    }
  }

  async deductCredits(
    userId: number,
    amount: number,
    description: string,
    metadata?: Record<string, any>
  ): Promise<CreditDeductionResult> {
    return db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('id', userId).forUpdate().firstOrFail()

      const reservationKey = metadata?.reservationKey
      if (typeof reservationKey === 'string' && reservationKey) {
        const existing = await CreditTransaction.query({ client: trx })
          .where('userId', userId)
          .where('type', 'usage')
          .whereRaw("metadata->>'reservationKey' = ?", [reservationKey])
          .orderBy('id', 'desc')
          .first()
        if (existing) {
          const refund = await CreditTransaction.query({ client: trx })
            .where('userId', userId)
            .where('type', 'refund')
            .whereRaw("metadata->>'reversalOf' = ?", [String(existing.id)])
            .first()
          // A retry after an explicit refund is a new attempt. Reusing the
          // same durable key remains idempotent while the previous attempt is
          // still charged, but permits one fresh debit after it was reversed.
          if (!refund) {
            return {
              transaction: existing,
              currentBalance: user.creditsBalance ?? 0,
              newBalance: existing.balanceAfter,
            }
          }
        }
      }
      const currentBalance = user.creditsBalance ?? 0

      if (currentBalance < amount) {
        return {
          transaction: null,
          currentBalance,
          newBalance: currentBalance,
        }
      }

      const newBalance = currentBalance - amount
      user.creditsBalance = newBalance
      user.useTransaction(trx)
      await user.save()

      const transaction = new CreditTransaction()
      transaction.useTransaction(trx)
      const transactionMetadata = { ...(metadata ?? {}) }
      if (typeof reservationKey === 'string' && reservationKey) {
        transactionMetadata.billingSettlement = 'processing'
        transactionMetadata.aiJobKeys = []
        transactionMetadata.terminalAiJobKeys = []
      }
      transaction.fill({
        userId: user.id,
        amount: -amount,
        balanceAfter: newBalance,
        type: 'usage',
        description,
        metadata: metadata ? transactionMetadata : null,
      })
      await transaction.save()

      return { transaction, currentBalance, newBalance }
    })
  }

  async addCredits(
    userId: number,
    amount: number,
    type: 'signup_bonus' | 'topup' | 'refund',
    description: string,
    metadata?: Record<string, any>
  ): Promise<CreditTransaction> {
    return db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('id', userId).forUpdate().firstOrFail()
      const currentBalance = user.creditsBalance ?? 0
      const newBalance = currentBalance + amount

      user.creditsBalance = newBalance
      user.useTransaction(trx)
      await user.save()

      const transaction = new CreditTransaction()
      transaction.useTransaction(trx)
      transaction.fill({
        userId: user.id,
        amount,
        balanceAfter: newBalance,
        type,
        description,
        metadata: metadata ?? null,
      })
      await transaction.save()

      return transaction
    })
  }

  /**
   * Atomically grant the one-time signup bonus. The user row lock prevents two
   * concurrent login/verification requests from both passing an eligibility
   * check and crediting the account twice.
   */
  async addSignupBonusIfEligible(userId: number): Promise<CreditTransaction | null> {
    return db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('id', userId).forUpdate().firstOrFail()
      const existingBonus = await CreditTransaction.query({ client: trx })
        .where('userId', userId)
        .where('type', 'signup_bonus')
        .first()

      if (existingBonus) return null

      const amount = 10
      const newBalance = (user.creditsBalance ?? 0) + amount
      user.creditsBalance = newBalance
      user.useTransaction(trx)
      await user.save()

      const transaction = new CreditTransaction()
      transaction.useTransaction(trx)
      transaction.fill({
        userId,
        amount,
        balanceAfter: newBalance,
        type: 'signup_bonus',
        description: 'Bonus 10 Kredit Gratis Selamat Datang di SiapAjar',
        metadata: { initial: true },
      })
      await transaction.save()
      return transaction
    })
  }

  /** Reverse one generation charge at most once, keyed by the generation id. */
  async refundUsageOnce(
    userId: number,
    amount: number,
    reservationKey: string,
    description: string
  ): Promise<CreditTransaction | null> {
    return db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('id', userId).forUpdate().firstOrFail()
      const usages = await CreditTransaction.query({ client: trx })
        .where('userId', userId)
        .where('type', 'usage')
        .whereRaw("metadata->>'reservationKey' = ?", [reservationKey])
        .orderBy('id', 'desc')

      let usage: CreditTransaction | null = null
      for (const candidate of usages) {
        const existingRefund = await CreditTransaction.query({ client: trx })
          .where('userId', userId)
          .where('type', 'refund')
          .whereRaw("metadata->>'reversalOf' = ?", [String(candidate.id)])
          .first()
        if (!existingRefund) {
          usage = candidate
          break
        }
      }
      if (!usage) return null

      const refundAmount = Math.max(0, Math.min(Math.trunc(amount), Math.abs(usage.amount)))
      if (refundAmount === 0) return null

      const newBalance = (user.creditsBalance ?? 0) + refundAmount
      user.creditsBalance = newBalance
      user.useTransaction(trx)
      await user.save()

      const refund = new CreditTransaction()
      refund.useTransaction(trx)
      refund.fill({
        userId,
        amount: refundAmount,
        balanceAfter: newBalance,
        type: 'refund',
        description,
        metadata: { reservationKey, reversalOf: String(usage.id) },
      })
      await refund.save()
      return refund
    })
  }

  async attachAiJobToGeneration(input: {
    userId: number
    reservationKey: string
    jobKey: string
  }): Promise<void> {
    await db.transaction(async (trx) => {
      await User.query({ client: trx }).where('id', input.userId).forUpdate().first()
      const usage = await this.findActiveUsage(trx, input.userId, input.reservationKey)
      if (!usage) return

      const metadata = { ...(usage.metadata ?? {}) }
      const jobKeys = Array.isArray(metadata.aiJobKeys) ? metadata.aiJobKeys : []
      if (jobKeys.includes(input.jobKey)) return

      metadata.aiJobKeys = [...jobKeys, input.jobKey]
      metadata.billingSettlement = metadata.billingSettlement || 'processing'
      usage.metadata = metadata
      usage.useTransaction(trx)
      await usage.save()
    })
  }

  async completeGenerationAiJob(input: {
    userId: number
    reservationKey: string
    jobKey: string
    amount: number
    description: string
  }): Promise<CreditTransaction | null> {
    return db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('id', input.userId).forUpdate().first()
      if (!user) return null
      const usage = await this.findActiveUsage(trx, input.userId, input.reservationKey)
      if (!usage) return null

      const metadata = { ...(usage.metadata ?? {}) }
      const jobKeys = Array.isArray(metadata.aiJobKeys) ? metadata.aiJobKeys : []
      if (!jobKeys.includes(input.jobKey)) return null
      const terminalKeys = Array.isArray(metadata.terminalAiJobKeys)
        ? metadata.terminalAiJobKeys
        : []
      if (terminalKeys.includes(input.jobKey)) return null

      metadata.terminalAiJobKeys = [...terminalKeys, input.jobKey]
      usage.metadata = metadata
      usage.useTransaction(trx)
      await usage.save()

      if (
        metadata.billingSettlement !== 'refund_pending' ||
        jobKeys.some((key: string) => !metadata.terminalAiJobKeys.includes(key))
      ) {
        return null
      }

      return this.createGenerationRefund(
        trx,
        user,
        usage,
        input.amount,
        input.reservationKey,
        input.description
      )
    })
  }

  async settleGenerationReservation(input: {
    userId: number
    reservationKey: string
  }): Promise<void> {
    await db.transaction(async (trx) => {
      await User.query({ client: trx }).where('id', input.userId).forUpdate().first()
      const usage = await this.findActiveUsage(trx, input.userId, input.reservationKey)
      if (!usage) return
      const metadata = { ...(usage.metadata ?? {}) }
      metadata.billingSettlement = 'completed'
      usage.metadata = metadata
      usage.useTransaction(trx)
      await usage.save()
    })
  }

  async requestGenerationRefund(input: {
    userId: number
    amount: number
    reservationKey: string
    description: string
  }): Promise<CreditTransaction | null> {
    return db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('id', input.userId).forUpdate().first()
      if (!user) return null
      const usage = await this.findActiveUsage(trx, input.userId, input.reservationKey)
      if (!usage) return null

      const metadata = { ...(usage.metadata ?? {}) }
      if (metadata.billingSettlement === 'completed') return null
      metadata.billingSettlement = 'refund_pending'
      usage.metadata = metadata
      usage.useTransaction(trx)
      await usage.save()

      const jobKeys = Array.isArray(metadata.aiJobKeys) ? metadata.aiJobKeys : []
      const terminalKeys = Array.isArray(metadata.terminalAiJobKeys)
        ? metadata.terminalAiJobKeys
        : []
      if (jobKeys.some((key: string) => !terminalKeys.includes(key))) return null

      return this.createGenerationRefund(
        trx,
        user,
        usage,
        input.amount,
        input.reservationKey,
        input.description
      )
    })
  }

  private async findActiveUsage(
    trx: TransactionClientContract,
    userId: number,
    reservationKey: string
  ) {
    const usages = await CreditTransaction.query({ client: trx })
      .where('userId', userId)
      .where('type', 'usage')
      .whereRaw("metadata->>'reservationKey' = ?", [reservationKey])
      .orderBy('id', 'desc')

    for (const usage of usages) {
      const refund = await CreditTransaction.query({ client: trx })
        .where('userId', userId)
        .where('type', 'refund')
        .whereRaw("metadata->>'reversalOf' = ?", [String(usage.id)])
        .first()
      if (!refund) return usage
    }
    return null
  }

  private async createGenerationRefund(
    trx: TransactionClientContract,
    user: User,
    usage: CreditTransaction,
    amount: number,
    reservationKey: string,
    description: string
  ) {
    const existingRefund = await CreditTransaction.query({ client: trx })
      .where('userId', user.id)
      .where('type', 'refund')
      .whereRaw("metadata->>'reversalOf' = ?", [String(usage.id)])
      .first()
    if (existingRefund) return existingRefund

    const refundAmount = Math.max(0, Math.min(Math.trunc(amount), Math.abs(usage.amount)))
    if (refundAmount === 0) return null

    const newBalance = (user.creditsBalance ?? 0) + refundAmount
    user.creditsBalance = newBalance
    user.useTransaction(trx)
    await user.save()

    usage.metadata = { ...(usage.metadata ?? {}), billingSettlement: 'refunded' }
    usage.useTransaction(trx)
    await usage.save()

    const refund = new CreditTransaction()
    refund.useTransaction(trx)
    refund.fill({
      userId: user.id,
      amount: refundAmount,
      balanceAfter: newBalance,
      type: 'refund',
      description,
      metadata: { reservationKey, reversalOf: String(usage.id), source: 'generation_terminal' },
    })
    await refund.save()
    return refund
  }
}

export const creditRepository = new CreditRepository()
