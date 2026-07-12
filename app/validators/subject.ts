import vine from '@vinejs/vine'

export const createSubjectValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100),
    educationLevel: vine.enum(['tk', 'sd']),
    gradeLevel: vine.number().min(0).max(6).nullable().optional(),
  })
)

export const updateSubjectValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100).optional(),
    educationLevel: vine.enum(['tk', 'sd']).optional(),
    gradeLevel: vine.number().min(0).max(6).nullable().optional(),
    isActive: vine.boolean().optional(),
  })
)
