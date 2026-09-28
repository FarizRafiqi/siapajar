import type AiSetting from '#models/ai_setting'
import { DateTime } from 'luxon'
import { aiSettingRepository } from '#repositories/ai_setting_repository'
import type { AiSettingRepository } from '#repositories/ai_setting_repository'
import { auditService } from '#services/audit_service'

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

  async update(data: UpdateAiSettingData, actorId?: number) {
    const setting = await this.repository.current()
    const before = safeAuditState(setting)
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
    await auditService.recordCritical({
      actorId,
      action: 'admin.ai_settings.updated',
      entityType: 'ai_settings',
      entityId: setting.id,
      metadata: {
        before,
        after: safeAuditState(setting),
        apiKeyProvided: Boolean(data.apiKey),
        changedFields: Object.keys(data)
          .filter((field) => field !== 'apiKey')
          .sort(),
      },
    })

    return setting
  }

  async enableOpenAiOAuth(actorId?: number) {
    const setting = await this.repository.current()
    setting.provider = 'openai'
    setting.authMode = 'oauth'
    await setting.save()
    await auditService.recordCritical({
      actorId,
      action: 'admin.ai_settings.oauth_enabled',
      entityType: 'ai_settings',
      entityId: setting.id,
      metadata: { provider: 'openai', authMode: 'oauth' },
    })
  }

  async completeGeminiOAuth(credentials: GeminiOAuthCredentials, actorId?: number) {
    const setting = await this.repository.current()
    setting.provider = 'gemini'
    setting.authMode = 'oauth'
    setting.oauthAccessToken = credentials.accessToken
    setting.oauthRefreshToken = credentials.refreshToken
    setting.oauthExpiresAt = DateTime.now().plus({ seconds: credentials.expiresIn || 3600 })
    setting.oauthProjectId = credentials.projectId
    await setting.save()
    await auditService.recordCritical({
      actorId,
      action: 'admin.ai_settings.oauth_connected',
      entityType: 'ai_settings',
      entityId: setting.id,
      metadata: {
        provider: 'gemini',
        authMode: 'oauth',
        projectConfigured: Boolean(credentials.projectId),
      },
    })
  }
}

function safeAuditState(setting: AiSetting) {
  return {
    provider: setting.gateway ? 'aggregator' : setting.provider,
    gateway: setting.gateway,
    model: setting.model,
    reasoningEffort: setting.reasoningEffort,
    authMode: setting.authMode,
    hasApiKey: Boolean(setting.apiKey),
  }
}

export const aiSettingsService = new AiSettingsService()
