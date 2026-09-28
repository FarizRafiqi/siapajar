import env from '#start/env'
import { operationsObservabilityRepository } from '#repositories/operations_observability_repository'
import { infrastructureRepository } from '#repositories/infrastructure_repository'

export class OperationsObservabilityService {
  async getOverview() {
    let database: 'ok' | 'degraded' = 'ok'
    let redis: 'ok' | 'degraded' | 'not_used' = 'not_used'

    try {
      await infrastructureRepository.pingDatabase()
    } catch {
      database = 'degraded'
    }

    if (env.get('QUEUE_DRIVER', 'redis') === 'redis') {
      try {
        const { default: redisClient } = await import('@adonisjs/redis/services/main')
        await redisClient.ping()
        redis = 'ok'
      } catch {
        redis = 'degraded'
      }
    }

    const metrics = database === 'ok' ? await operationsObservabilityRepository.getOverview() : null
    return {
      checkedAt: new Date().toISOString(),
      queueDriver: env.get('QUEUE_DRIVER', 'redis'),
      health: { database, redis },
      metrics,
    }
  }
}

export const operationsObservabilityService = new OperationsObservabilityService()
