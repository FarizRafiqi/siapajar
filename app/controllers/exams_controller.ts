import type { HttpContext } from '@adonisjs/core/http'
import Exam from '#models/exam'
import SchoolClass from '#models/school_class'
import Subject from '#models/subject'
import { createExamValidator, updateExamValidator } from '#validators/exam'
import { generateExamValidator } from '#validators/generate'
import { exportExam } from '#services/export_service'

/** Label Indonesia untuk kode jenis soal yang tersimpan di database. */
const EXAM_TYPE_LABELS: Record<'midterm' | 'final' | 'daily' | 'summative', string> = {
  midterm: 'PTS',
  final: 'PAS',
  daily: 'Ulangan Harian',
  summative: 'Sumatif',
}

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

    const subjects = await Subject.query()
      .where('user_id', user.id)
      .where('education_level', user.educationLevel || 'sd')
      .where('is_active', true)
      .orderBy('name')

    return inertia.render('dashboard/exams/index', {
      exams: exams.map((e) => e.toJSON()),
      classes: classes.map((c) => c.toJSON()),
      subjects: subjects.map((s) => s.toJSON()),
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
      exam: exam.toJSON(),
    })
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!exam) {
      return response.redirect('/exams')
    }

    const buffer = await exportExam(exam, user)
    response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    response.header('Content-Disposition', `attachment; filename="${exam.title}.docx"`)
    return response.send(buffer)
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
    const { classId, subject, type, topic, questionCount } =
      await request.validateUsing(generateExamValidator)

    // Pastikan kelas milik user yang login
    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    // Future implementation: Integrate with AI service (9router)
    const questions = Array.from({ length: questionCount }, (_, i) => ({
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
      title: `${EXAM_TYPE_LABELS[type]} ${subject} - ${topic}`,
      type,
      questions,
      status: 'draft',
    })

    session.flash('success', 'Soal berhasil digenerate')
    return response.redirect().toRoute('exams.show', { id: exam.id })
  }
}
