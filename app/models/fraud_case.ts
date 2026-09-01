import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class FraudCase extends BaseModel {
  static readonly table = 'fraud_cases'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'user_id' }) declare userId: number | null
  @column() declare type: string
  @column() declare status: 'open' | 'approved' | 'rejected'
  @column({
    prepare: (value: Record<string, unknown>) => JSON.stringify(value),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare evidence: Record<string, unknown>
  @column({ columnName: 'reviewed_by_user_id' }) declare reviewedByUserId: number | null
  @column.dateTime({ columnName: 'reviewed_at' }) declare reviewedAt: DateTime | null
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
