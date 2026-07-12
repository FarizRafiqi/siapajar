import type { HttpContext } from '@adonisjs/core/http'
import { onboardingValidator } from '#validators/onboarding'

export default class OnboardingController {
  async index({ inertia }: HttpContext) {
    return inertia.render('onboarding', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { schoolName, jenjang } = await request.validateUsing(onboardingValidator)

    user.schoolName = schoolName
    user.jenjang = jenjang
    await user.save()

    return response.redirect().toRoute('dashboard')
  }
}
