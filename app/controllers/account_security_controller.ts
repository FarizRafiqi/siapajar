import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import { emailVerificationService } from '#services/email_verification_service'
import { freeBenefitService } from '#services/free_benefit_service'

export default class AccountSecurityController {
  async pending({ inertia, auth, response }: HttpContext) {
    if (!auth.user) return response.redirect().toRoute('session.create')
    if (auth.user.emailVerifiedAt) return response.redirect('/claim-free-benefit')
    return inertia.render('auth/verify-email' as any, { email: auth.user.email } as any)
  }

  async verify({ params, auth, response, session }: HttpContext) {
    const user = await emailVerificationService.verify(params.token)
    if (!user) {
      session.flash('error', 'Tautan verifikasi tidak valid atau sudah kedaluwarsa.')
      return response.redirect('/verify-email/pending')
    }
    await auth.use('web').login(user)
    return response.redirect('/claim-free-benefit')
  }

  async resend({ auth, response, session }: HttpContext) {
    if (!auth.user) return response.redirect().toRoute('session.create')
    await emailVerificationService.sendForUser(auth.user)
    session.flash('success', 'Email verifikasi baru telah dikirim.')
    return response.redirect().back()
  }

  async requestEmailChange({ auth, request, response, session }: HttpContext) {
    if (!auth.user) return response.redirect().toRoute('session.create')
    try {
      await emailVerificationService.requestEmailChange(
        auth.user,
        String(request.input('email') || '')
      )
      session.flash('success', 'Tautan konfirmasi telah dikirim ke email baru Anda.')
    } catch {
      session.flash(
        'error',
        'Email baru tidak dapat digunakan. Pastikan formatnya benar dan belum terdaftar.'
      )
    }
    return response.redirect().back()
  }

  async claimPage({ inertia, auth, response }: HttpContext) {
    if (!auth.user) return response.redirect().toRoute('session.create')
    if (!auth.user.emailVerifiedAt) return response.redirect('/verify-email/pending')
    if (auth.user.freeBenefitStatus === 'restricted') {
      return inertia.render('auth/free-benefit-restricted' as any, {} as any)
    }
    return inertia.render(
      'auth/claim-free-benefit' as any,
      {
        turnstileSiteKey: env.get('TURNSTILE_SITE_KEY') || null,
        fingerprintPublicApiKey: env.get('FINGERPRINT_PUBLIC_API_KEY') || null,
      } as any
    )
  }

  async claim({ auth, request, response, session }: HttpContext) {
    if (!auth.user) return response.unauthorized({ message: 'Harap masuk terlebih dahulu.' })
    try {
      await freeBenefitService.claim(auth.user, {
        turnstileToken: String(request.input('turnstileToken') || ''),
        fingerprintRequestId: String(request.input('fingerprintRequestId') || ''),
        ipAddress: request.ip(),
        source: auth.user.googleId ? 'google_signup' : 'password_signup',
      })
      session.flash('success', 'Benefit gratis sudah aktif. Selamat menggunakan SiapAjar!')
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      const code = error instanceof Error ? error.message : 'FREE_BENEFIT_FAILED'
      const message =
        code === 'FREE_BENEFIT_ALREADY_CLAIMED'
          ? 'Benefit gratis sudah pernah digunakan dari perangkat atau jaringan ini. Silakan hubungi dukungan jika ini keliru.'
          : code === 'TURNSTILE_FAILED' || code === 'TURNSTILE_REQUIRED'
            ? 'Verifikasi keamanan belum selesai. Silakan coba lagi.'
            : 'Benefit gratis belum dapat diaktifkan. Silakan coba lagi.'
      return response.unprocessableEntity({ message })
    }
  }
}
