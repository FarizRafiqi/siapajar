import crypto from 'node:crypto'
import env from '#start/env'
import type User from '#models/user'
import {
  freeBenefitRepository,
  type FreeBenefitRepository,
} from '#repositories/free_benefit_repository'

const SIGNUP_BONUS_CREDITS = 10

export type ClaimFreeBenefitInput = {
  turnstileToken: string
  fingerprintRequestId: string
  ipAddress: string
  source: 'password_signup' | 'google_signup'
}

export class FreeBenefitService {
  constructor(private readonly repository: FreeBenefitRepository = freeBenefitRepository) {}

  async claim(user: User, input: ClaimFreeBenefitInput) {
    if (user.freeBenefitStatus === 'legacy' || user.freeBenefitStatus === 'eligible') return user
    if (!user.emailVerifiedAt) throw new Error('EMAIL_NOT_VERIFIED')
    await this.verifyTurnstile(input.turnstileToken, input.ipAddress)
    const visitorId = await this.verifyFingerprint(input.fingerprintRequestId)
    const identity = {
      emailHash: this.hash(user.email.trim().toLowerCase()),
      deviceHash: this.hash(visitorId),
      ipHash: this.hash(input.ipAddress),
    }
    const existing = await this.repository.findConflict(identity)
    if (existing) {
      await this.repository.restrictAndCreateCase(user.id, 'free_benefit_identity_reuse', {
        matches: {
          email: existing.emailHash === identity.emailHash,
          device: existing.deviceHash === identity.deviceHash,
          ip: existing.ipHash === identity.ipHash,
        },
      })
      throw new Error('FREE_BENEFIT_ALREADY_CLAIMED')
    }
    try {
      return await this.repository.claim(user.id, identity, input.source, SIGNUP_BONUS_CREDITS)
    } catch (error) {
      if (error instanceof Error && error.message === 'FREE_BENEFIT_ALREADY_CLAIMED') {
        await this.repository.restrictAndCreateCase(user.id, 'free_benefit_identity_reuse', {
          matches: { concurrentClaim: true },
        })
      }
      throw error
    }
  }

  private hash(value: string) {
    const secret = env.get('FRAUD_IDENTITY_HMAC_SECRET')
    if (!secret && env.get('NODE_ENV') === 'production')
      throw new Error('FRAUD_IDENTITY_SECRET_NOT_CONFIGURED')
    return crypto
      .createHmac('sha256', secret?.release() || env.get('APP_KEY').release())
      .update(value)
      .digest('hex')
  }

  private async verifyTurnstile(token: string, ipAddress: string) {
    const secret = env.get('TURNSTILE_SECRET_KEY')
    if (!secret) {
      if (env.get('NODE_ENV') === 'production') throw new Error('TURNSTILE_NOT_CONFIGURED')
      return
    }
    if (!token) throw new Error('TURNSTILE_REQUIRED')
    const body = new URLSearchParams({
      secret: secret.release(),
      response: token,
      remoteip: ipAddress,
    })
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    const result = (await response.json()) as { success?: boolean }
    if (!response.ok || !result.success) throw new Error('TURNSTILE_FAILED')
  }

  private async verifyFingerprint(requestId: string) {
    const apiKey = env.get('FINGERPRINT_SERVER_API_KEY')
    if (!apiKey) {
      if (env.get('NODE_ENV') === 'production') throw new Error('FINGERPRINT_NOT_CONFIGURED')
      if (!requestId) return 'development-device'
      return requestId
    }
    if (!requestId) throw new Error('FINGERPRINT_REQUIRED')
    const region = env.get('FINGERPRINT_REGION', 'us')
    const baseUrl =
      region === 'eu'
        ? 'https://eu.api.fpjs.io'
        : region === 'ap'
          ? 'https://ap.api.fpjs.io'
          : 'https://api.fpjs.io'
    const response = await fetch(`${baseUrl}/events/${encodeURIComponent(requestId)}`, {
      headers: { 'Auth-API-Key': apiKey.release() },
    })
    const payload = (await response.json()) as {
      products?: { identification?: { data?: { visitorId?: string } } }
    }
    const visitorId = payload.products?.identification?.data?.visitorId
    if (!response.ok || !visitorId) throw new Error('FINGERPRINT_VERIFICATION_FAILED')
    return visitorId
  }
}

export const freeBenefitService = new FreeBenefitService()
