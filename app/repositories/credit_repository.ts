import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import CreditTransaction from '#models/credit_transaction'

export type CreditDeductionResult = {
  transaction: CreditTransaction | null
  currentBalance: number
  newBalance: number
}

export class CreditRepository {
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
