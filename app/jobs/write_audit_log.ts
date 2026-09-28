import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { auditLogRepository } from '#repositories/audit_log_repository'

export interface AuditLogPayload {
  actorId?: number | null
  action: string
  entityType?: string | null
  entityId?: string | number | null
  metadata?: Record<string, unknown>
  ipAddress?: string | null
  userAgent?: string | null
}

export default class WriteAuditLog extends Job<AuditLogPayload> {
  static options: JobOptions = {
    queue: 'audit',
    maxRetries: 3,
    timeout: '30s',
    removeOnComplete: { age: '1h' },
    removeOnFail: { age: '1d' },
  }

  async execute() {
    await auditLogRepository.create(this.payload)
  }
}
