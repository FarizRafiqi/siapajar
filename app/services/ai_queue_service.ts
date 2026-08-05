import env from '#start/env'
import { callAiJson } from '#services/ai_service'
import AiJob from '#models/ai_job'
import { createHash } from 'node:crypto'
import { DateTime } from 'luxon'
import User from '#models/user'
import { assertEntitled, recordUsage } from '#services/entitlement_service'

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

/**
 * Service pengelola antrean AI (Concurrency & Queue Manager).
 * Mencegah server overload saat banyak guru melakukan generate dokumen bersamaan.
 * Mendukung batasan konkurensi (max concurrent) + in-memory queue + fallback cepat.
 */
class AiQueueService {
  private readonly maxConcurrency = 10
  private activeJobs = 0
  private readonly queue: Array<() => Promise<void>> = []

  /**
   * Menjalankan atau mengantrekan permintaan AI dengan kontrol konkurensi.
   */
  async enqueueAiJson<T>(options: {
    userId?: number
    combo: string
    systemPrompt: string
    userPrompt: string
    priority?: 'high' | 'normal' | 'low'
    timeoutMs?: number
  }): Promise<T> {
    // Jika beban di bawah ambang batas konkurensi, eksekusi langsung
    if (this.activeJobs < this.maxConcurrency) {
      return this.executeDirectly<T>(options)
    }

    // Jika beban tinggi, antrekan pengerjaan
    return new Promise<T>((resolve, reject) => {
      const task = async () => {
        try {
          const result = await this.executeDirectly<T>(options)
          resolve(result)
        } catch (err) {
          reject(err)
        }
      }

      if (options.priority === 'high') {
        this.queue.unshift(task)
      } else {
        this.queue.push(task)
      }
    })
  }

  private async executeDirectly<T>(options: {
    userId?: number
    combo: string
    systemPrompt: string
    userPrompt: string
    timeoutMs?: number
  }): Promise<T> {
    const owner = options.userId ? await User.find(options.userId) : null
    if (owner) await assertEntitled(owner, 'ai_generation_monthly')
    this.activeJobs++
    const jobKey = options.userId
      ? createHash('sha256')
          .update(
            `${options.userId}:${options.combo}:${options.systemPrompt}:${options.userPrompt}`
          )
          .digest('hex')
      : null
    const job =
      options.userId && jobKey
        ? await AiJob.firstOrCreate(
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
        : null
    try {
      if (job?.status === 'completed') return job.result as T
      if (job) {
        job.status = 'processing'
        job.attempts += 1
        job.startedAt = DateTime.now()
        await job.save()
      }
      const result = await callAiJson<T>(options)
      if (job) {
        job.status = 'completed'
        job.result = result
        job.finishedAt = DateTime.now()
        await job.save()
      }
      if (owner) await recordUsage(owner.id, 'ai_generation_monthly')
      return result
    } catch (error) {
      if (job) {
        job.status = 'failed'
        job.error = error instanceof Error ? error.message : 'AI job failed'
        job.finishedAt = DateTime.now()
        await job.save()
      }
      throw error
    } finally {
      this.activeJobs--
      this.processNext()
    }
  }

  private processNext() {
    if (this.queue.length > 0 && this.activeJobs < this.maxConcurrency) {
      const nextTask = this.queue.shift()
      if (nextTask) {
        nextTask()
      }
    }
  }

  /** Status antrean AI saat ini (untuk admin / monitoring). */
  getStats() {
    return {
      activeJobs: this.activeJobs,
      queuedJobs: this.queue.length,
      maxConcurrency: this.maxConcurrency,
      redisHost: env.get('REDIS_HOST') || '127.0.0.1',
    }
  }
}

export const aiQueueService = new AiQueueService()
