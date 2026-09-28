import AcademicYear from '#models/academic_year'
import AnnualPlan from '#models/annual_plan'
import type User from '#models/user'
import { annualPlanRepository } from '#repositories/annual_plan_repository'
import type { AnnualPlanRepository } from '#repositories/annual_plan_repository'
import { exportAnnualPlan } from '#services/export_service'
import { exportAnnualPlanPdf } from '#services/pdf_export_service'
import { AiServiceError, normalizeStringArraySections } from '#services/ai_service'
import { annualPlanPrompt } from '#services/ai_prompts'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { callAiJsonForUser } from '#services/user_ai_service'
import { creditService, InsufficientCreditsError } from '#services/credit_service'

export type GenerateAnnualPlanData = {
  academicYearId: number
  subject: string
  learningSequenceId?: number
}

export type GenerateAnnualPlanResult =
  | { status: 'missing_academic_year' }
  | { status: 'insufficient_credits' }
  | { status: 'generation_error'; message: string }
  | { status: 'created'; annualPlan: AnnualPlan }

export class AnnualPlanService {
  constructor(private readonly repository: AnnualPlanRepository = annualPlanRepository) {}

  async getIndexData(user: User) {
    const { annualPlans, academicYears, subjects, sequences } = await this.repository.getIndexData(
      user.id,
      user.educationLevel
    )

    return {
      annualPlans: annualPlans.map((plan) => plan.toJSON()),
      academicYears: academicYears.map((year) => year.toJSON()),
      subjects: subjects.map((subject) => subject.toJSON()),
      sequences: sequences.map((sequence) => sequence.toJSON()),
    }
  }

  async getShowData(userId: number, planId: string | number) {
    const annualPlan = await this.repository.findForUser(planId, userId, true)
    return annualPlan ? { annualPlan: annualPlan.toJSON() } : null
  }

  async getExportData(user: User, planId: string | number, format: 'docx' | 'pdf', charge = true) {
    const annualPlan = await this.repository.findForUser(planId, user.id)
    if (!annualPlan) return null

    const buffer =
      format === 'docx'
        ? await exportAnnualPlan(annualPlan, user)
        : await exportAnnualPlanPdf(annualPlan, user, charge)
    return { annualPlan, buffer }
  }

  async exists(userId: number, planId: string | number) {
    return Boolean(await this.repository.findForUser(planId, userId))
  }

  async create(user: User, data: Record<string, any>) {
    return AnnualPlan.create({ ...data, userId: user.id })
  }

  async update(userId: number, planId: string | number, data: Record<string, any>) {
    const annualPlan = await this.repository.findForUser(planId, userId)
    if (!annualPlan) return false

    await annualPlan.merge(data).save()
    return true
  }

  async destroy(userId: number, planId: string | number) {
    const annualPlan = await this.repository.findForUser(planId, userId)
    if (!annualPlan) return false

    await annualPlan.delete()
    return true
  }

  async generate(user: User, data: GenerateAnnualPlanData): Promise<GenerateAnnualPlanResult> {
    const academicYear = await AcademicYear.find(data.academicYearId)
    if (!academicYear) return { status: 'missing_academic_year' }

    if (!(await creditService.hasEnoughGenerationCredits(user, 1))) {
      return { status: 'insufficient_credits' }
    }

    const curriculum = await getCurriculumContext(user.id, data.learningSequenceId)
    const description = `Program Tahunan: ${data.subject}`
    try {
      return await creditService.withGenerationCredit(
        user,
        1,
        description,
        'annual_plan.generate',
        async (reservationKey) => {
          const prompt = annualPlanPrompt({
            subject: data.subject,
            educationLevel: user.educationLevel,
            institutionType: user.institutionType,
            curriculumVersion: user.curriculumVersion,
          })
          const raw = await callAiJsonForUser<Record<string, unknown>>(
            user,
            {
              operation: 'annual_plan.generate',
              systemPrompt: prompt.system,
              userPrompt: prompt.user,
            },
            { reservationKey, amount: 1, description }
          )
          const content: Record<string, any> = normalizeStringArraySections(raw, [
            'kompetensi',
            'alokasiWaktu',
            'kegiatan',
            'minggu',
          ])
          content.curriculum = curriculum

          const annualPlan = await AnnualPlan.create({
            userId: user.id,
            academicYearId: data.academicYearId,
            subject: data.subject,
            content,
          })
          return { status: 'created' as const, annualPlan }
        }
      )
    } catch (error) {
      if (error instanceof InsufficientCreditsError) {
        return { status: 'insufficient_credits' }
      }
      return {
        status: 'generation_error',
        message:
          error instanceof AiServiceError ? error.message : 'Gagal generate Protah. Coba lagi.',
      }
    }
  }
}

export const annualPlanService = new AnnualPlanService()
