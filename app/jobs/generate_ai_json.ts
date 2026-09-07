import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import AiJob from '#models/ai_job'
import User from '#models/user'
import { callAiJson } from '#services/ai_service'
import { commitUsageReservation, releaseUsageReservation } from '#services/entitlement_service'
import { aiJobRepository } from '#repositories/ai_job_repository'

export interface GenerateAiJsonPayload {
  jobKey: string
  userId: number
  combo: string
  systemPrompt: string
  userPrompt: string
  timeoutMs?: number
  featureKey?: string
}

export default class GenerateAiJson extends Job<GenerateAiJsonPayload> {
  static options: JobOptions = {
    queue: 'ai',
    maxRetries: 3,
    timeout: '5m',
    removeOnComplete: { age: '1h' },
    removeOnFail: { age: '1d' },
  }

  static async executeDirect(payload: GenerateAiJsonPayload) {
    const job = await AiJob.findByOrFail('job_key', payload.jobKey)
    if (job.status === 'completed') return
    const owner = await User.find(payload.userId)
    if (!owner) throw new Error('AI job owner not found')
    await aiJobRepository.markProcessing(job)
    try {
      const result = await callAiJson({
        combo: payload.combo,
        systemPrompt: payload.systemPrompt,
        userPrompt: payload.userPrompt,
        timeoutMs: payload.timeoutMs,
      })
      await aiJobRepository.markCompleted(job, result)
      await commitUsageReservation(payload.jobKey)
    } catch (error) {
      await aiJobRepository.markFailed(
        job,
        error instanceof Error ? error.message : 'AI job failed'
      )
      await releaseUsageReservation(payload.jobKey)
      throw error
    }
  }

  async execute() {
    return GenerateAiJson.executeDirect(this.payload)
  }
}
