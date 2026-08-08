import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Package from '#models/package'

export default class PackageSubscription extends BaseModel {
  static readonly table = 'package_subscriptions'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'user_id' }) declare userId: number
  @column({ columnName: 'package_id' }) declare packageId: number | null
  @column() declare status: 'active' | 'expired' | 'canceled'
  @column({ columnName: 'billing_cycle' }) declare billingCycle: 'monthly' | 'yearly' | 'manual'
  @column.dateTime({ columnName: 'starts_at' }) declare startsAt: DateTime
  @column.dateTime({ columnName: 'ends_at' }) declare endsAt: DateTime | null
  @column.dateTime({ columnName: 'canceled_at' }) declare canceledAt: DateTime | null
  @column({
    prepare: (value: Record<string, unknown>) => JSON.stringify(value ?? {}),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : (value ?? {})),
  })
  declare metadata: Record<string, unknown>
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime

  @belongsTo(() => User) declare user: BelongsTo<typeof User>
  @belongsTo(() => Package) declare package: BelongsTo<typeof Package>
}
