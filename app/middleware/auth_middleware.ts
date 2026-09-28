import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { apiTokenService } from '#services/api_token_service'

export default class AuthMiddleware {
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    const authorization = ctx.request.header('authorization')
    if (authorization?.startsWith('Bearer ')) {
      const user = await apiTokenService.verify(authorization.substring(7).trim())
      if (!user) return ctx.response.unauthorized({ message: 'Invalid or expired API token' })

      // The application currently exposes a single session guard. Hydrate it
      // with the verified bearer identity so existing controllers can keep using
      // `auth.user` while mobile clients remain stateless at the token layer.
      await ctx.auth.use('web').login(user)
      return next()
    }

    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    return next()
  }
}
