import type { HttpContext } from '@adonisjs/core/http'
import Exam from '#models/exam'
import SchoolClass from '#models/school_class'
import { createExamValidator, updateExamValidator } from '#validators/exam'

export default class ExamsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const exams = await Exam.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .orderBy('created_at', 'desc')

    const classes = await SchoolClass.query()
      .where('user_id', user.id)
      .orderBy('name')

    return inertia.render('dashboard/exams/index', {
      soal: exams,
      kelas: classes,
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .first()

    if (!exam) {
      return response.redirect('/exams')
    }

    return inertia.render('dashboard/exams/show', {
      soal: exam,
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createExamValidator)

    await Exam.create({
      ...data,
      userId: user.id,
      status: 'draft',
    })

    session.flash('success', 'Soal berhasil dibuat')
    return response.redirect().toRoute('exams.index')
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!exam) {
      return response.redirect('/exams')
    }

    const data = await request.validateUsing(updateExamValidator)
    await exam.merge(data).save()

    session.flash('success', 'Soal berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!exam) {
      return response.redirect('/exams')
    }

    await exam.delete()

    session.flash('success', 'Soal berhasil dihapus')
    return response.redirect().toRoute('exams.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { classId, subject, type, topic, questionCount } = request.only([
      'classId',
      'subject',
      'type',
      'topic',
      'questionCount',
    ])

    // Future implementation: Integrate with AI service (OpenAI)
    const questions = Array.from({ length: questionCount || 10 }, (_, i) => ({
      id: i + 1,
      type: 'multiple_choice',
      question: `Soal ${i + 1} tentang ${topic}`,
      options: ['A', 'B', 'C', 'D'].map((opt) => `${opt}. Pilihan ${opt}`),
      answer: 'A',
      explanation: '',
    }))

    const exam = await Exam.create({
      userId: user.id,
      classId,
      title: `${type} ${subject} - ${topic}`,
      type,
      questions,
      status: 'draft',
    })

    session.flash('success', 'Soal berhasil digenerate')
    return response.redirect().toRoute('exams.show', { id: exam.id })
  }
}
