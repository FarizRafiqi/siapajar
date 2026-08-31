import db from '@adonisjs/lucid/services/db'

export class InfrastructureRepository {
  async pingDatabase() {
    await db.rawQuery('select 1')
  }
}

export const infrastructureRepository = new InfrastructureRepository()
