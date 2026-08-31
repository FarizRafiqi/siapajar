import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { creditService } from '#services/credit_service'

export interface SyncCreditBalancesPayload {
  batchSize?: number
}

/**
 * Maintenance job untuk memperbaiki cache saldo kredit tanpa membebani request web.
 */
export default class SyncCreditBalances extends Job<SyncCreditBalancesPayload> {
  static options: JobOptions = {
    queue: 'maintenance',
    maxRetries: 3,
    timeout: '10m',
    removeOnComplete: { age: '1h' },
    removeOnFail: { age: '1d' },
  }

  async execute() {
    await creditService.synchronizeAllUserBalances({
      batchSize: this.payload.batchSize ?? 250,
    })
  }
}
