import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import CreditTransaction from '#models/credit_transaction'

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
      transaction.fill({
        userId: user.id,
        amount: -amount,
        balanceAfter: newBalance,
        type: 'usage',
        description,
        metadata: metadata ?? null,
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
}

export const creditRepository = new CreditRepository()
