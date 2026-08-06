import type User from '#models/user'
import { AiServiceError, type CallAiJsonOptions } from '#services/ai_service'
import { aiQueueService } from '#services/ai_queue_service'

/**
 * Semua generator menggunakan antrean AdonisJS/Redis yang sama.
 */
export async function callAiJsonForUser<T>(user: User, options: CallAiJsonOptions): Promise<T> {
  try {
    return await aiQueueService.enqueueAiJson<T>({
      userId: user.id,
      combo: options.combo,
      systemPrompt: options.systemPrompt,
      userPrompt: options.userPrompt,
      timeoutMs: options.timeoutMs,
    })
  } catch (error) {
    throw new AiServiceError(error instanceof Error ? error.message : 'Quota AI tidak tersedia')
  }
}
