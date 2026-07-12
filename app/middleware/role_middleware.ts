import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Role middleware to check if user has required role(s)
 *
 * Usage:
 *   router.use([() => import('#middleware/role_middleware')])
 *   .get('/admin', '#controllers/admin_controller.index').use(middleware.role({ roles: ['admin'] }))
 */
export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { roles: string[] }) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.redirect('/login')
    }

    if (!options.roles.includes(user.role)) {
      return ctx.response.forbidden({ message: 'Unauthorized: insufficient role' })
    }

    await next()
  }
}
