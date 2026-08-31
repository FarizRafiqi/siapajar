import { infrastructureRepository } from '#repositories/infrastructure_repository'
import type { InfrastructureRepository } from '#repositories/infrastructure_repository'

export class HealthService {
  constructor(
    private readonly infrastructure: InfrastructureRepository = infrastructureRepository
  ) {}

  async checkDatabase() {
    await this.infrastructure.pingDatabase()
  }
}

export const healthService = new HealthService()
