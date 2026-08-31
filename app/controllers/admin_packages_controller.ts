import type { HttpContext } from '@adonisjs/core/http'
import { createPackageValidator, updatePackageValidator } from '#validators/admin'
import { adminCatalogService } from '#services/admin_catalog_service'

export default class AdminPackagesController {
  async index({ inertia }: HttpContext) {
    const packages = await adminCatalogService.listPackages()

    return inertia.render('dashboard/admin/packages/index', {
      packages: packages.map((p) => p.toJSON()),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createPackageValidator)
    await adminCatalogService.createPackage(data)

    session.flash('success', 'Paket berhasil dibuat')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const data = await request.validateUsing(updatePackageValidator)
    const pkg = await adminCatalogService.updatePackage(params.id, data)
    if (!pkg) {
      return response.redirect('/admin/packages')
    }

    session.flash('success', 'Paket berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const deleted = await adminCatalogService.deletePackage(params.id)
    if (!deleted) return response.redirect('/admin/packages')

    session.flash('success', 'Paket berhasil dihapus')
    return response.redirect().toRoute('admin.packages.index')
  }
}
