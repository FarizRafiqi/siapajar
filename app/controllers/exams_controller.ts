import type { HttpContext } from '@adonisjs/core/http'
import { createExamValidator, updateExamValidator } from '#validators/exam'
import { generateExamValidator } from '#validators/generate'
import { EntitlementError } from '#services/entitlement_service'
import { examService } from '#services/exam_service'
import { EXPORT_CONTENT_TYPES, sendExport, wantsInlinePreview } from '#services/export_file_service'

function exportErrorResponse(error: unknown, format: string, response: HttpContext['response']) {
  if (error instanceof EntitlementError) {
    return response.status(422).json({ message: error.message })
  }

  return response.status(503).json({
    message: `${format} belum dapat dibuat. Mesin export sedang tidak siap. Coba lagi setelah konfigurasi server diperbaiki.`,
  })
}

export default class ExamsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const { exams, classes, subjects } = await examService.getIndexData(user)

    return inertia.render('dashboard/exams/index', {
      exams,
      classes,
      subjects,
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const data = await examService.getShowData(user.id, params.id)
    if (!data) return response.redirect('/exams')

    return inertia.render('dashboard/exams/show', data)
  }

  async generationStatus({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await examService.getGenerationStatus(user.id, params.id)
    if (!data) return response.notFound({ message: 'Naskah soal tidak ditemukan' })

    return response.ok(data)
  }

  async uploadImage({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const exam = await examService.findOwnedExam(user.id, params.id)
    if (!exam) return response.notFound({ message: 'Naskah soal tidak ditemukan' })

    const file = request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png'],
    })
    if (!file || !file.isValid || !file.tmpPath) {
      return response.badRequest({ message: file?.errors?.[0]?.message || 'Gambar tidak valid' })
    }

    try {
      const asset = await examService.persistImage(user, {
        filePath: file.tmpPath,
        mimeType: file.type,
        originalName: file.clientName,
      })
      return response.ok({
        url: asset.url,
        assetId: asset.id,
        kind: asset.kind,
        source: asset.source,
      })
    } catch (error) {
      return response.badRequest({
        message: error instanceof Error ? error.message : 'Gambar gagal disimpan',
      })
    }
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    let data: { buffer: Buffer; filename: string } | null
    try {
      data = await examService.getDocxExport(user, params.id)
    } catch (error) {
      return exportErrorResponse(error, 'DOCX', response)
    }
    if (!data) return response.redirect('/exams')

    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    response.header('Content-Disposition', `attachment; filename="${data.filename}"`)
    return response.send(data.buffer)
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const isInline = wantsInlinePreview(request)
    let data: { buffer: Buffer; filename: string } | null
    try {
      data = await examService.getPdfExport(user, params.id, isInline)
    } catch (error) {
      return exportErrorResponse(error, 'PDF', response)
    }
    if (!data) return response.redirect('/exams')

    return sendExport(response, data.buffer, EXPORT_CONTENT_TYPES.pdf, data.filename, {
      inline: isInline,
    })
  }

  async printPreview({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const html = await examService.getPrintPreview(user, params.id)
    if (!html) return response.redirect('/exams')

    response.header('Content-Type', 'text/html; charset=utf-8')
    return response.send(html)
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createExamValidator)

    await examService.create(user, data)

    session.flash('success', 'Soal berhasil dibuat')
    return response.redirect().toRoute('exams.index')
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const exam = await examService.findOwnedExam(user.id, params.id)

    if (!exam) {
      return response.redirect('/exams')
    }

    const data = await request.validateUsing(updateExamValidator)
    await examService.update(exam, data)

    session.flash('success', 'Soal berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const exam = await examService.findOwnedExam(user.id, params.id)

    if (!exam) {
      return response.redirect('/exams')
    }

    await examService.destroy(exam)

    session.flash('success', 'Soal berhasil dihapus')
    return response.redirect().toRoute('exams.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { classId, subject, type, topic, questionCount, examMode, learningSequenceId } =
      await request.validateUsing(generateExamValidator)

    const result = await examService.generate(user, {
      classId,
      subject,
      type,
      topic,
      questionCount,
      examMode,
      learningSequenceId,
    })

    if (result.status === 'missing_class') {
      const message = 'Kelas tidak ditemukan'
      if (request.header('accept')?.includes('application/json')) {
        return response.status(404).json({ message })
      }
      session.flash('error', message)
      return response.redirect().back()
    }

    if (result.status === 'queue_unavailable') {
      const message = 'Antrean pembuatan soal tidak tersedia. Coba lagi.'
      if (request.header('accept')?.includes('application/json')) {
        return response.status(503).json({ message, examId: result.examId })
      }
      session.flash('error', message)
      return response.redirect().back()
    }

    if (request.header('accept')?.includes('application/json')) {
      return response.status(202).json({
        examId: result.exam.id,
        status: result.exam.generationStatus,
        progress: result.exam.generationProgress,
      })
    }

    session.flash('success', 'Pembuatan naskah soal dimulai')
    return response.redirect().toRoute('exams.show', { id: result.exam.id })
  }
}
