import type { HttpContext } from '@adonisjs/core/http'
import { createSchoolValidator, updateSchoolValidator } from '#validators/admin'
import { adminCatalogService } from '#services/admin_catalog_service'

export default class AdminSchoolsController {
  async index({ inertia }: HttpContext) {
    const schools = await adminCatalogService.listSchools()

    return inertia.render('dashboard/admin/schools/index', {
      schools: schools.map((s) => s.toJSON()),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createSchoolValidator)

    const created = await adminCatalogService.createSchool(data)

    if (!created) {
      session.flash('error', `Sekolah "${data.name}" sudah ada`)
      return response.redirect().back()
    }

    session.flash('success', 'Sekolah berhasil dibuat')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const data = await request.validateUsing(updateSchoolValidator)
    const school = await adminCatalogService.updateSchool(params.id, data)
    if (!school) {
      return response.redirect('/admin/schools')
    }

    session.flash('success', 'Sekolah berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const deleted = await adminCatalogService.deleteSchool(params.id)
    if (!deleted) return response.redirect('/admin/schools')

    session.flash('success', 'Sekolah berhasil dihapus')
    return response.redirect().toRoute('admin.schools.index')
  }
}
