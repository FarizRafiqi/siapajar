import type { HttpContext } from '@adonisjs/core/http'
import AnnualPlan from '#models/annual_plan'
import AcademicYear from '#models/academic_year'
import { createAnnualPlanValidator, updateAnnualPlanValidator } from '#validators/annual_plan'

export default class AnnualPlansController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const annualPlans = await AnnualPlan.query()
      .where('user_id', user.id)
      .preload('academicYear')
      .orderBy('created_at', 'desc')

    const academicYears = await AcademicYear.query().orderBy('name', 'desc')

    return inertia.render('dashboard/annual-plans/index', {
      prota: annualPlans,
      tahunAjaran: academicYears,
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const annualPlan = await AnnualPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('academicYear')
      .first()

    if (!annualPlan) {
      return response.redirect('/annual-plans')
    }

    return inertia.render('dashboard/annual-plans/show', {
      prota: annualPlan,
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createAnnualPlanValidator)

    await AnnualPlan.create({
      ...data,
      userId: user.id,
    })

    session.flash('success', 'Program Tahunan berhasil dibuat')
    return response.redirect().toRoute('annual-plans.index')
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const annualPlan = await AnnualPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!annualPlan) {
      return response.redirect('/annual-plans')
    }

    const data = await request.validateUsing(updateAnnualPlanValidator)
    await annualPlan.merge(data).save()

    session.flash('success', 'Program Tahunan berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const annualPlan = await AnnualPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!annualPlan) {
      return response.redirect('/annual-plans')
    }

    await annualPlan.delete()

    session.flash('success', 'Program Tahunan berhasil dihapus')
    return response.redirect().toRoute('annual-plans.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { academicYearId, subject } = request.only(['academicYearId', 'subject'])

    // Future implementation: Integrate with AI service (OpenAI)
    const content = {
      kompetensi: [],
      alokasiWaktu: [],
      kegiatan: [],
      minggu: [],
    }

    const annualPlan = await AnnualPlan.create({
      userId: user.id,
      academicYearId,
      subject,
      content,
    })

    session.flash('success', 'Program Tahunan berhasil digenerate')
    return response.redirect().toRoute('annual-plans.show', { id: annualPlan.id })
  }
}
