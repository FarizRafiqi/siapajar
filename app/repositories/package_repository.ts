import Package from '#models/package'

export class PackageRepository {
  async listActive() {
    return Package.query().where('is_active', true).orderBy('sort_order', 'asc')
  }
}

export const packageRepository = new PackageRepository()
