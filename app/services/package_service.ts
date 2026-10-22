import { packageRepository } from '#repositories/package_repository'
import type { PackageRepository } from '#repositories/package_repository'

/** Paket yang tetap aktif di sistem tapi tidak ditampilkan di pricing landing page. */
const HIDDEN_ON_LANDING = new Set(['sekolah'])

export class PackageService {
  constructor(private readonly packages: PackageRepository = packageRepository) {}

  async listActiveForPublic() {
    const packages = await this.packages.listActive()
    return packages.map((pack) => pack.toJSON())
  }

  async listForLandingPricing() {
    const packages = await this.listActiveForPublic()
    return packages.filter((pack) => !HIDDEN_ON_LANDING.has(pack.name))
  }
}

export const packageService = new PackageService()
