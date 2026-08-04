import type { HttpContext } from '@adonisjs/core/http'
import DailyLessonPlan from '#models/daily_lesson_plan'
import SchoolClass from '#models/school_class'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'
import { updateDailyLessonPlanValidator } from '#validators/daily_lesson_plan'
import { generateDailyLessonPlanValidator } from '#validators/generate'
import { normalizeStringArraySections, AiServiceError } from '#services/ai_service'
import { dailyLessonPlanPrompt } from '#services/ai_prompts'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { callAiJsonForUser } from '#services/user_ai_service'
import LearningSequence from '#models/learning_sequence'

export default class DailyLessonPlansController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const dailyLessonPlans = await DailyLessonPlan.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .orderBy('date', 'desc')

    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')

    const weeklyLessonPlans = await WeeklyLessonPlan.query()
      .where('user_id', user.id)
      .orderBy('week_start_date', 'desc')
    const sequences = await LearningSequence.query().where('user_id', user.id).orderBy('title')

    return inertia.render('dashboard/daily-lesson-plans/index', {
      dailyLessonPlans: dailyLessonPlans.map((p) => p.toJSON()),
      classes: classes.map((c) => c.toJSON()),
      weeklyLessonPlans: weeklyLessonPlans.map((p) => p.toJSON()),
      sequences: sequences.map((s) => s.toJSON()),
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const dailyLessonPlan = await DailyLessonPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .preload('weeklyLessonPlan')
      .first()

    if (!dailyLessonPlan) {
      return response.redirect('/rpph')
    }

    return inertia.render('dashboard/daily-lesson-plans/show', {
      dailyLessonPlan: dailyLessonPlan.toJSON(),
    })
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const dailyLessonPlan = await DailyLessonPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!dailyLessonPlan) {
      return response.redirect('/rpph')
    }

    const data = await request.validateUsing(updateDailyLessonPlanValidator)
    await dailyLessonPlan.merge(data).save()

    session.flash('success', 'RPPH berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const dailyLessonPlan = await DailyLessonPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!dailyLessonPlan) {
      return response.redirect('/rpph')
    }

    await dailyLessonPlan.delete()

    session.flash('success', 'RPPH berhasil dihapus')
    return response.redirect().toRoute('rpph.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { classId, weeklyLessonPlanId, theme, date, learningSequenceId } =
      await request.validateUsing(generateDailyLessonPlanValidator)

    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    if (weeklyLessonPlanId) {
      const weeklyLessonPlan = await WeeklyLessonPlan.query()
        .where('id', weeklyLessonPlanId)
        .where('user_id', user.id)
        .first()

      if (!weeklyLessonPlan) {
        session.flash('error', 'RPPM tidak ditemukan')
        return response.redirect().back()
      }
    }

    const curriculum = await getCurriculumContext(user.id, learningSequenceId)
    let content: Record<string, any>
    try {
      const prompt = dailyLessonPlanPrompt({ theme, date: date.toFormat('dd/MM/yyyy') })
      const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      const generated = normalizeStringArraySections(raw, [
        'kegiatanPembuka',
        'kegiatanInti',
        'kegiatanPenutup',
        'alatBahan',
        'rencanaAsesmen',
      ])
      // tema taruh terakhir — hasil AI tidak boleh menimpa tema yang guru pilih
      content = { ...generated, tema: theme }
      content.curriculum = curriculum
    } catch (error) {
      session.flash(
        'error',
        error instanceof AiServiceError ? error.message : 'Gagal generate RPPH. Coba lagi.'
      )
      return response.redirect().back()
    }

    const dailyLessonPlan = await DailyLessonPlan.create({
      userId: user.id,
      classId,
      weeklyLessonPlanId: weeklyLessonPlanId ?? null,
      date,
      content,
      status: 'draft',
    })

    session.flash('success', 'RPPH berhasil digenerate')
    return response.redirect().toRoute('rpph.show', { id: dailyLessonPlan.id })
  }
}
