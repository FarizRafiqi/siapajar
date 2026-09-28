import Package from '#models/package'
import type User from '#models/user'

export class PackageRepository {
  async loadUserPackageWithEntitlements(user: User) {
    await user.load('package', (query) => query.preload('entitlements'))
    return user.package
  }

  async listActive() {
    return Package.query().where('is_active', true).orderBy('sort_order', 'asc')
  }

  async listForAdmin() {
    return Package.query().withCount('users').orderBy('sort_order', 'asc').orderBy('id', 'asc')
  }

  async findForCheckout(packageId?: string | number | null, packageName?: string | null) {
    // A checkout request must identify one explicit, currently sellable package.
    // Never fall back to a highlighted/first package: doing so can charge the
    // customer for a different offer when the client sends a stale or malformed id.
    const numericId = Number(packageId)
    if (Number.isInteger(numericId) && numericId > 0) {
      return Package.query()
        .where('id', numericId)
        .where('is_active', true)
        .where('price_monthly', '>', 0)
        .first()
    }

    if (!packageName && (packageId === null || packageId === undefined)) return null

    const identifier = String(packageName || packageId).trim()
    if (!identifier) return null

    return Package.query()
      .where('is_active', true)
      .where('price_monthly', '>', 0)
      .where((query) => {
        query
          .where('name', identifier)
          .orWhere('name', identifier.toLowerCase().replace(/\s+/g, '_'))
      })
      .first()
  }
}

export const packageRepository = new PackageRepository()
