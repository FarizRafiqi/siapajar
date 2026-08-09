import env from '#start/env'
import { defineConfig, drivers, exponentialBackoff } from '@adonisjs/queue'

const isTestEnvironment = env.get('NODE_ENV') === 'test'

// The MCP server runs as a stdio process and must not require Redis.
const isMcpServer = env.get('MCP_SERVER') === 'true'

/**
 * Official AdonisJS queue configuration.
 *
 * Redis is the production adapter. Sync is retained for local development and
 * tests so contributors do not need a worker process for every request.
 */
export default defineConfig({
  default: isTestEnvironment ? 'sync' : env.get('QUEUE_DRIVER', 'redis'),
  adapters: {
    // Unit tests must stay self-contained. The queue provider resolves every
    // configured adapter during boot, so even a sync default would otherwise
    // initialize the Redis connection. Same for the MCP server.
    ...(isTestEnvironment || isMcpServer
      ? {}
      : { redis: drivers.redis({ connectionName: 'main' }) }),
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
  // Dev/CI runs from the source tree (app/jobs/*.ts), production runs from the
  // AdonisJS build output (build/app/jobs/*.js) — match both so the queue
  // locator finds the jobs in every environment.
  locations: ['./app/jobs/**/*.{ts,js}', './build/app/jobs/**/*.js'],
})
