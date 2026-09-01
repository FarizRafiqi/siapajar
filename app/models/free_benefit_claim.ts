import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class FreeBenefitClaim extends BaseModel {
  static readonly table = 'free_benefit_claims'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'user_id' }) declare userId: number
  @column({ columnName: 'email_hash', serializeAs: null }) declare emailHash: string
  @column({ columnName: 'device_hash', serializeAs: null }) declare deviceHash: string
  @column({ columnName: 'ip_hash', serializeAs: null }) declare ipHash: string
  @column() declare source: string
  @column.dateTime({ columnName: 'claimed_at' }) declare claimedAt: DateTime
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
