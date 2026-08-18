import vine from '@vinejs/vine'

export const createClassValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(50),
    academicYearId: vine.number().positive(),
    gradeLevel: vine.number().min(0).max(6),
    groupContext: vine.enum(['a', 'b']).optional(),
    rombelNumber: vine.string().trim().maxLength(10).optional(),
  })
)

export const updateClassValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(50).optional(),
    academicYearId: vine.number().positive().optional(),
    gradeLevel: vine.number().min(0).max(6).optional(),
    groupContext: vine.enum(['a', 'b']).optional(),
    rombelNumber: vine.string().trim().maxLength(10).optional(),
  })
)
