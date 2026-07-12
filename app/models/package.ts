import { column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import User from '#models/user'

export default class Package extends BaseModel {
  static table = 'packages'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare displayName: string

  @column()
  declare description: string | null

  @column()
  declare priceMonthly: number

  @column()
  declare priceYearly: number | null

  @column({ serialize: (value: Record<string, unknown>) => value })
  declare features: Record<string, unknown>

  @column()
  declare isActive: boolean

  @column()
  declare sortOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @beforeCreate()
  static setDefaults(model: Package) {
    if (!model.sortOrder) {
      model.sortOrder = 0
    }
  }
}
