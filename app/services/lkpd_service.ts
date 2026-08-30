import Lkpd from '#models/lkpd'
import type User from '#models/user'
import { lkpdRepository } from '#repositories/lkpd_repository'
import type { LkpdRepository } from '#repositories/lkpd_repository'
import { exportLkpd } from '#services/export_service'
import { exportLkpdPdf } from '#services/pdf_export_service'
import { AiServiceError } from '#services/ai_service'
import { aiQueueService } from '#services/ai_queue_service'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { lkpdPrompt } from '#services/ai_prompts'
import { creditService } from '#services/credit_service'

export type GenerateLkpdData = {
  classId: number
  theme: string
  subtheme?: string
  ageGroup?: string
  learningSequenceId?: number
}

export type GenerateLkpdResult =
  | { status: 'missing_class' }
  | { status: 'insufficient_credits' }
  | { status: 'generation_error'; message: string }
  | { status: 'created'; lkpd: Lkpd }

export class LkpdService {
  constructor(private readonly repository: LkpdRepository = lkpdRepository) {}

  async getIndexData(user: User) {
    const { lkpds, classes, sequences } = await this.repository.getIndexData(user.id)

    return {
      lkpds: lkpds.map((lkpd) => lkpd.toJSON()),
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      sequences: sequences.map((sequence) => sequence.toJSON()),
    }
  }

  async getShowData(userId: number, lkpdId: string | number) {
    const lkpd = await this.repository.findForUser(lkpdId, userId, true)
    return lkpd ? { lkpd: lkpd.toJSON() } : null
  }

  async getExportData(user: User, lkpdId: string | number, format: 'docx' | 'pdf', charge = true) {
    const lkpd = await this.repository.findForUser(lkpdId, user.id, true)
    if (!lkpd) return null

    const buffer =
      format === 'docx' ? await exportLkpd(lkpd, user) : await exportLkpdPdf(lkpd, user, charge)
    return { lkpd, buffer }
  }

  async destroy(userId: number, lkpdId: string | number) {
    const lkpd = await this.repository.findForUser(lkpdId, userId)
    if (!lkpd) return false

    await lkpd.delete()
    return true
  }

  async generate(user: User, data: GenerateLkpdData): Promise<GenerateLkpdResult> {
    const schoolClass = await this.repository.findOwnedClass(data.classId, user.id)
    if (!schoolClass) return { status: 'missing_class' }

    if (!(await creditService.hasEnoughGenerationCredits(user, 1))) {
      return { status: 'insufficient_credits' }
    }

    const curriculum = await getCurriculumContext(user.id, data.learningSequenceId)
    let content: Record<string, any>
    try {
      const prompt = lkpdPrompt({
        theme: data.theme,
        subtheme: data.subtheme,
        ageGroup: data.ageGroup || 'Kelompok B',
        institutionType: user.educationLevel || 'tk',
      })

      content = await aiQueueService.enqueueAiJson<Record<string, any>>({
        userId: user.id,
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      content.curriculum = curriculum
    } catch (error) {
      return {
        status: 'generation_error' as const,
        message:
          error instanceof AiServiceError ? error.message : 'Gagal generate LKPD. Coba lagi.',
      }
    }

    const subTitle = data.subtheme ? ` - ${data.subtheme}` : ''
    const title = content.title || `LKPD Tema: ${data.theme}${subTitle}`
    const lkpd = await Lkpd.create({
      userId: user.id,
      classId: data.classId,
      title,
      theme: data.theme,
      subtheme: data.subtheme || null,
      ageGroup: data.ageGroup || 'Kelompok B (5-6 Tahun)',
      institutionType: user.educationLevel?.toUpperCase() || 'TK',
      content,
      status: 'draft',
    })
    await creditService.chargeGeneration(user, 1, `LKPD: ${data.theme}`)

    return { status: 'created', lkpd }
  }
}

export const lkpdService = new LkpdService()
