import vine from '@vinejs/vine'

export const updateAiSettingValidator = vine.create(
  vine.object({
    provider: vine.enum(['9router', 'anthropic', 'openai']),
    apiKey: vine.string().trim().maxLength(500).optional(),
    baseUrl: vine.string().trim().url().maxLength(500).nullable().optional(),
    model: vine.string().trim().maxLength(100).nullable().optional(),
  })
)

export const listModelsValidator = vine.create(
  vine.object({
    provider: vine.enum(['anthropic', 'openai']),
    apiKey: vine.string().trim().minLength(1).maxLength(500),
  })
)
