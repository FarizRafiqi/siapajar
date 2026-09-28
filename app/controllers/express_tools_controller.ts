import type { HttpContext } from '@adonisjs/core/http'
import { expressToolsService } from '#services/express_tools_service'
import { creditService } from '#services/credit_service'
import { generateProtaPromesValidator } from '#validators/generate'
import { generateExamValidator } from '#validators/generate'
import { generateReportNarrativesValidator } from '#validators/generate'
import { examService } from '#services/exam_service'
import { reportCardService } from '#services/report_card_service'

export default class ExpressToolsController {
  /**
   * Modul Ajar / RPPM Express View
   */
  async modulAjar({ inertia, auth }: HttpContext) {
    const data = await expressToolsService.getModulAjarData(auth.user!)

    return inertia.render('dashboard/tools/modul-ajar', data)
  }

  /**
   * LKPD Express View
   */
  async lkpd({ inertia, auth }: HttpContext) {
    const data = await expressToolsService.getLkpdData(auth.user!)

    return inertia.render('dashboard/tools/lkpd', data)
  }

  /**
   * Bank Soal AI Express View
   */
  async soal({ inertia, auth }: HttpContext) {
    const data = await expressToolsService.getSoalData(auth.user!)

    return inertia.render('dashboard/tools/soal', data)
  }

  async generateSoal({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(generateExamValidator)
    const result = await examService.generate(auth.user!, data)

    if (result.status === 'missing_class') {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }
    if (result.status === 'insufficient_credits') {
      session.flash('error', 'Saldo kredit Anda habis. Silakan top-up kredit.')
      return response.redirect().back()
    }
    if (result.status === 'queue_unavailable') {
      session.flash('error', 'Antrean AI belum tersedia. Coba lagi setelah worker aktif.')
      return response.redirect().back()
    }

    session.flash('success', 'Paket soal masuk antrean dan akan siap ditinjau.')
    return response.redirect().toRoute('exams.show', { id: result.exam.id })
  }

  /**
   * Prota & Promes Unified Express View
   */
  async protaPromes({ inertia, auth }: HttpContext) {
    const data = await expressToolsService.getProtaPromesData(auth.user!)

    return inertia.render('dashboard/tools/prota-promes', data)
  }

  async generateProtaPromes({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(generateProtaPromesValidator)
    const result = await expressToolsService.generateProtaPromes(auth.user!, data)

    if (result.status === 'invalid_input' || result.status === 'missing_reference') {
      session.flash('error', result.message)
      return response.redirect().back()
    }
    if (result.status === 'insufficient_credits') {
      session.flash(
        'error',
        'Saldo kredit Anda tidak mencukupi (butuh 2 kredit). Silakan top-up kredit.'
      )
      return response.redirect().back()
    }
    if (result.status === 'generation_error') {
      session.flash('error', result.message)
      return response.redirect().back()
    }

    session.flash('success', 'Prota dan Promes berhasil digenerate.')
    return response.redirect().toRoute('express.protaPromes')
  }

  /**
   * Rapor Narasi Deskripsi Kurikulum Merdeka Express View
   */
  async rapor({ inertia, auth }: HttpContext) {
    const data = await expressToolsService.getRaporData(auth.user!)

    return inertia.render('dashboard/tools/rapor', data)
  }

  async generateRapor({ request, response, session, auth }: HttpContext) {
    const { classId, semesterId } = await request.validateUsing(generateReportNarrativesValidator)
    const result = await reportCardService.generateNarratives(auth.user!.id, classId, semesterId)
    if (result.status === 'context_not_found') {
      session.flash('error', 'Kelas atau semester tidak ditemukan')
      return response.redirect().back()
    }

    session.flash(
      'success',
      `Pembuatan draft narasi dimulai (job ${result.jobId}). Tinjau dan edit sebelum menyetujui.`
    )
    return response.redirect().back()
  }

  /**
   * Katrol Nilai & Remedial View
   */
  async katrol({ inertia, auth }: HttpContext) {
    const data = await expressToolsService.getClassesData(auth.user!)

    return inertia.render('dashboard/tools/katrol', data)
  }

  /**
   * Generate Katrol Nilai AI / Formula
   */
  async generateKatrol({ request, response, auth }: HttpContext) {
    const result = await expressToolsService.generateKatrol(
      auth.user!,
      request.only([
        'subject',
        'topic',
        'kktp',
        'passingGrade',
        'targetMin',
        'targetMax',
        'scores',
        'method',
        'rawInput',
      ])
    )

    if (result.status === 'invalid_input') {
      return response.badRequest({ message: result.message })
    }

    if (result.status === 'error') {
      return response.badRequest({ success: false, message: result.message })
    }

    if (result.status === 'insufficient_credits') {
      return response.paymentRequired({ message: result.message })
    }

    const remainingCredits = await creditService.getBalance(auth.user!.id)
    return response.ok({
      success: true,
      ...result.data,
      data: result.data,
      remainingCredits,
    })
  }

  /**
   * Jurnal Mengajar & Refleksi Guru View
   */
  async jurnal({ inertia, auth }: HttpContext) {
    const data = await expressToolsService.getClassesData(auth.user!)

    return inertia.render('dashboard/tools/jurnal', data)
  }

  /**
   * Generate Jurnal Mengajar AI
   */
  async generateJurnal({ request, response, auth }: HttpContext) {
    const result = await expressToolsService.generateJurnal(
      auth.user!,
      request.only([
        'subject',
        'topic',
        'date',
        'grade',
        'schoolClass',
        'attendanceNotes',
        'attendanceSummary',
        'lessonNotes',
        'teacherNotes',
      ])
    )

    if (result.status === 'invalid_input' || result.status === 'error') {
      return response.badRequest({
        ...(result.status === 'error' ? { success: false } : {}),
        message: result.message,
      })
    }

    if (result.status === 'insufficient_credits') {
      return response.paymentRequired({ message: result.message })
    }

    const remainingCredits = await creditService.getBalance(auth.user!.id)
    return response.ok({
      ...result.data,
      success: true,
      data: result.data,
      remainingCredits,
    })
  }

  /**
   * Kokurikuler / Modul P5 View
   */
  async kokurikuler({ inertia, auth }: HttpContext) {
    const data = await expressToolsService.getClassesData(auth.user!)

    return inertia.render('dashboard/tools/kokurikuler', {
      ...data,
      isTk: auth.user!.isTk,
      educationLevel: auth.user!.educationLevel,
      institutionType: auth.user!.institutionType,
    })
  }

  /**
   * Generate Modul Kokurikuler / P5 AI (2 Kredit)
   */
  async generateKokurikuler({ request, response, auth }: HttpContext) {
    const result = await expressToolsService.generateKokurikuler(
      auth.user!,
      request.only([
        'theme',
        'topic',
        'projectTitle',
        'phase',
        'targetLevel',
        'targetDuration',
        'dimensions',
      ])
    )

    if (result.status === 'invalid_input' || result.status === 'error') {
      return response.badRequest({
        ...(result.status === 'error' ? { success: false } : {}),
        message: result.message,
      })
    }

    if (result.status === 'insufficient_credits') {
      return response.paymentRequired({ message: result.message })
    }

    const remainingCredits = await creditService.getBalance(auth.user!.id)
    return response.ok({
      success: true,
      ...result.data,
      data: result.data,
      remainingCredits,
    })
  }
}
