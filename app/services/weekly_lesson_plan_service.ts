import type { DateTime } from 'luxon'
import CurriculumPreset from '#models/curriculum_preset'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'
import type User from '#models/user'
import { weeklyLessonPlanRepository } from '#repositories/weekly_lesson_plan_repository'
import type { WeeklyLessonPlanRepository } from '#repositories/weekly_lesson_plan_repository'
import { normalizeRpmContent } from '#services/weekly_lesson_plan_content_service'
import { ensureDocumentWorkflow, saveDocumentWorkflow } from '#services/document_workflow_service'
import { exportWeeklyLessonPlan } from '#services/export_service'
import { exportWeeklyLessonPlanPdf } from '#services/pdf_export_service'
import { AiServiceError } from '#services/ai_service'
import { rpmKbcRaPrompt } from '#services/ai_prompts'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { callAiJsonForUser } from '#services/user_ai_service'
import { loadWeeklyPlanAssessments } from '#services/weekly_assessment_loader'
import { creditService } from '#services/credit_service'

export type GenerateWeeklyLessonPlanData = {
  classId: number
  theme: string
  subtheme?: string
  weekStartDate: DateTime
  semester?: number
  weekNumber?: number
  presetId?: number
  learningModel?: string
  learningSequenceId?: number
}

export type GenerateWeeklyLessonPlanResult =
  | { status: 'missing_class' }
  | { status: 'insufficient_credits' }
  | { status: 'generation_error'; message: string }
  | { status: 'created'; weeklyLessonPlan: WeeklyLessonPlan }

export class WeeklyLessonPlanService {
  constructor(
    private readonly repository: WeeklyLessonPlanRepository = weeklyLessonPlanRepository
  ) {}

  async getIndexData(user: User) {
    const { weeklyLessonPlans, classes, sequences, presets } = await this.repository.getIndexData(
      user.id
    )
    const currentMonth = new Date().getMonth() + 1
    const defaultSemester = currentMonth >= 7 && currentMonth <= 12 ? 1 : 2

    return {
      weeklyLessonPlans: weeklyLessonPlans.map((plan) => plan.toJSON()),
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      sequences: sequences.map((sequence) => sequence.toJSON()),
      presets: presets.map((preset) => preset.toJSON()),
      defaultSemester,
    }
  }

  async getShowData(userId: number, planId: string | number) {
    const weeklyLessonPlan = await this.repository.findForUser(planId, userId, true)
    if (!weeklyLessonPlan) return null

    const normalizedContent = this.normalizeContent(weeklyLessonPlan)
    const workflow = await ensureDocumentWorkflow(userId, 'rppm', weeklyLessonPlan.id, {
      status: weeklyLessonPlan.status,
    })
    const assessments = await loadWeeklyPlanAssessments(weeklyLessonPlan)
    const planJson = weeklyLessonPlan.toJSON()
    planJson.content = normalizedContent

    return {
      weeklyLessonPlan: planJson,
      workflow: workflow.toJSON(),
      assessments,
    }
  }

  async getExportData(user: User, planId: string | number, format: 'docx' | 'pdf', charge = true) {
    const plan = await this.repository.findForUser(planId, user.id, true)
    if (!plan) return null

    this.normalizeContent(plan)
    const assessments = await loadWeeklyPlanAssessments(plan)
    const buffer =
      format === 'docx'
        ? await exportWeeklyLessonPlan(plan, user, true, assessments)
        : await exportWeeklyLessonPlanPdf(plan, user, charge, assessments)

    return { plan, buffer }
  }

  async exists(userId: number, planId: string | number) {
    return Boolean(await this.repository.findForUser(planId, userId))
  }

  async create(user: User, data: Record<string, any>) {
    return WeeklyLessonPlan.create({ ...data, userId: user.id })
  }

  async update(userId: number, planId: string | number, data: Record<string, any>) {
    const weeklyLessonPlan = await this.repository.findForUser(planId, userId)
    if (!weeklyLessonPlan) return false

    await weeklyLessonPlan.merge(data).save()
    const workflow = await ensureDocumentWorkflow(userId, 'rppm', weeklyLessonPlan.id)
    await saveDocumentWorkflow(workflow, data.status as 'draft' | 'published' | undefined)
    return true
  }

