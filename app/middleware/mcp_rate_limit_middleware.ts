import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import limiter from '@adonisjs/limiter/services/main'
import crypto from 'node:crypto'

export default class McpRateLimitMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    const authHeader = request.header('authorization')

    let keyIdentifier = `ip:${request.ip()}`
    let maxRequests = 60

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim()
      if (token) {
        const keyHash = crypto.createHash('sha256').update(token).digest('hex').substring(0, 16)
        keyIdentifier = `mcp_key:${keyHash}`
        maxRequests = 120
      }
    }

    const throttleKey = `mcp_rate_limit:${keyIdentifier}`
    const limiterInstance = limiter.use({
      requests: maxRequests,
      duration: '1 mins',
    })

    if (await limiterInstance.isBlocked(throttleKey)) {
      return response.tooManyRequests({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Rate limit exceeded for MCP HTTP endpoint. Please slow down your requests.',
        },
        id: null,
      })
    }

    await limiterInstance.increment(throttleKey)
    return next()
  }
}
