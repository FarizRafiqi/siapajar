import WriteAuditLog, { type AuditLogPayload } from '#jobs/write_audit_log'
import { auditLogRepository, sanitizeAuditMetadata } from '#repositories/audit_log_repository'

class AuditService {
  async record(payload: AuditLogPayload) {
    try {
      await WriteAuditLog.dispatch({
        ...payload,
        metadata: sanitizeAuditMetadata(payload.metadata),
      })
    } catch {
      // Audit failure must not break the user-facing operation.
    }
  }

  async recordCritical(payload: AuditLogPayload) {
    return auditLogRepository.create({
      ...payload,
      metadata: sanitizeAuditMetadata(payload.metadata),
    })
  }
}

export const auditService = new AuditService()
