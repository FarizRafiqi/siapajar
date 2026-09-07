import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import AiJob from '#models/ai_job'
import User from '#models/user'
import { generateConfiguredImage } from '#services/ai_service'
import { persistVisualAsset } from '#services/visual_asset_service'
import { commitUsageReservation, releaseUsageReservation } from '#services/entitlement_service'
import { aiJobRepository } from '#repositories/ai_job_repository'
import { aiSettingRepository } from '#repositories/ai_setting_repository'

export interface GenerateAiImagePayload {
  jobKey: string
  userId: number
  prompt: string
}

export default class GenerateAiImage extends Job<GenerateAiImagePayload> {
  static options: JobOptions = {
    queue: 'ai',
    maxRetries: 2,
    timeout: '2m',
    removeOnComplete: { age: '1h' },
    removeOnFail: { age: '1d' },
  }

  static async executeDirect(payload: GenerateAiImagePayload) {
    const job = await AiJob.findByOrFail('job_key', payload.jobKey)
    if (job.status === 'completed') return
    const user = await User.findOrFail(payload.userId)
    const setting = await aiSettingRepository.current()
    await aiJobRepository.markProcessing(job)
    try {
      const dataUrl = await generateConfiguredImage(payload.prompt)
      const asset = await persistVisualAsset({
        user,
        source: 'image_model',
        kind: 'raster',
        prompt: payload.prompt,
        provider: setting.provider,
        model: setting.model,
        dataUrl,
      })
      const result = {
        url: asset.url,
        assetId: asset.id,
        kind: asset.kind,
        source: asset.source,
      }
      await aiJobRepository.markCompleted(job, result)
      await commitUsageReservation(payload.jobKey)
    } catch (error) {
      await aiJobRepository.markFailed(
        job,
        error instanceof Error ? error.message : 'AI image job failed'
      )
      await releaseUsageReservation(payload.jobKey)
      throw error
    }
  }

  async execute() {
    return GenerateAiImage.executeDirect(this.payload)
  }
}
