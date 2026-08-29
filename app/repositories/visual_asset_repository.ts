import VisualAsset from '#models/visual_asset'
import type { VisualAssetKind, VisualAssetSource } from '#models/visual_asset'

export type VisualAssetPersistenceData = {
  userId: number
  schoolId: number | null
  source: VisualAssetSource
  kind: VisualAssetKind
  status: 'ready' | 'processing' | 'failed'
  mimeType: string
  url: string
  storagePath: string
  prompt: string | null
  promptHash: string | null
  provider: string | null
  model: string | null
  viewBox: string | null
  width: number | null
  height: number | null
  error: string | null
  metadata: Record<string, unknown>
}

export class VisualAssetRepository {
  async findCached(userId: number, cacheKey: string, kind: VisualAssetKind) {
    return VisualAsset.query()
      .where('user_id', userId)
      .where('prompt_hash', cacheKey)
      .where('kind', kind)
      .where('status', 'ready')
      .orderBy('id', 'desc')
      .first()
  }

  async createReadyAsset(data: VisualAssetPersistenceData) {
    return VisualAsset.create(data)
  }

  async createUploadedAsset(data: VisualAssetPersistenceData) {
    return VisualAsset.create(data)
  }
}

export const visualAssetRepository = new VisualAssetRepository()
