import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { DateTime } from 'luxon'
import AiJob from '#models/ai_job'
import AiSetting from '#models/ai_setting'
import User from '#models/user'
import { generateConfiguredSvg } from '#services/ai_service'
import { persistVisualAsset } from '#services/visual_asset_service'
import { commitUsageReservation, releaseUsageReservation } from '#services/entitlement_service'

export interface GenerateAiSvgPayload {
  jobKey: string
  userId: number
  prompt: string
  purpose: 'exam' | 'media' | 'document' | 'generic'
  metadata: Record<string, unknown>
}

export default class GenerateAiSvg extends Job<GenerateAiSvgPayload> {
  static options: JobOptions = {
    queue: 'ai',
    maxRetries: 2,
    timeout: '3m',
    removeOnComplete: { age: '1h' },
    removeOnFail: { age: '1d' },
  }

  async execute() {
    const job = await AiJob.findByOrFail('job_key', this.payload.jobKey)
    if (job.status === 'completed') return
    const user = await User.findOrFail(this.payload.userId)
    const setting = await AiSetting.current()
    job.status = 'processing'
    job.attempts += 1
    job.startedAt = DateTime.now()
    await job.save()
    try {
      const generated = await generateConfiguredSvg(this.payload.prompt)
      const asset = await persistVisualAsset({
        user,
        source: 'svg_llm',
        kind: 'svg',
        prompt: this.payload.prompt,
        provider: setting.gateway || setting.provider,
        model: setting.model,
        metadata: { purpose: this.payload.purpose, ...this.payload.metadata },
        svg: generated.svg,
        viewBox: generated.viewBox || null,
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
      await commitUsageReservation(this.payload.jobKey)
    } catch (error) {
      job.status = 'failed'
      job.error = error instanceof Error ? error.message : 'AI SVG job failed'
      job.finishedAt = DateTime.now()
      await job.save()
      await releaseUsageReservation(this.payload.jobKey)
      throw error
    }
  }
}
