import env from '#start/env'
import { defineConfig, drivers, exponentialBackoff } from '@adonisjs/queue'

/**
 * Official AdonisJS queue configuration.
 *
 * Redis is the production adapter. Sync is retained for local development and
 * tests so contributors do not need a worker process for every request.
 */
export default defineConfig({
  default: env.get('QUEUE_DRIVER', 'redis'),
  adapters: {
    redis: drivers.redis({ connectionName: 'main' }),
    sync: drivers.sync(),
  },
  worker: {
    concurrency: env.get('AI_QUEUE_MAX_CONCURRENCY', 10),
    idleDelay: '2s',
  },
  retry: {
    maxRetries: env.get('AI_QUEUE_MAX_ATTEMPTS', 3),
    backoff: exponentialBackoff({ baseDelay: '1s', maxDelay: '1m' }),
  },
  locations: ['./app/jobs/**/*.{ts,js}'],
})
