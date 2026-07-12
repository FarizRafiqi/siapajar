import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import AcademicYear from '#models/academic_year'
import Student from '#models/student'
import TeachingModule from '#models/teaching_module'
import Exam from '#models/exam'
import SemesterPlan from '#models/semester_plan'

export default class SchoolClass extends BaseModel {
  public static readonly table = 'classes'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'academic_year_id' })
  declare academicYearId: number

  @column()
  declare name: string

  @column({ columnName: 'grade_level' })
  declare gradeLevel: number

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => AcademicYear, { foreignKey: 'academicYearId' })
  declare academicYear: BelongsTo<typeof AcademicYear>

  @hasMany(() => Student, { foreignKey: 'classId' })
  declare students: HasMany<typeof Student>

  @hasMany(() => TeachingModule, { foreignKey: 'classId' })
  declare teachingModules: HasMany<typeof TeachingModule>

  @hasMany(() => Exam, { foreignKey: 'classId' })
  declare exams: HasMany<typeof Exam>

  @hasMany(() => SemesterPlan, { foreignKey: 'classId' })
  declare semesterPlans: HasMany<typeof SemesterPlan>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
