import vine from '@vinejs/vine'

export const createSemesterPlanValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    semesterId: vine.number().positive(),
    subject: vine.string().trim().minLength(1).maxLength(100),
    content: vine.any().optional(),
  })
)

export const updateSemesterPlanValidator = vine.create(
  vine.object({
    classId: vine.number().positive().optional(),
    semesterId: vine.number().positive().optional(),
    subject: vine.string().trim().minLength(1).maxLength(100).optional(),
    content: vine.any().optional(),
  })
)
