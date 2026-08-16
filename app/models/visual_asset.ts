import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import School from '#models/school'

export type VisualAssetSource =
  'icon_library' | 'svg_composer' | 'svg_llm' | 'image_model' | 'user_upload'

export type VisualAssetKind = 'svg' | 'raster'
export type VisualAssetStatus = 'ready' | 'processing' | 'failed'

export default class VisualAsset extends BaseModel {
  static readonly table = 'visual_assets'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'user_id' }) declare userId: number
  @column({ columnName: 'school_id' }) declare schoolId: number | null
  @column() declare source: VisualAssetSource
  @column() declare kind: VisualAssetKind
  @column() declare status: VisualAssetStatus
  @column({ columnName: 'mime_type' }) declare mimeType: string
  @column() declare url: string
  @column({ columnName: 'storage_path' }) declare storagePath: string
  @column() declare prompt: string | null
  @column({ columnName: 'prompt_hash' }) declare promptHash: string | null
  @column() declare provider: string | null
  @column() declare model: string | null
  @column({ columnName: 'view_box' }) declare viewBox: string | null
  @column() declare width: number | null
  @column() declare height: number | null
  @column() declare error: string | null
  @column({
    prepare: (value: Record<string, unknown>) => JSON.stringify(value ?? {}),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : (value ?? {})),
  })
  declare metadata: Record<string, unknown>

  @belongsTo(() => User, { foreignKey: 'userId' }) declare user: BelongsTo<typeof User>
  @belongsTo(() => School, { foreignKey: 'schoolId' }) declare school: BelongsTo<typeof School>

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
