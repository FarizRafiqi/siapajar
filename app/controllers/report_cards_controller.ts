import type { HttpContext } from '@adonisjs/core/http'
import { reportCardService } from '#services/report_card_service'
import { EXPORT_CONTENT_TYPES, sendExport, wantsInlinePreview } from '#services/export_file_service'

export default class ReportCardsController {
  async index({ inertia, auth }: HttpContext) {
    return inertia.render(
      'dashboard/report-cards/index',
      await reportCardService.getIndexData(auth.user!)
    )
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const data = await reportCardService.getShowData(
      Number(params.classId),
      Number(params.semesterId),
      auth.user!
    )
    if (!data) return response.redirect('/report-cards')

    return inertia.render('dashboard/report-cards/show', data)
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const classId = Number(params.classId)
    const semesterId = Number(params.semesterId)
    const inline = wantsInlinePreview(request)
    const result = await reportCardService.getStudentExportData(
      classId,
      semesterId,
      Number(params.studentId),
      auth.user!,
      'pdf',
      inline
    )

    if (result.status === 'context_not_found') return response.redirect('/report-cards')
    if (result.status === 'student_not_found') {
      return response.redirect(`/report-cards/${classId}/${semesterId}`)
    }

    return sendExport(response, result.buffer, EXPORT_CONTENT_TYPES.pdf, result.filename, {
      inline,
    })
  }

  async exportDocx({ params, response, auth }: HttpContext) {
    const classId = Number(params.classId)
    const semesterId = Number(params.semesterId)
    const result = await reportCardService.getStudentExportData(
      classId,
      semesterId,
      Number(params.studentId),
      auth.user!,
      'docx'
    )

    if (result.status === 'context_not_found') return response.redirect('/report-cards')
    if (result.status === 'student_not_found') {
      return response.redirect(`/report-cards/${classId}/${semesterId}`)
    }

    return sendExport(response, result.buffer, EXPORT_CONTENT_TYPES.docx, result.filename)
  }

  async saveNarrative({ params, request, response, session, auth }: HttpContext) {
    const classId = Number(params.classId)
    const semesterId = Number(params.semesterId)
    const result = await reportCardService.saveNarrative(
      auth.user!.id,
      classId,
      semesterId,
      Number(params.studentId),
      request.only(['element', 'content'])
    )

    if (result === 'context_not_found') return response.redirect('/report-cards')
    if (result === 'invalid_content') {
      session.flash('error', 'Isi narasi dan elemen terlebih dahulu')
      return response.redirect().back()
    }

    session.flash('success', 'Narasi berhasil disimpan sebagai draft')
    return response.redirect().back()
  }

  async generateNarratives({ params, response, session, auth }: HttpContext) {
    const classId = Number(params.classId)
    const semesterId = Number(params.semesterId)
    const result = await reportCardService.generateNarratives(auth.user!.id, classId, semesterId)
    if (result.status === 'context_not_found') return response.redirect('/report-cards')

    session.flash(
      'success',
      `Pembuatan draft narasi dimulai (job ${result.jobId}). Tinjau dan edit sebelum menyetujui.`
    )
    return response.redirect().back()
  }

  async approveNarrative({ params, response, session, auth }: HttpContext) {
    const approved = await reportCardService.approveNarrative(params.id, auth.user!.id)
    if (!approved) return response.redirect('/report-cards')

    session.flash('success', 'Narasi disetujui')
    return response.redirect().back()
  }
}
