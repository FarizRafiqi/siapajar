import type { HttpContext } from '@adonisjs/core/http'
import { createSemesterPlanValidator, updateSemesterPlanValidator } from '#validators/semester_plan'
import { generateSemesterPlanValidator } from '#validators/generate'
import { semesterPlanService } from '#services/semester_plan_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

export default class SemesterPlansController {
  async index({ inertia, auth }: HttpContext) {
    const data = await semesterPlanService.getIndexData(auth.user!)

    return inertia.render('dashboard/semester-plans/index', data)
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const data = await semesterPlanService.getShowData(auth.user!.id, params.id)

    if (!data) {
      return response.redirect('/semester-plans')
    }

    return inertia.render('dashboard/semester-plans/show', data)
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await semesterPlanService.getExportData(user, params.id, 'docx')

    if (!data) {
      return response.redirect('/semester-plans')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['Promes', data.semesterPlan.subject], 'docx')
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const inline = wantsInlinePreview(request)
    const data = await semesterPlanService.getExportData(user, params.id, 'pdf', !inline)

    if (!data) {
      return response.redirect('/semester-plans')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Promes', data.semesterPlan.subject], 'pdf'),
      { inline }
    )
  }

  async store({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(createSemesterPlanValidator)
    await semesterPlanService.create(auth.user!, data)

    session.flash('success', 'Program Semester berhasil dibuat')
    return response.redirect().toRoute('semester-plans.index')
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!

    // Keep the existing not-found redirect before validation.
    if (!(await semesterPlanService.exists(user.id, params.id))) {
      return response.redirect('/semester-plans')
    }

    const data = await request.validateUsing(updateSemesterPlanValidator)
    await semesterPlanService.update(user.id, params.id, data)

    session.flash('success', 'Program Semester berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const deleted = await semesterPlanService.destroy(auth.user!.id, params.id)

    if (!deleted) {
      return response.redirect('/semester-plans')
    }

    session.flash('success', 'Program Semester berhasil dihapus')
    return response.redirect().toRoute('semester-plans.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(generateSemesterPlanValidator)
    const result = await semesterPlanService.generate(auth.user!, data)

    if (result.status === 'missing_class') {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    if (result.status === 'missing_semester') {
      session.flash('error', 'Semester tidak ditemukan')
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

    session.flash('success', 'Program Semester berhasil digenerate')
    return response.redirect().toRoute('semester-plans.show', { id: result.semesterPlan.id })
  }
}
