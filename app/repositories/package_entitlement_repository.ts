import Package from '#models/package'

export class PackageEntitlementRepository {
  async listWithEntitlements() {
    return Package.query().preload('entitlements').orderBy('sort_order', 'asc')
  }
}

export const packageEntitlementRepository = new PackageEntitlementRepository()
