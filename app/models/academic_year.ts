import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import SchoolClass from '#models/school_class'
import AnnualPlan from '#models/annual_plan'
import Semester from '#models/semester'

export default class AcademicYear extends BaseModel {
  static table = 'academic_years'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @hasMany(() => SchoolClass)
  declare classes: HasMany<typeof SchoolClass>

  @hasMany(() => AnnualPlan)
  declare annualPlans: HasMany<typeof AnnualPlan>

  @hasMany(() => Semester)
  declare semesters: HasMany<typeof Semester>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
