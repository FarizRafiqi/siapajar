import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import CurriculumCp from '#models/curriculum_cp'
import IktpIndicator from '#models/iktp_indicator'

export default class LearningObjective extends BaseModel {
  static readonly table = 'learning_objectives'
  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'cp_id' }) declare cpId: number
  @column({ columnName: 'user_id' }) declare userId: number | null
  @column() declare code: string
  @column() declare title: string
  @column({ columnName: 'group_context' }) declare groupContext: 'a' | 'b' | null
  @column() declare source: string
  @belongsTo(() => CurriculumCp, { foreignKey: 'cpId' }) declare cp: BelongsTo<typeof CurriculumCp>
  @hasMany(() => IktpIndicator, { foreignKey: 'learningObjectiveId' }) declare indicators: HasMany<
    typeof IktpIndicator
  >
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
