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
      }
    })
    .filter((item) => item.label || item.imageUrl)
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
    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    response.header('Content-Disposition', `attachment; filename="${exam.title}.docx"`)
    return response.send(buffer)
  }

  async exportPdf({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const exam = await Exam.query().where('id', params.id).where('user_id', user.id).first()

    if (!exam) {
      return response.redirect('/exams')
    }

    const buffer = await exportExamPdf(exam, user)
    response.header('Content-Type', 'application/pdf')
    response.header('Content-Disposition', `attachment; filename="${exam.title}.pdf"`)
    return response.send(buffer)
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
        options: Array.isArray(q.options)
          ? q.options
              .map((o: unknown) => {
                if (typeof o === 'string') {
                  const match = o.trim().match(/^([A-Z])[.)\-:]?\s*(.*)$/i)
                  return { label: match?.[1]?.toUpperCase() || '', text: match?.[2] || o.trim() }
                }
                if (o && typeof o === 'object' && 'text' in o) {
                  const option = o as { label?: unknown; text?: unknown }
                  return {
                    label: typeof option.label === 'string' ? option.label.toUpperCase() : '',
                    text: typeof option.text === 'string' ? option.text : '',
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
          typeof q.type === 'string' &&
          ['multiple_choice', 'essay', 'visual', 'matching', 'practical', 'oral'].includes(q.type)
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
        if (!question.imagePrompt || question.imageUrl) continue
        try {
          question.imageUrl =
            (await aiQueueService.enqueueAiImage({
              userId: user.id,
              prompt: question.imagePrompt,
            })) || ''
        } catch {
          question.imageUrl = ''
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
