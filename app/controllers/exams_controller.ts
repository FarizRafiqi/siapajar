import type { HttpContext } from '@adonisjs/core/http'
import Exam from '#models/exam'
import SchoolClass from '#models/school_class'
import Subject from '#models/subject'
import { createExamValidator, updateExamValidator } from '#validators/exam'
import { generateExamValidator } from '#validators/generate'
import { exportExam } from '#services/export_service'
import { exportExamPdf } from '#services/pdf_export_service'
import { AiServiceError } from '#services/ai_service'
import { aiQueueService } from '#services/ai_queue_service'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { examPrompt } from '#services/ai_prompts'
import { renderExamWorksheetHtml } from '#services/exam_worksheet_service'
import { EntitlementError } from '#services/entitlement_service'

/** Label Indonesia untuk kode jenis soal yang tersimpan di database. */
const EXAM_TYPE_LABELS: Record<'midterm' | 'final' | 'daily' | 'summative', string> = {
  midterm: 'PTS',
  final: 'PAS',
  daily: 'Ulangan Harian',
  summative: 'Sumatif',
}

function normalizeMatchingItems(value: unknown, side: 'left' | 'right') {
  const values = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(/\r?\n|;|•/).map((item) => item.trim())
      : []

  return values
    .map((item, index) => {
      if (typeof item === 'string') return { id: `${side}-${index + 1}`, label: item }
      const record = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
      return {
        id: typeof record.id === 'string' ? record.id : `${side}-${index + 1}`,
        label:
          typeof record.label === 'string'
            ? record.label
            : typeof record.text === 'string'
              ? record.text
              : '',
        imageUrl:
          typeof record.imageUrl === 'string'
            ? record.imageUrl
            : typeof record.image === 'string'
              ? record.image
              : '',
        imagePrompt: typeof record.imagePrompt === 'string' ? record.imagePrompt : '',
      }
    })
    .filter((item) => item.label || item.imageUrl || item.imagePrompt)
}

const PAUD_QUESTION_TYPES = [
  'multiple_choice',
  'essay',
  'visual',
  'matching',
  'practical',
  'oral',
  'fill_blank_image',
  'vertical_math',
  'count_and_circle',
  'coloring',
  'tracing',
] as const

