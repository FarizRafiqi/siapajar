import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import encryption from '@adonisjs/core/services/encryption'

export default class AiSetting extends BaseModel {
  static readonly table = 'ai_settings'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare provider: '9router' | 'anthropic' | 'openai'

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

  @column({ columnName: 'base_url' })
  declare baseUrl: string | null

  @column()
  declare model: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async current() {
    let setting = await AiSetting.query().orderBy('id', 'asc').first()
    if (!setting) {
      setting = await AiSetting.create({ provider: '9router' })
    }
    return setting
  }
}
