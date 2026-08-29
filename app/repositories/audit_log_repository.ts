import AuditLog from '#models/audit_log'

export type AuditLogPersistenceData = {
  actorId: number | null
  action: string
  entityType: string | null
  entityId: string | null
  metadata: Record<string, unknown>
  ipAddress: string | null
  userAgent: string | null
  createdAt?: undefined
}

export class AuditLogRepository {
  async record(data: AuditLogPersistenceData) {
    return AuditLog.create(data)
  }
}

export const auditLogRepository = new AuditLogRepository()
