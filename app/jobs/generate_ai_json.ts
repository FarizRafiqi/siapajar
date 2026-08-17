import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { DateTime } from 'luxon'
import AiJob from '#models/ai_job'
import User from '#models/user'
import { callAiJson } from '#services/ai_service'
import { commitUsageReservation, releaseUsageReservation } from '#services/entitlement_service'

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
    job.status = 'processing'
    job.attempts += 1
    job.startedAt = DateTime.now()
    await job.save()
    try {
      const result = await callAiJson({
        combo: payload.combo,
        systemPrompt: payload.systemPrompt,
        userPrompt: payload.userPrompt,
        timeoutMs: payload.timeoutMs,
      })
      job.status = 'completed'
      job.result = result
      job.finishedAt = DateTime.now()
      await job.save()
      await commitUsageReservation(payload.jobKey)
    } catch (error) {
      job.status = 'failed'
      job.error = error instanceof Error ? error.message : 'AI job failed'
      job.finishedAt = DateTime.now()
      await job.save()
      await releaseUsageReservation(payload.jobKey)
      throw error
    }
  }

  async execute() {
    return GenerateAiJson.executeDirect(this.payload)
  }
}
