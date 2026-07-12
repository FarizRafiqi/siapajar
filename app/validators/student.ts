import vine from '@vinejs/vine'

export const createStudentValidator = vine.create(
  vine.object({
    nis: vine.string().trim().minLength(1).maxLength(50),
    fullName: vine.string().trim().minLength(1).maxLength(100),
  })
)
