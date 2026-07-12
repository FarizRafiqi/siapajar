import vine from '@vinejs/vine'

export const createClassValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(50),
    academicYearId: vine.number().positive(),
    gradeLevel: vine.number().min(1).max(6),
  })
)

export const updateClassValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(50).optional(),
    academicYearId: vine.number().positive().optional(),
    gradeLevel: vine.number().min(1).max(6).optional(),
  })
)
