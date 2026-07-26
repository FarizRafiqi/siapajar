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

  @column({
    prepare: (value: string[]) => JSON.stringify(value ?? []),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : (value ?? [])),
  })
  declare features: string[]

  @column()
  declare isActive: boolean

  @column({ columnName: 'is_highlighted' })
  declare isHighlighted: boolean

  @column({ columnName: 'cta_label' })
  declare ctaLabel: string | null

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
