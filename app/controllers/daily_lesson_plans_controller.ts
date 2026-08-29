import type { HttpContext } from '@adonisjs/core/http'
import { updateDailyLessonPlanValidator } from '#validators/daily_lesson_plan'
import { generateDailyLessonPlanValidator } from '#validators/generate'
import { dailyLessonPlanService } from '#services/daily_lesson_plan_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

export default class DailyLessonPlansController {
  async index({ inertia, auth }: HttpContext) {
    const data = await dailyLessonPlanService.getIndexData(auth.user!)

    return inertia.render('dashboard/daily-lesson-plans/index', data)
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const data = await dailyLessonPlanService.getShowData(auth.user!.id, params.id)

    if (!data) {
      return response.redirect('/rpph')
    }

    return inertia.render('dashboard/daily-lesson-plans/show', data)
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await dailyLessonPlanService.getExportData(user, params.id, 'docx')

    if (!data) {
      return response.redirect('/rpph')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['RPPH', data.plan.content?.tema || data.plan.id], 'docx')
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const inline = wantsInlinePreview(request)
    const data = await dailyLessonPlanService.getExportData(user, params.id, 'pdf', !inline)

    if (!data) {
      return response.redirect('/rpph')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['RPPH', data.plan.content?.tema || data.plan.id], 'pdf'),
      { inline }
    )
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!

    // Keep the existing not-found redirect before validation.
    if (!(await dailyLessonPlanService.exists(user.id, params.id))) {
      return response.redirect('/rpph')
    }

    const data = await request.validateUsing(updateDailyLessonPlanValidator)
    await dailyLessonPlanService.update(user.id, params.id, data)

    session.flash('success', 'RPPH berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const deleted = await dailyLessonPlanService.destroy(auth.user!.id, params.id)

    if (!deleted) {
      return response.redirect('/rpph')
    }

    session.flash('success', 'RPPH berhasil dihapus')
    return response.redirect().toRoute('rpph.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(generateDailyLessonPlanValidator)
    const result = await dailyLessonPlanService.generate(auth.user!, data)

    if (result.status === 'missing_class') {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    if (result.status === 'missing_weekly_plan') {
      session.flash('error', 'RPPM tidak ditemukan')
      return response.redirect().back()
    }

    if (result.status === 'generation_error') {
      session.flash('error', result.message)
      return response.redirect().back()
    }

    session.flash('success', 'RPPH berhasil digenerate')
    return response.redirect().toRoute('rpph.show', { id: result.dailyLessonPlan.id })
  }
}
