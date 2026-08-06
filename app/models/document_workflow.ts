import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export type DocumentType = 'teaching_module' | 'rppm' | 'rpph' | 'lkpd' | 'media_module'
export type DocumentStatus = 'draft' | 'published' | 'archived'

export default class DocumentWorkflow extends BaseModel {
  static readonly table = 'document_workflows'
  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'user_id' }) declare userId: number
  @column({ columnName: 'document_type' }) declare documentType: DocumentType
  @column({ columnName: 'document_id' }) declare documentId: number
  @column() declare status: DocumentStatus
  @column.dateTime({ columnName: 'last_saved_at' }) declare lastSavedAt: DateTime | null
  @column({ columnName: 'template_key' }) declare templateKey: string | null
  @column() declare version: number
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
  @belongsTo(() => User, { foreignKey: 'userId' }) declare user: BelongsTo<typeof User>
}
