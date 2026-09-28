import env from '#start/env'
import GenerateAiJson from '#jobs/generate_ai_json'
import GenerateAiImage from '#jobs/generate_ai_image'
import GenerateAiSvg from '#jobs/generate_ai_svg'
import { createHash } from 'node:crypto'
import AiJob from '#models/ai_job'
import User from '#models/user'
import { reserveUsage, releaseUsageReservation } from '#services/entitlement_service'
import { auditService } from '#services/audit_service'
import { aiJobRepository } from '#repositories/ai_job_repository'
import {
  chooseVisualSource,
  resolveKnownVisualAsset,
  type VisualAssetRequest,
} from '#services/visual_asset_service'
import { aiSettingRepository } from '#repositories/ai_setting_repository'
import { creditService } from '#services/credit_service'
import { AiJobStillProcessingError } from '#services/ai_queue_errors'
import type { AiJobBillingReservation } from '#repositories/ai_job_repository'
import logger from '@adonisjs/core/services/logger'

// Bump when the shared prompt contract, output schema, or model routing changes.
// The version is part of every result-cache key so old drafts are never served
// after a semantic prompt change.
const AI_RESULT_CACHE_VERSION = 'v2'
const DEFAULT_JSON_WAIT_TIMEOUT_MS = 22 * 60_000
const DEFAULT_IMAGE_WAIT_TIMEOUT_MS = 7 * 60_000
const DEFAULT_SVG_WAIT_TIMEOUT_MS = 10 * 60_000

export interface VisualAssetResult {
  url: string
  assetId: number | null
  kind: 'svg' | 'raster'
  source: string
}

export interface AiJobPayload<T = unknown> {
  id: string
  /** Business operation that produced this result, e.g. teaching_module.generate. */
  operation: string
  /** 9router model bundle, when the selected provider is 9router. */
  routingCombo?: string
  systemPrompt: string
  userPrompt: string
  priority?: 'high' | 'normal' | 'low'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: T
  error?: string
  createdAt: Date
}

type EnqueueBillingReservation = AiJobBillingReservation

