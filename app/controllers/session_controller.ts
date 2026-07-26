import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { email, password, remember } = request.all()

    let user: User
    try {
      user = await User.verifyCredentials(email, password)
    } catch {
      session.flash('error', 'Email atau kata sandi salah')
      return response.redirect().back()
    }

    await auth.use('web').login(user, !!remember)
    response.redirect().toRoute('dashboard')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('session.create')
  }
}
