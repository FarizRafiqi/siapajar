import type { HttpContext } from '@adonisjs/core/http'
import Exam from '#models/exam'
import SchoolClass from '#models/school_class'
import Subject from '#models/subject'
import { createExamValidator, updateExamValidator } from '#validators/exam'
import { generateExamValidator } from '#validators/generate'
import { exportExam } from '#services/export_service'
import { exportExamPdf } from '#services/pdf_export_service'
import { renderExamWorksheetHtml } from '#services/exam_worksheet_service'
import { EntitlementError } from '#services/entitlement_service'
import GenerateExam from '#jobs/generate_exam'
import { persistUploadedVisualAsset } from '#services/visual_asset_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

/** Label Indonesia untuk kode jenis soal yang tersimpan di database. */
const EXAM_TYPE_LABELS: Record<'midterm' | 'final' | 'daily' | 'summative', string> = {
  midterm: 'PTS',
  final: 'PAS',
  daily: 'Ulangan Harian',
  summative: 'Sumatif',
}

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
    const exams = await Exam.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .orderBy('created_at', 'desc')

    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')

    const subjects = await Subject.query()
      .where('user_id', user.id)
      .where('education_level', user.educationLevel || 'sd')
      .where('is_active', true)
      .orderBy('name')

    return inertia.render('dashboard/exams/index', {
      exams: exams.map((e) => e.toJSON()),
      classes: classes.map((c) => c.toJSON()),
      subjects: subjects.map((s) => s.toJSON()),
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .first()

    if (!exam) {
      return response.redirect('/exams')
    }

    return inertia.render('dashboard/exams/show', {
      exam: exam.toJSON(),
    })
  }

  async generationStatus({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query().where('id', params.id).where('user_id', user.id).first()

    if (!exam) return response.notFound({ message: 'Naskah soal tidak ditemukan' })

    return response.ok({
      examId: exam.id,
      status: exam.generationStatus,
      progress: exam.generationProgress,
      questionCount: Array.isArray(exam.questions) ? exam.questions.length : 0,
    })
  }

  async uploadImage({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query().where('id', params.id).where('user_id', user.id).first()
    if (!exam) return response.notFound({ message: 'Naskah soal tidak ditemukan' })

    const file = request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png'],
    })
    if (!file || !file.isValid || !file.tmpPath) {
      return response.badRequest({ message: file?.errors?.[0]?.message || 'Gambar tidak valid' })
    }

    try {
      const asset = await persistUploadedVisualAsset({
        user,
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
    const exam = await Exam.query().where('id', params.id).where('user_id', user.id).first()

    if (!exam) {
      return response.redirect('/exams')
    }

    let buffer: Buffer
    try {
      buffer = await exportExam(exam, user)
    } catch (error) {
      return exportErrorResponse(error, 'DOCX', response)
    }
    const safeTitle = exam.title.replaceAll(/[^\w\s-]/gi, '').replaceAll(/\s+/g, '_')
    const filename = `Naskah_Soal_${safeTitle || 'RA_TK'}.docx`

    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    response.header('Content-Disposition', `attachment; filename="${filename}"`)
    return response.send(buffer)
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query().where('id', params.id).where('user_id', user.id).first()

    if (!exam) {
      return response.redirect('/exams')
    }

    let buffer: Buffer
    const isInline = wantsInlinePreview(request)
    try {
      buffer = await exportExamPdf(exam, user, !isInline)
    } catch (error) {
      return exportErrorResponse(error, 'PDF', response)
    }
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Naskah Soal', exam.title], 'pdf'),
      { inline: isInline }
    )
  }

  async printPreview({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query().where('id', params.id).where('user_id', user.id).first()

    if (!exam) return response.redirect('/exams')

    response.header('Content-Type', 'text/html; charset=utf-8')
    return response.send(renderExamWorksheetHtml(exam, user))
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createExamValidator)

    await Exam.create({
      ...data,
      userId: user.id,
      status: 'draft',
      header: data.header ?? {},
    })

    session.flash('success', 'Soal berhasil dibuat')
    return response.redirect().toRoute('exams.index')
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query().where('id', params.id).where('user_id', user.id).first()

    if (!exam) {
      return response.redirect('/exams')
    }

    const data = await request.validateUsing(updateExamValidator)
    await exam.merge(data).save()

    session.flash('success', 'Soal berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query().where('id', params.id).where('user_id', user.id).first()

    if (!exam) {
      return response.redirect('/exams')
    }

    await exam.delete()

    session.flash('success', 'Soal berhasil dihapus')
    return response.redirect().toRoute('exams.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { classId, subject, type, topic, questionCount, examMode, learningSequenceId } =
      await request.validateUsing(generateExamValidator)

    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      const message = 'Kelas tidak ditemukan'
      if (request.header('accept')?.includes('application/json')) {
        return response.status(404).json({ message })
      }
      session.flash('error', message)
      return response.redirect().back()
    }

    const exam = await Exam.create({
      userId: user.id,
      classId,
      title: EXAM_TYPE_LABELS[type] + ' ' + subject + ' - ' + topic,
      type,
      questions: [],
      header: {
        institutionName: user.schoolName || '',
        institutionAddress: '',
        academicYear: '',
        semester: '',
        groupName: schoolClass.name,
        subject,
        examLabel: EXAM_TYPE_LABELS[type],
        studentName: '',
        date: '',
      },
      status: 'draft',
      generationStatus: 'queued',
      generationProgress: {
        stage: 'queued',
        current: 0,
        total: 0,
        message: 'Menunggu proses pembuatan naskah...',
        errors: [],
      },
    })

    try {
      await GenerateExam.dispatch({
        examId: exam.id,
        userId: user.id,
        classId,
        subject,
        type,
        topic,
        questionCount,
        examMode,
        learningSequenceId,
      }).dedup({ id: 'exam-generation-' + exam.id, ttl: '15m' })
    } catch (error) {
      exam.generationStatus = 'failed'
      exam.generationProgress = {
        stage: 'failed',
        current: 0,
        total: 0,
        message: 'Pembuatan naskah gagal dimulai.',
        errors: [
          {
            stage: 'queued',
            message: error instanceof Error ? error.message : 'Antrean AI tidak tersedia.',
          },
        ],
      }
      await exam.save()
      const message = 'Antrean pembuatan soal tidak tersedia. Coba lagi.'
      if (request.header('accept')?.includes('application/json')) {
        return response.status(503).json({ message, examId: exam.id })
      }
      session.flash('error', message)
      return response.redirect().back()
    }

    if (request.header('accept')?.includes('application/json')) {
      return response.status(202).json({
        examId: exam.id,
        status: exam.generationStatus,
        progress: exam.generationProgress,
      })
    }

    session.flash('success', 'Pembuatan naskah soal dimulai')
    return response.redirect().toRoute('exams.show', { id: exam.id })
  }
}
