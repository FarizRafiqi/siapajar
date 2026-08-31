import type AiSetting from '#models/ai_setting'
import { DateTime } from 'luxon'
import { aiSettingRepository } from '#repositories/ai_setting_repository'
import type { AiSettingRepository } from '#repositories/ai_setting_repository'

export type UpdateAiSettingData = {
  provider: '9router' | 'anthropic' | 'openai' | 'gemini' | 'aggregator'
  gateway?: 'command_code' | 'openrouter' | 'opencode_zen' | 'together' | null
  reasoningEffort?: 'none' | 'low' | 'medium' | 'high' | 'max' | 'xhigh' | null
  authMode?: 'api_key' | 'oauth'
  apiKey?: string
  baseUrl?: string | null
  model?: string | null
}

export type GeminiOAuthCredentials = {
  accessToken: string
  refreshToken: string
  expiresIn?: number
  projectId: string | null
}

export class AiSettingsService {
  constructor(private readonly repository: AiSettingRepository = aiSettingRepository) {}

  async getCurrent(): Promise<AiSetting> {
    return this.repository.current()
  }

  async update(data: UpdateAiSettingData) {
    const setting = await this.repository.current()
    const isAggregator = data.provider === 'aggregator'

    setting.provider = isAggregator
      ? '9router'
      : (data.provider as '9router' | 'anthropic' | 'openai' | 'gemini')
    setting.gateway = isAggregator ? (data.gateway ?? null) : null
    setting.reasoningEffort =
      isAggregator || data.provider === 'openai' ? (data.reasoningEffort ?? 'medium') : null
    setting.authMode = isAggregator ? 'api_key' : (data.authMode ?? 'api_key')
    if (!['openai', 'gemini'].includes(setting.provider)) {
      setting.authMode = 'api_key'
    }
    setting.baseUrl = isAggregator || data.provider === '9router' ? (data.baseUrl ?? null) : null
    setting.model = data.model ?? null
    if (data.apiKey) setting.apiKey = data.apiKey
    await setting.save()

    return setting
  }

  async enableOpenAiOAuth() {
    const setting = await this.repository.current()
    setting.provider = 'openai'
    setting.authMode = 'oauth'
    await setting.save()
  }

  async completeGeminiOAuth(credentials: GeminiOAuthCredentials) {
    const setting = await this.repository.current()
    setting.provider = 'gemini'
    setting.authMode = 'oauth'
    setting.oauthAccessToken = credentials.accessToken
    setting.oauthRefreshToken = credentials.refreshToken
    setting.oauthExpiresAt = DateTime.now().plus({ seconds: credentials.expiresIn || 3600 })
    setting.oauthProjectId = credentials.projectId
    await setting.save()
  }
}

export const aiSettingsService = new AiSettingsService()
