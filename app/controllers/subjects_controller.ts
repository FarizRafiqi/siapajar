import type { HttpContext } from '@adonisjs/core/http'
import Subject from '#models/subject'
import { createSubjectValidator, updateSubjectValidator } from '#validators/subject'

export default class SubjectsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const subjects = await Subject.query()
      .where('user_id', user.id)
      .where('education_level', user.educationLevel || 'sd')
      .orderBy('grade_level', 'asc')
      .orderBy('name', 'asc')

    return inertia.render('dashboard/subjects/index', {
      subjects,
      educationLevel: user.educationLevel,
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createSubjectValidator)

    await Subject.create({
      ...data,
      userId: user.id,
    })

    session.flash('success', 'Mata pelajaran berhasil ditambahkan')
    return response.redirect().back()
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const subject = await Subject.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!subject) {
      return response.redirect('/dashboard/subjects')
    }

    const data = await request.validateUsing(updateSubjectValidator)
    await subject.merge(data).save()

    session.flash('success', 'Mata pelajaran berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const subject = await Subject.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!subject) {
      return response.redirect('/dashboard/subjects')
    }

    await subject.delete()

    session.flash('success', 'Mata pelajaran berhasil dihapus')
    return response.redirect().back()
  }
}
