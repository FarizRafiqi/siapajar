import env from '#start/env'
import { callAiJson } from '#services/ai_service'

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
    combo: string
    systemPrompt: string
    userPrompt: string
    timeoutMs?: number
  }): Promise<T> {
    this.activeJobs++
    try {
      return await callAiJson<T>(options)
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
