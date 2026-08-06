import type User from '#models/user'
import { assertEntitled, recordUsage } from '#services/entitlement_service'
import { AiServiceError, callAiJson, type CallAiJsonOptions } from '#services/ai_service'

/**
 * Satu pintu untuk generate AI langsung: quota diperiksa sebelum request dan
 * pemakaian dicatat hanya setelah provider berhasil mengembalikan hasil.
 */
export async function callAiJsonForUser<T>(user: User, options: CallAiJsonOptions): Promise<T> {
  try {
    await assertEntitled(user, 'ai_generation_monthly')
  } catch (error) {
    throw new AiServiceError(error instanceof Error ? error.message : 'Quota AI tidak tersedia')
  }
  const result = await callAiJson<T>(options)
  await recordUsage(user.id, 'ai_generation_monthly', 1, { combo: options.combo })
  return result
}
