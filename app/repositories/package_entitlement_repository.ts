import Package from '#models/package'
import PackageEntitlement from '#models/package_entitlement'

export class PackageEntitlementRepository {
  async findForFeature(packageId: number, featureKey: string) {
    return PackageEntitlement.query()
      .where('package_id', packageId)
      .where('feature_key', featureKey)
      .first()
  }

  async listWithEntitlements() {
    return Package.query().preload('entitlements').orderBy('sort_order', 'asc')
  }
}

export const packageEntitlementRepository = new PackageEntitlementRepository()
