import vine from '@vinejs/vine'

export const createAnnualPlanValidator = vine.create(
  vine.object({
    academicYearId: vine.number().positive(),
    subject: vine.string().trim().minLength(1).maxLength(100),
    content: vine.any().optional(),
  })
)

export const updateAnnualPlanValidator = vine.create(
  vine.object({
    academicYearId: vine.number().positive().optional(),
    subject: vine.string().trim().minLength(1).maxLength(100).optional(),
    content: vine.any().optional(),
  })
)
