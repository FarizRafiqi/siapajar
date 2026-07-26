import vine from '@vinejs/vine'

export const createStudentValidator = vine.create(
  vine.object({
    nis: vine.string().trim().minLength(1).maxLength(50),
    fullName: vine.string().trim().minLength(1).maxLength(100),
  })
)

export const updateStudentValidator = vine.create(
  vine.object({
    nis: vine.string().trim().minLength(1).maxLength(50).optional(),
    fullName: vine.string().trim().minLength(1).maxLength(100).optional(),
  })
)
