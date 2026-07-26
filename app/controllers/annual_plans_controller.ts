import type { HttpContext } from '@adonisjs/core/http'
import AnnualPlan from '#models/annual_plan'
import AcademicYear from '#models/academic_year'
import Subject from '#models/subject'
import { createAnnualPlanValidator, updateAnnualPlanValidator } from '#validators/annual_plan'
import { generateAnnualPlanValidator } from '#validators/generate'
import { exportAnnualPlan } from '#services/export_service'
import { exportAnnualPlanPdf } from '#services/pdf_export_service'
import { callAiJson, normalizeStringArraySections, AiServiceError } from '#services/ai_service'
import { annualPlanPrompt } from '#services/ai_prompts'

export default class AnnualPlansController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const annualPlans = await AnnualPlan.query()
      .where('user_id', user.id)
      .preload('academicYear')
      .orderBy('created_at', 'desc')

    const academicYears = await AcademicYear.query().orderBy('name', 'desc')

    const subjects = await Subject.query()
      .where('user_id', user.id)
      .where('education_level', user.educationLevel || 'sd')
      .where('is_active', true)
      .orderBy('name')

    return inertia.render('dashboard/annual-plans/index', {
      annualPlans: annualPlans.map((p) => p.toJSON()),
      academicYears: academicYears.map((y) => y.toJSON()),
      subjects: subjects.map((s) => s.toJSON()),
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
      annualPlan: annualPlan.toJSON(),
    })
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const annualPlan = await AnnualPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!annualPlan) {
      return response.redirect('/annual-plans')
    }

    const buffer = await exportAnnualPlan(annualPlan, user)
    response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    response.header('Content-Disposition', `attachment; filename="Protah ${annualPlan.subject}.docx"`)
    return response.send(buffer)
  }

  async exportPdf({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const annualPlan = await AnnualPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!annualPlan) {
      return response.redirect('/annual-plans')
    }

    const buffer = await exportAnnualPlanPdf(annualPlan, user)
    response.header('Content-Type', 'application/pdf')
    response.header('Content-Disposition', `attachment; filename="Protah ${annualPlan.subject}.pdf"`)
    return response.send(buffer)
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
    const { academicYearId, subject } = await request.validateUsing(generateAnnualPlanValidator)

    const academicYear = await AcademicYear.find(academicYearId)
    if (!academicYear) {
      session.flash('error', 'Tahun ajaran tidak ditemukan')
      return response.redirect().back()
    }

    let content: Record<string, string[]>
    try {
      const prompt = annualPlanPrompt({ subject })
      const raw = await callAiJson<Record<string, unknown>>({
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      content = normalizeStringArraySections(raw, ['kompetensi', 'alokasiWaktu', 'kegiatan', 'minggu'])
    } catch (error) {
      session.flash('error', error instanceof AiServiceError ? error.message : 'Gagal generate Protah. Coba lagi.')
      return response.redirect().back()
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
