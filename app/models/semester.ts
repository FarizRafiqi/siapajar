import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import AcademicYear from '#models/academic_year'
import SemesterPlan from '#models/semester_plan'

export default class Semester extends BaseModel {
  static readonly table = 'semesters'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'academic_year_id' })
  declare academicYearId: number

  @column()
  declare name: string

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @belongsTo(() => AcademicYear, { foreignKey: 'academicYearId' })
  declare academicYear: BelongsTo<typeof AcademicYear>

  @hasMany(() => SemesterPlan)
  declare semesterPlans: HasMany<typeof SemesterPlan>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
