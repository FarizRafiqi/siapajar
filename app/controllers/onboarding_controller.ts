import type { HttpContext } from '@adonisjs/core/http'
import { onboardingValidator } from '#validators/onboarding'
import School from '#models/school'

export default class OnboardingController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    return inertia.render('onboarding', { role: user.role })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { schoolName, educationLevel, institutionType, curriculumVersion, defaultGroupContext } =
      await request.validateUsing(onboardingValidator)

    if (user.role === 'guru' && !educationLevel) {
      session.flash('error', 'Pilih jenjang pendidikan')
      return response.redirect().back()
    }

    const normalizedName = schoolName.trim()
    let school = await School.query()
      .whereRaw('LOWER(name) = ?', [normalizedName.toLowerCase()])
      .first()

    school ??= await School.create({ name: normalizedName })

    user.schoolName = normalizedName
    user.schoolId = school.id
    if (educationLevel) {
      user.educationLevel = educationLevel
    }
    if (institutionType) user.institutionType = institutionType
    if (curriculumVersion) user.curriculumVersion = curriculumVersion
    if (defaultGroupContext) user.defaultGroupContext = defaultGroupContext
    await user.save()

    return response.redirect().toRoute('dashboard')
  }
}
