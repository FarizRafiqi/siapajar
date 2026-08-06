import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import School from '#models/school'

export default class LearningSequence extends BaseModel {
  static readonly table = 'learning_sequences'
  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'user_id' }) declare userId: number
  @column({ columnName: 'school_id' }) declare schoolId: number | null
  @column() declare title: string
  @column({ columnName: 'education_level' }) declare educationLevel: 'tk' | 'sd'
  @column({ columnName: 'group_context' }) declare groupContext: 'a' | 'b' | null
  @column({ columnName: 'curriculum_version' }) declare curriculumVersion: string
  @column({
    prepare: (v: unknown[]) => JSON.stringify(v ?? []),
    consume: (v: unknown) => (typeof v === 'string' ? JSON.parse(v) : (v ?? [])),
  })
  declare items: unknown[]
  @column() declare status: 'draft' | 'published'
  @belongsTo(() => User, { foreignKey: 'userId' }) declare user: BelongsTo<typeof User>
  @belongsTo(() => School, { foreignKey: 'schoolId' }) declare school: BelongsTo<typeof School>
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
