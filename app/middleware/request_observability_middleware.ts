import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { randomUUID } from 'node:crypto'
import logger from '@adonisjs/core/services/logger'

export default class RequestObservabilityMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const requestId = randomUUID()
    const startedAt = performance.now()
    const route = ctx.route?.name || 'unmatched'
    const method = ctx.request.method()
    ctx.response.header('x-request-id', requestId)

    try {
      await next()
      const status = ctx.response.getStatus()
      const fields = {
        event: 'http.request.completed',
        requestId,
        route,
        method,
        status,
        durationMs: Math.round(performance.now() - startedAt),
      }
      if (status >= 500) {
        logger.error(fields, 'HTTP request completed with server error')
      } else {
        logger.info(fields, 'HTTP request completed')
      }
    } catch (error) {
      logger.error(
        {
          event: 'http.request.failed',
          requestId,
          route,
          method,
          status: Math.max(ctx.response.getStatus(), 500),
          durationMs: Math.round(performance.now() - startedAt),
          errorName: error instanceof Error ? error.name : 'UnknownError',
        },
        'HTTP request failed'
      )
      throw error
    }
  }
}
