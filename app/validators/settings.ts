import vine from '@vinejs/vine'

const uniqueEmail = (userId: number) =>
  vine
    .string()
    .email()
    .maxLength(254)
    .unique(async (db, value) => {
      const match = await db.from('users').where('email', value).whereNot('id', userId).first()
      return !match
    })

/** Guru & kepala sekolah — punya sekolah dan jenjang. */
export const createSettingsValidator = (userId: number) =>
  vine.create(
    vine.object({
      fullName: vine.string().trim().minLength(2).maxLength(100),
      email: uniqueEmail(userId),
      schoolName: vine.string().trim().minLength(2).maxLength(100),
      educationLevel: vine.enum(['tk', 'sd']),
    })
  )

/** Admin — tidak terikat sekolah atau jenjang tertentu. */
export const createAdminSettingsValidator = (userId: number) =>
  vine.create(
    vine.object({
      fullName: vine.string().trim().minLength(2).maxLength(100),
      email: uniqueEmail(userId),
    })
  )
