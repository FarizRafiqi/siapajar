import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ReportNarrative extends BaseModel {
  static readonly table = 'report_narratives'
  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'user_id' }) declare userId: number
  @column({ columnName: 'class_id' }) declare classId: number
  @column({ columnName: 'student_id' }) declare studentId: number
  @column({ columnName: 'semester_id' }) declare semesterId: number
  @column() declare element: string
  @column() declare content: string
  @column() declare status: 'draft' | 'approved'
  @column.dateTime({ columnName: 'approved_at' }) declare approvedAt: DateTime | null
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
