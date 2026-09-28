import AiJob from '#models/ai_job'
import { aiJobRepository } from '#repositories/ai_job_repository'
import { creditService } from '#services/credit_service'
import { releaseUsageReservation } from '#services/entitlement_service'
import { auditService } from '#services/audit_service'
import logger from '@adonisjs/core/services/logger'

export class AiJobLifecycleService {
  async markRetrying(jobKey: string, error: unknown) {
    const job = await AiJob.findBy('jobKey', jobKey)
    if (!job || job.status === 'completed') return
    const message = error instanceof Error ? error.message : 'AI job failed'
    await aiJobRepository.markRetrying(job, message)
    await releaseUsageReservation(jobKey)
    logger.warn(
      {
        event: 'ai.job.retry',
        jobId: job.id,
        jobKey: job.jobKey,
        operation: job.operation,
        attempt: job.attempts,
        errorName: error instanceof Error ? error.name : 'UnknownError',
      },
      'AI queue job attempt failed and will be retried'
    )
  }

  async markCompleted(job: AiJob) {
    await this.settleLinkedReservations(job)
    logger.info(
      {
        event: 'ai.job.completed',
        jobId: job.id,
        jobKey: job.jobKey,
        operation: job.operation,
        attempts: job.attempts,
        durationMs: durationMs(job),
      },
      'AI queue job completed'
    )
  }

  async markFailed(jobKey: string, error: unknown) {
    const job = await AiJob.findBy('jobKey', jobKey)
    if (!job || job.status === 'completed') return

    const message = error instanceof Error ? error.message : 'AI job failed'
    await aiJobRepository.markFailed(job, message)
    await releaseUsageReservation(jobKey)
    await this.settleLinkedReservations(job)
    await auditService.record({
      actorId: job.userId,
      action: 'ai.job.failed',
      entityType: 'ai_job',
      entityId: job.id,
      metadata: { operation: job.operation, attempts: job.attempts },
    })
    logger.error(
      {
        event: 'ai.job.failed',
        jobId: job.id,
        jobKey: job.jobKey,
        operation: job.operation,
        attempts: job.attempts,
        durationMs: durationMs(job),
        errorName: error instanceof Error ? error.name : 'UnknownError',
      },
      'AI queue job exhausted its retries'
    )
  }

  private async settleLinkedReservations(job: AiJob) {
    const reservations = aiJobRepository.getBillingReservations(job)
    for (const reservation of reservations) {
      await creditService.completeGenerationAiJob({
        userId: job.userId,
        reservationKey: reservation.reservationKey,
        jobKey: job.jobKey,
        amount: reservation.amount,
        description: `Pengembalian kredit: ${reservation.description}`,
      })
    }
  }
}

function durationMs(job: AiJob) {
  if (!job.startedAt || !job.finishedAt) return null
  return Math.max(0, job.finishedAt.toMillis() - job.startedAt.toMillis())
}

export const aiJobLifecycleService = new AiJobLifecycleService()
