import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import SchoolClass from '#models/school_class'

export default class Exam extends BaseModel {
  static readonly table = 'exams'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'class_id' })
  declare classId: number

  @column()
  declare title: string

  @column()
  declare type: 'midterm' | 'final' | 'daily' | 'summative'

  /**
   * Array JSONB. Lucid tidak otomatis meng-encode array (beda dengan objek),
   * jadi prepare/consume ditulis eksplisit — tanpa ini insert gagal dengan
   * "invalid input syntax for type json".
   */
  @column({
    columnName: 'questions',
    prepare: (value: Record<string, any>[]) => JSON.stringify(value ?? []),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : (value ?? [])),
  })
  declare questions: Record<string, any>[]

  @column({
    columnName: 'header',
    prepare: (value: Record<string, string>) => JSON.stringify(value ?? {}),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : (value ?? {})),
  })
  declare header: Record<string, string>

  @column()
  declare status: 'draft' | 'published'

  @column({ columnName: 'generation_status' })
  declare generationStatus:
    'queued' | 'researching' | 'generating_questions' | 'generating_images' | 'completed' | 'failed'

  @column({
    columnName: 'generation_progress',
    prepare: (value: Record<string, unknown>) => JSON.stringify(value ?? {}),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : (value ?? {})),
  })
  declare generationProgress: Record<string, unknown>

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => SchoolClass, { foreignKey: 'classId' })
  declare schoolClass: BelongsTo<typeof SchoolClass>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
