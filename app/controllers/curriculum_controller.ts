import type { HttpContext } from '@adonisjs/core/http'
import {
  createIndicatorValidator,
  createObjectiveValidator,
  createSequenceValidator,
  updateSequenceValidator,
} from '#validators/curriculum'
import { curriculumService } from '#services/curriculum_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

export default class CurriculumController {
  async index({ inertia, auth }: HttpContext) {
    return inertia.render(
      'dashboard/curriculum/index',
      await curriculumService.getIndexData(auth.user!)
    )
  }

  async print({ inertia, auth }: HttpContext) {
    return inertia.render(
      'dashboard/curriculum/print',
      await curriculumService.getPrintData(auth.user!)
    )
  }

  async export({ response, auth }: HttpContext) {
    const user = auth.user!
    const buffer = await curriculumService.exportDocx(user)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(
        ['Matriks_CP_TP_ATP', (user as any).institutionName || user.schoolName || 'Sekolah'],
        'docx'
      )
    )
  }

  async exportPdf({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const isInline = wantsInlinePreview(request)
    const buffer = await curriculumService.exportPdf(user, !isInline)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(
        ['Matriks_CP_TP_ATP', (user as any).institutionName || user.schoolName || 'Sekolah'],
        'pdf'
      ),
      { inline: isInline }
    )
  }

  async storeObjective({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createObjectiveValidator)
    const created = await curriculumService.storeObjective(user, data)
    if (!created) {
      session.flash('error', 'CP tidak ditemukan')
      return response.redirect().back()
    }

    session.flash('success', 'TP berhasil dibuat')
    return response.redirect().back()
  }

  async destroyObjective({ params, response, session, auth }: HttpContext) {
    const deleted = await curriculumService.destroyObjective(auth.user!, params.id)
    session.flash(
      deleted ? 'success' : 'error',
      deleted ? 'Tujuan Pembelajaran (TP) berhasil dihapus' : 'Tujuan Pembelajaran tidak ditemukan'
    )
    return response.redirect().back()
  }

  async storeSequence({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(createSequenceValidator)
    await curriculumService.storeSequence(auth.user!, data)
    session.flash('success', 'ATP berhasil disimpan sebagai draft')
    return response.redirect().back()
  }

  async updateSequence({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    if (!(await curriculumService.sequenceExists(user.id, params.id))) {
      return response.redirect('/curriculum')
    }

    const data = await request.validateUsing(updateSequenceValidator)
    const updated = await curriculumService.updateSequence(user, params.id, data)
    if (!updated) return response.redirect('/curriculum')

    session.flash('success', 'ATP berhasil diperbarui')
    return response.redirect().back()
  }

  async destroySequence({ params, response, session, auth }: HttpContext) {
    const deleted = await curriculumService.destroySequence(auth.user!.id, params.id)
    if (deleted) session.flash('success', 'Alur ATP berhasil dihapus')
    return response.redirect().back()
  }

  async storeIndicator({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(createIndicatorValidator)
    const created = await curriculumService.storeIndicator(auth.user!, data)
    if (!created) {
      session.flash('error', 'TP tidak ditemukan')
      return response.redirect().back()
    }

    session.flash('success', 'IKTP berhasil ditambahkan')
    return response.redirect().back()
  }

  async seedPresets({ response, session, auth }: HttpContext) {
    await curriculumService.seedPresets(auth.user!)
    session.flash('success', 'Contoh ATP & IKTP siap pakai berhasil dimuat!')
    return response.redirect().back()
  }

  async resetPresets({ response, session, auth }: HttpContext) {
    await curriculumService.resetPresets(auth.user!.id)
    session.flash('success', 'Data ATP & IKTP berhasil di-reset ke kondisi awal!')
    return response.redirect().back()
  }
}
