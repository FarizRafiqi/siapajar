import VisualAsset from '#models/visual_asset'
import type { VisualAssetKind } from '#models/visual_asset'

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
}

export const visualAssetRepository = new VisualAssetRepository()
