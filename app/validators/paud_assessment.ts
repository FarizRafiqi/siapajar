import vine from '@vinejs/vine'

export const createPaudAssessmentValidator = vine.create(
  vine.object({
    classId: vine.number().positive(),
    semesterId: vine.number().positive().optional(),
    studentId: vine.number().positive(),
    type: vine.enum(['checklist', 'anecdotal_note', 'work_sample', 'photo_series']),
    date: vine.date(),
    content: vine.any(),
    learningObjectiveId: vine.number().positive().optional(),
    iktpIndicatorId: vine.number().positive().optional(),
    achievementStatus: vine
      .enum([
        'belum_terlihat',
        'mulai_berkembang',
        'berkembang_sesuai_harapan',
        'berkembang_sangat_baik',
      ])
      .optional(),
    activity: vine.string().trim().maxLength(500).optional(),
    teacherNote: vine.string().trim().maxLength(2000).optional(),
    evidenceUrl: vine.string().url().optional(),
    evidenceType: vine.string().trim().maxLength(100).optional(),
  })
)

export const updatePaudAssessmentValidator = vine.create(
  vine.object({
    content: vine.any().optional(),
    learningObjectiveId: vine.number().positive().optional(),
    iktpIndicatorId: vine.number().positive().optional(),
    achievementStatus: vine
      .enum([
        'belum_terlihat',
        'mulai_berkembang',
        'berkembang_sesuai_harapan',
        'berkembang_sangat_baik',
      ])
      .optional(),
    activity: vine.string().trim().maxLength(500).optional(),
    teacherNote: vine.string().trim().maxLength(2000).optional(),
    evidenceUrl: vine.string().url().optional(),
    evidenceType: vine.string().trim().maxLength(100).optional(),
  })
)

export const generateAiPaudAssessmentValidator = vine.create(
  vine.object({
    type: vine.enum(['checklist', 'anecdotal_note', 'work_sample', 'photo_series']),
    classId: vine.number().positive().optional(),
    studentId: vine.number().positive().optional(),
    theme: vine.string().trim().maxLength(200).optional(),
    context: vine.string().trim().maxLength(500).optional(),
    observedBehaviorNotes: vine.string().trim().maxLength(1000).optional(),
    learningObjective: vine.string().trim().maxLength(500).optional(),
    targetIndicators: vine.array(vine.string()).optional(),
    roughNotes: vine.string().trim().maxLength(1000).optional(),
    workTitle: vine.string().trim().maxLength(200).optional(),
    childQuotesOrDescription: vine.string().trim().maxLength(1000).optional(),
    activityTitle: vine.string().trim().maxLength(200).optional(),
    stageNotes: vine.string().trim().maxLength(1000).optional(),
  })
)

export const exportBundlePaudAssessmentValidator = vine.create(
  vine.object({
    classId: vine.number().positive().optional(),
    studentId: vine.number().positive().optional(),
    theme: vine.string().trim().maxLength(200).optional(),
    week: vine.string().trim().maxLength(50).optional(),
    type: vine
      .enum(['all', 'checklist', 'anecdotal_note', 'work_sample', 'photo_series'])
      .optional(),
  })
)
