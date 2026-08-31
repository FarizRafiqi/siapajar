import type { HttpContext } from '@adonisjs/core/http'
import { createSettingsValidator, createAdminSettingsValidator } from '#validators/settings'
import { settingsService } from '#services/settings_service'

export default class SettingsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    return inertia.render('dashboard/settings', await settingsService.getPageData(user))
  }

  async update({ request, response, auth, session }: HttpContext) {
    const user = auth.user!

    // Admin tidak punya sekolah/jenjang — pakai validator terpisah
    const data = user.isAdmin
      ? await request.validateUsing(createAdminSettingsValidator(user.id))
      : await request.validateUsing(createSettingsValidator(user.id))

    const avatarFile = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    })

    const logoFile = request.file('logo', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    })

    await settingsService.update(user, data, { avatarFile, logoFile })

    session.flash('success', 'Pengaturan berhasil diperbarui')
    return response.redirect().back()
  }
}
