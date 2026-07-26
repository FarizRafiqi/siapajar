import vine from '@vinejs/vine'

export const createAssessmentValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    subject: vine.string().trim().minLength(1).maxLength(100),
    type: vine.enum(['formative', 'summative']),
    title: vine.string().trim().minLength(1).maxLength(200),
    learningObjective: vine.string().trim().maxLength(300).optional(),
    date: vine.date(),
  })
)

export const updateScoresValidator = vine.create(
  vine.object({
    scores: vine.array(
      vine.object({
        studentId: vine.number().positive(),
        value: vine.number().min(0).max(100).nullable(),
        note: vine.string().trim().maxLength(200).nullable().optional(),
      })
    ),
  })
)
