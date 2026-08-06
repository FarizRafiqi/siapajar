import vine from '@vinejs/vine'

export const createObjectiveValidator = vine.create(
  vine.object({
    cpId: vine.number().positive(),
    code: vine.string().trim().minLength(1).maxLength(30),
    title: vine.string().trim().minLength(5).maxLength(500),
    groupContext: vine.enum(['a', 'b']).optional(),
  })
)

export const createSequenceValidator = vine.create(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(150),
    educationLevel: vine.enum(['tk', 'sd']),
    groupContext: vine.enum(['a', 'b']).optional(),
    curriculumVersion: vine.string().trim().maxLength(100).optional(),
    items: vine
      .array(
        vine.object({
          learningObjectiveId: vine.number().positive(),
          order: vine.number().positive(),
          period: vine.string().trim().maxLength(100).optional(),
        })
      )
      .optional(),
  })
)

export const updateSequenceValidator = vine.create(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(150).optional(),
    groupContext: vine.enum(['a', 'b']).optional(),
    items: vine
      .array(
        vine.object({
          learningObjectiveId: vine.number().positive(),
          order: vine.number().positive(),
          period: vine.string().trim().maxLength(100).optional(),
        })
      )
      .optional(),
    status: vine.enum(['draft', 'published']).optional(),
  })
)

export const createIndicatorValidator = vine.create(
  vine.object({
    learningObjectiveId: vine.number().positive(),
    description: vine.string().trim().minLength(5).maxLength(500),
    evidenceType: vine.string().trim().minLength(2).maxLength(100),
    achievementCriteria: vine.string().trim().minLength(5).maxLength(1000),
  })
)
