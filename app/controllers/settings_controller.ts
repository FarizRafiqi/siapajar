import type { HttpContext } from '@adonisjs/core/http'
import { createSettingsValidator } from '#validators/settings'

export default class SettingsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    return inertia.render('dashboard/settings', {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        schoolName: user.schoolName,
        educationLevel: user.educationLevel as 'tk' | 'sd',
      },
    })
  }

  async update({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const settingsValidator = createSettingsValidator(user.id)
    const data = await request.validateUsing(settingsValidator)

    user.fullName = data.fullName
    user.email = data.email
    user.schoolName = data.schoolName
    user.educationLevel = data.educationLevel
    await user.save()

    session.flash('success', 'Pengaturan berhasil diperbarui')
    return response.redirect().back()
  }
}
