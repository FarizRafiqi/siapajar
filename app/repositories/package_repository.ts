import Package from '#models/package'

export class PackageRepository {
  async listActive() {
    return Package.query().where('is_active', true).orderBy('sort_order', 'asc')
  }

  async findForCheckout(packageId?: string | number | null, packageName?: string | null) {
    let pkg: Package | null = null

    if (packageId && !Number.isNaN(Number(packageId))) {
      pkg = await Package.find(Number(packageId))
    }

    if (!pkg && (packageName || packageId)) {
      const identifier = String(packageName || packageId).trim()
      pkg = await Package.query()
        .where('name', identifier)
        .orWhere('name', identifier.toLowerCase().replace(/\s+/g, '_'))
        .first()
    }

    if (!pkg) {
      pkg =
        (await Package.query().where('is_active', true).where('is_highlighted', true).first()) ||
        (await Package.query().where('is_active', true).first())
    }

    return pkg
  }
}

export const packageRepository = new PackageRepository()
