import type { HttpContext } from '@adonisjs/core/http'
import School from '#models/school'
import { createSchoolValidator, updateSchoolValidator } from '#validators/admin'

export default class AdminSchoolsController {
  async index({ inertia }: HttpContext) {
    const schools = await School.query().orderBy('name')

    return inertia.render('dashboard/admin/schools/index', {
      schools: schools.map((s) => s.toJSON()),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createSchoolValidator)

    const duplicate = await School.query()
      .whereRaw('LOWER(name) = ?', [data.name.toLowerCase()])
      .first()

    if (duplicate) {
      session.flash('error', `Sekolah "${data.name}" sudah ada`)
      return response.redirect().back()
    }

    await School.create(data)

    session.flash('success', 'Sekolah berhasil dibuat')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const school = await School.find(params.id)
    if (!school) {
      return response.redirect('/admin/schools')
    }

    const data = await request.validateUsing(updateSchoolValidator)
    await school.merge(data).save()

    session.flash('success', 'Sekolah berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const school = await School.find(params.id)
    if (!school) {
      return response.redirect('/admin/schools')
    }

    await school.delete()

    session.flash('success', 'Sekolah berhasil dihapus')
    return response.redirect().toRoute('admin.schools.index')
  }
}
