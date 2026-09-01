import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import limiter from '@adonisjs/limiter/services/main'

export default class AntiFraudRateLimitMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const key = `anti_fraud:${ctx.request.url()}:ip:${ctx.request.ip()}`
    const limit = limiter.use({ requests: 8, duration: '15 mins' })
    if (await limit.isBlocked(key)) {
      return ctx.response.tooManyRequests({
        message: 'Terlalu banyak percobaan. Silakan tunggu beberapa menit.',
      })
    }
    await limit.increment(key)
    return next()
  }
}
