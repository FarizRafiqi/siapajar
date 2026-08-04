import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Package from '#models/package'

export default class PackageEntitlement extends BaseModel {
  static readonly table = 'package_entitlements'
  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'package_id' }) declare packageId: number
  @column({ columnName: 'feature_key' }) declare featureKey: string
  @column({ columnName: 'limit_value' }) declare limitValue: number | null
  @column({ columnName: 'is_enabled' }) declare isEnabled: boolean
  @belongsTo(() => Package, { foreignKey: 'packageId' }) declare package: BelongsTo<typeof Package>
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
