import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import AuditLog from '#models/audit_log'

export type AuditLogInput = {
  actorId?: number | null
  action: string
  entityType?: string | null
  entityId?: string | number | null
  metadata?: Record<string, unknown>
  ipAddress?: string | null
  userAgent?: string | null
}

const SENSITIVE_KEY =
  /password|secret|token|authorization|api.?key|credential|refresh.?token|access.?token|prompt|payload|raw.?body|payment.?url|webhook.?body|email|mobile|phone|ip.?address|user.?agent/i

export function sanitizeAuditMetadata(value: Record<string, unknown> = {}) {
  return sanitizeRecord(value, 0)
}

function sanitizeRecord(value: Record<string, unknown>, depth: number): Record<string, unknown> {
  if (depth > 3) return {}
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !SENSITIVE_KEY.test(key))
      .slice(0, 40)
      .map(([key, entry]) => [key.slice(0, 80), sanitizeValue(entry, depth + 1)])
  )
}

function sanitizeValue(value: unknown, depth: number): unknown {
  if (value === null || typeof value === 'boolean') return value
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string') return value.slice(0, 500)
  if (Array.isArray(value)) return value.slice(0, 30).map((item) => sanitizeValue(item, depth + 1))
  if (typeof value === 'object' && value !== null) {
    return sanitizeRecord(value as Record<string, unknown>, depth)
  }
  return null
}

export class AuditLogRepository {
  async create(input: AuditLogInput, trx?: TransactionClientContract) {
    const audit = new AuditLog()
    if (trx) audit.useTransaction(trx)
    audit.fill({
      actorId: input.actorId ?? null,
      action: input.action.slice(0, 120),
      entityType: input.entityType?.slice(0, 120) ?? null,
      entityId:
        input.entityId === null || input.entityId === undefined
          ? null
          : String(input.entityId).slice(0, 120),
      metadata: sanitizeAuditMetadata(input.metadata),
      ipAddress: input.ipAddress?.slice(0, 64) ?? null,
      userAgent: input.userAgent?.slice(0, 500) ?? null,
      createdAt: undefined,
    })
    await audit.save()
    return audit
  }
}

export const auditLogRepository = new AuditLogRepository()
