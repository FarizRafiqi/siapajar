import type { HttpContext } from '@adonisjs/core/http'
import PaudAssessment from '#models/paud_assessment'
import SchoolClass from '#models/school_class'
import Student from '#models/student'
import Semester from '#models/semester'
import { createPaudAssessmentValidator, updatePaudAssessmentValidator } from '#validators/paud_assessment'
import LearningObjective from '#models/learning_objective'

const TYPE_LABELS: Record<string, string> = {
  checklist: 'Ceklis',
  anecdotal_note: 'Catatan Anekdot',
  work_sample: 'Hasil Karya',
  photo_series: 'Foto Berseri',
}

export default class PaudAssessmentsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const assessments = await PaudAssessment.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .preload('student')
      .orderBy('date', 'desc')

    const classes = await SchoolClass.query()
      .where('user_id', user.id)
      .preload('students')
      .orderBy('name')
    const curriculumObjectives = await LearningObjective.query()
      .where((q) => q.whereNull('user_id').orWhere('user_id', user.id))
      .preload('indicators')
      .orderBy('code')

    return inertia.render('dashboard/paud-assessments/index', {
      assessments: assessments.map((a) => a.toJSON()),
      classes: classes.map((c) => c.toJSON()),
      typeLabels: TYPE_LABELS,
      curriculumObjectives: curriculumObjectives.map((objective) => objective.toJSON()),
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createPaudAssessmentValidator)

    const schoolClass = await SchoolClass.query()
      .where('id', data.classId)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      session.flash('error', 'Kelompok tidak ditemukan')
      return response.redirect().back()
    }

    const student = await Student.query()
      .where('id', data.studentId)
      .where('class_id', data.classId)
      .first()

    if (!student) {
      session.flash('error', 'Siswa tidak ditemukan di kelompok ini')
      return response.redirect().back()
    }

    if (data.learningObjectiveId) {
      const objective = await LearningObjective.query().where('id', data.learningObjectiveId).where((q) => q.whereNull('user_id').orWhere('user_id', user.id)).first()
      if (!objective) {
        session.flash('error', 'TP yang dipilih tidak valid')
        return response.redirect().back()
      }
    }

    let semesterId = data.semesterId ?? null
    if (!semesterId) {
      const activeSemester = await Semester.query()
        .where('academic_year_id', schoolClass.academicYearId)
        .where('is_active', true)
        .first()
      semesterId = activeSemester?.id ?? null
    }

    await PaudAssessment.create({
      userId: user.id,
      classId: data.classId,
      semesterId,
      studentId: data.studentId,
      type: data.type,
      date: data.date,
      content: data.content ?? {},
      learningObjectiveId: data.learningObjectiveId ?? null,
      iktpIndicatorId: data.iktpIndicatorId ?? null,
      achievementStatus: data.achievementStatus ?? null,
      activity: data.activity ?? null,
      teacherNote: data.teacherNote ?? null,
      evidenceUrl: data.evidenceUrl ?? null,
      evidenceType: data.evidenceType ?? null,
    })

    session.flash('success', `${TYPE_LABELS[data.type]} berhasil dicatat`)
    return response.redirect().back()
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await PaudAssessment.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!assessment) {
      return response.redirect('/paud-assessments')
    }

    const data = await request.validateUsing(updatePaudAssessmentValidator)
    await assessment.merge(data).save()

    session.flash('success', 'Asesmen berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await PaudAssessment.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!assessment) {
      return response.redirect('/paud-assessments')
    }

    await assessment.delete()

    session.flash('success', 'Asesmen berhasil dihapus')
    return response.redirect().toRoute('paud-assessments.index')
  }
}
