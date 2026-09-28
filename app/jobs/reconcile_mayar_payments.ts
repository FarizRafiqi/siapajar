import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { mayarService } from '#services/mayar_service'

export interface ReconcileMayarPaymentsPayload {
  batchSize?: number
}

export default class ReconcileMayarPayments extends Job<ReconcileMayarPaymentsPayload> {
  static options: JobOptions = {
    queue: 'maintenance',
    maxRetries: 1,
    timeout: '30m',
    removeOnComplete: { age: '1d' },
    removeOnFail: { age: '7d' },
  }

  async execute() {
    await mayarService.reconcilePendingInvoices(this.payload.batchSize ?? 100)
  }
}
