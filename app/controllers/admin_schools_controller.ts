import type { HttpContext } from '@adonisjs/core/http'
import { createSchoolValidator, updateSchoolValidator } from '#validators/admin'
import { adminCatalogService } from '#services/admin_catalog_service'

export default class AdminSchoolsController {
  async index({ inertia }: HttpContext) {
    const schools = await adminCatalogService.listSchools()

    return inertia.render('dashboard/admin/schools/index', {
      schools: schools.map((school) => ({
        ...school.toJSON(),
        userCount: Number(school.$extras.users_count ?? 0),
      })),
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(createSchoolValidator)

    const created = await adminCatalogService.createSchool(data, auth.user!.id)

    if (!created) {
      session.flash('error', `Sekolah "${data.name}" sudah ada`)
      return response.redirect().back()
    }

    session.flash('success', 'Sekolah berhasil dibuat')
    return response.redirect().back()
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(updateSchoolValidator)
    const school = await adminCatalogService.updateSchool(params.id, data, auth.user!.id)
    if (school === 'duplicate') {
      session.flash('error', `Sekolah "${data.name}" sudah ada`)
      return response.redirect().back()
    }
    if (!school) {
      return response.redirect('/admin/schools')
    }

    session.flash('success', 'Sekolah berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const deleted = await adminCatalogService.deleteSchool(params.id, auth.user!.id)
    if (!deleted) return response.redirect('/admin/schools')

    session.flash('success', 'Sekolah berhasil dihapus')
    return response.redirect().toRoute('admin.schools.index')
  }
}
