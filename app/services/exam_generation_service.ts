import Exam from '#models/exam'
import User from '#models/user'
import type { CurriculumContext } from '#services/curriculum_context_service'
import { examPrompt } from '#services/ai_prompts'
import { aiQueueService } from '#services/ai_queue_service'
import { AiServiceError } from '#services/ai_service'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { EntitlementError } from '#services/entitlement_service'
import { fitPaudQuestionSet } from '#services/exam_worksheet_layout_service'

export type ExamGenerationStage =
  'queued' | 'researching' | 'generating_questions' | 'generating_images' | 'completed' | 'failed'

export interface ExamGenerationError {
  stage: ExamGenerationStage
  message: string
  questionId?: number
  item?: number
}

export interface ExamGenerationProgress {
  stage: ExamGenerationStage
  current: number
  total: number
  message: string
  errors: ExamGenerationError[]
}

export interface ExamGenerationOptions {
  examId: number
  userId: number
  classId: number
  subject: string
  type: 'midterm' | 'final' | 'daily' | 'summative'
  topic: string
  questionCount: number
  examMode?: 'lisan' | 'tertulis_visual' | 'multiple_choice' | 'essay' | 'practical'
  learningSequenceId?: number
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
  'number_writing',
  'count_and_circle',
  'coloring',
  'tracing',
] as const

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
      const imageUrl =
        side === 'left'
          ? typeof record.imageUrl === 'string'
            ? record.imageUrl
            : typeof record.image === 'string'
              ? record.image
              : ''
          : ''
      const imagePrompt =
        side === 'left' && typeof record.imagePrompt === 'string' ? record.imagePrompt : ''
      return {
        id: typeof record.id === 'string' ? record.id : `${side}-${index + 1}`,
        label:
          typeof record.label === 'string'
            ? record.label
            : typeof record.text === 'string'
              ? record.text
              : '',
        imageUrl,
        imagePrompt,
      }
    })
    .filter((item) => item.label || item.imageUrl || item.imagePrompt)
}

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

function matchingItemImagePrompt(label: string, isRa: boolean) {
  const context = isRa
    ? 'gentle Islamic values for RA children'
    : 'a friendly PAUD/TK learning theme'
  return `Simple black-and-white printable worksheet illustration of ${label}, ${context}, clear thick outlines, centered object, white background, no text, no letters, no watermark.`
}

function isIllustratedChoice(question: Record<string, any>) {
  return (
    question.type === 'multiple_choice' &&
    /(gambar|bergambar|ilustrasi|benda)/i.test(
      String(question.visualType || question.question || '')
    )
  )
}

function illustratedChoicePrompt(label: string, isRa: boolean) {
  const context = isRa
    ? 'gentle Islamic values for RA children'
    : 'a friendly PAUD/TK learning theme'
  return `Simple black-and-white printable worksheet illustration of ${label || 'the correct answer'}, ${context}, clear thick outline, centered object, white background, no text, no letters, no watermark. It must be recognizable by young children.`
}

function countItemImagePrompt(question: Record<string, any>, isRa: boolean, itemIndex = 0) {
  const context = isRa
    ? 'gentle Islamic values for RA children'
    : 'a friendly PAUD/TK learning theme'
  const subject = String(question.question || 'the worksheet theme').trim()
  return `Simple black-and-white printable worksheet illustration for counting, ${subject}, ${context}, one clear repeated object for group ${String.fromCharCode(97 + itemIndex)}, thick clean outlines, white background, no text, no numbers, no watermark.`
}

