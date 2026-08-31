import CreditTransaction from '#models/credit_transaction'

export class CreditTransactionRepository {
  async listRecentForUser(userId: number, limit = 20) {
    return CreditTransaction.query()
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
  }
}

export const creditTransactionRepository = new CreditTransactionRepository()
