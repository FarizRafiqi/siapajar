import { randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import User from '#models/user'
import Package from '#models/package'
import PackageSubscription from '#models/package_subscription'

export type SignupAccountData = {
  fullName: string | null
  email: string
  password: string
}

export type GoogleAccountProfile = {
  id: string
  email: string
  name?: string | null
  avatarUrl?: string | null
}

export class AccountService {
  async authenticate(email: string, password: string) {
    return User.verifyCredentials(email, password)
  }

  async register(data: SignupAccountData) {
    const freePackage = await Package.findBy('name', 'free')
    const user = await User.create({
      ...data,
      packageId: freePackage?.id ?? null,
      creditsBalance: 0,
      freeBenefitStatus: 'pending',
    })

    if (freePackage) {
      await PackageSubscription.create({
        userId: user.id,
        packageId: freePackage.id,
        status: 'active',
        billingCycle: 'manual',
        startsAt: DateTime.now(),
        endsAt: null,
        canceledAt: null,
        metadata: { source: 'pending_signup' },
      })
    }

    return user
  }

  async signInWithGoogle(profile: GoogleAccountProfile) {
    let user = await User.findBy('google_id', profile.id)
    user ??= await User.findBy('email', profile.email)

    if (!user) {
      user = await User.create({
        fullName: profile.name ?? null,
        email: profile.email,
        password: randomBytes(32).toString('hex'),
        role: 'guru',
        googleId: profile.id,
        avatarUrl: profile.avatarUrl ?? null,
      })

      user.emailVerifiedAt = user.createdAt
      user.freeBenefitStatus = 'pending'
      user.creditsBalance = 0
      const freePackage = await Package.findBy('name', 'free')
      if (freePackage) {
        user.packageId = freePackage.id
        await user.save()
        await PackageSubscription.create({
          userId: user.id,
          packageId: freePackage.id,
          status: 'active',
          billingCycle: 'manual',
          startsAt: user.createdAt,
          endsAt: null,
          canceledAt: null,
          metadata: { source: 'pending_google_signup' },
        })
      }
      await user.save()
    } else if (!user.googleId) {
      user.googleId = profile.id
      user.avatarUrl = user.avatarUrl ?? profile.avatarUrl ?? null
      await user.save()
    }

    return user
  }
}

export const accountService = new AccountService()
