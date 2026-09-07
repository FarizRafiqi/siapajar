import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Package from '#models/package'
import PackageSubscription from '#models/package_subscription'
import CreditTransaction from '#models/credit_transaction'
import FreeBenefitClaim from '#models/free_benefit_claim'
import FraudCase from '#models/fraud_case'

export type FreeBenefitIdentity = {
  emailHash: string
  deviceHash: string
  ipHash: string
}

export class FreeBenefitRepository {
  async findConflict(identity: FreeBenefitIdentity) {
    return FreeBenefitClaim.query()
      .where('emailHash', identity.emailHash)
      .orWhere('deviceHash', identity.deviceHash)
      .orWhere('ipHash', identity.ipHash)
      .first()
  }

  async claim(userId: number, identity: FreeBenefitIdentity, source: string, bonusCredits: number) {
    return db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('id', userId).forUpdate().firstOrFail()
      if (user.freeBenefitStatus === 'legacy' || user.freeBenefitStatus === 'eligible') return user
      if (!user.emailVerifiedAt) throw new Error('EMAIL_NOT_VERIFIED')

      const conflict = await FreeBenefitClaim.query({ client: trx })
        .where('emailHash', identity.emailHash)
        .orWhere('deviceHash', identity.deviceHash)
        .orWhere('ipHash', identity.ipHash)
        .first()
      if (conflict) throw new Error('FREE_BENEFIT_ALREADY_CLAIMED')

      const freePackage = await Package.query({ client: trx }).where('name', 'free').first()
      const claim = new FreeBenefitClaim()
      claim.useTransaction(trx)
      claim.fill({ userId, ...identity, source, claimedAt: DateTime.now() })
      await claim.save()

      if (freePackage) {
        user.packageId = freePackage.id
        const existingSubscription = await PackageSubscription.query({ client: trx })
          .where('userId', userId)
          .where('packageId', freePackage.id)
          .where('status', 'active')
          .first()
        if (!existingSubscription) {
          const subscription = new PackageSubscription()
          subscription.useTransaction(trx)
          subscription.fill({
            userId,
            packageId: freePackage.id,
            status: 'active',
            billingCycle: 'manual',
            startsAt: DateTime.now(),
            endsAt: null,
            canceledAt: null,
            metadata: { source: 'verified_free_benefit' },
          })
          await subscription.save()
        }
      }

      user.freeBenefitStatus = 'eligible'
      user.creditsBalance = (user.creditsBalance ?? 0) + bonusCredits
      user.useTransaction(trx)
      await user.save()

      const credit = new CreditTransaction()
      credit.useTransaction(trx)
      credit.fill({
        userId,
        amount: bonusCredits,
        balanceAfter: user.creditsBalance,
        type: 'signup_bonus',
        description: 'Bonus kredit akun terverifikasi SiapAjar',
        metadata: { source, freeBenefitClaimId: claim.id },
      })
      await credit.save()
      return user
    })
  }

  async restrictAndCreateCase(userId: number, type: string, evidence: Record<string, unknown>) {
    await db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('id', userId).forUpdate().first()
      if (user && user.freeBenefitStatus === 'pending') {
        user.freeBenefitStatus = 'restricted'
        user.useTransaction(trx)
        await user.save()
      }
      const fraudCase = new FraudCase()
      fraudCase.useTransaction(trx)
      fraudCase.fill({
        userId,
        type,
        status: 'open',
        evidence,
        reviewedByUserId: null,
        reviewedAt: null,
      })
      await fraudCase.save()
    })
  }
}

export const freeBenefitRepository = new FreeBenefitRepository()
