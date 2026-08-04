import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AuditLog extends BaseModel {
  static readonly table = 'audit_logs'
  static readonly createdAtColumn = 'created_at'
  static readonly updatedAtColumn = false

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'actor_id' }) declare actorId: number | null
  @column() declare action: string
  @column({ columnName: 'entity_type' }) declare entityType: string | null
  @column({ columnName: 'entity_id' }) declare entityId: string | null
  @column({
    columnName: 'metadata',
    prepare: (value: Record<string, unknown>) => JSON.stringify(value ?? {}),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : (value ?? {})),
  })
  declare metadata: Record<string, unknown>
  @column({ columnName: 'ip_address' }) declare ipAddress: string | null
  @column({ columnName: 'user_agent' }) declare userAgent: string | null
  @column.dateTime({ columnName: 'created_at', autoCreate: true }) declare createdAt: DateTime
}
