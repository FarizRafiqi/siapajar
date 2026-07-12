import vine from '@vinejs/vine'

export const createExamValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    title: vine.string().trim().minLength(1).maxLength(200),
    type: vine.enum(['midterm', 'final', 'daily', 'summative']),
    questions: vine.array(vine.object({})).optional(),
  })
)

export const updateExamValidator = vine.create(
  vine.object({
    classId: vine.number().positive().optional(),
    title: vine.string().trim().minLength(1).maxLength(200).optional(),
    type: vine.enum(['midterm', 'final', 'daily', 'summative']).optional(),
    questions: vine.array(vine.object({})).optional(),
    status: vine.enum(['draft', 'published']).optional(),
  })
)
