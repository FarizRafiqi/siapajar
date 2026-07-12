import vine from '@vinejs/vine'

export const createSettingsValidator = (userId: number) => vine.create(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().email().maxLength(254).unique(async (db, value) => {
      const match = await db
        .from('users')
        .where('email', value)
        .whereNot('id', userId)
        .first()
      return !match
    }),
    schoolName: vine.string().trim().minLength(2).maxLength(100),
    educationLevel: vine.enum(['tk', 'sd']),
  })
)
