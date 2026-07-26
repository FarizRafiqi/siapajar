import vine from '@vinejs/vine'

/**
 * Validator untuk endpoint generate AI.
 * Kepemilikan classId/academicYearId/semesterId diverifikasi di controller.
 */

export const generateTeachingModuleValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    subject: vine.string().trim().minLength(1).maxLength(100),
    topic: vine.string().trim().minLength(1).maxLength(200),
    phase: vine.enum(['A', 'B', 'C', 'D', 'E', 'F']),
  })
)

export const generateExamValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    subject: vine.string().trim().minLength(1).maxLength(100),
    type: vine.enum(['midterm', 'final', 'daily', 'summative']),
    topic: vine.string().trim().minLength(1).maxLength(200),
    questionCount: vine.number().min(5).max(50),
  })
)

export const generateAnnualPlanValidator = vine.create(
  vine.object({
    academicYearId: vine.number().positive(),
    subject: vine.string().trim().minLength(1).maxLength(100),
  })
)

export const generateSemesterPlanValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    semesterId: vine.number().positive(),
    subject: vine.string().trim().minLength(1).maxLength(100),
  })
)

export const generateWeeklyLessonPlanValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    theme: vine.string().trim().minLength(1).maxLength(200),
    weekStartDate: vine.date(),
  })
)

export const generateDailyLessonPlanValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    weeklyLessonPlanId: vine.number().positive().optional(),
    theme: vine.string().trim().minLength(1).maxLength(200),
    date: vine.date(),
  })
)
