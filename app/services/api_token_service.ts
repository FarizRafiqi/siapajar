import crypto from 'node:crypto'
import env from '#start/env'
import User from '#models/user'

const TOKEN_VERSION = 'v1'
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30

type ApiTokenPayload = {
  v: string
  sub: number
  exp: number
}

/**
 * Stateless mobile/API token. The previous implementation only base64 encoded
 * `userId:timestamp`, which allowed anyone to impersonate any account. Tokens
 * are now signed with the application key and expire after 30 days.
 */
export class ApiTokenService {
  issue(userId: number): string {
    const payload: ApiTokenPayload = {
      v: TOKEN_VERSION,
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    }
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
    return `${encoded}.${this.sign(encoded)}`
  }

  async verify(token: string): Promise<User | null> {
    const [encoded, signature] = token.split('.')
    if (!encoded || !signature) return null

    const expected = this.sign(encoded)
    const providedBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expected)
    if (
      providedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
    ) {
      return null
    }

    try {
      const payload = JSON.parse(
        Buffer.from(encoded, 'base64url').toString('utf8')
      ) as ApiTokenPayload
      if (
        payload.v !== TOKEN_VERSION ||
        !Number.isInteger(payload.sub) ||
        payload.sub <= 0 ||
        !Number.isInteger(payload.exp) ||
        payload.exp <= Math.floor(Date.now() / 1000)
      ) {
        return null
      }
      return User.find(payload.sub)
    } catch {
      return null
    }
  }

  private sign(value: string): string {
    return crypto
      .createHmac('sha256', env.get('APP_KEY').release())
      .update(value)
      .digest('base64url')
  }
}

export const apiTokenService = new ApiTokenService()
