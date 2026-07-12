import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class OnboardingMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (user) {
      // Admin skips onboarding
      if (user.role === 'admin') return next()

      const hasCompletedOnboarding = user.educationLevel !== null && user.schoolName !== null
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
