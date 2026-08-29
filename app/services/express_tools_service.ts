import type User from '#models/user'
import { expressToolsRepository } from '#repositories/express_tools_repository'
import type { ExpressToolsRepository } from '#repositories/express_tools_repository'
import { AiServiceError } from '#services/ai_service'
import { katrolPrompt, jurnalPrompt, kokurikulerPrompt } from '#services/ai_prompts'
import { callAiJsonForUser } from '#services/user_ai_service'
import { creditService } from '#services/credit_service'

export type ExpressGenerationResult<T> =
  | { status: 'invalid_input'; message: string }
  | { status: 'insufficient_credits'; message: string }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T }

type FreeExpressGenerationResult<T> = Exclude<
  ExpressGenerationResult<T>,
  { status: 'insufficient_credits' }
>

export class ExpressToolsService {
  constructor(private readonly repository: ExpressToolsRepository = expressToolsRepository) {}

  async getModulAjarData(user: User) {
    const isTk = user.educationLevel === 'tk'
    const data = await this.repository.getModulAjarData(user.id, isTk)
    const recentModules = isTk
      ? data.weeklyLessonPlans.map((plan) => ({
          id: plan.id,
          title: plan.theme || 'Modul Ajar RPPM',
          subject: plan.content?.subject || 'Tematik PAUD KBC',
          phase: 'Fondasi',
          status: plan.status || 'published',
          createdAt: plan.createdAt ? plan.createdAt.toISO() || '' : '',
          schoolClass: plan.schoolClass ? plan.schoolClass.toJSON() : undefined,
        }))
      : data.teachingModules.map((module) => ({
          id: module.id,
          title: module.title || 'Modul Ajar',
          subject: module.subject || '',
          phase: module.phase || '',
          status: module.status || 'published',
          createdAt: module.createdAt ? module.createdAt.toISO() || '' : '',
          schoolClass: module.schoolClass ? module.schoolClass.toJSON() : undefined,
        }))

    return {
      isTk,
      classes: data.classes.map((schoolClass) => schoolClass.toJSON()),
      subjects: data.subjects.map((subject) => subject.toJSON()),
      recentModules,
    }
  }

  async getLkpdData(user: User) {
    const { classes, recentLkpds } = await this.repository.getLkpdData(user.id)
    return {
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      recentLkpds: recentLkpds.map((lkpd) => lkpd.toJSON()),
      institutionType: user.institutionType || 'tk',
    }
  }

  async getSoalData(user: User) {
    const { classes, subjects, recentExams } = await this.repository.getSoalData(user.id)
    return {
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      subjects: subjects.map((subject) => subject.toJSON()),
      recentExams: recentExams.map((exam) => exam.toJSON()),
      isTk: user.educationLevel === 'tk',
    }
  }

  async getProtaPromesData(user: User) {
    const { classes, subjects, annualPlans, semesterPlans } =
      await this.repository.getProtaPromesData(user.id)
    return {
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      subjects: subjects.map((subject) => subject.toJSON()),
      annualPlans: annualPlans.map((plan) => plan.toJSON()),
      semesterPlans: semesterPlans.map((plan) => plan.toJSON()),
    }
  }

  async getRaporData(user: User) {
    const { classes, recentNarratives } = await this.repository.getRaporData(user.id)
    return {
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      recentNarratives: recentNarratives.map((narrative) => narrative.toJSON()),
      isTk: user.educationLevel === 'tk',
    }
  }

  async getClassesData(user: User) {
    const classes = await this.repository.listClasses(user.id)
    return { classes: classes.map((schoolClass) => schoolClass.toJSON()) }
  }

  async generateKatrol(
    user: User,
    input: Record<string, any>
  ): Promise<FreeExpressGenerationResult<Record<string, any>>> {
    const { subject, topic, kktp, scores, method } = input
    if (!subject || !scores || !Array.isArray(scores) || scores.length === 0) {
      return { status: 'invalid_input', message: 'Data nilai dan mata pelajaran wajib diisi' }
    }

    try {
      const prompt = katrolPrompt({
        subject,
        topic: topic || 'Ulangan Harian',
        kktp: Number(kktp) || 75,
        scores,
        method: method || 'linear',
      })
      const data = await callAiJsonForUser<Record<string, any>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      return { status: 'success', data }
    } catch (error) {
      return {
        status: 'error',
        message:
          error instanceof AiServiceError ? error.message : 'Gagal memproses analisis katrol nilai',
      }
    }
  }

  async generateJurnal(
    user: User,
    input: Record<string, any>
  ): Promise<ExpressGenerationResult<Record<string, any>>> {
    const { subject, topic, date, grade, lessonNotes } = input
    if (!subject || !topic) {
      return { status: 'invalid_input', message: 'Mata pelajaran dan topik wajib diisi' }
    }

    if (!(await creditService.hasEnoughCredits(user.id, 1))) {
      return {
        status: 'insufficient_credits',
        message: 'Saldo kredit Anda habis. Silakan top-up kredit untuk melanjutkan.',
      }
    }

    try {
      const prompt = jurnalPrompt({
        subject,
        topic,
        date: date || new Date().toISOString().split('T')[0],
        grade: grade || 'Kelas 1',
        lessonNotes,
      })
      const data = await callAiJsonForUser<Record<string, any>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      await creditService.deductCredits(
        user.id,
        1,
        `Jurnal Mengajar & Refleksi: ${subject} - ${topic}`
      )
      return { status: 'success', data }
    } catch (error) {
      return {
        status: 'error',
        message:
          error instanceof AiServiceError ? error.message : 'Gagal membuat jurnal mengajar harian',
      }
    }
  }

  async generateKokurikuler(
    user: User,
    input: Record<string, any>
  ): Promise<ExpressGenerationResult<Record<string, any>>> {
    const { theme, topic, phase, targetLevel, dimensions } = input
    if (!theme || !topic) {
      return { status: 'invalid_input', message: 'Tema dan topik proyek wajib diisi' }
    }

    if (!(await creditService.hasEnoughCredits(user.id, 2))) {
      return {
        status: 'insufficient_credits',
        message: 'Saldo kredit Anda tidak mencukupi (butuh 2 kredit). Silakan top-up kredit.',
      }
    }

    try {
      const prompt = kokurikulerPrompt({
        theme,
        topic,
        phase: phase || (user.educationLevel === 'tk' ? 'Fondasi' : 'A'),
        targetLevel:
          targetLevel || (user.educationLevel === 'tk' ? 'TK B (5-6 Tahun)' : 'SD Kelas 1'),
        dimensions: Array.isArray(dimensions) ? dimensions : undefined,
      })
      const data = await callAiJsonForUser<Record<string, any>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      await creditService.deductCredits(
        user.id,
        2,
        `Modul Projek P5 / Kokurikuler: ${theme} - ${topic}`
      )
      return { status: 'success', data }
    } catch (error) {
      return {
        status: 'error',
        message:
          error instanceof AiServiceError ? error.message : 'Gagal membuat modul kokurikuler P5',
      }
    }
  }
}

export const expressToolsService = new ExpressToolsService()
