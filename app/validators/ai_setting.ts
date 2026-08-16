import vine from '@vinejs/vine'

export const updateAiSettingValidator = vine.create(
  vine.object({
    provider: vine.enum(['9router', 'anthropic', 'openai', 'gemini', 'aggregator']),
    gateway: vine
      .enum(['command_code', 'openrouter', 'opencode_zen', 'together'])
      .nullable()
      .optional(),
    reasoningEffort: vine.enum(['medium', 'high', 'max']).nullable().optional(),
    authMode: vine.enum(['api_key', 'oauth']).optional(),
    apiKey: vine.string().trim().maxLength(500).optional(),
    baseUrl: vine.string().trim().url({ require_tld: false }).maxLength(500).nullable().optional(),
    model: vine.string().trim().maxLength(100).nullable().optional(),
  })
)

export const listModelsValidator = vine.create(
  vine.object({
    provider: vine.enum(['9router', 'anthropic', 'openai', 'gemini', 'aggregator']),
    gateway: vine
      .enum(['command_code', 'openrouter', 'opencode_zen', 'together'])
      .nullable()
      .optional(),
    baseUrl: vine.string().trim().url({ require_tld: false }).maxLength(500).nullable().optional(),
    authMode: vine.enum(['api_key', 'oauth']).optional(),
    apiKey: vine.string().trim().maxLength(500).optional(),
  })
)

export const testConnectionValidator = vine.create(
  vine.object({
    model: vine.string().trim().maxLength(100).optional(),
    apiKey: vine.string().trim().maxLength(500).optional(),
  })
)
