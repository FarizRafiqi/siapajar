import MediaModule from '#models/media_module'
import type User from '#models/user'
import { mediaModuleRepository } from '#repositories/media_module_repository'
import type { MediaModuleRepository } from '#repositories/media_module_repository'
import { AiServiceError } from '#services/ai_service'
import { aiQueueService } from '#services/ai_queue_service'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { mediaModulePrompt } from '#services/ai_prompts'
import { exportMediaModulePdf, exportMediaModulePptx } from '#services/media_module_export_service'

export type GenerateMediaModuleData = {
  classId: number
  theme: string
  subtheme?: string
  learningSequenceId?: number
}

export type GenerateMediaModuleResult =
  | { status: 'missing_class' }
  | { status: 'generation_error'; message: string }
  | { status: 'created'; mediaModule: MediaModule; imageQuotaWarning: boolean }

export class MediaModuleService {
  constructor(private readonly repository: MediaModuleRepository = mediaModuleRepository) {}

  async getIndexData(user: User) {
    const { mediaModules, classes, sequences } = await this.repository.getIndexData(user.id)

    return {
      mediaModules: mediaModules.map((module) => module.toJSON()),
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      sequences: sequences.map((sequence) => sequence.toJSON()),
    }
  }

  async getShowData(userId: number, mediaModuleId: string | number) {
    const mediaModule = await this.repository.findForUser(mediaModuleId, userId, true)
    return mediaModule ? { mediaModule: mediaModule.toJSON() } : null
  }

  async destroy(userId: number, mediaModuleId: string | number) {
    const mediaModule = await this.repository.findForUser(mediaModuleId, userId)
    if (!mediaModule) return false

    await mediaModule.delete()
    return true
  }

  async getExportData(
    user: User,
    mediaModuleId: string | number,
    format: 'pptx' | 'pdf',
    charge = true
  ) {
    const mediaModule = await this.repository.findForUser(mediaModuleId, user.id, true)
    if (!mediaModule) return null

    const buffer =
      format === 'pptx'
        ? await exportMediaModulePptx(mediaModule, user, charge)
        : await exportMediaModulePdf(mediaModule, user, charge)
    return { mediaModule, buffer }
  }

  async generate(user: User, data: GenerateMediaModuleData): Promise<GenerateMediaModuleResult> {
    const schoolClass = await this.repository.findOwnedClass(data.classId, user.id)
    if (!schoolClass) return { status: 'missing_class' }

    const curriculum = await getCurriculumContext(user.id, data.learningSequenceId)
    let result: {
      slides?: Record<string, any>[]
      loosePartsGuide?: Record<string, any>
      curriculum?: unknown
    }
    try {
      const prompt = mediaModulePrompt({
        theme: data.theme,
        subtheme: data.subtheme,
        institutionType: user.educationLevel || 'tk',
      })

      result = await aiQueueService.enqueueAiJson<{
        slides?: Record<string, any>[]
        loosePartsGuide?: Record<string, any>
      }>({
        userId: user.id,
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      result.curriculum = curriculum
    } catch (error) {
      return {
        status: 'generation_error' as const,
        message:
          error instanceof AiServiceError ? error.message : 'Gagal generate Media Ajar. Coba lagi.',
      }
    }

    const subTitle = data.subtheme ? ` - ${data.subtheme}` : ''
    const title = `Media Ajar & Loose Parts: ${data.theme}${subTitle}`
    const slides = Array.isArray(result.slides) ? result.slides : []
    let imageQuotaWarning = false
    for (const slide of slides) {
      const imagePrompt = typeof slide.imagePrompt === 'string' ? slide.imagePrompt.trim() : ''
      if (!imagePrompt) continue
      try {
        const visual = await aiQueueService.enqueueAiVisual({
          userId: user.id,
          prompt: imagePrompt,
          purpose: 'media',
        })
        slide.imageUrl = visual?.url || ''
        slide.assetId = visual?.assetId || null
        slide.assetKind = visual?.kind || null
      } catch {
        imageQuotaWarning = true
        slide.imageUrl = ''
      }
    }

    const mediaModule = await MediaModule.create({
      userId: user.id,
      classId: data.classId,
      title,
      theme: data.theme,
      subtheme: data.subtheme || null,
      slides,
      loosePartsGuide: result.loosePartsGuide || null,
      status: 'draft',
    })

    return { status: 'created', mediaModule, imageQuotaWarning }
  }
}

export const mediaModuleService = new MediaModuleService()
