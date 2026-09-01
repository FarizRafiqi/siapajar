import { randomBytes } from 'node:crypto'
import User from '#models/user'

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
    return User.create({
      ...data,
      packageId: null,
      creditsBalance: 0,
      freeBenefitStatus: 'pending',
    })
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
