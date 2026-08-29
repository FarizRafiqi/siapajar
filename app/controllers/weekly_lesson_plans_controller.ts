import type { HttpContext } from '@adonisjs/core/http'
import { updateWeeklyLessonPlanValidator } from '#validators/weekly_lesson_plan'
import { generateWeeklyLessonPlanValidator } from '#validators/generate'
import { weeklyLessonPlanService } from '#services/weekly_lesson_plan_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

export default class WeeklyLessonPlansController {
  async index({ inertia, auth }: HttpContext) {
    const data = await weeklyLessonPlanService.getIndexData(auth.user!)

    return inertia.render('dashboard/weekly-lesson-plans/index', data)
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const data = await weeklyLessonPlanService.getShowData(auth.user!.id, params.id)

    if (!data) {
      return response.redirect('/rppm')
    }

    return inertia.render('dashboard/weekly-lesson-plans/show', data)
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await weeklyLessonPlanService.getExportData(user, params.id, 'docx')

    if (!data) {
      return response.redirect('/rppm')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['Modul_Ajar_RPM', data.plan.theme], 'docx')
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const inline = wantsInlinePreview(request)
    const data = await weeklyLessonPlanService.getExportData(user, params.id, 'pdf', !inline)

    if (!data) {
      return response.redirect('/rppm')
    }

    return sendExport(
      response,
      data.buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Modul_Ajar_RPM', data.plan.theme], 'pdf'),
      { inline }
    )
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!

    // Keep the existing not-found redirect before validation.
    if (!(await weeklyLessonPlanService.exists(user.id, params.id))) {
      return response.redirect('/rppm')
    }

    const data = await request.validateUsing(updateWeeklyLessonPlanValidator)
    await weeklyLessonPlanService.update(user.id, params.id, data)

    session.flash('success', 'Modul Ajar (RPM) berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const deleted = await weeklyLessonPlanService.destroy(auth.user!.id, params.id)

    if (!deleted) {
      return response.redirect('/rppm')
    }

    session.flash('success', 'Modul Ajar (RPM) berhasil dihapus')
    return response.redirect().toRoute('rppm.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(generateWeeklyLessonPlanValidator)
    const result = await weeklyLessonPlanService.generate(auth.user!, data)

    if (result.status === 'missing_class') {
      session.flash('error', 'Kelompok / Kelas tidak ditemukan')
      return response.redirect().back()
    }

    if (result.status === 'generation_error') {
      session.flash('error', result.message)
      return response.redirect().back()
    }

    session.flash('success', 'Modul Ajar (RPM KBC RA) berhasil dibuat!')
    return response.redirect().toRoute('rppm.show', { id: result.weeklyLessonPlan.id })
  }
}
