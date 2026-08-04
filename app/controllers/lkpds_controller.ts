import type { HttpContext } from '@adonisjs/core/http'
import Lkpd from '#models/lkpd'
import SchoolClass from '#models/school_class'
import { generateLkpdValidator } from '#validators/generate'
import { AiServiceError } from '#services/ai_service'
import { aiQueueService } from '#services/ai_queue_service'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { lkpdPrompt } from '#services/ai_prompts'
import LearningSequence from '#models/learning_sequence'

export default class LkpdsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const lkpds = await Lkpd.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .orderBy('created_at', 'desc')

    const classes = await SchoolClass.query()
      .where('user_id', user.id)
      .orderBy('name')
    const sequences = await LearningSequence.query().where('user_id', user.id).orderBy('title')

    return inertia.render('dashboard/lkpd/index', {
      lkpds: lkpds.map((l) => l.toJSON()),
      classes: classes.map((c) => c.toJSON()),
      sequences: sequences.map((s) => s.toJSON()),
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const lkpd = await Lkpd.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .first()

    if (!lkpd) {
      return response.redirect('/lkpd')
    }

    return inertia.render('dashboard/lkpd/show', {
      lkpd: lkpd.toJSON(),
    })
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { classId, theme, subtheme, ageGroup, learningSequenceId } = await request.validateUsing(generateLkpdValidator)

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
      const prompt = lkpdPrompt({
        theme,
        subtheme,
        ageGroup: ageGroup || 'Kelompok B',
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
      session.flash('error', error instanceof AiServiceError ? error.message : 'Gagal generate LKPD. Coba lagi.')
      return response.redirect().back()
    }

    const subTitle = subtheme ? ` - ${subtheme}` : ''
    const title = content.title || `LKPD Tema: ${theme}${subTitle}`

    const lkpd = await Lkpd.create({
      userId: user.id,
      classId,
      title,
      theme,
      subtheme: subtheme || null,
      ageGroup: ageGroup || 'Kelompok B (5-6 Tahun)',
      institutionType: user.educationLevel?.toUpperCase() || 'TK',
      content,
      status: 'draft',
    })

    session.flash('success', 'LKPD / Lembar Aktivitas Anak berhasil digenerate')
    return response.redirect().toRoute('lkpd.show', { id: lkpd.id })
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const lkpd = await Lkpd.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!lkpd) {
      return response.redirect('/lkpd')
    }

    await lkpd.delete()

    session.flash('success', 'LKPD berhasil dihapus')
    return response.redirect().toRoute('lkpd.index')
  }
}
