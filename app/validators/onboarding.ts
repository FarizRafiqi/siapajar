import vine from '@vinejs/vine'

export const onboardingValidator = vine.create(
  vine.object({
    schoolName: vine.string().trim().minLength(2).maxLength(100),
    educationLevel: vine.enum(['tk', 'sd']).optional(),
    institutionType: vine.enum(['tk', 'ra']).optional(),
    curriculumVersion: vine.string().trim().maxLength(100).optional(),
    defaultGroupContext: vine.enum(['a', 'b']).optional(),
  })
)
