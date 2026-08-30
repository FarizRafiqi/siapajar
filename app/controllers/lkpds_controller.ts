import type { HttpContext } from '@adonisjs/core/http'
import { generateLkpdValidator } from '#validators/generate'
import { lkpdService } from '#services/lkpd_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

export default class LkpdsController {
  async index({ inertia, auth }: HttpContext) {
    const data = await lkpdService.getIndexData(auth.user!)

    return inertia.render('dashboard/lkpd/index', data)
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const data = await lkpdService.getShowData(auth.user!.id, params.id)

    if (!data) {
      return response.redirect('/lkpd')
    }

    return inertia.render('dashboard/lkpd/show', data)
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await lkpdService.getExportData(user, params.id, 'docx')

    if (!data) {
      return response.redirect('/lkpd')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['LKPD', data.lkpd.title], 'docx')
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const inline = wantsInlinePreview(request)
    const data = await lkpdService.getExportData(user, params.id, 'pdf', !inline)

    if (!data) {
      return response.redirect('/lkpd')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['LKPD', data.lkpd.title], 'pdf'),
      { inline }
    )
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(generateLkpdValidator)
    const result = await lkpdService.generate(auth.user!, data)

    if (result.status === 'missing_class') {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    if (result.status === 'insufficient_credits') {
      session.flash('error', 'Saldo kredit Anda habis. Silakan top-up kredit untuk melanjutkan.')
      return response.redirect().back()
    }

    if (result.status === 'generation_error') {
      session.flash('error', result.message)
      return response.redirect().back()
    }

    session.flash('success', 'LKPD / Lembar Aktivitas Anak berhasil digenerate')
    return response.redirect().toRoute('lkpd.show', { id: result.lkpd.id })
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const deleted = await lkpdService.destroy(auth.user!.id, params.id)

    if (!deleted) {
      return response.redirect('/lkpd')
    }

    session.flash('success', 'LKPD berhasil dihapus')
    return response.redirect().toRoute('lkpd.index')
  }
}
