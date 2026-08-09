import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { DateTime } from 'luxon'
import AiJob from '#models/ai_job'
import { generateConfiguredImage } from '#services/ai_service'
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

  async execute() {
    const job = await AiJob.findByOrFail('job_key', this.payload.jobKey)
    if (job.status === 'completed') return
    job.status = 'processing'
    job.attempts += 1
    job.startedAt = DateTime.now()
    await job.save()
    try {
      job.result = await generateConfiguredImage(this.payload.prompt)
      job.status = 'completed'
      job.finishedAt = DateTime.now()
      await job.save()
      await commitUsageReservation(this.payload.jobKey)
    } catch (error) {
      job.status = 'failed'
      job.error = error instanceof Error ? error.message : 'AI image job failed'
      job.finishedAt = DateTime.now()
      await job.save()
      await releaseUsageReservation(this.payload.jobKey)
      throw error
    }
  }
}
