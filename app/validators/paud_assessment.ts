import vine from '@vinejs/vine'

export const createPaudAssessmentValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    studentId: vine.number().positive(),
    type: vine.enum(['checklist', 'anecdotal_note', 'work_sample', 'photo_series']),
    date: vine.date(),
    content: vine.any(),
  })
)

export const updatePaudAssessmentValidator = vine.create(
  vine.object({
    content: vine.any().optional(),
  })
)