function generatedImagePrompt(question: Record<string, any>, isRa: boolean) {
  if (typeof question.imagePrompt === 'string' && question.imagePrompt.trim()) {
    return question.imagePrompt.trim()
  }

  const context = isRa ? 'nilai Islami yang lembut dan sesuai anak RA' : 'tema PAUD yang ramah anak'
  const subject = String(question.question || 'aktivitas anak').trim()
  const type = String(question.type || '').toLowerCase()
  const visualType = String(question.visualType || '').toLowerCase()

  if (type === 'coloring') {
    return `Black-and-white printable coloring worksheet line art for children, ${subject}, ${context}, thick clean outlines, white background, no color, no shading, no text, no watermark.`
  }
  if (type === 'tracing' && !question.traceText) {
    return `Black-and-white dotted tracing worksheet illustration for children, ${subject}, ${context}, simple dotted outline, white background, no color, no text, no watermark.`
  }
  if (
    type === 'fill_blank_image' ||
    (type === 'visual' && /(gambar|ilustrasi|warna|benda)/.test(visualType))
  ) {
    return `Simple black-and-white printable worksheet illustration for children, ${subject}, ${context}, clean recognizable outline, white background, no text, no watermark.`
  }
  return ''
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

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query().where('id', params.id).where('user_id', user.id).first()

    if (!exam) {
      return response.redirect('/exams')
    }

    const buffer = await exportExam(exam, user)
    const safeTitle = exam.title.replaceAll(/[^\w\s-]/gi, '').replaceAll(/\s+/g, '_')
    const filename = `Naskah_Soal_${safeTitle || 'RA_TK'}.docx`

    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    response.header('Content-Disposition', `attachment; filename="${filename}"`)
    return response.send(buffer)
  }

  async exportPdf({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query().where('id', params.id).where('user_id', user.id).first()

    if (!exam) {
      return response.redirect('/exams')
    }

    const buffer = await exportExamPdf(exam, user)
    const safeTitle = exam.title.replaceAll(/[^\w\s-]/gi, '').replaceAll(/\s+/g, '_')
    const filename = `Naskah_Soal_${safeTitle || 'RA_TK'}.pdf`

    response.header('Content-Type', 'application/pdf')
    response.header('Content-Disposition', `attachment; filename="${filename}"`)
    return response.send(buffer)
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

    // Pastikan kelas milik user yang login
    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    let questions: Record<string, any>[]
    const curriculum = await getCurriculumContext(user.id, learningSequenceId)
    try {
      const isPaud = user.isTk || user.institutionType === 'ra'
      const prompt = examPrompt({
        subject,
        topic,
        type,
        questionCount,
        examMode: examMode || (isPaud ? 'tertulis_visual' : 'multiple_choice'),
        isPaud,
        isRa: user.institutionType === 'ra',
      })
      const result = await aiQueueService.enqueueAiJson<{ questions: Record<string, any>[] }>({
        userId: user.id,
        combo: 'siapajar-soal',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      const rawQuestions = Array.isArray(result.questions) ? result.questions : []
      questions = rawQuestions.map((q, i) => ({
        question: typeof q.question === 'string' ? q.question : '',
        instruction: typeof q.instruction === 'string' ? q.instruction : '',
        visualType: typeof q.visualType === 'string' ? q.visualType : '',
        rubric: typeof q.rubric === 'string' ? q.rubric : '',
        scoringGuide: typeof q.scoringGuide === 'string' ? q.scoringGuide : '',
        imagePrompt: typeof q.imagePrompt === 'string' ? q.imagePrompt : '',
        imageUrl: typeof q.imageUrl === 'string' ? q.imageUrl : '',
        traceText: typeof q.traceText === 'string' ? q.traceText : '',
        assetStatus: 'ready',
        assetError: '',
        mathProblems: Array.isArray(q.mathProblems) ? q.mathProblems : [],
        countItems: Array.isArray(q.countItems) ? q.countItems : [],
        options: Array.isArray(q.options)
          ? q.options
              .map((o: unknown) => {
                if (typeof o === 'string') {
                  const match = o.trim().match(/^([A-Z])[.)\-:]?\s*(.*)$/i)
                  return { label: match?.[1]?.toUpperCase() || '', text: match?.[2] || o.trim() }
                }
                if (o && typeof o === 'object') {
                  const option = o as {
                    label?: unknown
                    text?: unknown
                    imageUrl?: unknown
                    image?: unknown
                    imagePrompt?: unknown
                  }
                  return {
                    label: typeof option.label === 'string' ? option.label.toUpperCase() : '',
                    text: typeof option.text === 'string' ? option.text : '',
                    imageUrl:
                      typeof option.imageUrl === 'string'
                        ? option.imageUrl
                        : typeof option.image === 'string'
                          ? option.image
                          : '',
                    imagePrompt: typeof option.imagePrompt === 'string' ? option.imagePrompt : '',
                  }
                }
                return null
              })
              .filter((o) => Boolean(o))
          : [],
        answer: typeof q.answer === 'string' ? q.answer : '',
        explanation: typeof q.explanation === 'string' ? q.explanation : '',
        id: i + 1,
        type:
          typeof q.type === 'string' && (PAUD_QUESTION_TYPES as readonly string[]).includes(q.type)
            ? q.type
            : typeof q.visualType === 'string' && q.visualType.toLowerCase().includes('hubung')
              ? 'matching'
              : examMode === 'tertulis_visual'
                ? 'visual'
                : examMode || (isPaud ? 'visual' : 'multiple_choice'),
        leftItems: normalizeMatchingItems(
          q.leftItems ?? q.left ?? q.leftColumn ?? q.itemsLeft,
          'left'
        ),
        rightItems: normalizeMatchingItems(
          q.rightItems ?? q.right ?? q.rightColumn ?? q.itemsRight,
          'right'
        ),
        pairs: Array.isArray(q.pairs ?? q.answerPairs ?? q.matches)
          ? (q.pairs ?? q.answerPairs ?? q.matches)
          : [],
        curriculum,
      }))

      // Illustration generation is best-effort: a text-only exam must still
      // be created if Gemini image generation is unavailable or fails.
      for (const question of questions) {
        const fallbackPrompt = generatedImagePrompt(question, user.institutionType === 'ra')
        if (fallbackPrompt && !question.imagePrompt) question.imagePrompt = fallbackPrompt
        const visualRequests: Array<{ target: Record<string, any>; prompt: string }> = []
        if (question.imagePrompt && !question.imageUrl) {
          visualRequests.push({ target: question, prompt: question.imagePrompt })
        }
        for (const side of ['leftItems', 'rightItems'] as const) {
          for (const item of Array.isArray(question[side]) ? question[side] : []) {
            if (item?.imagePrompt && !item.imageUrl) {
              visualRequests.push({ target: item, prompt: item.imagePrompt })
            }
          }
        }
        for (const option of Array.isArray(question.options) ? question.options : []) {
          if (option?.imagePrompt && !option.imageUrl) {
            visualRequests.push({ target: option, prompt: option.imagePrompt })
          }
        }
        for (const item of Array.isArray(question.countItems) ? question.countItems : []) {
          if (item?.imagePrompt && !item.imageUrl) {
            visualRequests.push({ target: item, prompt: item.imagePrompt })
          }
        }
        for (const visualRequest of visualRequests) {
          try {
            visualRequest.target.imageUrl =
              (await aiQueueService.enqueueAiImage({
                userId: user.id,
                prompt: visualRequest.prompt,
              })) || ''
            if (!visualRequest.target.imageUrl) question.assetStatus = 'quota_unavailable'
          } catch (error) {
            question.assetStatus =
              error instanceof EntitlementError ||
              (error instanceof Error && /batas fitur|kuota/i.test(error.message))
                ? 'quota_unavailable'
                : 'failed'
            question.assetError = error instanceof Error ? error.message : 'Gambar gagal dibuat.'
            visualRequest.target.imageUrl = ''
          }
        }
      }
    } catch (error) {
      session.flash(
        'error',
        error instanceof AiServiceError ? error.message : 'Gagal generate soal. Coba lagi.'
      )
      return response.redirect().back()
    }

    const exam = await Exam.create({
      userId: user.id,
      classId,
      title: `${EXAM_TYPE_LABELS[type]} ${subject} - ${topic}`,
      type,
      questions,
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
    })

    session.flash('success', 'Soal berhasil digenerate')
    return response.redirect().toRoute('exams.show', { id: exam.id })
  }
}
