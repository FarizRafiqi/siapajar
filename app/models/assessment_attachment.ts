import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import PaudAssessment from '#models/paud_assessment'
import User from '#models/user'

export default class AssessmentAttachment extends BaseModel {
  static readonly table = 'assessment_attachments'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'assessment_id' }) declare assessmentId: number
  @column({ columnName: 'user_id' }) declare userId: number
  @column({ columnName: 'original_name' }) declare originalName: string
  @column({ columnName: 'stored_name' }) declare storedName: string
  @column() declare url: string
  @column({ columnName: 'mime_type' }) declare mimeType: string
  @column() declare size: number
  @column({ columnName: 'display_order' }) declare displayOrder: number
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime

  @belongsTo(() => PaudAssessment, { foreignKey: 'assessmentId' }) declare assessment: BelongsTo<
    typeof PaudAssessment
  >
  @belongsTo(() => User, { foreignKey: 'userId' }) declare user: BelongsTo<typeof User>
}
