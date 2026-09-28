import type { HttpContext } from '@adonisjs/core/http'
import { createPackageValidator, updatePackageValidator } from '#validators/admin'
import { adminCatalogService } from '#services/admin_catalog_service'

export default class AdminPackagesController {
  async index({ inertia }: HttpContext) {
    const packages = await adminCatalogService.listPackages()

    return inertia.render('dashboard/admin/packages/index', {
      packages: packages.map((pkg) => ({
        ...pkg.toJSON(),
        userCount: Number(pkg.$extras.users_count ?? 0),
      })),
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(createPackageValidator)
    const existing = await adminCatalogService.findPackageByName(data.name)
    if (existing) {
      session.flash('error', `Kode paket "${data.name}" sudah digunakan`)
      return response.redirect().back()
    }
    await adminCatalogService.createPackage(data, auth.user!.id)

    session.flash('success', 'Paket berhasil dibuat')
    return response.redirect().back()
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(updatePackageValidator)
    const pkg = await adminCatalogService.updatePackage(params.id, data, auth.user!.id)
    if (!pkg) {
      return response.redirect('/admin/packages')
    }

    session.flash('success', 'Paket berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const deleted = await adminCatalogService.deletePackage(params.id, auth.user!.id)
    if (deleted === 'not_found') return response.redirect('/admin/packages')
    if (deleted === 'in_use') {
      session.flash(
        'error',
        'Paket masih dipakai pengguna. Nonaktifkan paket jika ingin mengarsipkannya.'
      )
      return response.redirect().back()
    }

    session.flash('success', 'Paket berhasil dihapus')
    return response.redirect().toRoute('admin.packages.index')
  }
}
