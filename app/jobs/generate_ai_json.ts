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
}

export default class GenerateAiJson extends Job<GenerateAiJsonPayload> {
  static options: JobOptions = {
    queue: 'ai',
    maxRetries: 3,
    timeout: '5m',
    removeOnComplete: { age: '1h' },
    removeOnFail: { age: '1d' },
  }

  async execute() {
    const job = await AiJob.findByOrFail('job_key', this.payload.jobKey)
    if (job.status === 'completed') return
    const owner = await User.find(this.payload.userId)
    if (!owner) throw new Error('AI job owner not found')
    job.status = 'processing'
    job.attempts += 1
    job.startedAt = DateTime.now()
    await job.save()
    try {
      const result = await callAiJson({
        combo: this.payload.combo,
        systemPrompt: this.payload.systemPrompt,
        userPrompt: this.payload.userPrompt,
        timeoutMs: this.payload.timeoutMs,
      })
      job.status = 'completed'
      job.result = result
      job.finishedAt = DateTime.now()
      await job.save()
      await commitUsageReservation(this.payload.jobKey)
    } catch (error) {
      job.status = 'failed'
      job.error = error instanceof Error ? error.message : 'AI job failed'
      job.finishedAt = DateTime.now()
      await job.save()
      await releaseUsageReservation(this.payload.jobKey)
      throw error
    }
  }
}
