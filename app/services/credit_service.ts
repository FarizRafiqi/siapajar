import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import CreditTransaction from '#models/credit_transaction'

export class CreditService {
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

    return await db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('id', userId).forUpdate().firstOrFail()

      const currentBalance = user.creditsBalance ?? 0
      if (currentBalance < amount) {
        throw new Error(
          `Saldo kredit tidak mencukupi. Anda memiliki ${currentBalance} kredit, dibutuhkan ${amount} kredit.`
        )
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

      return transaction
    })
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

    return await db.transaction(async (trx) => {
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
