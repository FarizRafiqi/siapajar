import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class OnboardingMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (user) {
      const hasCompletedOnboarding = user.jenjang !== null && user.schoolName !== null
      const isOnboardingPage = ctx.request.url().startsWith('/onboarding')

      if (!hasCompletedOnboarding && !isOnboardingPage) {
        return ctx.response.redirect().toPath('/onboarding')
      }

      if (hasCompletedOnboarding && isOnboardingPage) {
        return ctx.response.redirect().toRoute('dashboard')
      }
    }

    return next()
  }
}
