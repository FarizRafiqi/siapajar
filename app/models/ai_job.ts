import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AiJob extends BaseModel {
  static readonly table = 'ai_jobs'
  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'job_key' }) declare jobKey: string
  @column({ columnName: 'user_id' }) declare userId: number
  @column() declare combo: string
  @column() declare status: 'pending' | 'processing' | 'completed' | 'failed'
  @column() declare attempts: number
  @column({
    prepare: (v: Record<string, unknown>) => JSON.stringify(v ?? {}),
    consume: (v: unknown) => (typeof v === 'string' ? JSON.parse(v) : (v ?? {})),
  })
  declare payload: Record<string, unknown>
  @column({
    prepare: (v: unknown) => (v == null ? null : JSON.stringify(v)),
    consume: (v: unknown) => (typeof v === 'string' ? JSON.parse(v) : v),
  })
  declare result: unknown
  @column() declare error: string | null
  @column.dateTime({ columnName: 'available_at' }) declare availableAt: DateTime
  @column.dateTime({ columnName: 'started_at' }) declare startedAt: DateTime | null
  @column.dateTime({ columnName: 'finished_at' }) declare finishedAt: DateTime | null
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
