import { DateTime } from 'luxon'
import AiJob from '#models/ai_job'
import AuditLog from '#models/audit_log'
import PaymentInvoice from '#models/payment_invoice'

const RECENT_AUDIT_ACTIONS = [
  'payment.invoice.created',
  'payment.invoice.creation_failed',
  'payment.invoice.settled',
  'payment.webhook.received',
  'payment.webhook.ignored',
  'payment.webhook.unmatched',
  'payment.webhook.verification_pending',
  'payment.webhook.processed',
  'payment.webhook.processing_failed',
  'payment.reconciliation.run',
  'admin.package.created',
  'admin.package.updated',
  'admin.package.deleted',
  'admin.package.entitlement.updated',
  'admin.user.updated',
  'admin.user.deleted',
  'admin.fraud_case.reviewed',
  'admin.ai_settings.updated',
  'admin.ai_settings.oauth_enabled',
  'admin.ai_settings.oauth_connected',
  'admin.academic_year.created',
  'admin.academic_year.updated',
  'admin.academic_year.deleted',
  'admin.school.created',
  'admin.school.updated',
  'admin.school.deleted',
  'admin.curriculum_preset.created',
  'admin.curriculum_preset.updated',
  'admin.curriculum_preset.deleted',
  'admin.curriculum_presets.reset_defaults',
]

export class OperationsObservabilityRepository {
  async getOverview() {
    const last24Hours = DateTime.now().minus({ hours: 24 })
    const [
      states,
      completedJobs,
      completedCount,
      failedCount,
      staleProcessingCount,
      stalePendingCount,
      pendingInvoices,
      oldestPending,
      lastRun,
      recentAuditEvents,
    ] = await Promise.all([
      AiJob.query().select('status').count('* as total').groupBy('status'),
      AiJob.query()
        .where('status', 'completed')
        .whereNotNull('startedAt')
        .whereNotNull('finishedAt')
        .where('finishedAt', '>=', last24Hours.toSQL())
        .select('startedAt', 'finishedAt')
        .orderBy('finishedAt', 'desc')
        .limit(5_000),
      AiJob.query()
        .where('status', 'completed')
        .where('finishedAt', '>=', last24Hours.toSQL())
        .count('* as total')
        .first(),
      AiJob.query()
        .where('status', 'failed')
        .where('finishedAt', '>=', last24Hours.toSQL())
        .count('* as total')
        .first(),
      AiJob.query()
        .where('status', 'processing')
        .where('updatedAt', '<', DateTime.now().minus({ minutes: 20 }).toSQL())
        .count('* as total')
        .first(),
      AiJob.query()
        .where('status', 'pending')
        .where('updatedAt', '<', DateTime.now().minus({ minutes: 20 }).toSQL())
        .count('* as total')
        .first(),
      PaymentInvoice.query()
        .where('paymentGateway', 'mayar')
        .where('status', 'pending')
        .count('* as total')
        .first(),
      PaymentInvoice.query()
        .where('paymentGateway', 'mayar')
        .where('status', 'pending')
        .orderBy('createdAt', 'asc')
        .select('createdAt')
        .first(),
      AuditLog.query()
        .where('action', 'payment.reconciliation.run')
        .orderBy('createdAt', 'desc')
        .first(),
      AuditLog.query()
        .whereIn('action', RECENT_AUDIT_ACTIONS)
        .select('id', 'action', 'entityType', 'entityId', 'actorId', 'createdAt')
        .orderBy('createdAt', 'desc')
        .limit(10),
    ])

    const totals = new Map(states.map((state) => [state.status, Number(state.$extras.total ?? 0)]))
    const durations = completedJobs
      .filter((job) => job.startedAt && job.finishedAt)
      .map((job) => Math.max(0, job.finishedAt!.toMillis() - job.startedAt!.toMillis()))
      .sort((left, right) => left - right)
    const reconciliation = lastRun
      ? {
          at: lastRun.createdAt.toISO(),
          checked: numberFromMetadata(lastRun.metadata, 'checked'),
          settled: numberFromMetadata(lastRun.metadata, 'settled'),
          stillPending: numberFromMetadata(lastRun.metadata, 'stillPending'),
          failures: numberFromMetadata(lastRun.metadata, 'failures'),
          limitReached: lastRun.metadata?.limitReached === true,
        }
      : null

    return {
      aiQueue: {
        pending: totals.get('pending') ?? 0,
        processing: totals.get('processing') ?? 0,
        failedTotal: totals.get('failed') ?? 0,
        failedLast24Hours: Number(failedCount?.$extras.total ?? 0),
        staleProcessing: Number(staleProcessingCount?.$extras.total ?? 0),
        stalePending: Number(stalePendingCount?.$extras.total ?? 0),
        completedLast24Hours: Number(completedCount?.$extras.total ?? 0),
        latencySampleCount: durations.length,
        latencyP50Ms: percentile(durations, 0.5),
        latencyP95Ms: percentile(durations, 0.95),
      },
      payments: {
        pendingMayar: Number(pendingInvoices?.$extras.total ?? 0),
        oldestPendingAt: oldestPending?.createdAt?.toISO() ?? null,
      },
      reconciliation,
      recentAuditEvents: recentAuditEvents.map((event) => ({
        id: event.id,
        action: event.action,
        entityType: event.entityType,
        entityId: event.entityId,
        actorId: event.actorId,
        createdAt: event.createdAt.toISO(),
      })),
    }
  }
}

function percentile(sortedValues: number[], fraction: number) {
  if (!sortedValues.length) return null
  const index = Math.min(sortedValues.length - 1, Math.ceil(fraction * sortedValues.length) - 1)
  return Math.round(sortedValues[index])
}

function numberFromMetadata(metadata: Record<string, unknown> | null, key: string) {
  const value = metadata?.[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export const operationsObservabilityRepository = new OperationsObservabilityRepository()
