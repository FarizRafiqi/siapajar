import type { HttpContext } from '@adonisjs/core/http'
import SchoolClass from '#models/school_class'
import Subject from '#models/subject'
import TeachingModule from '#models/teaching_module'
import Exam from '#models/exam'
import Lkpd from '#models/lkpd'
import AnnualPlan from '#models/annual_plan'
import SemesterPlan from '#models/semester_plan'
import ReportNarrative from '#models/report_narrative'
import { callAiJsonForUser } from '#services/user_ai_service'
import { katrolPrompt, jurnalPrompt, kokurikulerPrompt } from '#services/ai_prompts'
import { creditService } from '#services/credit_service'
import { AiServiceError } from '#services/ai_service'

export default class ExpressToolsController {
  /**
   * Modul Ajar / RPPM Express View
   */
  async modulAjar({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const isTk = user.educationLevel === 'tk'

    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')
    const subjects = await Subject.query()
      .where('user_id', user.id)
      .where('is_active', true)
      .orderBy('name')

    const recentModules = await TeachingModule.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .orderBy('created_at', 'desc')
      .limit(10)

    return inertia.render('dashboard/tools/modul-ajar', {
      isTk,
      classes: classes.map((c) => c.toJSON()),
      subjects: subjects.map((s) => s.toJSON()),
      recentModules: recentModules.map((m) => m.toJSON()),
    })
  }

  /**
   * LKPD Express View
   */
  async lkpd({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')
    const recentLkpds = await Lkpd.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(10)

    return inertia.render('dashboard/tools/lkpd', {
      classes: classes.map((c) => c.toJSON()),
      recentLkpds: recentLkpds.map((l) => l.toJSON()),
      institutionType: user.institutionType || 'tk',
    })
  }

  /**
   * Bank Soal AI Express View
   */
  async soal({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')
    const subjects = await Subject.query()
      .where('user_id', user.id)
      .where('is_active', true)
      .orderBy('name')

    const recentExams = await Exam.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(10)

    return inertia.render('dashboard/tools/soal', {
      classes: classes.map((c) => c.toJSON()),
      subjects: subjects.map((s) => s.toJSON()),
      recentExams: recentExams.map((e) => e.toJSON()),
      isTk: user.educationLevel === 'tk',
    })
  }

  /**
   * Prota & Promes Unified Express View
   */
  async protaPromes({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')
    const subjects = await Subject.query()
      .where('user_id', user.id)
      .where('is_active', true)
      .orderBy('name')

    const annualPlans = await AnnualPlan.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(10)

    const semesterPlans = await SemesterPlan.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(10)

    return inertia.render('dashboard/tools/prota-promes', {
      classes: classes.map((c) => c.toJSON()),
      subjects: subjects.map((s) => s.toJSON()),
      annualPlans: annualPlans.map((p) => p.toJSON()),
      semesterPlans: semesterPlans.map((p) => p.toJSON()),
    })
  }

  /**
   * Rapor Narasi Deskripsi Kurikulum Merdeka Express View
   */
  async rapor({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')
    const recentNarratives = await ReportNarrative.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(10)

    return inertia.render('dashboard/tools/rapor', {
      classes: classes.map((c) => c.toJSON()),
      recentNarratives: recentNarratives.map((n) => n.toJSON()),
      isTk: user.educationLevel === 'tk',
    })
  }

  /**
   * Katrol Nilai & Remedial View
   */
  async katrol({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')
    return inertia.render('dashboard/tools/katrol', {
      classes: classes.map((c) => c.toJSON()),
    })
  }

  /**
   * Generate Katrol Nilai AI / Formula
   */
  async generateKatrol({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { subject, topic, kktp, scores, method } = request.only([
      'subject',
      'topic',
      'kktp',
      'scores',
      'method',
    ])

    if (!subject || !scores || !Array.isArray(scores) || scores.length === 0) {
      return response.badRequest({ message: 'Data nilai dan mata pelajaran wajib diisi' })
    }

    if (!(await creditService.hasEnoughCredits(user.id, 1))) {
      return response.paymentRequired({
        message: 'Saldo kredit Anda habis. Silakan top-up kredit untuk melanjutkan.',
      })
    }

    try {
      const prompt = katrolPrompt({
        subject,
        topic: topic || 'Ulangan Harian',
        kktp: Number(kktp) || 75,
        scores,
        method: method || 'linear',
      })

      const raw = await callAiJsonForUser<Record<string, any>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })

      await creditService.deductCredits(
        user.id,
        1,
        `Katrol Nilai & Remedial: ${subject} (${scores.length} siswa)`
      )

      return response.ok({
        success: true,
        data: raw,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message:
          error instanceof AiServiceError ? error.message : 'Gagal memproses analisis katrol nilai',
      })
    }
  }

  /**
   * Jurnal Mengajar & Refleksi Guru View
   */
  async jurnal({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')
    return inertia.render('dashboard/tools/jurnal', {
      classes: classes.map((c) => c.toJSON()),
    })
  }

  /**
   * Generate Jurnal Mengajar AI
   */
  async generateJurnal({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { subject, topic, date, grade, lessonNotes } = request.only([
      'subject',
      'topic',
      'date',
      'grade',
      'lessonNotes',
    ])

    if (!subject || !topic) {
      return response.badRequest({ message: 'Mata pelajaran dan topik wajib diisi' })
    }

    if (!(await creditService.hasEnoughCredits(user.id, 1))) {
      return response.paymentRequired({
        message: 'Saldo kredit Anda habis. Silakan top-up kredit untuk melanjutkan.',
      })
    }

    try {
      const prompt = jurnalPrompt({
        subject,
        topic,
        date: date || new Date().toISOString().split('T')[0],
        grade: grade || 'Kelas 1',
        lessonNotes,
      })

      const raw = await callAiJsonForUser<Record<string, any>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })

      await creditService.deductCredits(
        user.id,
        1,
        `Jurnal Mengajar & Refleksi: ${subject} - ${topic}`
      )

      return response.ok({
        success: true,
        data: raw,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message:
          error instanceof AiServiceError ? error.message : 'Gagal membuat jurnal mengajar harian',
      })
    }
  }

  /**
   * Kokurikuler / Modul P5 View
   */
  async kokurikuler({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')
    return inertia.render('dashboard/tools/kokurikuler', {
      classes: classes.map((c) => c.toJSON()),
      isTk: user.educationLevel === 'tk',
    })
  }

  /**
   * Generate Modul Kokurikuler / P5 AI
   */
  async generateKokurikuler({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { theme, topic, phase, targetLevel, dimensions } = request.only([
      'theme',
      'topic',
      'phase',
      'targetLevel',
      'dimensions',
    ])

    if (!theme || !topic) {
      return response.badRequest({ message: 'Tema dan topik proyek wajib diisi' })
    }

    if (!(await creditService.hasEnoughCredits(user.id, 1))) {
      return response.paymentRequired({
        message: 'Saldo kredit Anda habis. Silakan top-up kredit untuk melanjutkan.',
      })
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

      const raw = await callAiJsonForUser<Record<string, any>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })

      await creditService.deductCredits(
        user.id,
        1,
        `Modul Projek P5 / Kokurikuler: ${theme} - ${topic}`
      )

      return response.ok({
        success: true,
        data: raw,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message:
          error instanceof AiServiceError ? error.message : 'Gagal membuat modul kokurikuler P5',
      })
    }
  }
}
