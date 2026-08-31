import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import AiJob from '#models/ai_job'
import User from '#models/user'
import { generateConfiguredSvg } from '#services/ai_service'
import { persistVisualAsset } from '#services/visual_asset_service'
import { commitUsageReservation, releaseUsageReservation } from '#services/entitlement_service'
import { aiJobRepository } from '#repositories/ai_job_repository'
import { aiSettingRepository } from '#repositories/ai_setting_repository'

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
    const setting = await aiSettingRepository.current()
    await aiJobRepository.markProcessing(job)
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
      const result = {
        url: asset.url,
        assetId: asset.id,
        kind: asset.kind,
        source: asset.source,
      }
      await aiJobRepository.markCompleted(job, result)
      await commitUsageReservation(this.payload.jobKey)
    } catch (error) {
      await aiJobRepository.markFailed(
        job,
        error instanceof Error ? error.message : 'AI SVG job failed'
      )
      await releaseUsageReservation(this.payload.jobKey)
      throw error
    }
  }
}
