import { DateTime } from 'luxon'
import AiJob from '#models/ai_job'
import User from '#models/user'

export type CreateAiJobData = {
  jobKey: string
  userId: number
  combo: string
  payload: Record<string, unknown>
}

export class AiJobRepository {
  async findOrCreate(data: CreateAiJobData) {
    return AiJob.firstOrCreate(
      { jobKey: data.jobKey },
      {
        jobKey: data.jobKey,
        userId: data.userId,
        combo: data.combo,
        status: 'pending',
        attempts: 0,
        payload: data.payload,
        availableAt: DateTime.now(),
      }
    )
  }

  async findByJobKeyOrFail(jobKey: string) {
    return AiJob.findByOrFail('job_key', jobKey)
  }

  async findById(id: number) {
    return AiJob.find(id)
  }

  async findOwner(userId: number) {
    return User.find(userId)
  }

  async findOwnerOrFail(userId: number) {
    return User.findOrFail(userId)
  }

  async resetFailed(job: AiJob) {
    job.status = 'pending'
    job.error = null
    job.startedAt = null
    job.finishedAt = null
    await job.save()
    return job
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
}

export const aiJobRepository = new AiJobRepository()
