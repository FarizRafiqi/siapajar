import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import AcademicYear from '#models/academic_year'

export default class AnnualPlan extends BaseModel {
  static readonly table = 'annual_plans'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'academic_year_id' })
  declare academicYearId: number

  @column()
  declare subject: string

  @column({ columnName: 'content', serializeAs: null })
  declare content: Record<string, any>

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => AcademicYear, { foreignKey: 'academicYearId' })
  declare academicYear: BelongsTo<typeof AcademicYear>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
