import type { DateTime } from 'luxon'
import DailyLessonPlan from '#models/daily_lesson_plan'
import type User from '#models/user'
import { dailyLessonPlanRepository } from '#repositories/daily_lesson_plan_repository'
import type { DailyLessonPlanRepository } from '#repositories/daily_lesson_plan_repository'
import { ensureDocumentWorkflow, saveDocumentWorkflow } from '#services/document_workflow_service'
import { exportDailyLessonPlan } from '#services/export_service'
import { exportDailyLessonPlanPdf } from '#services/pdf_export_service'
import { AiServiceError, normalizeStringArraySections } from '#services/ai_service'
import { dailyLessonPlanPrompt } from '#services/ai_prompts'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { callAiJsonForUser } from '#services/user_ai_service'
import { creditService, InsufficientCreditsError } from '#services/credit_service'

export type GenerateDailyLessonPlanData = {
  classId: number
  weeklyLessonPlanId?: number
  theme: string
  date: DateTime
  learningSequenceId?: number
}

export type GenerateDailyLessonPlanResult =
  | { status: 'missing_class' }
  | { status: 'missing_weekly_plan' }
  | { status: 'insufficient_credits' }
  | { status: 'generation_error'; message: string }
  | { status: 'created'; dailyLessonPlan: DailyLessonPlan }

export class DailyLessonPlanService {
  constructor(private readonly repository: DailyLessonPlanRepository = dailyLessonPlanRepository) {}

  async getIndexData(user: User) {
    const { dailyLessonPlans, classes, weeklyLessonPlans, sequences } =
      await this.repository.getIndexData(user.id)

    return {
      dailyLessonPlans: dailyLessonPlans.map((plan) => plan.toJSON()),
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      weeklyLessonPlans: weeklyLessonPlans.map((plan) => plan.toJSON()),
      sequences: sequences.map((sequence) => sequence.toJSON()),
    }
  }

  async getShowData(userId: number, planId: string | number) {
    const dailyLessonPlan = await this.repository.findForUser(planId, userId, true)
    if (!dailyLessonPlan) return null

    const workflow = await ensureDocumentWorkflow(userId, 'rpph', dailyLessonPlan.id, {
      status: dailyLessonPlan.status,
    })

    return {
      dailyLessonPlan: dailyLessonPlan.toJSON(),
      workflow: workflow.toJSON(),
    }
  }

  async getExportData(user: User, planId: string | number, format: 'docx' | 'pdf', charge = true) {
    const plan = await this.repository.findForUser(planId, user.id, true)
    if (!plan) return null

    const buffer =
      format === 'docx'
        ? await exportDailyLessonPlan(plan, user)
        : await exportDailyLessonPlanPdf(plan, user, charge)
    return { plan, buffer }
  }

  async exists(userId: number, planId: string | number) {
    return Boolean(await this.repository.findForUser(planId, userId))
  }

  async create(user: User, data: Record<string, any>) {
    return DailyLessonPlan.create({ ...data, userId: user.id })
  }

  async update(userId: number, planId: string | number, data: Record<string, any>) {
    const dailyLessonPlan = await this.repository.findForUser(planId, userId)
    if (!dailyLessonPlan) return false

    await dailyLessonPlan.merge(data).save()
    const workflow = await ensureDocumentWorkflow(userId, 'rpph', dailyLessonPlan.id)
    await saveDocumentWorkflow(workflow, data.status as 'draft' | 'published' | undefined)
    return true
  }

  async destroy(userId: number, planId: string | number) {
    const dailyLessonPlan = await this.repository.findForUser(planId, userId)
    if (!dailyLessonPlan) return false

    await dailyLessonPlan.delete()
    return true
  }

  async generate(
    user: User,
    data: GenerateDailyLessonPlanData
  ): Promise<GenerateDailyLessonPlanResult> {
    const schoolClass = await this.repository.findOwnedClass(data.classId, user.id)
    if (!schoolClass) return { status: 'missing_class' }

    if (!(await creditService.hasEnoughGenerationCredits(user, 1))) {
      return { status: 'insufficient_credits' }
    }

    if (data.weeklyLessonPlanId) {
      const weeklyLessonPlan = await this.repository.findWeeklyPlanForUser(
        data.weeklyLessonPlanId,
        user.id
      )
      if (!weeklyLessonPlan) return { status: 'missing_weekly_plan' }
    }

    try {
      const dailyLessonPlan = await creditService.withGenerationCredit(
        user,
        1,
        `RPPH: ${data.theme}`,
        'daily_lesson_plan.generate',
        async (reservationKey) => {
          const curriculum = await getCurriculumContext(user.id, data.learningSequenceId)
          const prompt = dailyLessonPlanPrompt({
            theme: data.theme,
            date: data.date.toFormat('dd/MM/yyyy'),
          })
          const raw = await callAiJsonForUser<Record<string, unknown>>(
            user,
            {
              operation: 'daily_lesson_plan.generate',
              systemPrompt: prompt.system,
              userPrompt: prompt.user,
            },
            {
              reservationKey,
              amount: 1,
              description: `RPPH: ${data.theme}`,
            }
          )
          const generated = normalizeStringArraySections(raw, [
            'kegiatanPembuka',
            'kegiatanInti',
            'kegiatanPenutup',
            'alatBahan',
            'rencanaAsesmen',
          ])
          // Keep the teacher-selected theme authoritative over AI output.
          const content: Record<string, any> = {
            ...generated,
            tema: data.theme,
            curriculum,
          }

          const created = await DailyLessonPlan.create({
            userId: user.id,
            classId: data.classId,
            weeklyLessonPlanId: data.weeklyLessonPlanId ?? null,
            date: data.date,
            content,
            status: 'draft',
          })
          await ensureDocumentWorkflow(user.id, 'rpph', created.id, { status: 'draft' })
          return created
        }
      )

      return { status: 'created' as const, dailyLessonPlan }
    } catch (error) {
      if (error instanceof InsufficientCreditsError) {
        return { status: 'insufficient_credits' }
      }
      return {
        status: 'generation_error' as const,
        message:
          error instanceof AiServiceError ? error.message : 'Gagal generate RPPH. Coba lagi.',
      }
    }
  }
}

export const dailyLessonPlanService = new DailyLessonPlanService()
