import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EmailVerificationToken extends BaseModel {
  static readonly table = 'email_verification_tokens'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'user_id' }) declare userId: number
  @column({ columnName: 'token_hash', serializeAs: null }) declare tokenHash: string
  @column() declare purpose: 'email_verification' | 'email_change'
  @column({ columnName: 'target_email' }) declare targetEmail: string | null
  @column.dateTime({ columnName: 'expires_at' }) declare expiresAt: DateTime
  @column.dateTime({ columnName: 'used_at' }) declare usedAt: DateTime | null
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
