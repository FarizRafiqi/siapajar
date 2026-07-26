import vine from '@vinejs/vine'

export const updateDailyLessonPlanValidator = vine.create(
  vine.object({
    content: vine.any().optional(),
    status: vine.enum(['draft', 'published']).optional(),
  })
)
