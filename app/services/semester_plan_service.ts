import Semester from '#models/semester'
import SemesterPlan from '#models/semester_plan'
import type User from '#models/user'
import { semesterPlanRepository } from '#repositories/semester_plan_repository'
import type { SemesterPlanRepository } from '#repositories/semester_plan_repository'
import { exportSemesterPlan } from '#services/export_service'
import { exportSemesterPlanPdf } from '#services/pdf_export_service'
import { AiServiceError, normalizeStringArraySections } from '#services/ai_service'
import { semesterPlanPrompt } from '#services/ai_prompts'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { callAiJsonForUser } from '#services/user_ai_service'
import { creditService } from '#services/credit_service'

export type GenerateSemesterPlanData = {
  classId: number
  semesterId: number
  subject: string
  learningSequenceId?: number
}

export type GenerateSemesterPlanResult =
  | { status: 'missing_class' }
  | { status: 'missing_semester' }
  | { status: 'insufficient_credits' }
  | { status: 'generation_error'; message: string }
  | { status: 'created'; semesterPlan: SemesterPlan }

export class SemesterPlanService {
  constructor(private readonly repository: SemesterPlanRepository = semesterPlanRepository) {}

  async getIndexData(user: User) {
    const { semesterPlans, classes, semesters, subjects, sequences } =
      await this.repository.getIndexData(user.id, user.educationLevel)

    return {
      semesterPlans: semesterPlans.map((plan) => plan.toJSON()),
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      semesters: semesters.map((semester) => semester.toJSON()),
      subjects: subjects.map((subject) => subject.toJSON()),
      sequences: sequences.map((sequence) => sequence.toJSON()),
    }
  }

  async getShowData(userId: number, planId: string | number) {
    const semesterPlan = await this.repository.findForUser(planId, userId, true)
    return semesterPlan ? { semesterPlan: semesterPlan.toJSON() } : null
  }

  async getExportData(user: User, planId: string | number, format: 'docx' | 'pdf', charge = true) {
    const semesterPlan = await this.repository.findForUser(planId, user.id)
    if (!semesterPlan) return null

    const buffer =
      format === 'docx'
        ? await exportSemesterPlan(semesterPlan, user)
        : await exportSemesterPlanPdf(semesterPlan, user, charge)
    return { semesterPlan, buffer }
  }

  async exists(userId: number, planId: string | number) {
    return Boolean(await this.repository.findForUser(planId, userId))
  }

  async create(user: User, data: Record<string, any>) {
    return SemesterPlan.create({ ...data, userId: user.id })
  }

  async update(userId: number, planId: string | number, data: Record<string, any>) {
    const semesterPlan = await this.repository.findForUser(planId, userId)
    if (!semesterPlan) return false

    await semesterPlan.merge(data).save()
    return true
  }

  async destroy(userId: number, planId: string | number) {
    const semesterPlan = await this.repository.findForUser(planId, userId)
    if (!semesterPlan) return false

    await semesterPlan.delete()
    return true
  }

  async generate(user: User, data: GenerateSemesterPlanData) {
    const schoolClass = await this.repository.findOwnedClass(data.classId, user.id)
    if (!schoolClass) return { status: 'missing_class' as const }

    const semester = await Semester.find(data.semesterId)
    if (!semester) return { status: 'missing_semester' as const }

    if (!(await creditService.hasEnoughGenerationCredits(user, 1))) {
      return { status: 'insufficient_credits' as const }
    }

    const curriculum = await getCurriculumContext(user.id, data.learningSequenceId)
    const prompt = semesterPlanPrompt({ subject: data.subject })
    let content: Record<string, any>
    try {
      const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      content = normalizeStringArraySections(raw, ['minggu', 'kegiatan', 'target', 'materi'])
    } catch (error) {
      return {
        status: 'generation_error' as const,
        message:
          error instanceof AiServiceError ? error.message : 'Gagal generate Promes. Coba lagi.',
      }
    }
    content.curriculum = curriculum

    const semesterPlan = await SemesterPlan.create({
      userId: user.id,
      classId: data.classId,
      semesterId: data.semesterId,
      subject: data.subject,
      content,
    })
    await creditService.chargeGeneration(user, 1, `Program Semester: ${data.subject}`)

    return { status: 'created' as const, semesterPlan }
  }
}

export const semesterPlanService = new SemesterPlanService()