class AiQueueService {
  async enqueueAiJson<T>(options: {
    userId?: number
    operation: string
    routingCombo?: string
    systemPrompt: string
    userPrompt: string
    priority?: 'high' | 'normal' | 'low'
    timeoutMs?: number
    waitTimeoutMs?: number
    waitSignal?: AbortSignal
    featureKey?: string
    billingReservation?: EnqueueBillingReservation
  }): Promise<T> {
    if (!options.userId) throw new Error('AI jobs require an authenticated user')
    const owner = await User.findOrFail(options.userId)
    const setting = await aiSettingRepository.current()
    if (options.routingCombo && (setting.provider !== '9router' || setting.gateway)) {
      throw new Error('routingCombo hanya boleh digunakan saat provider AI adalah 9router')
    }
    const featureKey = options.featureKey || 'ai_generation_monthly'
    const jobKey = createAiCacheKey({
      userId: options.userId,
      kind: 'json',
      operation: options.operation,
      routingCombo: options.routingCombo || null,
      provider: setting.provider,
      gateway: setting.gateway || null,
      model: setting.model || null,
      featureKey,
      systemPrompt: options.systemPrompt,
      userPrompt: options.userPrompt,
    })
    const job = await aiJobRepository.findOrCreate({
      jobKey,
      userId: options.userId,
      operation: options.operation,
      payload: {
        operation: options.operation,
        routingCombo: options.routingCombo,
        systemPrompt: options.systemPrompt,
        userPrompt: options.userPrompt,
        featureKey,
      },
    })
    if (job.status === 'completed') {
      await recordCacheHit(options.userId, job, 'json')
    } else {
      if (job.status === 'failed') {
        // A failed provider attempt releases its reservation. Releasing again
        // is harmless and prevents a stale reservation from blocking retries.
        await releaseUsageReservation(jobKey)
        await aiJobRepository.resetFailed(job)
      }
      await attachBillingReservation(job.id, job.jobKey, options.userId, options.billingReservation)
      const reserved = await reserveUsage(owner, featureKey, jobKey, 1, {
        operation: options.operation,
        ...(options.routingCombo ? { routingCombo: options.routingCombo } : {}),
      })
      // A false reservation means another request already owns this cache
      // miss. Do not dispatch a second provider call; both requests will wait
      // for the same durable ai_jobs result.
      if (reserved) {
        try {
          const isSync =
            env.get('QUEUE_DRIVER', 'sync') === 'sync' || env.get('NODE_ENV') === 'test'
          if (isSync) {
            await GenerateAiJson.executeDirect({
              jobKey,
              userId: options.userId,
              operation: options.operation,
              routingCombo: options.routingCombo,
              systemPrompt: options.systemPrompt,
              userPrompt: options.userPrompt,
              timeoutMs: options.timeoutMs,
              featureKey,
            })
          } else {
            await GenerateAiJson.dispatch({
              jobKey,
              userId: options.userId,
              operation: options.operation,
              routingCombo: options.routingCombo,
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
            metadata: {
              operation: options.operation,
              ...(options.routingCombo ? { routingCombo: options.routingCombo } : {}),
              featureKey,
              cacheMiss: true,
            },
          })
        } catch (error) {
          await releaseUsageReservation(jobKey)
          await completeLinkedBillingReservation(job, options.userId, options.billingReservation)
          throw error
        }
      }
    }
    return waitForAiJob<T>(
      job,
      options.waitTimeoutMs,
      DEFAULT_JSON_WAIT_TIMEOUT_MS,
      'json',
      options.waitSignal
    )
  }

  async enqueueAiImage(options: {
    userId?: number
    prompt: string
    timeoutMs?: number
    waitTimeoutMs?: number
    waitSignal?: AbortSignal
  }): Promise<VisualAssetResult | null> {
    if (!options.userId) throw new Error('AI image jobs require an authenticated user')
    const owner = await User.findOrFail(options.userId)
    const setting = await aiSettingRepository.current()
    const jobKey = createAiCacheKey({
      userId: options.userId,
      kind: 'image',
      provider: setting.provider,
      gateway: setting.gateway || null,
      model: setting.model || null,
      prompt: options.prompt,
    })
    const job = await aiJobRepository.findOrCreate({
      jobKey,
      userId: options.userId,
      operation: 'visual_asset.image.generate',
      payload: { operation: 'visual_asset.image.generate', prompt: options.prompt },
    })
    if (job.status === 'completed') {
      await recordCacheHit(options.userId, job, 'image')
    } else {
      if (job.status === 'failed') {
        await releaseUsageReservation(jobKey)
        await aiJobRepository.resetFailed(job)
      }
      const reserved = await reserveUsage(owner, 'ai_image_generation_monthly', jobKey, 1, {
        operation: 'visual_asset.image.generate',
      })
      if (reserved) {
        try {
          const isSync =
            env.get('QUEUE_DRIVER', 'sync') === 'sync' || env.get('NODE_ENV') === 'test'
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
            metadata: { operation: 'visual_asset.image.generate', cacheMiss: true },
          })
        } catch (error) {
          await releaseUsageReservation(jobKey)
          throw error
        }
      }
    }
    const result = await waitForAiJob<unknown>(
      job,
      options.waitTimeoutMs,
      DEFAULT_IMAGE_WAIT_TIMEOUT_MS,
      'image',
      options.waitSignal
    )
    return normalizeVisualResult(result)
  }

  async enqueueAiVisual(options: {
    userId?: number
    prompt: string
    preferredKind?: 'svg' | 'raster' | 'auto'
    purpose?: 'exam' | 'media' | 'document' | 'generic'
    sourceHint?: 'icon_library' | 'svg_composer' | 'svg_llm' | 'image_model'
    metadata?: Record<string, unknown>
    timeoutMs?: number
    waitTimeoutMs?: number
    waitSignal?: AbortSignal
  }): Promise<VisualAssetResult | null> {
    if (!options.userId) throw new Error('AI visual jobs require an authenticated user')
    const owner = await User.findOrFail(options.userId)
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
        waitTimeoutMs: options.waitTimeoutMs,
        waitSignal: options.waitSignal,
      })
    }
    return this.enqueueAiImage({
      userId: options.userId,
      prompt: options.prompt,
      timeoutMs: options.timeoutMs,
      waitTimeoutMs: options.waitTimeoutMs,
      waitSignal: options.waitSignal,
    })
  }

  async enqueueAiSvg(options: {
    userId?: number
    prompt: string
    purpose?: 'exam' | 'media' | 'document' | 'generic'
    metadata?: Record<string, unknown>
    timeoutMs?: number
    waitTimeoutMs?: number
    waitSignal?: AbortSignal
  }): Promise<VisualAssetResult | null> {
    if (!options.userId) throw new Error('AI SVG jobs require an authenticated user')
    const owner = await User.findOrFail(options.userId)
    const setting = await aiSettingRepository.current()
    const jobKey = createAiCacheKey({
      userId: options.userId,
      kind: 'svg',
      provider: setting.provider,
      gateway: setting.gateway || null,
      model: setting.model || null,
      prompt: options.prompt,
      purpose: options.purpose || 'generic',
      metadata: options.metadata || {},
    })
    const job = await aiJobRepository.findOrCreate({
      jobKey,
      userId: options.userId,
      operation: 'visual_asset.svg.generate',
      payload: {
        operation: 'visual_asset.svg.generate',
        prompt: options.prompt,
        purpose: options.purpose || 'generic',
        metadata: options.metadata || {},
      },
    })
    if (job.status === 'completed') {
      await recordCacheHit(options.userId, job, 'svg')
    } else {
      if (job.status === 'failed') {
        await releaseUsageReservation(jobKey)
        await aiJobRepository.resetFailed(job)
      }
      const reserved = await reserveUsage(owner, 'ai_svg_generation_monthly', jobKey, 1, {
        operation: 'visual_asset.svg.generate',
      })
      if (reserved) {
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
            metadata: { operation: 'visual_asset.svg.generate', cacheMiss: true },
          })
        } catch (error) {
          await releaseUsageReservation(jobKey)
          throw error
        }
      }
    }
    const result = await waitForAiJob<unknown>(
      job,
      options.waitTimeoutMs,
      DEFAULT_SVG_WAIT_TIMEOUT_MS,
      'svg',
      options.waitSignal
    )
    return normalizeVisualResult(result)
  }

  getStats() {
    return {
      driver: env.get('QUEUE_DRIVER', 'redis'),
      maxConcurrency: env.get('AI_QUEUE_MAX_CONCURRENCY', 10),
      redisHost: env.get('REDIS_HOST') || '127.0.0.1',
    }
  }
}

