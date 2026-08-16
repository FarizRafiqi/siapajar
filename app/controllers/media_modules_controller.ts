import type { HttpContext } from '@adonisjs/core/http'
import MediaModule from '#models/media_module'
import SchoolClass from '#models/school_class'
import { generateMediaModuleValidator } from '#validators/generate'
import { AiServiceError } from '#services/ai_service'
import { aiQueueService } from '#services/ai_queue_service'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { mediaModulePrompt } from '#services/ai_prompts'
import LearningSequence from '#models/learning_sequence'
import {
  exportMediaModulePdf,
  exportMediaModulePptx,
  safeFilename,
} from '#services/media_module_export_service'

export default class MediaModulesController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const mediaModules = await MediaModule.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .orderBy('created_at', 'desc')

    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')
    const sequences = await LearningSequence.query().where('user_id', user.id).orderBy('title')

    return inertia.render('dashboard/media-modules/index', {
      mediaModules: mediaModules.map((m) => m.toJSON()),
      classes: classes.map((c) => c.toJSON()),
      sequences: sequences.map((s) => s.toJSON()),
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const mediaModule = await MediaModule.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .first()

    if (!mediaModule) {
      return response.redirect('/media-modules')
    }

    return inertia.render('dashboard/media-modules/show', {
      mediaModule: mediaModule.toJSON(),
    })
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { classId, theme, subtheme, learningSequenceId } = await request.validateUsing(
      generateMediaModuleValidator
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
    let result: {
      slides?: Record<string, any>[]
      loosePartsGuide?: Record<string, any>
      curriculum?: unknown
    }
    try {
      const prompt = mediaModulePrompt({
        theme,
        subtheme,
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
      session.flash(
        'error',
        error instanceof AiServiceError ? error.message : 'Gagal generate Media Ajar. Coba lagi.'
      )
      return response.redirect().back()
    }

    const subTitle = subtheme ? ` - ${subtheme}` : ''
    const title = `Media Ajar & Loose Parts: ${theme}${subTitle}`

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
      classId,
      title,
      theme,
      subtheme: subtheme || null,
      slides,
      loosePartsGuide: result.loosePartsGuide || null,
      status: 'draft',
    })

    session.flash('success', 'Media Ajar berhasil dibuat')
    if (imageQuotaWarning) {
      session.flash(
        'error',
        'Sebagian ilustrasi belum tersedia karena quota gambar atau provider AI.'
      )
    }
    return response.redirect().toRoute('media-modules.show', { id: mediaModule.id })
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const mediaModule = await MediaModule.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!mediaModule) {
      return response.redirect('/media-modules')
    }

    await mediaModule.delete()

    session.flash('success', 'Media Ajar berhasil dihapus')
    return response.redirect().toRoute('media-modules.index')
  }

  async exportPptx({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const mediaModule = await MediaModule.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .first()

    if (!mediaModule) return response.notFound({ message: 'Media Ajar tidak ditemukan' })

    const isPreview = request.input('disposition') === 'inline'
    const buffer = await exportMediaModulePptx(mediaModule, user, !isPreview)
    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    )
    const disposition = request.input('disposition') === 'inline' ? 'inline' : 'attachment'
    response.header(
      'Content-Disposition',
      `${disposition}; filename="${safeFilename(mediaModule.title)}.pptx"`
    )
    return response.send(buffer)
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const mediaModule = await MediaModule.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .first()

    if (!mediaModule) return response.notFound({ message: 'Media Ajar tidak ditemukan' })

    const isPreview = request.input('disposition') === 'inline'
    const buffer = await exportMediaModulePdf(mediaModule, user, !isPreview)
    response.header('Content-Type', 'application/pdf')
    const disposition = request.input('disposition') === 'inline' ? 'inline' : 'attachment'
    response.header(
      'Content-Disposition',
      `${disposition}; filename="${safeFilename(mediaModule.title)}.pdf"`
    )
    return response.send(buffer)
  }
}
