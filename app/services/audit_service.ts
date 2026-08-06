import WriteAuditLog, { type AuditLogPayload } from '#jobs/write_audit_log'

class AuditService {
  async record(payload: AuditLogPayload) {
    try {
      await WriteAuditLog.dispatch(payload)
    } catch {
      // Audit failure must not break the user-facing operation.
    }
  }
}

export const auditService = new AuditService()
