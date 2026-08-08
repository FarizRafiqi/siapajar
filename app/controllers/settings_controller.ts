import type { HttpContext } from '@adonisjs/core/http'
import { createSettingsValidator, createAdminSettingsValidator } from '#validators/settings'
import string from '@adonisjs/core/helpers/string'
import PackageSubscription from '#models/package_subscription'
import { DateTime } from 'luxon'

export default class SettingsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    await user.load('package')
    const subscription = await PackageSubscription.query()
      .where('user_id', user.id)
      .where('status', 'active')
      .where((query) => query.whereNull('ends_at').orWhere('ends_at', '>', DateTime.now().toSQL()))
      .orderBy('starts_at', 'desc')
      .first()

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
        kopSurat: user.kopSurat || {},
      },
      package: user.package?.toJSON() ?? null,
      subscription: subscription?.toJSON() ?? null,
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

      const currentKop = user.kopSurat || {}
      const updatedKop = data.kopSurat || {}
      user.kopSurat = {
        ...currentKop,
        ...updatedKop,
        institutionName:
          updatedKop.institutionName || data.schoolName || currentKop.institutionName,
      }
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

    const logoFile = request.file('logo', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    })

    if (logoFile) {
      const logoFileName = `logo_${string.uuid()}.${logoFile.extname}`
      await logoFile.move('public/uploads/logos', {
        name: logoFileName,
        overwrite: true,
      })

      if (logoFile.isValid) {
        user.kopSurat = {
          ...user.kopSurat,
          logoUrl: `/uploads/logos/${logoFileName}`,
        }
      }
    }

    await user.save()

    session.flash('success', 'Pengaturan berhasil diperbarui')
    return response.redirect().back()
  }
}
