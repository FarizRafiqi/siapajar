import type { HttpContext } from '@adonisjs/core/http'
import { generateMediaModuleValidator } from '#validators/generate'
import { mediaModuleService } from '#services/media_module_service'
import { safeFilename } from '#services/media_module_export_service'

export default class MediaModulesController {
  async index({ inertia, auth }: HttpContext) {
    const data = await mediaModuleService.getIndexData(auth.user!)

    return inertia.render('dashboard/media-modules/index', data)
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const data = await mediaModuleService.getShowData(auth.user!.id, params.id)

    if (!data) {
      return response.redirect('/media-modules')
    }

    return inertia.render('dashboard/media-modules/show', data)
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(generateMediaModuleValidator)
    const result = await mediaModuleService.generate(auth.user!, data)

    if (result.status === 'missing_class') {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    if (result.status === 'generation_error') {
      session.flash('error', result.message)
      return response.redirect().back()
    }

    session.flash('success', 'Media Ajar berhasil dibuat')
    if (result.imageQuotaWarning) {
      session.flash(
        'error',
        'Sebagian ilustrasi belum tersedia karena quota gambar atau provider AI.'
      )
    }
    return response.redirect().toRoute('media-modules.show', { id: result.mediaModule.id })
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const deleted = await mediaModuleService.destroy(auth.user!.id, params.id)

    if (!deleted) {
      return response.redirect('/media-modules')
    }

    session.flash('success', 'Media Ajar berhasil dihapus')
    return response.redirect().toRoute('media-modules.index')
  }

  async exportPptx({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const inline = request.input('disposition') === 'inline'
    const data = await mediaModuleService.getExportData(user, params.id, 'pptx', !inline)

    if (!data) {
      return response.notFound({ message: 'Media Ajar tidak ditemukan' })
    }

    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    )
    response.header(
      'Content-Disposition',
      `${inline ? 'inline' : 'attachment'}; filename="${safeFilename(data.mediaModule.title)}.pptx"`
    )
    return response.send(data.buffer)
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const inline = request.input('disposition') === 'inline'
    const data = await mediaModuleService.getExportData(user, params.id, 'pdf', !inline)

    if (!data) {
      return response.notFound({ message: 'Media Ajar tidak ditemukan' })
    }

    response.header('Content-Type', 'application/pdf')
    response.header(
      'Content-Disposition',
      `${inline ? 'inline' : 'attachment'}; filename="${safeFilename(data.mediaModule.title)}.pdf"`
    )
    return response.send(data.buffer)
  }
}
