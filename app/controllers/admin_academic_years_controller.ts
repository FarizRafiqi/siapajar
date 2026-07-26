import type { HttpContext } from '@adonisjs/core/http'
import AcademicYear from '#models/academic_year'
import { createAcademicYearValidator, updateAcademicYearValidator } from '#validators/admin'

export default class AdminAcademicYearsController {
  async index({ inertia }: HttpContext) {
    const academicYears = await AcademicYear.query().orderBy('name', 'desc')

    return inertia.render('dashboard/admin/academic-years/index', {
      academicYears: academicYears.map((y) => y.toJSON()),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createAcademicYearValidator)

    const duplicate = await AcademicYear.findBy('name', data.name)
    if (duplicate) {
      session.flash('error', `Tahun ajaran "${data.name}" sudah ada`)
      return response.redirect().back()
    }

    await AcademicYear.create(data)

    session.flash('success', 'Tahun ajaran berhasil dibuat')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const academicYear = await AcademicYear.find(params.id)
    if (!academicYear) {
      return response.redirect('/admin/academic-years')
    }

    const data = await request.validateUsing(updateAcademicYearValidator)
    await academicYear.merge(data).save()

    session.flash('success', 'Tahun ajaran berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const academicYear = await AcademicYear.find(params.id)
    if (!academicYear) {
      return response.redirect('/admin/academic-years')
    }

    await academicYear.delete()

    session.flash('success', 'Tahun ajaran berhasil dihapus')
    return response.redirect().toRoute('admin.academic-years.index')
  }
}
