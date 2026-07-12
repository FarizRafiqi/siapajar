import vine from '@vinejs/vine'

export const onboardingValidator = vine.create(
  vine.object({
    schoolName: vine.string().trim().minLength(2).maxLength(100),
    jenjang: vine.enum(['tk', 'sd']),
  })
)
