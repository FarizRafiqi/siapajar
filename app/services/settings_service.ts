import type { MultipartFile } from '@adonisjs/bodyparser'
import string from '@adonisjs/core/helpers/string'
import { unlink } from 'node:fs/promises'
import type User from '#models/user'
import { packageSubscriptionRepository } from '#repositories/package_subscription_repository'
import type { PackageSubscriptionRepository } from '#repositories/package_subscription_repository'

type SettingsUser = User

export type SettingsData = {
  fullName: string
  email: string
  schoolName?: string
  educationLevel?: 'tk' | 'sd'
  kopSurat?: Partial<SettingsUser['kopSurat']>
}

export type SettingsFiles = {
  avatarFile?: MultipartFile | null
  logoFile?: MultipartFile | null
}

export class SettingsService {
  constructor(
    private readonly subscriptions: PackageSubscriptionRepository = packageSubscriptionRepository
  ) {}

  async getPageData(user: SettingsUser) {
    await user.load('package')
    const subscription = await this.subscriptions.findActiveForUser(user.id)

    return {
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
    }
  }

  async update(user: SettingsUser, data: SettingsData, files: SettingsFiles = {}) {
    user.fullName = data.fullName
    user.email = data.email

    if (!user.isAdmin) {
      user.schoolName = data.schoolName ?? user.schoolName
      user.educationLevel = data.educationLevel ?? user.educationLevel

      const currentKop = user.kopSurat || {}
      const updatedKop = data.kopSurat || {}
      user.kopSurat = {
        ...currentKop,
        ...updatedKop,
        institutionName:
          updatedKop.institutionName || data.schoolName || currentKop.institutionName,
      }
    }

    await this.updateAvatar(user, files.avatarFile)
    await this.updateLogo(user, files.logoFile)
    await user.save()

    return user
  }

  private async updateAvatar(user: SettingsUser, avatarFile?: MultipartFile | null) {
    if (!avatarFile) return

    const fileName = `${string.uuid()}.${avatarFile.extname}`
    await avatarFile.move('public/uploads/avatars', {
      name: fileName,
      overwrite: true,
    })

    if (avatarFile.isValid) {
      if (user.avatarUrl && !user.avatarUrl.startsWith('http')) {
        await unlink(`public${user.avatarUrl}`).catch(() => {})
      }

      user.avatarUrl = `/uploads/avatars/${fileName}`
    }
  }

  private async updateLogo(user: SettingsUser, logoFile?: MultipartFile | null) {
    if (!logoFile) return

    const fileName = `logo_${string.uuid()}.${logoFile.extname}`
    await logoFile.move('public/uploads/logos', {
      name: fileName,
      overwrite: true,
    })

    if (logoFile.isValid) {
      user.kopSurat = {
        ...user.kopSurat,
        logoUrl: `/uploads/logos/${fileName}`,
      }
    }
  }
}

export const settingsService = new SettingsService()
