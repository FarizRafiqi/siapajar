import crypto from 'node:crypto'
import { DateTime } from 'luxon'
import env from '#start/env'
import User from '#models/user'
import EmailVerificationToken from '#models/email_verification_token'

const TOKEN_TTL_HOURS = 24

export class EmailVerificationService {
  private hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  async sendForUser(
    user: User,
    options: { purpose?: 'email_verification' | 'email_change'; targetEmail?: string } = {}
  ) {
    const token = crypto.randomBytes(32).toString('base64url')
    const purpose = options.purpose || 'email_verification'
    const recipient = options.targetEmail || user.email
    const record = new EmailVerificationToken()
    record.fill({
      userId: user.id,
      tokenHash: this.hashToken(token),
      purpose,
      targetEmail: options.targetEmail || null,
      expiresAt: DateTime.now().plus({ hours: TOKEN_TTL_HOURS }),
      usedAt: null,
    })
    await record.save()

    const verifyUrl = `${env.get('APP_URL', 'http://localhost:3333')}/verify-email/${token}`
    const apiKey = env.get('RESEND_API_KEY')
    const from = env.get('RESEND_FROM_EMAIL')
    if (!apiKey || !from) {
      if (env.get('NODE_ENV') === 'production') throw new Error('EMAIL_PROVIDER_NOT_CONFIGURED')
      console.info(`[email-verification] ${recipient}: ${verifyUrl}`)
      return
    }

    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.release()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject:
          purpose === 'email_change'
            ? 'Konfirmasi perubahan email SiapAjar'
            : 'Verifikasi email akun SiapAjar',
        html: `<p>Halo ${this.escapeHtml(user.fullName || 'Guru SiapAjar')},</p><p>${purpose === 'email_change' ? 'Konfirmasikan alamat email baru Anda.' : 'Konfirmasikan email Anda untuk mengaktifkan benefit gratis akun.'}</p><p><a href="${verifyUrl}">Verifikasi email</a></p><p>Tautan ini berlaku ${TOKEN_TTL_HOURS} jam.</p>`,
      }),
    })
    if (!result.ok) throw new Error('EMAIL_DELIVERY_FAILED')
  }

  async verify(token: string) {
    const record = await EmailVerificationToken.query()
      .where('tokenHash', this.hashToken(token))
      .whereNull('usedAt')
      .where('expiresAt', '>', DateTime.now().toSQL()!)
      .first()
    if (!record) return null
    const user = await User.find(record.userId)
    if (!user) return null
    record.usedAt = DateTime.now()
    await record.save()
    if (record.purpose === 'email_change' && record.targetEmail) {
      user.email = record.targetEmail
      user.emailChangeRequestedAt = null
    }
    user.emailVerifiedAt = DateTime.now()
    await user.save()
    return user
  }

  async requestEmailChange(user: User, newEmail: string) {
    const normalizedEmail = newEmail.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) throw new Error('EMAIL_INVALID')
    if (normalizedEmail === user.email.toLowerCase()) throw new Error('EMAIL_UNCHANGED')
    if (await User.findBy('email', normalizedEmail)) throw new Error('EMAIL_ALREADY_USED')
    user.emailChangeRequestedAt = DateTime.now()
    await user.save()
    await this.sendForUser(user, { purpose: 'email_change', targetEmail: normalizedEmail })
  }

  private escapeHtml(value: string) {
    return value.replace(
      /[&<>'"]/g,
      (character) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!
    )
  }
}

export const emailVerificationService = new EmailVerificationService()
