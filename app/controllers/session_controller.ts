import type { HttpContext } from '@adonisjs/core/http'
import { accountService } from '#services/account_service'

function isApiRequest(ctx: HttpContext): boolean {
  return (
    ctx.request.url().startsWith('/api/') ||
    (ctx.request.accepts(['json', 'html']) === 'json' && !ctx.request.header('x-inertia'))
  )
}

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store(ctx: HttpContext) {
    const { request, auth, response, session } = ctx
    const { email, password, remember } = request.all()
    const isApi = isApiRequest(ctx)

    let user
    try {
      user = await accountService.authenticate(email, password)
    } catch {
      if (isApi) {
        return response.unauthorized({
          status: 'error',
          message: 'Email atau kata sandi salah',
        })
      }
      session.flash('error', 'Email atau kata sandi salah')
      return response.redirect().back()
    }

    if (isApi) {
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

    await auth.use('web').login(user, !!remember)
    response.redirect().toRoute('dashboard')
  }

  async destroy(ctx: HttpContext) {
    const { auth, response } = ctx
    const isApi = isApiRequest(ctx)

    await auth.use('web').logout()

    if (isApi) {
      return response.ok({
        status: 'success',
        message: 'Berhasil logout',
      })
    }

    response.redirect().toRoute('session.create')
  }
}
