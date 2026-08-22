import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export interface CurriculumPresetData {
  description?: string
  objectives?: string[]
  dpl?: string[]
  kbcValues?: string[]
  essentialConcepts?: string[]
  loosePartsSuggestions?: string[]
  activityIdeas?: string[]
  [key: string]: any
}

export default class CurriculumPreset extends BaseModel {
  static readonly table = 'curriculum_presets'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'education_level' })
  declare educationLevel: 'tk' | 'sd' | 'smp' | 'sma'

  @column({ columnName: 'curriculum_version' })
  declare curriculumVersion: string

  @column()
  declare semester: number

  @column({ columnName: 'week_number' })
  declare weekNumber: number | null

  @column()
  declare code: string

  @column({ columnName: 'theme_title' })
  declare themeTitle: string

  @column({ columnName: 'subtheme_title' })
  declare subthemeTitle: string | null

  @column()
  declare phase: string

  @column({ columnName: 'group_context' })
  declare groupContext: 'a' | 'b' | null

  @column({
    columnName: 'data',
    prepare: (value: CurriculumPresetData) => JSON.stringify(value ?? {}),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : (value ?? {})),
  })
  declare data: CurriculumPresetData

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @column({ columnName: 'sort_order' })
  declare sortOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
