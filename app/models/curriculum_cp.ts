import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import LearningObjective from '#models/learning_objective'

export default class CurriculumCp extends BaseModel {
  static readonly table = 'curriculum_cps'
  @column({ isPrimary: true }) declare id: number
  @column() declare code: string
  @column() declare element: string
  @column() declare title: string
  @column() declare description: string
  @column() declare phase: string
  @column({ columnName: 'curriculum_version' }) declare curriculumVersion: string
  @column({ columnName: 'is_official' }) declare isOfficial: boolean
  @hasMany(() => LearningObjective, { foreignKey: 'cpId' }) declare learningObjectives: HasMany<
    typeof LearningObjective
  >
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
