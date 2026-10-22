import { packageRepository } from '#repositories/package_repository'
import type { PackageRepository } from '#repositories/package_repository'

export class PackageService {
  constructor(private readonly packages: PackageRepository = packageRepository) {}

  async listActiveForPublic() {
    const packages = await this.packages.listActive()
    return packages.map((pack) => pack.toJSON())
  }
}

export const packageService = new PackageService()
