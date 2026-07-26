import type { HttpContext } from '@adonisjs/core/http'
import Package from '#models/package'
import { createPackageValidator, updatePackageValidator } from '#validators/admin'

export default class AdminPackagesController {
  async index({ inertia }: HttpContext) {
    const packages = await Package.query().orderBy('sort_order', 'asc')

    return inertia.render('dashboard/admin/packages/index', {
      packages: packages.map((p) => p.toJSON()),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createPackageValidator)
    await Package.create({ ...data, features: {} })

    session.flash('success', 'Paket berhasil dibuat')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const pkg = await Package.find(params.id)
    if (!pkg) {
      return response.redirect('/admin/packages')
    }

    const data = await request.validateUsing(updatePackageValidator)
    await pkg.merge(data).save()

    session.flash('success', 'Paket berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const pkg = await Package.find(params.id)
    if (!pkg) {
      return response.redirect('/admin/packages')
    }

    await pkg.delete()

    session.flash('success', 'Paket berhasil dihapus')
    return response.redirect().toRoute('admin.packages.index')
  }
}
