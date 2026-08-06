import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UsageEvent extends BaseModel {
  static readonly table = 'usage_events'
  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'user_id' }) declare userId: number
  @column({ columnName: 'event_key' }) declare eventKey: string
  @column({ columnName: 'reservation_key' }) declare reservationKey: string | null
  @column() declare quantity: number
  @column.date({ columnName: 'period_start' }) declare periodStart: DateTime
  @column({
    prepare: (v: Record<string, unknown>) => JSON.stringify(v ?? {}),
    consume: (v: unknown) => (typeof v === 'string' ? JSON.parse(v) : (v ?? {})),
  })
  declare metadata: Record<string, unknown>
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
