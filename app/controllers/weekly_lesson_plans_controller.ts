import type { HttpContext } from '@adonisjs/core/http'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'
import SchoolClass from '#models/school_class'
import { updateWeeklyLessonPlanValidator } from '#validators/weekly_lesson_plan'
import { generateWeeklyLessonPlanValidator } from '#validators/generate'
import { normalizeStringArraySections, AiServiceError } from '#services/ai_service'
import { weeklyLessonPlanPrompt } from '#services/ai_prompts'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { callAiJsonForUser } from '#services/user_ai_service'
import LearningSequence from '#models/learning_sequence'
import { ensureDocumentWorkflow, saveDocumentWorkflow } from '#services/document_workflow_service'

export default class WeeklyLessonPlansController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const weeklyLessonPlans = await WeeklyLessonPlan.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .orderBy('week_start_date', 'desc')

    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')
    const sequences = await LearningSequence.query().where('user_id', user.id).orderBy('title')

    return inertia.render('dashboard/weekly-lesson-plans/index', {
      weeklyLessonPlans: weeklyLessonPlans.map((p) => p.toJSON()),
      classes: classes.map((c) => c.toJSON()),
      sequences: sequences.map((s) => s.toJSON()),
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const weeklyLessonPlan = await WeeklyLessonPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .first()

    if (!weeklyLessonPlan) {
      return response.redirect('/rppm')
    }

    const workflow = await ensureDocumentWorkflow(user.id, 'rppm', weeklyLessonPlan.id, {
      status: weeklyLessonPlan.status,
    })
    return inertia.render('dashboard/weekly-lesson-plans/show', {
      weeklyLessonPlan: weeklyLessonPlan.toJSON(),
      workflow: workflow.toJSON(),
    })
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const weeklyLessonPlan = await WeeklyLessonPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!weeklyLessonPlan) {
      return response.redirect('/rppm')
    }

    const data = await request.validateUsing(updateWeeklyLessonPlanValidator)
    await weeklyLessonPlan.merge(data).save()
    const workflow = await ensureDocumentWorkflow(user.id, 'rppm', weeklyLessonPlan.id)
    await saveDocumentWorkflow(workflow, data.status as 'draft' | 'published' | undefined)

    session.flash('success', 'RPPM berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const weeklyLessonPlan = await WeeklyLessonPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!weeklyLessonPlan) {
      return response.redirect('/rppm')
    }

    await weeklyLessonPlan.delete()

    session.flash('success', 'RPPM berhasil dihapus')
    return response.redirect().toRoute('rppm.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { classId, theme, weekStartDate, learningSequenceId } = await request.validateUsing(
      generateWeeklyLessonPlanValidator
    )

    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    const curriculum = await getCurriculumContext(user.id, learningSequenceId)
    let content: Record<string, any>
    try {
      const prompt = weeklyLessonPlanPrompt({ theme })
      const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      content = normalizeStringArraySections(raw, [
        'nilaiAgamaBudiPekerti',
        'jatiDiri',
        'literasiSainsTeknologi',
        'rencanaKegiatan',
      ])
      content.curriculum = curriculum
    } catch (error) {
      session.flash(
        'error',
        error instanceof AiServiceError ? error.message : 'Gagal generate RPPM. Coba lagi.'
      )
      return response.redirect().back()
    }

    const weeklyLessonPlan = await WeeklyLessonPlan.create({
      userId: user.id,
      classId,
      theme,
      weekStartDate,
      content,
      status: 'draft',
    })
    await ensureDocumentWorkflow(user.id, 'rppm', weeklyLessonPlan.id, { status: 'draft' })

    session.flash('success', 'RPPM berhasil digenerate')
    return response.redirect().toRoute('rppm.show', { id: weeklyLessonPlan.id })
  }
}
