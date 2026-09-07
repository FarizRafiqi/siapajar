import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { accountService } from '#services/account_service'
import { emailVerificationService } from '#services/email_verification_service'
import env from '#start/env'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {
      turnstileSiteKey: env.get('TURNSTILE_SITE_KEY') || null,
      fingerprintPublicApiKey: env.get('FINGERPRINT_PUBLIC_API_KEY') || null,
    })
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const user = await accountService.register(payload)
    await auth.use('web').login(user)
    await emailVerificationService.sendForUser(user)
    response.redirect('/verify-email/pending')
  }
}
