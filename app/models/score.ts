import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Assessment from '#models/assessment'
import Student from '#models/student'

export default class Score extends BaseModel {
  static readonly table = 'scores'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'assessment_id' })
  declare assessmentId: number

  @column({ columnName: 'student_id' })
  declare studentId: number

  @column()
  declare value: number | null

  @column()
  declare note: string | null

  @belongsTo(() => Assessment, { foreignKey: 'assessmentId' })
  declare assessment: BelongsTo<typeof Assessment>

  @belongsTo(() => Student, { foreignKey: 'studentId' })
  declare student: BelongsTo<typeof Student>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
