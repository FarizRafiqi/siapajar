import type { HttpContext } from '@adonisjs/core/http'
import {
  createTeachingModuleValidator,
  updateTeachingModuleValidator,
} from '#validators/teaching_module'
import { generateTeachingModuleValidator } from '#validators/generate'
import { teachingModuleService } from '#services/teaching_module_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

export default class TeachingModulesController {
  async index({ inertia, auth }: HttpContext) {
    const data = await teachingModuleService.getIndexData(auth.user!)

    return inertia.render('dashboard/teaching-modules/index', data)
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const data = await teachingModuleService.getShowData(auth.user!.id, params.id)

    if (!data) {
      return response.redirect('/teaching-modules')
    }

    return inertia.render('dashboard/teaching-modules/show', data)
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await teachingModuleService.getExportData(user, params.id, 'docx')

    if (!data) {
      return response.redirect('/teaching-modules')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['Modul Ajar', data.teachingModule.title], 'docx')
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const inline = wantsInlinePreview(request)
    const data = await teachingModuleService.getExportData(user, params.id, 'pdf', !inline)

    if (!data) {
      return response.redirect('/teaching-modules')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Modul Ajar', data.teachingModule.title], 'pdf'),
      { inline }
    )
  }

  async store({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(createTeachingModuleValidator)

    await teachingModuleService.create(auth.user!, data)

    session.flash('success', 'Modul Ajar berhasil dibuat')
    return response.redirect().toRoute('teaching-modules.index')
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const exists = await teachingModuleService.exists(user.id, params.id)

    if (!exists) {
      return response.redirect('/teaching-modules')
    }

    const data = await request.validateUsing(updateTeachingModuleValidator)
    await teachingModuleService.update(user.id, params.id, data)

    session.flash('success', 'Modul Ajar berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const deleted = await teachingModuleService.destroy(auth.user!.id, params.id)

    if (!deleted) {
      return response.redirect('/teaching-modules')
    }

    session.flash('success', 'Modul Ajar berhasil dihapus')
    return response.redirect().toRoute('teaching-modules.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(generateTeachingModuleValidator)
    const result = await teachingModuleService.generate(auth.user!, data)

    if (result.status === 'missing_class') {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    if (result.status === 'generation_error') {
      session.flash('error', result.message)
      return response.redirect().back()
    }

    session.flash('success', 'Modul Ajar berhasil digenerate')
    return response.redirect().toRoute('teaching-modules.show', {
      id: result.teachingModule.id,
    })
  }
}
