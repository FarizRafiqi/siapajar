import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import SchoolClass from '#models/school_class'
import Score from '#models/score'

export default class Assessment extends BaseModel {
  static readonly table = 'assessments'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'class_id' })
  declare classId: number

  @column()
  declare subject: string

  @column()
  declare type: 'formative' | 'summative'

  @column()
  declare title: string

  @column({ columnName: 'learning_objective' })
  declare learningObjective: string | null

  @column.date()
  declare date: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => SchoolClass, { foreignKey: 'classId' })
  declare schoolClass: BelongsTo<typeof SchoolClass>

  @hasMany(() => Score, { foreignKey: 'assessmentId' })
  declare scores: HasMany<typeof Score>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
