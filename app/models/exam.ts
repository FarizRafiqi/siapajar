import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import SchoolClass from '#models/school_class'

export default class Exam extends BaseModel {
  static readonly table = 'exams'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'class_id' })
  declare classId: number

  @column()
  declare title: string

  @column()
  declare type: 'midterm' | 'final' | 'daily' | 'summative'

  @column({ columnName: 'questions', serializeAs: null })
  declare questions: Record<string, any>[]

  @column()
  declare status: 'draft' | 'published'

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => SchoolClass, { foreignKey: 'classId' })
  declare schoolClass: BelongsTo<typeof SchoolClass>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
