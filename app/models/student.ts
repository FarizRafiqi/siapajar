import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import SchoolClass from '#models/school_class'

export default class Student extends BaseModel {
  static readonly table = 'students'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'class_id' })
  declare classId: number

  @column()
  declare nis: string

  @column({ columnName: 'full_name' })
  declare fullName: string

  @belongsTo(() => SchoolClass, { foreignKey: 'classId' })
  declare schoolClass: BelongsTo<typeof SchoolClass>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
