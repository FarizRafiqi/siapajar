import type { HttpContext } from '@adonisjs/core/http'
import { accountService } from '#services/account_service'

function isApi(ctx: HttpContext): boolean {
  return (
    ctx.request.url().startsWith('/api/') ||
    (ctx.request.accepts(['json', 'html']) === 'json' && !ctx.request.header('x-inertia'))
  )
}

export default class GoogleAuthController {
  async redirect({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  async callback(ctx: HttpContext) {
    const { ally, auth, response, session } = ctx
    const google = ally.use('google')

    if (google.accessDenied()) {
      if (isApi(ctx)) {
        return response.badRequest({ message: 'Login dengan Google dibatalkan' })
      }
      session.flash('error', 'Login dengan Google dibatalkan')
      return response.redirect().toRoute('session.create')
    }

    if (google.stateMisMatch()) {
      if (isApi(ctx)) {
        return response.badRequest({ message: 'Sesi login Google kedaluwarsa, silakan coba lagi' })
      }
      session.flash('error', 'Sesi login Google kedaluwarsa, silakan coba lagi')
      return response.redirect().toRoute('session.create')
    }

    if (google.hasError()) {
      if (isApi(ctx)) {
        return response.badRequest({ message: google.getError() ?? 'Gagal login dengan Google' })
      }
      session.flash('error', google.getError() ?? 'Gagal login dengan Google')
      return response.redirect().toRoute('session.create')
    }

    const googleUser = await google.user()

    if (!googleUser.email) {
      if (isApi(ctx)) {
        return response.badRequest({
          message: 'Akun Google Anda tidak memiliki email yang bisa diakses',
        })
      }
      session.flash('error', 'Akun Google Anda tidak memiliki email yang bisa diakses')
      return response.redirect().toRoute('session.create')
    }

    // Wajib verified: mencegah account takeover
    if (googleUser.emailVerificationState !== 'verified') {
      if (isApi(ctx)) {
        return response.badRequest({
          message:
            'Email Google Anda belum terverifikasi. Verifikasi email di akun Google Anda, lalu coba lagi.',
        })
      }
      session.flash(
        'error',
        'Email Google Anda belum terverifikasi. Verifikasi email di akun Google Anda, lalu coba lagi.'
      )
      return response.redirect().toRoute('session.create')
    }

    const user = await accountService.signInWithGoogle({
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      avatarUrl: googleUser.avatarUrl,
    })

    await auth.use('web').login(user)

    if (isApi(ctx)) {
      const tokenPayload = `${user.id}:${Date.now()}`
      const token = Buffer.from(tokenPayload).toString('base64')
      return response.ok({
        status: 'success',
        data: {
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            schoolName: user.schoolName,
            educationLevel: user.educationLevel,
            role: user.role,
          },
        },
      })
    }

    return response.redirect().toRoute('dashboard')
  }
}
