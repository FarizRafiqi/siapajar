import type { HttpContext } from '@adonisjs/core/http'
import { createAssessmentValidator, updateScoresValidator } from '#validators/assessment'
import { exportAssessmentScores } from '#services/xlsx_export_service'
import { exportAssessment as exportAssessmentDocx } from '#services/export_service'
import { exportAssessmentPdf } from '#services/pdf_export_service'
import { assertEntitled, recordUsage } from '#services/entitlement_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'
import { assessmentService } from '#services/assessment_service'

export default class AssessmentsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const { assessments, classes, subjects } = await assessmentService.getIndexData(
      user.id,
      user.educationLevel || 'sd'
    )

    return inertia.render('dashboard/assessments/index', {
      assessments: assessments.map((a) => a.toJSON()),
      classes: classes.map((c) => c.toJSON()),
      subjects: subjects.map((s) => s.toJSON()),
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createAssessmentValidator)

    const result = await assessmentService.createAssessment(user.id, data)

    if (result.status === 'class_not_found') {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    session.flash('success', 'Penilaian berhasil dibuat')
    return response.redirect().toRoute('assessments.show', { id: result.assessment.id })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const assessment = await assessmentService.findForUser(params.id, user.id, true)

    if (!assessment) {
      return response.redirect('/assessments')
    }

    return inertia.render('dashboard/assessments/show', {
      assessment: assessment.toJSON(),
    })
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await assessmentService.findForUser(params.id, user.id, true)

    if (!assessment) {
      return response.redirect('/assessments')
    }

    await assertEntitled(user, 'export_xlsx')
    await recordUsage(user.id, 'export_xlsx')
    const buffer = exportAssessmentScores(assessment, user)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.xlsx,
      exportFilename(['Penilaian', assessment.title], 'xlsx')
    )
  }

  async exportDocx({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await assessmentService.findForUser(params.id, user.id, true)

    if (!assessment) return response.redirect('/assessments')
    const buffer = await exportAssessmentDocx(assessment, user)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['Penilaian', assessment.title], 'docx')
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await assessmentService.findForUser(params.id, user.id, true)

    if (!assessment) return response.redirect('/assessments')
    const buffer = await exportAssessmentPdf(assessment, user, !wantsInlinePreview(request))
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Penilaian', assessment.title], 'pdf'),
      { inline: wantsInlinePreview(request) }
    )
  }

  async updateScores({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { scores } = await request.validateUsing(updateScoresValidator)

    const updated = await assessmentService.updateScores(params.id, user.id, scores)
    if (!updated) {
      return response.redirect('/assessments')
    }

    session.flash('success', 'Nilai berhasil disimpan')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const deleted = await assessmentService.deleteAssessment(params.id, user.id)

    if (!deleted) {
      return response.redirect('/assessments')
    }

    session.flash('success', 'Penilaian berhasil dihapus')
    return response.redirect().toRoute('assessments.index')
  }
}
