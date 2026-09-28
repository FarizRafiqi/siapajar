import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import AiJob from '#models/ai_job'
import User from '#models/user'
import { callAiJson } from '#services/ai_service'
import {
  commitUsageReservation,
  releaseUsageReservation,
  reserveUsage,
} from '#services/entitlement_service'
import { aiJobRepository } from '#repositories/ai_job_repository'
import { aiJobLifecycleService } from '#services/ai_job_lifecycle_service'

export interface GenerateAiJsonPayload {
  jobKey: string
  userId: number
  operation: string
  routingCombo?: string
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

  static async executeDirect(
    payload: GenerateAiJsonPayload,
    retryManaged = false,
    signal?: AbortSignal
  ) {
    const job = await AiJob.findByOrFail('job_key', payload.jobKey)
    if (job.status === 'completed') return
    const owner = await User.find(payload.userId)
    if (!owner) throw new Error('AI job owner not found')
    if (job.status === 'failed') {
      await releaseUsageReservation(payload.jobKey)
      await aiJobRepository.resetFailed(job)
    }

    // The HTTP request normally creates this reservation first. Retrying a
    // failed queue job does not pass through that request, so ensure the
    // reservation exists here as well before another provider call.
    const featureKey = payload.featureKey || 'ai_generation_monthly'
    const reserved = await reserveUsage(owner, featureKey, payload.jobKey, 1, {
      operation: payload.operation,
      ...(payload.routingCombo ? { routingCombo: payload.routingCombo } : {}),
    })

    const claimed = await aiJobRepository.claimProcessing(job)
    if (!claimed) {
      if (reserved) await releaseUsageReservation(payload.jobKey)
      return
    }
    try {
      const result = await callAiJson({
        operation: payload.operation,
        routingCombo: payload.routingCombo,
        systemPrompt: payload.systemPrompt,
        userPrompt: payload.userPrompt,
        timeoutMs: payload.timeoutMs,
        signal,
      })
      await aiJobRepository.markCompleted(job, result)
      await commitUsageReservation(payload.jobKey)
      await aiJobLifecycleService.markCompleted(job)
    } catch (error) {
      if (retryManaged) {
        await aiJobLifecycleService.markRetrying(payload.jobKey, error)
      } else {
        await aiJobLifecycleService.markFailed(payload.jobKey, error)
      }
      throw error
    }
  }

  async execute() {
    return GenerateAiJson.executeDirect(this.payload, true, this.signal)
  }

  async failed(error: Error) {
    await aiJobLifecycleService.markFailed(this.payload.jobKey, error)
  }
}
