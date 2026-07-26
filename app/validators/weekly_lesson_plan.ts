import vine from '@vinejs/vine'

export const updateWeeklyLessonPlanValidator = vine.create(
  vine.object({
    theme: vine.string().trim().minLength(1).maxLength(200).optional(),
    content: vine.any().optional(),
    status: vine.enum(['draft', 'published']).optional(),
  })
)
