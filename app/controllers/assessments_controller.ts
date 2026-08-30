import type { HttpContext } from '@adonisjs/core/http'
import { createAssessmentValidator, updateScoresValidator } from '#validators/assessment'
import { assessmentService } from '#services/assessment_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

export default class AssessmentsController {
  async index({ inertia, auth }: HttpContext) {
    const data = await assessmentService.getIndexData(auth.user!)

    return inertia.render('dashboard/assessments/index', data)
  }

  async store({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(createAssessmentValidator)
    const assessment = await assessmentService.create(auth.user!, data)

    if (!assessment) {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    session.flash('success', 'Penilaian berhasil dibuat')
    return response.redirect().toRoute('assessments.show', { id: assessment.id })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const data = await assessmentService.getShowData(auth.user!.id, params.id)

    if (!data) {
      return response.redirect('/assessments')
    }

    return inertia.render('dashboard/assessments/show', data)
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await assessmentService.getExportData(user, params.id, 'xlsx')

    if (!data) {
      return response.redirect('/assessments')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.xlsx,
      exportFilename(['Penilaian', data.assessment.title], 'xlsx')
    )
  }

  async exportDocx({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await assessmentService.getExportData(user, params.id, 'docx')

    if (!data) {
      return response.redirect('/assessments')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['Penilaian', data.assessment.title], 'docx')
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const inline = wantsInlinePreview(request)
    const data = await assessmentService.getExportData(user, params.id, 'pdf', !inline)

    if (!data) {
      return response.redirect('/assessments')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Penilaian', data.assessment.title], 'pdf'),
      { inline }
    )
  }

  async updateScores({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const exists = await assessmentService.exists(user.id, params.id)

    if (!exists) {
      return response.redirect('/assessments')
    }

    const { scores } = await request.validateUsing(updateScoresValidator)
    await assessmentService.updateScores(user.id, params.id, scores)

    session.flash('success', 'Nilai berhasil disimpan')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const deleted = await assessmentService.destroy(auth.user!.id, params.id)

    if (!deleted) {
      return response.redirect('/assessments')
    }

    session.flash('success', 'Penilaian berhasil dihapus')
    return response.redirect().toRoute('assessments.index')
  }
}
