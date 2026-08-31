import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { accountService } from '#services/account_service'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const user = await accountService.register(payload)

    await auth.use('web').login(user)
    response.redirect().toRoute('dashboard')
  }
}
