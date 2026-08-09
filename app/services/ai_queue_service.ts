import env from '#start/env'
import AiJob from '#models/ai_job'
import User from '#models/user'
import GenerateAiJson from '#jobs/generate_ai_json'
import GenerateAiImage from '#jobs/generate_ai_image'
import { createHash } from 'node:crypto'
import { DateTime } from 'luxon'
import { reserveUsage, releaseUsageReservation } from '#services/entitlement_service'
import { auditService } from '#services/audit_service'

export interface AiJobPayload<T = unknown> {
  id: string
  combo: string
  systemPrompt: string
  userPrompt: string
  priority?: 'high' | 'normal' | 'low'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: T
  error?: string
  createdAt: Date
}

class AiQueueService {
  async enqueueAiJson<T>(options: {
    userId?: number
    combo: string
    systemPrompt: string
    userPrompt: string
    priority?: 'high' | 'normal' | 'low'
    timeoutMs?: number
  }): Promise<T> {
    if (!options.userId) throw new Error('AI jobs require an authenticated user')
    const owner = await User.findOrFail(options.userId)
    const jobKey = createHash('sha256')
      .update(`${options.userId}:${options.combo}:${options.systemPrompt}:${options.userPrompt}`)
      .digest('hex')
    const job = await AiJob.firstOrCreate(
      { jobKey },
      {
        jobKey,
        userId: options.userId,
        combo: options.combo,
        status: 'pending',
        attempts: 0,
        payload: { systemPrompt: options.systemPrompt, userPrompt: options.userPrompt },
        availableAt: DateTime.now(),
      }
    )
    if (job.status !== 'completed') {
      const reserved = await reserveUsage(owner, 'ai_generation_monthly', jobKey, 1, {
        combo: options.combo,
      })
      try {
        await GenerateAiJson.dispatch({
          jobKey,
          userId: options.userId,
          combo: options.combo,
          systemPrompt: options.systemPrompt,
          userPrompt: options.userPrompt,
          timeoutMs: options.timeoutMs,
        }).dedup({ id: jobKey, ttl: '5m' })
        await auditService.record({
          actorId: options.userId,
          action: 'ai.generate.queued',
          entityType: 'ai_job',
          entityId: job.id,
          metadata: { combo: options.combo, quotaReserved: reserved },
        })
      } catch (error) {
        if (reserved) await releaseUsageReservation(jobKey)
        throw error
      }
    }
    const deadline = Date.now() + (options.timeoutMs ?? 120_000)
    while (Date.now() < deadline) {
      const current = await AiJob.find(job.id)
      if (current?.status === 'completed') return current.result as T
      if (current?.status === 'failed') throw new Error(current.error ?? 'AI job failed')
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
    throw new Error('AI job is still processing. Please retry from the document status page.')
  }

  async enqueueAiImage(options: {
    userId?: number
    prompt: string
    timeoutMs?: number
  }): Promise<string | null> {
    if (!options.userId) throw new Error('AI image jobs require an authenticated user')
    const owner = await User.findOrFail(options.userId)
    const jobKey = createHash('sha256')
      .update(`${options.userId}:siapajar-image:${options.prompt}`)
      .digest('hex')
    const job = await AiJob.firstOrCreate(
      { jobKey },
      {
        jobKey,
        userId: options.userId,
        combo: 'siapajar-image',
        status: 'pending',
        attempts: 0,
        payload: { prompt: options.prompt },
        availableAt: DateTime.now(),
      }
    )
    if (job.status !== 'completed') {
      const reserved = await reserveUsage(owner, 'ai_image_generation_monthly', jobKey, 1, {
        combo: 'siapajar-image',
      })
      try {
        await GenerateAiImage.dispatch({
          jobKey,
          userId: options.userId,
          prompt: options.prompt,
        }).dedup({ id: jobKey, ttl: '5m' })
        await auditService.record({
          actorId: options.userId,
          action: 'ai.generate.image.queued',
          entityType: 'ai_job',
          entityId: job.id,
          metadata: { combo: 'siapajar-image', quotaReserved: reserved },
        })
      } catch (error) {
        if (reserved) await releaseUsageReservation(jobKey)
        throw error
      }
    }
    const deadline = Date.now() + (options.timeoutMs ?? 120_000)
    while (Date.now() < deadline) {
      const current = await AiJob.find(job.id)
      if (current?.status === 'completed')
        return typeof current.result === 'string' ? current.result : null
      if (current?.status === 'failed') throw new Error(current.error ?? 'AI image job failed')
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
    throw new Error('AI image is still processing. Please retry from the document status page.')
  }

  getStats() {
    return {
      driver: env.get('QUEUE_DRIVER', 'redis'),
      maxConcurrency: env.get('AI_QUEUE_MAX_CONCURRENCY', 10),
      redisHost: env.get('REDIS_HOST') || '127.0.0.1',
    }
  }
}

export const aiQueueService = new AiQueueService()
