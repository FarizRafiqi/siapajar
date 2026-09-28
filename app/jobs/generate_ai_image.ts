import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import AiJob from '#models/ai_job'
import User from '#models/user'
import { generateConfiguredImage } from '#services/ai_service'
import { persistVisualAsset } from '#services/visual_asset_service'
import {
  commitUsageReservation,
  releaseUsageReservation,
  reserveUsage,
} from '#services/entitlement_service'
import { aiJobRepository } from '#repositories/ai_job_repository'
import { aiSettingRepository } from '#repositories/ai_setting_repository'
import { aiJobLifecycleService } from '#services/ai_job_lifecycle_service'

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

  static async executeDirect(
    payload: GenerateAiImagePayload,
    retryManaged = false,
    signal?: AbortSignal
  ) {
    const job = await AiJob.findByOrFail('job_key', payload.jobKey)
    if (job.status === 'completed') return
    const user = await User.findOrFail(payload.userId)
    const setting = await aiSettingRepository.current()
    if (job.status === 'failed') {
      await releaseUsageReservation(payload.jobKey)
      await aiJobRepository.resetFailed(job)
    }
    const reserved = await reserveUsage(user, 'ai_image_generation_monthly', payload.jobKey, 1, {
      operation: 'visual_asset.image.generate',
    })
    const claimed = await aiJobRepository.claimProcessing(job)
    if (!claimed) {
      if (reserved) await releaseUsageReservation(payload.jobKey)
      return
    }
    try {
      const dataUrl = await generateConfiguredImage(payload.prompt, signal)
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
      await aiJobLifecycleService.markCompleted(job)
    } catch (error) {
      if (retryManaged) await aiJobLifecycleService.markRetrying(payload.jobKey, error)
      else await aiJobLifecycleService.markFailed(payload.jobKey, error)
      throw error
    }
  }

  async execute() {
    return GenerateAiImage.executeDirect(this.payload, true, this.signal)
  }

  async failed(error: Error) {
    await aiJobLifecycleService.markFailed(this.payload.jobKey, error)
  }
}
