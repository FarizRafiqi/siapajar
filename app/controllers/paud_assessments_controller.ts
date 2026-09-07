import type { HttpContext } from '@adonisjs/core/http'
import {
  createPaudAssessmentValidator,
  exportBundlePaudAssessmentValidator,
  generateAiPaudAssessmentValidator,
  updatePaudAssessmentValidator,
} from '#validators/paud_assessment'
import { paudAssessmentService } from '#services/paud_assessment_service'
import { EXPORT_CONTENT_TYPES, sendExport, wantsInlinePreview } from '#services/export_file_service'

function isApi(ctx: HttpContext): boolean {
  return (
    ctx.request.url().startsWith('/api/') ||
    (ctx.request.accepts(['json', 'html']) === 'json' && !ctx.request.header('x-inertia'))
  )
}

export default class PaudAssessmentsController {
  async index(ctx: HttpContext) {
    const user = await paudAssessmentService.resolveUser(
      ctx.request.header('authorization'),
      ctx.auth?.user || null
    )
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const apiResponse = isApi(ctx)
    const data = await paudAssessmentService.getIndexData(user, apiResponse)
    if (apiResponse) {
      return ctx.response.ok({ status: 'success', data })
    }

    return ctx.inertia.render('dashboard/paud-assessments/index', data)
  }

  /**
   * Mobile API: GET /api/v1/students/:id/timeline
   */
  async getStudentTimeline(ctx: HttpContext) {
    const user = await paudAssessmentService.resolveUser(
      ctx.request.header('authorization'),
      ctx.auth?.user || null
    )
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const data = await paudAssessmentService.getStudentTimeline(ctx.params.id)
    return ctx.response.ok({ status: 'success', data })
  }

  /**
   * Mobile API: POST /api/v1/assessments/quick-capture
   */
  async quickCapture(ctx: HttpContext) {
    const user = await paudAssessmentService.resolveUser(
      ctx.request.header('authorization'),
      ctx.auth?.user || null
    )
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const result = await paudAssessmentService.quickCapture(user, ctx.request)
    if (result.status === 'empty') {
      return ctx.response.badRequest({ message: 'Minimal 1 siswa wajib dipilih' })
    }

    return ctx.response.created({
      status: 'success',
      message: `${result.assessmentIds.length} Asesmen berhasil dicatat`,
      data: { assessmentIds: result.assessmentIds },
    })
  }

  /**
   * Endpoint AI drafting khusus untuk Asesmen PAUD/RA (memotong kuota paket aktif user)
   */
  async generateAi({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(generateAiPaudAssessmentValidator)
    const result = await paudAssessmentService.generateAi(user, data)

    if (result.status === 'success') {
      return response.json({ success: true, result: result.result })
    }

    if (result.status === 'invalid_type') {
      return response.badRequest({ error: 'Jenis asesmen tidak valid' })
    }

    return response.badRequest({ error: result.error })
  }

  async export({ params, response, auth }: HttpContext) {
    const data = await paudAssessmentService.getExportData(auth.user!, params.id, 'docx')
    if (!data) return response.redirect('/paud-assessments')

    return sendExport(response, data.buffer, EXPORT_CONTENT_TYPES.docx, data.filename)
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const inline = wantsInlinePreview(request)
    const data = await paudAssessmentService.getExportData(auth.user!, params.id, 'pdf', inline)
    if (!data) return response.redirect('/paud-assessments')

    return sendExport(response, data.buffer, EXPORT_CONTENT_TYPES.pdf, data.filename, { inline })
  }

  async exportBundle({ request, response, auth }: HttpContext) {
    const filters = await request.validateUsing(exportBundlePaudAssessmentValidator)
    const data = await paudAssessmentService.getBundleExportData(auth.user!, filters, 'docx')
    if (!data) return response.redirect().back()

    return sendExport(response, data.buffer, EXPORT_CONTENT_TYPES.docx, data.filename)
  }

  async exportBundlePdf({ request, response, auth }: HttpContext) {
    const filters = await request.validateUsing(exportBundlePaudAssessmentValidator)
    const inline = wantsInlinePreview(request)
    const data = await paudAssessmentService.getBundleExportData(auth.user!, filters, 'pdf', inline)
    if (!data) return response.redirect().back()

    return sendExport(response, data.buffer, EXPORT_CONTENT_TYPES.pdf, data.filename, { inline })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(createPaudAssessmentValidator)
    const result = await paudAssessmentService.create(auth.user!, data, request)

    if (result.status === 'missing_class') {
      session.flash('error', 'Kelompok tidak ditemukan')
      return response.redirect().back()
    }

    if (result.status === 'missing_student') {
      session.flash('error', 'Siswa tidak ditemukan di kelompok ini')
      return response.redirect().back()
    }

    if (result.status === 'invalid_learning_objective') {
      session.flash('error', 'TP yang dipilih tidak valid')
      return response.redirect().back()
    }

    session.flash('success', `${result.typeLabel} berhasil dicatat`)
    return response.redirect().back()
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const exists = await paudAssessmentService.exists(auth.user!.id, params.id)
    if (!exists) return response.redirect('/paud-assessments')

    const data = await request.validateUsing(updatePaudAssessmentValidator)
    await paudAssessmentService.update(auth.user!.id, params.id, data)

    session.flash('success', 'Asesmen berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const deleted = await paudAssessmentService.destroy(auth.user!.id, params.id)
    if (!deleted) return response.redirect('/paud-assessments')

    session.flash('success', 'Asesmen berhasil dihapus')
    return response.redirect().toRoute('paud-assessments.index')
  }
}
