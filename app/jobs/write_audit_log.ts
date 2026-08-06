import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import AuditLog from '#models/audit_log'

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
    await AuditLog.create({
      actorId: this.payload.actorId ?? null,
      action: this.payload.action,
      entityType: this.payload.entityType ?? null,
      entityId:
        this.payload.entityId === null || this.payload.entityId === undefined
          ? null
          : String(this.payload.entityId),
      metadata: this.payload.metadata ?? {},
      ipAddress: this.payload.ipAddress ?? null,
      userAgent: this.payload.userAgent ?? null,
      createdAt: undefined,
    })
  }
}
