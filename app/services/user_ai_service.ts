import type User from '#models/user'
import { AiServiceError, type CallAiJsonOptions } from '#services/ai_service'
import { aiQueueService } from '#services/ai_queue_service'
import { AiJobStillProcessingError } from '#services/ai_queue_errors'
import type { AiJobBillingReservation } from '#repositories/ai_job_repository'

/**
 * Semua generator menggunakan antrean AdonisJS/Redis yang sama.
 */
export async function callAiJsonForUser<T>(
  user: User,
  options: CallAiJsonOptions,
  billingReservation?: AiJobBillingReservation
): Promise<T> {
  try {
    return await aiQueueService.enqueueAiJson<T>({
      userId: user.id,
      operation: options.operation,
      routingCombo: options.routingCombo,
      systemPrompt: options.systemPrompt,
      userPrompt: options.userPrompt,
      timeoutMs: options.timeoutMs,
      billingReservation,
    })
  } catch (error) {
    if (error instanceof AiJobStillProcessingError) throw error
    throw new AiServiceError(error instanceof Error ? error.message : 'Quota AI tidak tersedia')
  }
}
