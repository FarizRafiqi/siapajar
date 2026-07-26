import type { HttpContext } from '@adonisjs/core/http'
import { createSettingsValidator, createAdminSettingsValidator } from '#validators/settings'

export default class SettingsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!

    return inertia.render('dashboard/settings', {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        schoolName: user.schoolName,
        educationLevel: user.educationLevel,
        role: user.role,
      },
    })
  }

  async update({ request, response, auth, session }: HttpContext) {
    const user = auth.user!

    // Admin tidak punya sekolah/jenjang — pakai validator terpisah
    if (user.isAdmin) {
      const data = await request.validateUsing(createAdminSettingsValidator(user.id))
      user.fullName = data.fullName
      user.email = data.email
    } else {
      const data = await request.validateUsing(createSettingsValidator(user.id))
      user.fullName = data.fullName
      user.email = data.email
      user.schoolName = data.schoolName
      user.educationLevel = data.educationLevel
    }

    await user.save()

    session.flash('success', 'Pengaturan berhasil diperbarui')
    return response.redirect().back()
  }
}
