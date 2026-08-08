import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Package from '#models/package'
import PackageSubscription from '#models/package_subscription'
import { randomBytes } from 'node:crypto'

export default class GoogleAuthController {
  async redirect({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  async callback({ ally, auth, response, session }: HttpContext) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      session.flash('error', 'Login dengan Google dibatalkan')
      return response.redirect().toRoute('session.create')
    }

    if (google.stateMisMatch()) {
      session.flash('error', 'Sesi login Google kedaluwarsa, silakan coba lagi')
      return response.redirect().toRoute('session.create')
    }

    if (google.hasError()) {
      session.flash('error', google.getError() ?? 'Gagal login dengan Google')
      return response.redirect().toRoute('session.create')
    }

    const googleUser = await google.user()

    if (!googleUser.email) {
      session.flash('error', 'Akun Google Anda tidak memiliki email yang bisa diakses')
      return response.redirect().toRoute('session.create')
    }

    // Wajib verified: mencegah account takeover — tanpa ini, siapa pun bisa
    // mendaftarkan email address orang lain di provider OAuth-nya sendiri dan
    // otomatis "masuk" ke akun yang sudah ada atas nama email tersebut.
    if (googleUser.emailVerificationState !== 'verified') {
      session.flash(
        'error',
        'Email Google Anda belum terverifikasi. Verifikasi email di akun Google Anda, lalu coba lagi.'
      )
      return response.redirect().toRoute('session.create')
    }

    let user = await User.findBy('google_id', googleUser.id)

    if (!user) {
      user = await User.findBy('email', googleUser.email)
    }

    if (!user) {
      user = await User.create({
        fullName: googleUser.name,
        email: googleUser.email,
        password: randomBytes(32).toString('hex'),
        role: 'guru',
        googleId: googleUser.id,
        avatarUrl: googleUser.avatarUrl,
      })
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
          metadata: { source: 'google_signup' },
        })
      }
    } else if (!user.googleId) {
      user.googleId = googleUser.id
      user.avatarUrl = user.avatarUrl ?? googleUser.avatarUrl
      await user.save()
    }

    await auth.use('web').login(user)
    return response.redirect().toRoute('dashboard')
  }
}
