import vine from '@vinejs/vine'

export const createTeachingModuleValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    title: vine.string().trim().minLength(1).maxLength(200),
    subject: vine.string().trim().minLength(1).maxLength(100),
    phase: vine.string().trim().minLength(1).maxLength(10),
    content: vine.any().optional(),
  })
)

export const updateTeachingModuleValidator = vine.create(
  vine.object({
    classId: vine.number().positive().optional(),
    title: vine.string().trim().minLength(1).maxLength(200).optional(),
    subject: vine.string().trim().minLength(1).maxLength(100).optional(),
    phase: vine.string().trim().minLength(1).maxLength(10).optional(),
    content: vine.any().optional(),
    status: vine.enum(['draft', 'published']).optional(),
  })
)
