import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { DateTime } from 'luxon'
import AiJob from '#models/ai_job'
import AiSetting from '#models/ai_setting'
import User from '#models/user'
import { generateConfiguredImage } from '#services/ai_service'
import { persistVisualAsset } from '#services/visual_asset_service'
import { commitUsageReservation, releaseUsageReservation } from '#services/entitlement_service'

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
    const setting = await AiSetting.current()
    job.status = 'processing'
    job.attempts += 1
    job.startedAt = DateTime.now()
    await job.save()
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
      job.result = {
        url: asset.url,
        assetId: asset.id,
        kind: asset.kind,
        source: asset.source,
      }
      job.status = 'completed'
      job.finishedAt = DateTime.now()
      await job.save()
      await commitUsageReservation(payload.jobKey)
    } catch (error) {
      job.status = 'failed'
      job.error = error instanceof Error ? error.message : 'AI image job failed'
      job.finishedAt = DateTime.now()
      await job.save()
      await releaseUsageReservation(payload.jobKey)
      throw error
    }
  }

  async execute() {
    return GenerateAiImage.executeDirect(this.payload)
  }
}
