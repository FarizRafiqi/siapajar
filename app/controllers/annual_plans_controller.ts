import type { HttpContext } from '@adonisjs/core/http'
import { createAnnualPlanValidator, updateAnnualPlanValidator } from '#validators/annual_plan'
import { generateAnnualPlanValidator } from '#validators/generate'
import { annualPlanService } from '#services/annual_plan_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

export default class AnnualPlansController {
  async index({ inertia, auth }: HttpContext) {
    const data = await annualPlanService.getIndexData(auth.user!)

    return inertia.render('dashboard/annual-plans/index', data)
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const data = await annualPlanService.getShowData(auth.user!.id, params.id)

    if (!data) {
      return response.redirect('/annual-plans')
    }

    return inertia.render('dashboard/annual-plans/show', data)
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await annualPlanService.getExportData(user, params.id, 'docx')

    if (!data) {
      return response.redirect('/annual-plans')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['Prota', data.annualPlan.subject], 'docx')
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const inline = wantsInlinePreview(request)
    const data = await annualPlanService.getExportData(user, params.id, 'pdf', !inline)

    if (!data) {
      return response.redirect('/annual-plans')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Prota', data.annualPlan.subject], 'pdf'),
      { inline }
    )
  }

  async store({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(createAnnualPlanValidator)
    await annualPlanService.create(auth.user!, data)

    session.flash('success', 'Program Tahunan berhasil dibuat')
    return response.redirect().toRoute('annual-plans.index')
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!

    // Keep the existing not-found redirect before validation.
    if (!(await annualPlanService.exists(user.id, params.id))) {
      return response.redirect('/annual-plans')
    }

    const data = await request.validateUsing(updateAnnualPlanValidator)
    await annualPlanService.update(user.id, params.id, data)

    session.flash('success', 'Program Tahunan berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const deleted = await annualPlanService.destroy(auth.user!.id, params.id)

    if (!deleted) {
      return response.redirect('/annual-plans')
    }

    session.flash('success', 'Program Tahunan berhasil dihapus')
    return response.redirect().toRoute('annual-plans.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(generateAnnualPlanValidator)
    const result = await annualPlanService.generate(auth.user!, data)

    if (result.status === 'missing_academic_year') {
      session.flash('error', 'Tahun ajaran tidak ditemukan')
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

    session.flash('success', 'Program Tahunan berhasil digenerate')
    return response.redirect().toRoute('annual-plans.show', { id: result.annualPlan.id })
  }
}
