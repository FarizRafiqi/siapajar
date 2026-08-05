import vine from '@vinejs/vine'

export const createStudentValidator = vine.create(
  vine.object({
    nis: vine.string().trim().minLength(1).maxLength(50).regex(/^\d+$/),
    fullName: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(100)
      .regex(/^[a-zA-Z\s.'-]+$/),
  })
)

export const updateStudentValidator = vine.create(
  vine.object({
    nis: vine.string().trim().minLength(1).maxLength(50).regex(/^\d+$/).optional(),
    fullName: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(100)
      .regex(/^[a-zA-Z\s.'-]+$/)
      .optional(),
  })
)
