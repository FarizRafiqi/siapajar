import type { HttpContext } from '@adonisjs/core/http'
import { expressToolsService } from '#services/express_tools_service'
import { creditService } from '#services/credit_service'

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

  /**
   * Prota & Promes Unified Express View
   */
  async protaPromes({ inertia, auth }: HttpContext) {
    const data = await expressToolsService.getProtaPromesData(auth.user!)

    return inertia.render('dashboard/tools/prota-promes', data)
  }

  /**
   * Rapor Narasi Deskripsi Kurikulum Merdeka Express View
   */
  async rapor({ inertia, auth }: HttpContext) {
    const data = await expressToolsService.getRaporData(auth.user!)

    return inertia.render('dashboard/tools/rapor', data)
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
      request.only(['subject', 'topic', 'kktp', 'scores', 'method', 'rawInput'])
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
      request.only(['subject', 'topic', 'date', 'grade', 'lessonNotes'])
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
      isTk: auth.user!.educationLevel === 'tk',
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
