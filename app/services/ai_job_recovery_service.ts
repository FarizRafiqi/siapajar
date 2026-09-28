import GenerateAiImage from '#jobs/generate_ai_image'
import GenerateAiJson from '#jobs/generate_ai_json'
import GenerateAiSvg from '#jobs/generate_ai_svg'
import { aiJobRepository } from '#repositories/ai_job_repository'
import { aiJobLifecycleService } from '#services/ai_job_lifecycle_service'
import { AiServiceError } from '#services/ai_queue_errors'
import logger from '@adonisjs/core/services/logger'

export class AiJobRecoveryService {
  async recoverStaleJobs(limit = 100) {
    const candidates = await aiJobRepository.listStaleForRecovery(limit)
    let recovered = 0
    let failed = 0

    for (const candidate of candidates) {
      const job = await aiJobRepository.prepareStaleJobForRecovery(candidate.id)
      if (!job) continue

      try {
        const payload = job.payload
        if (job.operation === 'visual_asset.image.generate' && typeof payload.prompt === 'string') {
          await GenerateAiImage.dispatch({
            jobKey: job.jobKey,
            userId: job.userId,
            prompt: payload.prompt,
          })
        } else if (
          job.operation === 'visual_asset.svg.generate' &&
          typeof payload.prompt === 'string'
        ) {
          await GenerateAiSvg.dispatch({
            jobKey: job.jobKey,
            userId: job.userId,
            prompt: payload.prompt,
            purpose: validPurpose(payload.purpose),
            metadata:
              payload.metadata && typeof payload.metadata === 'object'
                ? (payload.metadata as Record<string, unknown>)
                : {},
          })
        } else if (
          typeof payload.systemPrompt === 'string' &&
          typeof payload.userPrompt === 'string' &&
          typeof payload.operation === 'string'
        ) {
          await GenerateAiJson.dispatch({
            jobKey: job.jobKey,
            userId: job.userId,
            operation: payload.operation,
            routingCombo:
              typeof payload.routingCombo === 'string' ? payload.routingCombo : undefined,
            systemPrompt: payload.systemPrompt,
            userPrompt: payload.userPrompt,
            featureKey: typeof payload.featureKey === 'string' ? payload.featureKey : undefined,
          })
        } else {
          await aiJobLifecycleService.markFailed(
            job.jobKey,
            new AiServiceError('AI job tidak memiliki payload yang dapat dipulihkan.')
          )
          failed += 1
          continue
        }

        recovered += 1
        logger.warn(
          {
            event: 'ai.job.recovered',
            jobId: job.id,
            jobKey: job.jobKey,
            operation: job.operation,
            previousStatus: candidate.status,
          },
          'Re-dispatched a stale AI job'
        )
      } catch (error) {
        logger.error(
          {
            event: 'ai.job.recovery_failed',
            jobId: job.id,
            jobKey: job.jobKey,
            operation: job.operation,
            errorName: error instanceof Error ? error.name : 'UnknownError',
          },
          'Could not re-dispatch a stale AI job'
        )
      }
    }

    logger.info(
      { event: 'ai.job.recovery_run', scanned: candidates.length, recovered, failed },
      'Stale AI job recovery run completed'
    )
    return { scanned: candidates.length, recovered, failed }
  }
}

function validPurpose(value: unknown): 'exam' | 'media' | 'document' | 'generic' {
  return value === 'exam' || value === 'media' || value === 'document' ? value : 'generic'
}

export const aiJobRecoveryService = new AiJobRecoveryService()
