import type { HttpContext } from '@adonisjs/core/http'
import Assessment from '#models/assessment'
import Score from '#models/score'
import SchoolClass from '#models/school_class'
import Student from '#models/student'
import Subject from '#models/subject'
import Semester from '#models/semester'
import { createAssessmentValidator, updateScoresValidator } from '#validators/assessment'
import { exportAssessmentScores } from '#services/xlsx_export_service'

export default class AssessmentsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const assessments = await Assessment.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .orderBy('date', 'desc')

    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')

    const subjects = await Subject.query()
      .where('user_id', user.id)
      .where('education_level', user.educationLevel || 'sd')
      .where('is_active', true)
      .orderBy('name')

    return inertia.render('dashboard/assessments/index', {
      assessments: assessments.map((a) => a.toJSON()),
      classes: classes.map((c) => c.toJSON()),
      subjects: subjects.map((s) => s.toJSON()),
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createAssessmentValidator)

    const schoolClass = await SchoolClass.query()
      .where('id', data.classId)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    let semesterId = data.semesterId ?? null
    if (!semesterId) {
      const activeSemester = await Semester.query()
        .where('academic_year_id', schoolClass.academicYearId)
        .where('is_active', true)
        .first()
      semesterId = activeSemester?.id ?? null
    }

    const assessment = await Assessment.create({
      userId: user.id,
      classId: data.classId,
      semesterId,
      subject: data.subject,
      type: data.type,
      title: data.title,
      learningObjective: data.learningObjective ?? null,
      date: data.date,
    })

    const students = await Student.query().where('class_id', data.classId)
    for (const student of students) {
      await Score.create({
        assessmentId: assessment.id,
        studentId: student.id,
        value: null,
        note: null,
      })
    }

    session.flash('success', 'Penilaian berhasil dibuat')
    return response.redirect().toRoute('assessments.show', { id: assessment.id })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const assessment = await Assessment.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .preload('scores', (q) => q.preload('student'))
      .first()

    if (!assessment) {
      return response.redirect('/assessments')
    }

    return inertia.render('dashboard/assessments/show', {
      assessment: assessment.toJSON(),
    })
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await Assessment.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .preload('scores', (q) => q.preload('student'))
      .first()

    if (!assessment) {
      return response.redirect('/assessments')
    }

    const buffer = exportAssessmentScores(assessment, user)
    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response.header('Content-Disposition', `attachment; filename="${assessment.title}.xlsx"`)
    return response.send(buffer)
  }

  async updateScores({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await Assessment.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!assessment) {
      return response.redirect('/assessments')
    }

    const { scores } = await request.validateUsing(updateScoresValidator)

    for (const s of scores) {
      await Score.query()
        .where('assessment_id', assessment.id)
        .where('student_id', s.studentId)
        .update({ value: s.value, note: s.note ?? null })
    }

    session.flash('success', 'Nilai berhasil disimpan')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await Assessment.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!assessment) {
      return response.redirect('/assessments')
    }

    await assessment.delete()

    session.flash('success', 'Penilaian berhasil dihapus')
    return response.redirect().toRoute('assessments.index')
  }
}