function inferQuestionType(question: Record<string, any>, examMode: string | undefined) {
  if (
    question.type === 'visual' &&
    typeof question.visualType === 'string' &&
    /pilihan\s*ganda.*gambar|gambar.*pilihan\s*ganda|bergambar/i.test(question.visualType)
  ) {
    return 'multiple_choice'
  }
  if (
    typeof question.type === 'string' &&
    (PAUD_QUESTION_TYPES as readonly string[]).includes(question.type)
  ) {
    return question.type
  }
  if (
    typeof question.visualType === 'string' &&
    /pilihan\s*ganda.*gambar|gambar.*pilihan\s*ganda|bergambar/i.test(question.visualType)
  ) {
    return 'multiple_choice'
  }
  if (typeof question.visualType === 'string' && /hitung.*lingkari/i.test(question.visualType)) {
    return 'count_and_circle'
  }
  if (
    typeof question.visualType === 'string' &&
    /tulis.*angka|angka.*tulis/i.test(question.visualType)
  ) {
    return 'number_writing'
  }
  if (typeof question.visualType === 'string' && /mewarnai/i.test(question.visualType)) {
    return 'coloring'
  }
  if (typeof question.visualType === 'string' && /tebal/i.test(question.visualType)) {
    return 'tracing'
  }
  if (
    typeof question.visualType === 'string' &&
    question.visualType.toLowerCase().includes('hubung')
  ) {
    return 'matching'
  }
  return examMode === 'tertulis_visual' ? 'visual' : examMode || 'visual'
}

function safeErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AiServiceError || error instanceof EntitlementError) return error.message
  return error instanceof Error && error.message ? error.message : fallback
}

function progressFromExam(exam: Exam): ExamGenerationProgress {
  const value = exam.generationProgress || {}
  return {
    stage: (value.stage as ExamGenerationStage) || exam.generationStatus || 'queued',
    current: typeof value.current === 'number' ? value.current : 0,
    total: typeof value.total === 'number' ? value.total : 0,
    message: typeof value.message === 'string' ? value.message : '',
    errors: Array.isArray(value.errors) ? (value.errors as ExamGenerationError[]) : [],
  }
}

async function saveProgress(
  exam: Exam,
  status: ExamGenerationStage,
  patch: Partial<Omit<ExamGenerationProgress, 'stage'>>
) {
  const previous = progressFromExam(exam)
  exam.generationStatus = status
  exam.generationProgress = {
    stage: status,
    current: patch.current ?? previous.current,
    total: patch.total ?? previous.total,
    message: patch.message ?? previous.message,
    errors: patch.errors ?? previous.errors,
  }
  await exam.save()
}

