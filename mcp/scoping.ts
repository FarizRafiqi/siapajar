import type { ModelQueryBuilderContract, LucidModel } from '@adonisjs/lucid/types/model'
import type { McpContext } from './auth.js'

export function applyUserOrSchoolScope<T extends LucidModel>(
  query: ModelQueryBuilderContract<T>,
  ctx: McpContext,
  tablePrefix: string = ''
) {
  if (ctx.role === 'admin') {
    return query
  }

  const prefix = tablePrefix ? `${tablePrefix}.` : ''

  if (ctx.role === 'kepala_sekolah') {
    if (ctx.schoolId) {
      query.whereHas('user' as any, (uQ: any) => {
        uQ.where('school_id', ctx.schoolId!)
      })
    } else {
      query.whereRaw('1 = 0')
    }
    return query
  }

  if (ctx.role === 'guru') {
    query.where(`${prefix}user_id`, ctx.user.id)
    return query
  }

  return query
}

export function checkResourceOwnership(
  record: { userId?: number; user_id?: number },
  ctx: McpContext
): boolean {
  if (ctx.role === 'admin') return true
  if (ctx.role === 'guru') {
    const recordUserId = record.userId ?? record.user_id
    return recordUserId === ctx.user.id
  }
  if (ctx.role === 'kepala_sekolah') {
    return true
  }
  return false
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const MAX_GENERATIONS_PER_WINDOW = 10
const userGenerationTimestamps = new Map<number, number[]>()

export function checkAiRateLimit(userId: number): { allowed: boolean; error?: string } {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS

  let timestamps = userGenerationTimestamps.get(userId) || []
  timestamps = timestamps.filter((t) => t > windowStart)

  if (timestamps.length >= MAX_GENERATIONS_PER_WINDOW) {
    return {
      allowed: false,
      error:
        'Rate limit exceeded: Maximum 10 AI generation requests per 10 minutes. Please try again later.',
    }
  }

  timestamps.push(now)
  userGenerationTimestamps.set(userId, timestamps)
  return { allowed: true }
}

export function resetAiRateLimits() {
  userGenerationTimestamps.clear()
}
