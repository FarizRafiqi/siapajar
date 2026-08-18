import vine from '@vinejs/vine'

export const createCurriculumPresetValidator = vine.create(
  vine.object({
    educationLevel: vine.enum(['tk', 'sd', 'smp', 'sma'] as const),
    curriculumVersion: vine.string().trim().minLength(2).maxLength(50),
    semester: vine.number().min(1).max(2),
    weekNumber: vine.number().min(1).max(30).optional(),
    code: vine.string().trim().minLength(2).maxLength(50),
    themeTitle: vine.string().trim().minLength(2).maxLength(255),
    subthemeTitle: vine.string().trim().maxLength(255).optional(),
    phase: vine.string().trim().minLength(1).maxLength(50),
    groupContext: vine.enum(['a', 'b'] as const).optional(),
    description: vine.string().trim().optional(),
    dpl: vine.array(vine.string()).optional(),
    kbcValues: vine.array(vine.string()).optional(),
    loosePartsSuggestions: vine.array(vine.string()).optional(),
    isActive: vine.boolean().optional(),
    sortOrder: vine.number().optional(),
  })
)

export const updateCurriculumPresetValidator = vine.create(
  vine.object({
    educationLevel: vine.enum(['tk', 'sd', 'smp', 'sma'] as const).optional(),
    curriculumVersion: vine.string().trim().minLength(2).maxLength(50).optional(),
    semester: vine.number().min(1).max(2).optional(),
    weekNumber: vine.number().min(1).max(30).nullable().optional(),
    code: vine.string().trim().minLength(2).maxLength(50).optional(),
    themeTitle: vine.string().trim().minLength(2).maxLength(255).optional(),
    subthemeTitle: vine.string().trim().maxLength(255).nullable().optional(),
    phase: vine.string().trim().minLength(1).maxLength(50).optional(),
    groupContext: vine
      .enum(['a', 'b'] as const)
      .nullable()
      .optional(),
    description: vine.string().trim().optional(),
    dpl: vine.array(vine.string()).optional(),
    kbcValues: vine.array(vine.string()).optional(),
    loosePartsSuggestions: vine.array(vine.string()).optional(),
    isActive: vine.boolean().optional(),
    sortOrder: vine.number().optional(),
  })
)
