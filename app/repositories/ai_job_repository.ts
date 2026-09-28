import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import AiJob from '#models/ai_job'

export type CreateAiJobData = {
  jobKey: string
  userId: number
  operation: string
  payload: Record<string, unknown>
}

export type AiJobBillingReservation = {
  reservationKey: string
  amount: number
  description: string
}

export class AiJobRepository {
  async findOrCreate(data: CreateAiJobData) {
    return AiJob.firstOrCreate(
      { jobKey: data.jobKey },
      {
        jobKey: data.jobKey,
        userId: data.userId,
        operation: data.operation,
        status: 'pending',
        attempts: 0,
        payload: data.payload,
        availableAt: DateTime.now(),
      }
    )
  }

  async resetFailed(job: AiJob) {
    job.status = 'pending'
    job.error = null
    job.startedAt = null
    job.finishedAt = null
    await job.save()
    return job
  }

  async listStaleForRecovery(limit = 100) {
    return AiJob.query()
      .whereIn('status', ['pending', 'processing'])
      .where('updatedAt', '<', DateTime.now().minus({ minutes: 20 }).toSQL())
      .orderBy('updatedAt', 'asc')
      .limit(Math.max(1, Math.min(Math.trunc(limit), 500)))
  }

  async prepareStaleJobForRecovery(jobId: number) {
    return db.transaction(async (trx) => {
      const job = await AiJob.query({ client: trx }).where('id', jobId).forUpdate().first()
      if (!job || !['pending', 'processing'].includes(job.status)) return null
      if (job.updatedAt > DateTime.now().minus({ minutes: 20 })) return null

      job.status = 'pending'
      job.error = null
      job.finishedAt = null
      job.availableAt = DateTime.now()
      job.useTransaction(trx)
      await job.save()
      return job
    })
  }

  async attachBillingReservation(jobId: number, reservation: AiJobBillingReservation) {
    return db.transaction(async (trx) => {
      const job = await AiJob.query({ client: trx }).where('id', jobId).forUpdate().firstOrFail()
      const payload = { ...(job.payload ?? {}) }
      const reservations = Array.isArray(payload.billingReservations)
        ? (payload.billingReservations as AiJobBillingReservation[])
        : []
      if (!reservations.some((item) => item.reservationKey === reservation.reservationKey)) {
        payload.billingReservations = [...reservations, reservation]
        job.payload = payload
        job.useTransaction(trx)
        await job.save()
      }
      return job
    })
  }

  getBillingReservations(job: AiJob): AiJobBillingReservation[] {
    const reservations = job.payload?.billingReservations
    if (!Array.isArray(reservations)) return []
    return reservations.filter(
      (item): item is AiJobBillingReservation =>
        Boolean(item) &&
        typeof item.reservationKey === 'string' &&
        Number.isInteger(item.amount) &&
        typeof item.description === 'string'
    )
  }

  /**
   * Claim a pending cache miss atomically before calling an AI provider.
   *
   * The unique job key deduplicates rows, but two HTTP requests can still read
   * the same pending row at the same time. A row lock makes exactly one worker
   * transition it to processing; the other worker waits on the same cache row
   * instead of paying for a duplicate provider call.
   */
  async claimProcessing(job: AiJob): Promise<boolean> {
    return db.transaction(async (trx) => {
      const candidate = await AiJob.query({ client: trx }).where('id', job.id).forUpdate().first()
      if (!candidate || candidate.status !== 'pending') return false

      candidate.status = 'processing'
      candidate.attempts += 1
      candidate.startedAt ??= DateTime.now()
      candidate.useTransaction(trx)
      await candidate.save()
      job.status = candidate.status
      job.attempts = candidate.attempts
      job.startedAt = candidate.startedAt
      job.updatedAt = candidate.updatedAt
      return true
    })
  }

  async markProcessing(job: AiJob) {
    job.status = 'processing'
    job.attempts += 1
    job.startedAt = DateTime.now()
    await job.save()
    return job
  }

  async markCompleted(job: AiJob, result: unknown) {
    job.status = 'completed'
    job.result = result
    job.finishedAt = DateTime.now()
    await job.save()
    return job
  }

  async markFailed(job: AiJob, message: string) {
    job.status = 'failed'
    job.error = message
    job.finishedAt = DateTime.now()
    await job.save()
    return job
  }

  async markRetrying(job: AiJob, message: string) {
    job.status = 'pending'
    job.error = message
    job.finishedAt = null
    await job.save()
    return job
  }
}

export const aiJobRepository = new AiJobRepository()