function normalizeQuestions(
  rawQuestions: unknown[],
  curriculum: CurriculumContext,
  examMode: string | undefined,
  isPaud: boolean
) {
  return rawQuestions.map((rawQuestion, index) => {
    const q =
      rawQuestion && typeof rawQuestion === 'object' ? (rawQuestion as Record<string, any>) : {}
    return {
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
        ? (q.options
            .map((optionValue: unknown) => {
              if (typeof optionValue === 'string') {
                const match = optionValue.trim().match(/^([A-Z])[.)\-:]?\s*(.*)$/i)
                return {
                  label: match?.[1]?.toUpperCase() || '',
                  text: match?.[2] || optionValue.trim(),
                }
              }
              if (optionValue && typeof optionValue === 'object') {
                const option = optionValue as Record<string, unknown>
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
            .filter((option) => option !== null) as Record<string, any>[])
        : [],
      answer: typeof q.answer === 'string' ? q.answer : '',
      explanation: typeof q.explanation === 'string' ? q.explanation : '',
      id: index + 1,
      type: inferQuestionType(q, examMode),
      sectionKey: typeof q.sectionKey === 'string' ? q.sectionKey : '',
      sectionTitle: typeof q.sectionTitle === 'string' ? q.sectionTitle : '',
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
      isPaud,
    }
  })
}

interface VisualRequest {
  question: Record<string, any>
  target: Record<string, any>
  prompt: string
  questionId: number
  item?: number
  preferredKind?: 'svg' | 'raster' | 'auto'
}

function collectVisualRequests(questions: Record<string, any>[], isRa: boolean): VisualRequest[] {
  const requests: VisualRequest[] = []

  questions.forEach((question, questionIndex) => {
    const questionId = Number(question.id) || questionIndex + 1
    const fallbackPrompt = generatedImagePrompt(question, isRa)
    if (fallbackPrompt && !question.imagePrompt) question.imagePrompt = fallbackPrompt
    const isMatching = question.type === 'matching'

    if (isIllustratedChoice(question)) {
      for (const option of Array.isArray(question.options) ? question.options : []) {
        if (option && !option.imagePrompt && !option.imageUrl) {
          option.imagePrompt = illustratedChoicePrompt(option.text || option.label, isRa)
        }
      }
    }
    if (question.type === 'count_and_circle') {
      const countItems = Array.isArray(question.countItems) ? question.countItems : []
      countItems.forEach((item: Record<string, any>, itemIndex: number) => {
        if (item && !item.imagePrompt && !item.imageUrl) {
          item.imagePrompt = countItemImagePrompt(question, isRa, itemIndex)
        }
      })
    }
    if (question.type === 'tracing' && !question.traceText) {
      const numberMatch = String(question.question || '').match(/\d+(?:\s*[-+]\s*\d+)*/)
      if (numberMatch) question.traceText = numberMatch[0]
    }
    if (isMatching) {
      for (const item of Array.isArray(question.leftItems) ? question.leftItems : []) {
        if (item?.label && !item.imagePrompt && !item.imageUrl) {
          item.imagePrompt = matchingItemImagePrompt(item.label, isRa)
        }
      }
    }
    if (!isMatching && question.imagePrompt && !question.imageUrl) {
      requests.push({
        question,
        target: question,
        prompt: question.imagePrompt,
        questionId,
        preferredKind: question.type === 'visual' ? 'auto' : 'svg',
      })
    }
    const visualSides = isMatching
      ? (['leftItems'] as const)
      : (['leftItems', 'rightItems'] as const)
    for (const side of visualSides) {
      const items = Array.isArray(question[side]) ? question[side] : []
      items.forEach((item: Record<string, any>, itemIndex: number) => {
        if (item?.imagePrompt && !item.imageUrl) {
          requests.push({
            question,
            target: item,
            prompt: item.imagePrompt,
            questionId,
            item: itemIndex + 1,
            preferredKind: 'svg',
          })
        }
      })
    }
    const options = Array.isArray(question.options) ? question.options : []
    options.forEach((option: Record<string, any>, itemIndex: number) => {
      if (option?.imagePrompt && !option.imageUrl) {
        requests.push({
          question,
          target: option,
          prompt: option.imagePrompt,
          questionId,
          item: itemIndex + 1,
          preferredKind: 'svg',
        })
      }
    })
    const questionCountItems = Array.isArray(question.countItems) ? question.countItems : []
    questionCountItems.forEach((item: Record<string, any>, itemIndex: number) => {
      if (item?.imagePrompt && !item.imageUrl) {
        requests.push({
          question,
          target: item,
          prompt: item.imagePrompt,
          questionId,
          item: itemIndex + 1,
          preferredKind: 'svg',
        })
      }
    })
  })

  return requests
}

export async function generateExam(options: ExamGenerationOptions) {
  const exam = await Exam.query().where('id', options.examId).firstOrFail()
  const user = await User.query().where('id', options.userId).firstOrFail()
  try {
    await saveProgress(exam, 'researching', {
      current: 0,
      total: 0,
      message: 'Meriset kurikulum dan menyusun struktur soal...',
    })
    const curriculum = await getCurriculumContext(options.userId, options.learningSequenceId)
    const isPaud = user.isTk || user.institutionType === 'ra'
    const isRa = user.institutionType === 'ra'
    const paudMaxItemsPerSection = Math.max(1, Math.min(options.questionCount, 5))
    const prompt = examPrompt({
      subject: options.subject,
      topic: options.topic,
      type: options.type,
      questionCount: isPaud ? paudMaxItemsPerSection : options.questionCount,
      examMode: options.examMode || (isPaud ? 'tertulis_visual' : 'multiple_choice'),
      isPaud,
      isRa,
    })

    await saveProgress(exam, 'generating_questions', {
      current: 0,
      total: 1,
      message: 'Memformulasikan pertanyaan dan kunci jawaban...',
    })
    const result = await aiQueueService.enqueueAiJson<{ questions: Record<string, any>[] }>({
      userId: options.userId,
      combo: 'siapajar-soal',
      systemPrompt: prompt.system,
      userPrompt: prompt.user,
    })
    await saveProgress(exam, 'generating_questions', {
      current: 1,
      total: 1,
      message: 'Struktur soal selesai. Menyiapkan ilustrasi...',
    })

    const rawQuestions = Array.isArray(result.questions) ? result.questions : []
    let questions: Record<string, any>[] = normalizeQuestions(
      rawQuestions,
      curriculum,
      options.examMode,
      isPaud
    )
    if (isPaud) questions = fitPaudQuestionSet(questions, paudMaxItemsPerSection)
    if (!questions.length) throw new AiServiceError('AI tidak mengembalikan butir soal. Coba lagi.')

    exam.questions = questions
    await exam.save()

    const visualRequests = collectVisualRequests(questions, isRa)
    await saveProgress(exam, 'generating_images', {
      current: 0,
      total: visualRequests.length,
      message: visualRequests.length
        ? `Menyiapkan ${visualRequests.length} ilustrasi soal...`
        : 'Tidak ada ilustrasi tambahan yang perlu dibuat.',
    })

    const errors = progressFromExam(exam).errors
    for (const [requestIndex, visualRequest] of visualRequests.entries()) {
      await saveProgress(exam, 'generating_images', {
        current: requestIndex,
        total: visualRequests.length,
        message: `Membuat ilustrasi ${requestIndex + 1} dari ${visualRequests.length}...`,
      })
      try {
        const visual = await aiQueueService.enqueueAiVisual({
          userId: options.userId,
          prompt: visualRequest.prompt,
          preferredKind: visualRequest.preferredKind || 'auto',
          purpose: 'exam',
          metadata: {
            questionId: visualRequest.questionId,
            item: visualRequest.item || null,
          },
        })
        visualRequest.target.imageUrl = visual?.url || ''
        visualRequest.target.assetId = visual?.assetId || null
        visualRequest.target.assetKind = visual?.kind || null
        visualRequest.target.assetSource = visual?.source || null
        if (!visualRequest.target.imageUrl) visualRequest.question.assetStatus = 'quota_unavailable'
      } catch (error) {
        visualRequest.question.assetStatus =
          error instanceof EntitlementError ||
          (error instanceof Error && /batas fitur|kuota/i.test(error.message))
            ? 'quota_unavailable'
            : 'failed'
        visualRequest.question.assetError = safeErrorMessage(error, 'Gambar gagal dibuat.')
        visualRequest.target.imageUrl = ''
        errors.push({
          stage: 'generating_images',
          message: visualRequest.question.assetError,
          questionId: visualRequest.questionId,
          item: visualRequest.item,
        })
      }
      exam.questions = questions
      await exam.save()
      await saveProgress(exam, 'generating_images', {
        current: requestIndex + 1,
        total: visualRequests.length,
        message: `Ilustrasi ${requestIndex + 1} dari ${visualRequests.length} selesai.`,
        errors,
      })
    }

    await saveProgress(exam, 'completed', {
      current: visualRequests.length,
      total: visualRequests.length,
      message: errors.length
        ? `Naskah selesai dengan ${errors.length} ilustrasi yang perlu diperiksa.`
        : 'Naskah soal selesai dibuat.',
      errors,
    })
    return exam
  } catch (error) {
    const message = safeErrorMessage(error, 'Gagal membuat naskah soal. Coba lagi.')
    const previous = progressFromExam(exam)
    await saveProgress(exam, 'failed', {
      current: previous.current,
      total: previous.total,
      message: 'Pembuatan naskah berhenti karena terjadi kesalahan.',
      errors: [...previous.errors, { stage: previous.stage, message }],
    })
    throw error
  }
}
