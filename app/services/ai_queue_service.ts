import env from '#start/env'
import GenerateAiJson from '#jobs/generate_ai_json'
import GenerateAiImage from '#jobs/generate_ai_image'
import GenerateAiSvg from '#jobs/generate_ai_svg'
import { createHash } from 'node:crypto'
import { reserveUsage, releaseUsageReservation } from '#services/entitlement_service'
import { auditService } from '#services/audit_service'
import { aiJobRepository } from '#repositories/ai_job_repository'
import {
  chooseVisualSource,
  resolveKnownVisualAsset,
  type VisualAssetRequest,
} from '#services/visual_asset_service'

export interface VisualAssetResult {
  url: string
  assetId: number | null
  kind: 'svg' | 'raster'
  source: string
}

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
    featureKey?: string
  }): Promise<T> {
    if (!options.userId) throw new Error('AI jobs require an authenticated user')
    const owner = await aiJobRepository.findOwnerOrFail(options.userId)
    const jobKey = createHash('sha256')
      .update(`${options.userId}:${options.combo}:${options.systemPrompt}:${options.userPrompt}`)
      .digest('hex')
    const job = await aiJobRepository.findOrCreate({
      jobKey,
      userId: options.userId,
      combo: options.combo,
      payload: {
        systemPrompt: options.systemPrompt,
        userPrompt: options.userPrompt,
        featureKey: options.featureKey || 'ai_generation_monthly',
      },
    })
    if (job.status !== 'completed') {
      if (job.status === 'failed') {
        await aiJobRepository.resetFailed(job)
      }
      const featureKey = options.featureKey || 'ai_generation_monthly'
      const reserved = await reserveUsage(owner, featureKey, jobKey, 1, {
        combo: options.combo,
      })
      try {
        const isSync = env.get('QUEUE_DRIVER', 'sync') === 'sync' || env.get('NODE_ENV') === 'test'
        if (isSync) {
          await GenerateAiJson.executeDirect({
            jobKey,
            userId: options.userId,
            combo: options.combo,
            systemPrompt: options.systemPrompt,
            userPrompt: options.userPrompt,
            timeoutMs: options.timeoutMs,
            featureKey,
          })
        } else {
          await GenerateAiJson.dispatch({
            jobKey,
            userId: options.userId,
            combo: options.combo,
            systemPrompt: options.systemPrompt,
            userPrompt: options.userPrompt,
            timeoutMs: options.timeoutMs,
            featureKey,
          })
        }
        await auditService.record({
          actorId: options.userId,
          action: 'ai.generate.queued',
          entityType: 'ai_job',
          entityId: job.id,
          metadata: { combo: options.combo, featureKey, quotaReserved: reserved },
        })
      } catch (error) {
        if (reserved) await releaseUsageReservation(jobKey)
        throw error
      }
    }
    const deadline = Date.now() + (options.timeoutMs ?? 120_000)
    while (Date.now() < deadline) {
      const current = await aiJobRepository.findById(job.id)
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
  }): Promise<VisualAssetResult | null> {
    if (!options.userId) throw new Error('AI image jobs require an authenticated user')
    const owner = await aiJobRepository.findOwnerOrFail(options.userId)
    const jobKey = createHash('sha256')
      .update(`${options.userId}:siapajar-image:${options.prompt}`)
      .digest('hex')
    const job = await aiJobRepository.findOrCreate({
      jobKey,
      userId: options.userId,
      combo: 'siapajar-image',
      payload: { prompt: options.prompt },
    })
    if (job.status !== 'completed') {
      if (job.status === 'failed') {
        await aiJobRepository.resetFailed(job)
      }
      const reserved = await reserveUsage(owner, 'ai_image_generation_monthly', jobKey, 1, {
        combo: 'siapajar-image',
      })
      try {
        const isSync = env.get('QUEUE_DRIVER', 'sync') === 'sync' || env.get('NODE_ENV') === 'test'
        if (isSync) {
          await GenerateAiImage.executeDirect({
            jobKey,
            userId: options.userId,
            prompt: options.prompt,
          })
        } else {
          await GenerateAiImage.dispatch({
            jobKey,
            userId: options.userId,
            prompt: options.prompt,
          })
        }
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
      const current = await aiJobRepository.findById(job.id)
      if (current?.status === 'completed') return normalizeVisualResult(current.result)
      if (current?.status === 'failed') throw new Error(current.error ?? 'AI image job failed')
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
    throw new Error('AI image is still processing. Please retry from the document status page.')
  }

  async enqueueAiVisual(options: {
    userId?: number
    prompt: string
    preferredKind?: 'svg' | 'raster' | 'auto'
    purpose?: 'exam' | 'media' | 'document' | 'generic'
    sourceHint?: 'icon_library' | 'svg_composer' | 'svg_llm' | 'image_model'
    metadata?: Record<string, unknown>
    timeoutMs?: number
  }): Promise<VisualAssetResult | null> {
    if (!options.userId) throw new Error('AI visual jobs require an authenticated user')
    const owner = await aiJobRepository.findOwnerOrFail(options.userId)
    const request: VisualAssetRequest = {
      userId: options.userId,
      prompt: options.prompt,
      preferredKind: options.preferredKind,
      purpose: options.purpose,
      sourceHint: options.sourceHint,
      metadata: options.metadata,
    }
    const knownAsset = await resolveKnownVisualAsset(owner, request)
    if (knownAsset) {
      return {
        url: knownAsset.url,
        assetId: knownAsset.id,
        kind: knownAsset.kind,
        source: knownAsset.source,
      }
    }
    const kind = chooseVisualSource({
      userId: options.userId,
      prompt: options.prompt,
      preferredKind: options.preferredKind,
      purpose: options.purpose,
      sourceHint: options.sourceHint,
      metadata: options.metadata,
    })
    if (kind === 'svg') {
      return this.enqueueAiSvg({
        userId: options.userId,
        prompt: options.prompt,
        purpose: options.purpose,
        metadata: options.metadata,
        timeoutMs: options.timeoutMs,
      })
    }
    return this.enqueueAiImage({
      userId: options.userId,
      prompt: options.prompt,
      timeoutMs: options.timeoutMs,
    })
  }

  async enqueueAiSvg(options: {
    userId?: number
    prompt: string
    purpose?: 'exam' | 'media' | 'document' | 'generic'
    metadata?: Record<string, unknown>
    timeoutMs?: number
  }): Promise<VisualAssetResult | null> {
    if (!options.userId) throw new Error('AI SVG jobs require an authenticated user')
    const owner = await aiJobRepository.findOwnerOrFail(options.userId)
    const jobKey = createHash('sha256')
      .update(
        `${options.userId}:siapajar-svg:${options.prompt}:${JSON.stringify(options.metadata || {})}`
      )
      .digest('hex')
    const job = await aiJobRepository.findOrCreate({
      jobKey,
      userId: options.userId,
      combo: 'siapajar-svg',
      payload: {
        prompt: options.prompt,
        purpose: options.purpose || 'generic',
        metadata: options.metadata || {},
      },
    })
    if (job.status !== 'completed') {
      const reserved = await reserveUsage(owner, 'ai_svg_generation_monthly', jobKey, 1, {
        combo: 'siapajar-svg',
      })
      try {
        await GenerateAiSvg.dispatch({
          jobKey,
          userId: options.userId,
          prompt: options.prompt,
          purpose: options.purpose || 'generic',
          metadata: options.metadata || {},
        }).dedup({ id: jobKey, ttl: '5m' })
        await auditService.record({
          actorId: options.userId,
          action: 'ai.generate.svg.queued',
          entityType: 'ai_job',
          entityId: job.id,
          metadata: { combo: 'siapajar-svg', quotaReserved: reserved },
        })
      } catch (error) {
        if (reserved) await releaseUsageReservation(jobKey)
        throw error
      }
    }
    const deadline = Date.now() + (options.timeoutMs ?? 120_000)
    while (Date.now() < deadline) {
      const current = await aiJobRepository.findById(job.id)
      if (current?.status === 'completed') {
        return normalizeVisualResult(current.result)
      }
      if (current?.status === 'failed') throw new Error(current.error ?? 'AI SVG job failed')
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
    throw new Error('AI SVG is still processing. Please retry from the document status page.')
  }

  getStats() {
    return {
      driver: env.get('QUEUE_DRIVER', 'redis'),
      maxConcurrency: env.get('AI_QUEUE_MAX_CONCURRENCY', 10),
      redisHost: env.get('REDIS_HOST') || '127.0.0.1',
    }
  }
}

function normalizeVisualResult(value: unknown): VisualAssetResult | null {
  if (typeof value === 'string' && value) {
    return { url: value, assetId: null, kind: 'raster', source: 'legacy' }
  }
  if (!value || typeof value !== 'object') return null
  const result = value as Record<string, unknown>
  if (typeof result.url !== 'string' || !result.url) return null
  return {
    url: result.url,
    assetId: typeof result.assetId === 'number' ? result.assetId : null,
    kind: result.kind === 'svg' ? 'svg' : 'raster',
    source: typeof result.source === 'string' ? result.source : 'image_model',
  }
}

export const aiQueueService = new AiQueueService()
