import type { HttpContext } from '@adonisjs/core/http'
import { onboardingValidator } from '#validators/onboarding'
import { OnboardingError, onboardingService } from '#services/onboarding_service'

export default class OnboardingController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    return inertia.render('onboarding', { role: user.role })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { schoolName, educationLevel, institutionType, curriculumVersion, defaultGroupContext } =
      await request.validateUsing(onboardingValidator)

    try {
      await onboardingService.complete(user, {
        schoolName,
        educationLevel,
        institutionType,
        curriculumVersion,
        defaultGroupContext,
      })
    } catch (error) {
      if (!(error instanceof OnboardingError)) throw error
      session.flash('error', error.message)
      return response.redirect().back()
    }

    return response.redirect().toRoute('dashboard')
  }
}
