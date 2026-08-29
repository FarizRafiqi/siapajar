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
    learningModel: vine
      .enum([
        'Problem Based Learning (PBL)',
        'Project Based Learning (PjBL)',
        'Discovery Learning',
        'Inquiry Learning',
        'Cooperative Learning',
      ])
      .optional(),
    learningApproach: vine
      .enum([
        'Teaching at the Right Level (TaRL)',
        'Culturally Responsive Teaching (CRT)',
        'Teaching at the Right Level (TaRL) + Culturally Responsive Teaching (CRT)',
      ])
      .optional(),
    learningSequenceId: vine.number().positive().optional(),
  })
)

export const generateExamValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    subject: vine.string().trim().minLength(1).maxLength(100),
    type: vine.enum(['midterm', 'final', 'daily', 'summative']),
    topic: vine.string().trim().minLength(1).maxLength(200),
    questionCount: vine.number().min(3).max(25),
    examMode: vine
      .enum(['lisan', 'tertulis_visual', 'multiple_choice', 'essay', 'practical'])
      .optional(),
    learningSequenceId: vine.number().positive().optional(),
  })
)

export const generateAnnualPlanValidator = vine.create(
  vine.object({
    academicYearId: vine.number().positive(),
    subject: vine.string().trim().minLength(1).maxLength(100),
    learningSequenceId: vine.number().positive().optional(),
  })
)

export const generateSemesterPlanValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    semesterId: vine.number().positive(),
    subject: vine.string().trim().minLength(1).maxLength(100),
    learningSequenceId: vine.number().positive().optional(),
  })
)

export const generateWeeklyLessonPlanValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    theme: vine.string().trim().minLength(1).maxLength(200),
    subtheme: vine.string().trim().maxLength(200).optional(),
    weekStartDate: vine.date(),
    semester: vine.number().min(1).max(2).optional(),
    weekNumber: vine.number().min(1).max(25).optional(),
    presetId: vine.number().positive().optional(),
    learningModel: vine
      .enum([
        'Pembelajaran Berbasis Bermain',
        'Eksplorasi dan Discovery',
        'Inkuiri Sederhana',
        'Projek Bermain Kontekstual',
        'Bermain Kolaboratif',
        'STEAM berbasis Loose Parts',
      ])
      .optional(),
    learningSequenceId: vine.number().positive().optional(),
  })
)

export const generateDailyLessonPlanValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    weeklyLessonPlanId: vine.number().positive().optional(),
    theme: vine.string().trim().minLength(1).maxLength(200),
    date: vine.date(),
    learningSequenceId: vine.number().positive().optional(),
  })
)

export const generateLkpdValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    theme: vine.string().trim().minLength(1).maxLength(200),
    subtheme: vine.string().trim().maxLength(200).optional(),
    ageGroup: vine.string().trim().maxLength(100).optional(),
    learningSequenceId: vine.number().positive().optional(),
  })
)

export const generateMediaModuleValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    theme: vine.string().trim().minLength(1).maxLength(200),
    subtheme: vine.string().trim().maxLength(200).optional(),
    learningSequenceId: vine.number().positive().optional(),
  })
)
