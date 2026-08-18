import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import encryption from '@adonisjs/core/services/encryption'

export default class AiSetting extends BaseModel {
  static readonly table = 'ai_settings'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare provider: '9router' | 'anthropic' | 'openai' | 'gemini'

  /** Optional OpenAI-compatible aggregator. Legacy provider remains untouched. */
  @column()
  declare gateway: 'command_code' | 'openrouter' | 'opencode_zen' | 'together' | null

  @column({ columnName: 'auth_mode' })
  declare authMode: 'api_key' | 'oauth'

  /**
   * Tidak pernah dikirim ke client (serializeAs: null) — dan dienkripsi
   * di kolom DB (APP_KEY) supaya dump/backup tidak bocorin key mentah.
   */
  @column({
    columnName: 'api_key',
    serializeAs: null,
    prepare: (value: string | null) => (value ? encryption.encrypt(value) : null),
    consume: (value: string | null) => (value ? (encryption.decrypt<string>(value) ?? null) : null),
  })
  declare apiKey: string | null

  @column({
    columnName: 'oauth_access_token',
    serializeAs: null,
    prepare: (value: string | null) => (value ? encryption.encrypt(value) : null),
    consume: (value: string | null) => (value ? (encryption.decrypt<string>(value) ?? null) : null),
  })
  declare oauthAccessToken: string | null

  @column({
    columnName: 'oauth_refresh_token',
    serializeAs: null,
    prepare: (value: string | null) => (value ? encryption.encrypt(value) : null),
    consume: (value: string | null) => (value ? (encryption.decrypt<string>(value) ?? null) : null),
  })
  declare oauthRefreshToken: string | null

  @column.dateTime({ columnName: 'oauth_expires_at' })
  declare oauthExpiresAt: DateTime | null

  @column({ columnName: 'oauth_email' })
  declare oauthEmail: string | null

  @column({ columnName: 'oauth_project_id' })
  declare oauthProjectId: string | null

  @column({ columnName: 'base_url' })
  declare baseUrl: string | null

  @column()
  declare model: string | null

  @column({ columnName: 'reasoning_effort' })
  declare reasoningEffort: 'none' | 'low' | 'medium' | 'high' | 'max' | 'xhigh' | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async current() {
    let setting = await AiSetting.query().orderBy('id', 'asc').first()
    setting ??= await AiSetting.create({ provider: '9router', authMode: 'api_key' })
    return setting
  }
}
