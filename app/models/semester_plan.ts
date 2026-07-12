import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import SchoolClass from '#models/school_class'
import Semester from '#models/semester'

export default class SemesterPlan extends BaseModel {
  public static readonly table = 'semester_plans'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'class_id' })
  declare classId: number

  @column({ columnName: 'semester_id' })
  declare semesterId: number

  @column()
  declare subject: string

  @column({ columnName: 'content', serializeAs: null })
  declare content: Record<string, any>

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => SchoolClass, { foreignKey: 'classId' })
  declare schoolClass: BelongsTo<typeof SchoolClass>

  @belongsTo(() => Semester, { foreignKey: 'semesterId' })
  declare semester: BelongsTo<typeof Semester>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
