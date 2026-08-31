import type { HttpContext } from '@adonisjs/core/http'
import { createAcademicYearValidator, updateAcademicYearValidator } from '#validators/admin'
import { adminCatalogService } from '#services/admin_catalog_service'

export default class AdminAcademicYearsController {
  async index({ inertia }: HttpContext) {
    const academicYears = await adminCatalogService.listAcademicYears()

    return inertia.render('dashboard/admin/academic-years/index', {
      academicYears: academicYears.map((y) => y.toJSON()),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createAcademicYearValidator)

    const duplicate = await adminCatalogService.findAcademicYearByName(data.name)
    if (duplicate) {
      session.flash('error', `Tahun ajaran "${data.name}" sudah ada`)
      return response.redirect().back()
    }

    await adminCatalogService.createAcademicYear(data)

    session.flash('success', 'Tahun ajaran berhasil dibuat')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const academicYear = await adminCatalogService.updateAcademicYear(
      params.id,
      await request.validateUsing(updateAcademicYearValidator)
    )
    if (!academicYear) {
      return response.redirect('/admin/academic-years')
    }

    session.flash('success', 'Tahun ajaran berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const deleted = await adminCatalogService.deleteAcademicYear(params.id)
    if (!deleted) return response.redirect('/admin/academic-years')

    session.flash('success', 'Tahun ajaran berhasil dihapus')
    return response.redirect().toRoute('admin.academic-years.index')
  }
}