  async destroy(userId: number, planId: string | number) {
    const weeklyLessonPlan = await this.repository.findForUser(planId, userId)
    if (!weeklyLessonPlan) return false

    await weeklyLessonPlan.delete()
    return true
  }

  async generate(
    user: User,
    data: GenerateWeeklyLessonPlanData
  ): Promise<GenerateWeeklyLessonPlanResult> {
    const schoolClass = await this.repository.findOwnedClassWithStudents(data.classId, user.id)
    if (!schoolClass) return { status: 'missing_class' }

    if (!(await creditService.hasEnoughGenerationCredits(user, 1))) {
      return { status: 'insufficient_credits' }
    }

    let preset: CurriculumPreset | null = null
    if (data.presetId) {
      // A single-record lookup is intentionally kept in the service.
      preset = await CurriculumPreset.find(data.presetId)
    }

    const currentMonth = new Date().getMonth() + 1
    const computedSemester =
      data.semester ?? preset?.semester ?? (currentMonth >= 7 && currentMonth <= 12 ? 1 : 2)
    const computedWeek = data.weekNumber ?? preset?.weekNumber ?? 1
    const finalTheme = data.theme || preset?.themeTitle || 'Aku Hamba Allah'
    const finalSubtheme = data.subtheme || preset?.subthemeTitle || ''
    const studentNames = (schoolClass.students || [])
      .map((student) => student.fullName)
      .filter(Boolean)

    const curriculum = await getCurriculumContext(user.id, data.learningSequenceId)
    let content: Record<string, any>
    try {
      const prompt = rpmKbcRaPrompt({
        theme: finalTheme,
        subtheme: finalSubtheme || undefined,
        semester: computedSemester,
        weekNumber: computedWeek,
        groupName: schoolClass.name,
        schoolName: user.schoolName || undefined,
        teacherName: user.fullName || undefined,
        studentNames: studentNames.length > 0 ? studentNames : undefined,
        dplSuggestions: (preset?.data?.dpl as string[]) || undefined,
        kbcSuggestions: (preset?.data?.kbcValues as string[]) || undefined,
        loosePartsSuggestions: (preset?.data?.loosePartsSuggestions as string[]) || undefined,
        learningModel: data.learningModel,
        curriculumContext: {
          objectives: curriculum.objectives,
        },
      })

      const raw = await callAiJsonForUser<Record<string, any>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })

      content = normalizeRpmContent(raw, {
        finalTheme,
        finalSubtheme,
        computedSemester,
        computedWeek,
        groupName: schoolClass.name,
        preset,
        curriculum,
      })
      content.modelPembelajaran = data.learningModel || 'Pembelajaran Berbasis Bermain'
    } catch (error) {
      return {
        status: 'generation_error' as const,
        message:
          error instanceof AiServiceError
            ? error.message
            : 'Gagal generate Modul Ajar (RPM). Coba lagi.',
      }
    }

    const weeklyLessonPlan = await WeeklyLessonPlan.create({
      userId: user.id,
      classId: data.classId,
      theme: finalTheme,
      weekStartDate: data.weekStartDate,
      content,
      status: 'draft',
    })
    await ensureDocumentWorkflow(user.id, 'rppm', weeklyLessonPlan.id, { status: 'draft' })
    await creditService.chargeGeneration(user, 1, `Modul Ajar RPPM: ${finalTheme}`)

    return { status: 'created' as const, weeklyLessonPlan }
  }

  private normalizeContent(weeklyLessonPlan: WeeklyLessonPlan) {
    const rawContent = weeklyLessonPlan.content || {}
    const finalTheme = rawContent.topic || rawContent.theme || weeklyLessonPlan.theme
    const finalSubtheme = rawContent.subtopic || rawContent.subtheme || ''
    const normalizedContent = normalizeRpmContent(rawContent, {
      finalTheme,
      finalSubtheme,
      computedSemester: rawContent.semester || 1,
      computedWeek: rawContent.weekNumber || 1,
      groupName: weeklyLessonPlan.schoolClass?.name || 'Kelompok B',
    })

    weeklyLessonPlan.content = normalizedContent
    return normalizedContent
  }
}

export const weeklyLessonPlanService = new WeeklyLessonPlanService()
