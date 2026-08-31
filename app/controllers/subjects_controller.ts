import type { HttpContext } from '@adonisjs/core/http'
import { createSubjectValidator, updateSubjectValidator } from '#validators/subject'
import { subjectService } from '#services/subject_service'

export { DEFAULT_SUBJECTS } from '#services/subject_service'

export default class SubjectsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const subjects = await subjectService.listForUser(
      user.id,
      (user.educationLevel || 'sd') as 'tk' | 'sd'
    )

    return inertia.render('dashboard/subjects/index', {
      subjects: subjects.map((s) => s.toJSON()),
      educationLevel: user.educationLevel,
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createSubjectValidator)

    const created = await subjectService.create(user.id, data)
    if (!created) {
      session.flash('error', `Mata pelajaran "${data.name}" sudah ada`)
      return response.redirect().back()
    }

    session.flash('success', 'Mata pelajaran berhasil ditambahkan')
    return response.redirect().back()
  }

  /**
   * Tambah mata pelajaran default sesuai jenjang dalam satu request.
   * Menggantikan loop router.post di frontend yang saling membatalkan.
   */
  async storeDefaults({ response, session, auth }: HttpContext) {
    const user = auth.user!
    const educationLevel = (user.educationLevel || 'sd') as 'tk' | 'sd'
    const defaults = await subjectService.storeDefaults(user.id, educationLevel)

    session.flash('success', `${defaults} mata pelajaran default berhasil ditambahkan`)
    return response.redirect().back()
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(updateSubjectValidator)
    const updated = await subjectService.update(user.id, params.id, data)
    if (!updated) {
      return response.redirect('/subjects')
    }

    session.flash('success', 'Mata pelajaran berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const deleted = await subjectService.delete(user.id, params.id)
    if (!deleted) {
      return response.redirect('/subjects')
    }

    session.flash('success', 'Mata pelajaran berhasil dihapus')
    return response.redirect().back()
  }
}
