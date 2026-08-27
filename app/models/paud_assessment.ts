import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import SchoolClass from '#models/school_class'
import Student from '#models/student'
import Semester from '#models/semester'
import AssessmentAttachment from '#models/assessment_attachment'
import LearningObjective from '#models/learning_objective'

export default class PaudAssessment extends BaseModel {
  static readonly table = 'paud_assessments'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'class_id' })
  declare classId: number

  @column({ columnName: 'student_id' })
  declare studentId: number

  @column({ columnName: 'semester_id' })
  declare semesterId: number | null

  @column({ columnName: 'learning_objective_id' })
  declare learningObjectiveId: number | null

  @column({ columnName: 'iktp_indicator_id' })
  declare iktpIndicatorId: number | null

  @column({ columnName: 'achievement_status' })
  declare achievementStatus: string | null

  @column()
  declare activity: string | null

  @column({ columnName: 'teacher_note' })
  declare teacherNote: string | null

  @column({ columnName: 'evidence_url' })
  declare evidenceUrl: string | null

  @column({ columnName: 'evidence_type' })
  declare evidenceType: string | null

  @column()
  declare type: 'checklist' | 'anecdotal_note' | 'work_sample' | 'photo_series'

  @column.date()
  declare date: DateTime

  @column({
    columnName: 'content',
    prepare: (value: Record<string, any>) => JSON.stringify(value ?? {}),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : (value ?? {})),
  })
  declare content: Record<string, any>

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => SchoolClass, { foreignKey: 'classId' })
  declare schoolClass: BelongsTo<typeof SchoolClass>

  @belongsTo(() => Student, { foreignKey: 'studentId' })
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => Semester, { foreignKey: 'semesterId' })
  declare semester: BelongsTo<typeof Semester>

  @belongsTo(() => LearningObjective, { foreignKey: 'learningObjectiveId' })
  declare learningObjective: BelongsTo<typeof LearningObjective>

  @hasMany(() => AssessmentAttachment, { foreignKey: 'assessmentId' })
  declare attachments: HasMany<typeof AssessmentAttachment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
