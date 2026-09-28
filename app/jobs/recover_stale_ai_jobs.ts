import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { aiJobRecoveryService } from '#services/ai_job_recovery_service'

export interface RecoverStaleAiJobsPayload {
  batchSize?: number
}

export default class RecoverStaleAiJobs extends Job<RecoverStaleAiJobsPayload> {
  static options: JobOptions = {
    queue: 'maintenance',
    maxRetries: 1,
    timeout: '10m',
    removeOnComplete: { age: '1h' },
    removeOnFail: { age: '1d' },
  }

  async execute() {
    await aiJobRecoveryService.recoverStaleJobs(this.payload.batchSize ?? 100)
  }
}
