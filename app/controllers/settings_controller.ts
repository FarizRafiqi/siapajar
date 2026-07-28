import type { HttpContext } from '@adonisjs/core/http'
import { createSettingsValidator, createAdminSettingsValidator } from '#validators/settings'
import string from '@adonisjs/core/helpers/string'

export default class SettingsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!

    return inertia.render('dashboard/settings', {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        initials: user.initials,
        schoolName: user.schoolName,
        educationLevel: user.educationLevel,
        role: user.role,
        avatarUrl: user.avatarUrl,
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

    const avatarFile = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    })

    if (avatarFile) {
      const fileName = `${string.uuid()}.${avatarFile.extname}`
      await avatarFile.move('public/uploads/avatars', {
        name: fileName,
        overwrite: true,
      })

      if (avatarFile.isValid) {
        if (user.avatarUrl && !user.avatarUrl.startsWith('http')) {
          const fs = await import('node:fs/promises')
          await fs.unlink(`public${user.avatarUrl}`).catch(() => {})
        }

        user.avatarUrl = `/uploads/avatars/${fileName}`
      }
    }

    await user.save()

    session.flash('success', 'Pengaturan berhasil diperbarui')
    return response.redirect().back()
  }
}
