import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import LearningObjective from '#models/learning_objective'

export default class IktpIndicator extends BaseModel {
  static readonly table = 'iktp_indicators'
  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'learning_objective_id' }) declare learningObjectiveId: number
  @column({ columnName: 'user_id' }) declare userId: number | null
  @column() declare description: string
  @column({ columnName: 'evidence_type' }) declare evidenceType: string
  @column({ columnName: 'achievement_criteria' }) declare achievementCriteria: string
  @belongsTo(() => LearningObjective, { foreignKey: 'learningObjectiveId' })
  declare learningObjective: BelongsTo<typeof LearningObjective>
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
