import type { HttpContext } from '@adonisjs/core/http'
import SemesterPlan from '#models/semester_plan'
import SchoolClass from '#models/school_class'
import Semester from '#models/semester'
import Subject from '#models/subject'
import { createSemesterPlanValidator, updateSemesterPlanValidator } from '#validators/semester_plan'
import { generateSemesterPlanValidator } from '#validators/generate'
import { exportSemesterPlan } from '#services/export_service'
import { exportSemesterPlanPdf } from '#services/pdf_export_service'
import { normalizeStringArraySections, AiServiceError } from '#services/ai_service'
import { semesterPlanPrompt } from '#services/ai_prompts'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { callAiJsonForUser } from '#services/user_ai_service'
import LearningSequence from '#models/learning_sequence'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

export default class SemesterPlansController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const semesterPlans = await SemesterPlan.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .preload('semester')
      .orderBy('created_at', 'desc')

    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')

    const semesters = await Semester.query().where('isActive', true).preload('academicYear')

    const subjects = await Subject.query()
      .where('user_id', user.id)
      .where('education_level', user.educationLevel || 'sd')
      .where('is_active', true)
      .orderBy('name')
    const sequences = await LearningSequence.query().where('user_id', user.id).orderBy('title')

    return inertia.render('dashboard/semester-plans/index', {
      semesterPlans: semesterPlans.map((p) => p.toJSON()),
      classes: classes.map((c) => c.toJSON()),
      semesters: semesters.map((s) => s.toJSON()),
      subjects: subjects.map((s) => s.toJSON()),
      sequences: sequences.map((s) => s.toJSON()),
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const semesterPlan = await SemesterPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .preload('semester')
      .first()

    if (!semesterPlan) {
      return response.redirect('/semester-plans')
    }

    return inertia.render('dashboard/semester-plans/show', {
      semesterPlan: semesterPlan.toJSON(),
    })
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const semesterPlan = await SemesterPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!semesterPlan) {
      return response.redirect('/semester-plans')
    }

    const buffer = await exportSemesterPlan(semesterPlan, user)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['Promes', semesterPlan.subject], 'docx')
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const semesterPlan = await SemesterPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!semesterPlan) {
      return response.redirect('/semester-plans')
    }

    const buffer = await exportSemesterPlanPdf(semesterPlan, user, !wantsInlinePreview(request))
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Promes', semesterPlan.subject], 'pdf'),
      { inline: wantsInlinePreview(request) }
    )
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createSemesterPlanValidator)

    await SemesterPlan.create({
      ...data,
      userId: user.id,
    })

    session.flash('success', 'Program Semester berhasil dibuat')
    return response.redirect().toRoute('semester-plans.index')
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const semesterPlan = await SemesterPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!semesterPlan) {
      return response.redirect('/semester-plans')
    }

    const data = await request.validateUsing(updateSemesterPlanValidator)
    await semesterPlan.merge(data).save()

    session.flash('success', 'Program Semester berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const semesterPlan = await SemesterPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!semesterPlan) {
      return response.redirect('/semester-plans')
    }

    await semesterPlan.delete()

    session.flash('success', 'Program Semester berhasil dihapus')
    return response.redirect().toRoute('semester-plans.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { classId, semesterId, subject, learningSequenceId } = await request.validateUsing(
      generateSemesterPlanValidator
    )

    // Pastikan kelas milik user yang login
    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    const semester = await Semester.find(semesterId)
    if (!semester) {
      session.flash('error', 'Semester tidak ditemukan')
      return response.redirect().back()
    }

    const curriculum = await getCurriculumContext(user.id, learningSequenceId)
    let content: Record<string, any>
    try {
      const prompt = semesterPlanPrompt({ subject })
      const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      content = normalizeStringArraySections(raw, ['minggu', 'kegiatan', 'target', 'materi'])
      content.curriculum = curriculum
    } catch (error) {
      session.flash(
        'error',
        error instanceof AiServiceError ? error.message : 'Gagal generate Promes. Coba lagi.'
      )
      return response.redirect().back()
    }

    const semesterPlan = await SemesterPlan.create({
      userId: user.id,
      classId,
      semesterId,
      subject,
      content,
    })

    session.flash('success', 'Program Semester berhasil digenerate')
    return response.redirect().toRoute('semester-plans.show', { id: semesterPlan.id })
  }
}
