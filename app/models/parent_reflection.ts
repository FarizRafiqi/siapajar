import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ParentReflection extends BaseModel {
  static readonly table = 'parent_reflections'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'user_id' }) declare userId: number
  @column({ columnName: 'class_id' }) declare classId: number
  @column({ columnName: 'student_id' }) declare studentId: number
  @column({ columnName: 'semester_id' }) declare semesterId: number
  @column() declare content: string | null
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