async function attachBillingReservation(
  jobId: number,
  jobKey: string,
  userId: number,
  reservation?: EnqueueBillingReservation
) {
  if (!reservation) return
  const job = await aiJobRepository.attachBillingReservation(jobId, reservation)
  await creditService.attachAiJobToGeneration({
    userId,
    reservationKey: reservation.reservationKey,
    jobKey,
  })
  if (job.status === 'completed' || job.status === 'failed') {
    await creditService.completeGenerationAiJob({
      userId,
      reservationKey: reservation.reservationKey,
      jobKey,
      amount: reservation.amount,
      description: reservation.description,
    })
  }
}

async function completeLinkedBillingReservation(
  job: AiJob,
  userId: number,
  reservation?: EnqueueBillingReservation
) {
  if (!reservation) return
  await creditService.completeGenerationAiJob({
    userId,
    reservationKey: reservation.reservationKey,
    jobKey: job.jobKey,
    amount: reservation.amount,
    description: reservation.description,
  })
}

async function waitForAiJob<T>(
  job: AiJob,
  requestedWaitMs: number | undefined,
  defaultWaitMs: number,
  kind: 'json' | 'image' | 'svg',
  signal?: AbortSignal
): Promise<T> {
  const configuredWaitMs = env.get('AI_QUEUE_RESULT_WAIT_TIMEOUT_MS')
  const defaultConfiguredWaitMs = Number.isFinite(configuredWaitMs)
    ? configuredWaitMs!
    : DEFAULT_JSON_WAIT_TIMEOUT_MS
  const waitMs = Math.max(
    5_000,
    Math.min(
      requestedWaitMs ?? (kind === 'json' ? defaultConfiguredWaitMs : defaultWaitMs),
      60 * 60_000
    )
  )
  const deadline = Date.now() + waitMs

  while (Date.now() < deadline && !signal?.aborted) {
    const current = await AiJob.find(job.id)
    if (current?.status === 'completed') return current.result as T
    if (current?.status === 'failed') {
      throw new Error(current.error ?? `AI ${kind} job failed`)
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const current = (await AiJob.find(job.id)) ?? job
  if (current.status === 'completed') return current.result as T
  if (current.status === 'failed') throw new Error(current.error ?? `AI ${kind} job failed`)

  const message =
    kind === 'json'
      ? 'AI masih memproses permintaan. Kredit ditahan sampai antrean menyelesaikan pekerjaannya.'
      : `Pembuatan ${kind === 'image' ? 'gambar' : 'ilustrasi'} masih diproses. Coba buka kembali dokumen beberapa saat lagi.`
  logger.warn(
    {
      event: 'ai.queue.wait_timeout',
      jobId: current.id,
      jobKey: current.jobKey,
      operation: current.operation,
      status: current.status,
      attempts: current.attempts,
      waitMs,
      waitOutcome: signal?.aborted ? 'parent_cancelled' : 'deadline',
    },
    'AI queue waiter reached its deadline while the durable job remained active'
  )
  throw new AiJobStillProcessingError(message, current.jobKey, current.status)
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

function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map((item) => stableSerialize(item)).join(',')}]`

  const record = value as Record<string, unknown>
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`)
    .join(',')}}`
}

function createAiCacheKey(scope: Record<string, unknown>) {
  return createHash('sha256')
    .update(stableSerialize({ version: AI_RESULT_CACHE_VERSION, ...scope }))
    .digest('hex')
}

async function recordCacheHit(userId: number, job: AiJob, kind: string) {
  await auditService.record({
    actorId: userId,
    action: 'ai.result_cache.hit',
    entityType: 'ai_job',
    entityId: job.id,
    metadata: { kind, cacheKey: job.jobKey },
  })
}
