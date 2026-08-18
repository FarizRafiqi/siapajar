export type QuestionKind =
  | 'multiple_choice'
  | 'essay'
  | 'visual'
  | 'matching'
  | 'practical'
  | 'oral'
  | 'fill_blank_image'
  | 'vertical_math'
  | 'number_writing'
  | 'count_and_circle'
  | 'coloring'
  | 'tracing'

export interface QuestionOption {
  label: string
  text: string
  imageUrl?: string
  imagePrompt?: string
}

export interface MatchingItem {
  id: string
  label: string
  imageUrl?: string
  imagePrompt?: string
}

export interface MatchingPair {
  leftId: string
  rightId: string
}

export interface VerticalMathProblem {
  topNumber: number
  bottomNumber: number
  operator: '+' | '-'
}

export interface CountItem {
  count: number
  iconName?: string
  imageUrl?: string
  imagePrompt?: string
  options: number[]
  sectionItemLetter?: string
}

export interface ExamQuestion {
  id: number
  type: QuestionKind
  question: string
  instruction?: string
  visualType?: string
  leftItems?: MatchingItem[]
  rightItems?: MatchingItem[]
  pairs?: MatchingPair[]
  imagePrompt?: string
  imageUrl?: string
  traceText?: string
  assetStatus?: 'ready' | 'processing' | 'quota_unavailable' | 'failed'
  assetError?: string
  options?: QuestionOption[]
  mathProblems?: VerticalMathProblem[]
  countItems?: CountItem[]
  sectionKey?: string
  sectionTitle?: string
  sectionLetter?: string
  sectionQuestionNumber?: number
  answer?: string
  explanation?: string
  rubric?: string
  scoringGuide?: string
}

export interface ExamHeader {
  logoUrl: string
  institutionName: string
  institutionSubName: string
  institutionAddress: string
  addressLine1: string
  addressLine2: string
  phone: string
  academicYear: string
  semester: string
  groupName: string
  subject: string
  examLabel: string
  studentName: string
  date: string
}

const QUESTION_KINDS = new Set<QuestionKind>([
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
])

function normalizeOption(value: unknown, index: number): QuestionOption {
  const fallbackLabel = String.fromCodePoint(65 + index)

  if (value && typeof value === 'object') {
    const valObj = value as Record<string, unknown>
    const labelStr =
      typeof valObj.label === 'string' && valObj.label.trim() ? valObj.label.trim() : fallbackLabel
    let textStr = ''
    if (typeof valObj.text === 'string' && valObj.text.trim()) {
      textStr = valObj.text.trim()
    } else if (typeof valObj.label === 'string' && valObj.label.trim()) {
      textStr = valObj.label.trim()
    }
    return {
      label: labelStr.toUpperCase(),
      text: textStr,
      imageUrl:
        typeof valObj.imageUrl === 'string'
          ? valObj.imageUrl
          : typeof valObj.image === 'string'
            ? valObj.image
            : undefined,
      imagePrompt: typeof valObj.imagePrompt === 'string' ? valObj.imagePrompt : undefined,
    }
  }

  const raw = typeof value === 'string' ? value.trim() : ''
  const regex = /^([A-Z])[.)\-:]?\s*(.*)$/i
  const match = regex.exec(raw)
  const label = match?.[1]?.toUpperCase() || fallbackLabel
  const text = match?.[2] && match[2].trim().length > 0 ? match[2].trim() : raw

  return { label, text }
}

function determineQuestionKind(rawType: string, raw: Record<string, unknown>): QuestionKind {
  const visualType = typeof raw.visualType === 'string' ? raw.visualType : ''
  if (
    rawType === 'visual' &&
    Array.isArray(raw.options) &&
    /pilihan\s*ganda.*gambar|gambar.*pilihan\s*ganda|bergambar/i.test(visualType)
  ) {
    return 'multiple_choice'
  }
  if (QUESTION_KINDS.has(rawType as QuestionKind)) {
    return rawType as QuestionKind
  }
  if (Array.isArray(raw.options) && raw.options.length > 0) {
    return 'multiple_choice'
  }
  if (raw.visualType) {
    return 'visual'
  }
  if (raw.rubric) {
    return 'practical'
  }
  return 'essay'
}

function normalizeItems(value: unknown, side: 'left' | 'right'): MatchingItem[] {
  let values: unknown[] = []
  if (Array.isArray(value)) {
    values = value
  } else if (typeof value === 'string') {
    values = value.split(/\r?\n|;|•/).map((item) => item.trim())
  }

  return values
    .map((item, itemIndex) => {
      const defaultId = `${side}-${itemIndex + 1}`
      if (typeof item === 'string') {
        return { id: defaultId, label: item.trim() }
      }

      const record = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
      let label = ''
      if (typeof record.label === 'string') {
        label = record.label
      } else if (typeof record.text === 'string') {
        label = record.text
      }

      let imageUrl: string | undefined
      if (typeof record.imageUrl === 'string') {
        imageUrl = record.imageUrl
      } else if (typeof record.image === 'string') {
        imageUrl = record.image
      }

      const imagePrompt = typeof record.imagePrompt === 'string' ? record.imagePrompt : undefined

      return {
        id: typeof record.id === 'string' ? record.id : defaultId,
        label,
        imageUrl,
        imagePrompt,
      }
    })
    .filter((item) => item.label || item.imageUrl)
}

function normalizePairs(rawPairs: unknown): MatchingPair[] {
  if (!Array.isArray(rawPairs)) return []
  return rawPairs.flatMap((pair: unknown) => {
    if (!pair || typeof pair !== 'object') return []
    const value = pair as Record<string, unknown>
    return typeof value.leftId === 'string' && typeof value.rightId === 'string'
      ? [{ leftId: value.leftId, rightId: value.rightId }]
      : []
  })
}

export function normalizeQuestion(raw: Record<string, unknown>, index: number): ExamQuestion {
  const rawType = typeof raw.type === 'string' ? raw.type : ''
  const type = determineQuestionKind(rawType, raw)

  const visualType = typeof raw.visualType === 'string' ? raw.visualType : undefined
  const inferredType = visualType?.toLowerCase().includes('hubung') ? 'matching' : type

  const leftValue = raw.leftItems ?? raw.left ?? raw.leftColumn ?? raw.itemsLeft
  const rightValue = raw.rightItems ?? raw.right ?? raw.rightColumn ?? raw.itemsRight
  const pairsValue = raw.pairs ?? raw.answerPairs ?? raw.matches

  return {
    id: typeof raw.id === 'number' ? raw.id : index + 1,
    type: inferredType,
    question: typeof raw.question === 'string' ? raw.question : '',
    instruction: typeof raw.instruction === 'string' ? raw.instruction : undefined,
    visualType,
    leftItems: normalizeItems(leftValue, 'left'),
    rightItems: normalizeItems(rightValue, 'right'),
    pairs: normalizePairs(pairsValue),
    imagePrompt: typeof raw.imagePrompt === 'string' ? raw.imagePrompt : undefined,
    imageUrl: typeof raw.imageUrl === 'string' ? raw.imageUrl : undefined,
    traceText: typeof raw.traceText === 'string' ? raw.traceText : undefined,
    assetStatus:
      raw.assetStatus === 'failed' ||
      raw.assetStatus === 'quota_unavailable' ||
      raw.assetStatus === 'processing'
        ? raw.assetStatus
        : 'ready',
    assetError: typeof raw.assetError === 'string' ? raw.assetError : undefined,
    options: Array.isArray(raw.options)
      ? raw.options.map((option, optionIndex) => normalizeOption(option, optionIndex))
      : undefined,
    mathProblems: Array.isArray(raw.mathProblems)
      ? (raw.mathProblems as VerticalMathProblem[])
      : undefined,
    countItems: Array.isArray(raw.countItems) ? (raw.countItems as CountItem[]) : undefined,
    sectionKey: typeof raw.sectionKey === 'string' ? raw.sectionKey : undefined,
    sectionTitle: typeof raw.sectionTitle === 'string' ? raw.sectionTitle : undefined,
    sectionLetter: typeof raw.sectionLetter === 'string' ? raw.sectionLetter : undefined,
    sectionQuestionNumber:
      typeof raw.sectionQuestionNumber === 'number' ? raw.sectionQuestionNumber : undefined,
    answer: typeof raw.answer === 'string' ? raw.answer : undefined,
    explanation: typeof raw.explanation === 'string' ? raw.explanation : undefined,
    rubric: typeof raw.rubric === 'string' ? raw.rubric : undefined,
    scoringGuide: typeof raw.scoringGuide === 'string' ? raw.scoringGuide : undefined,
  }
}

export function normalizeHeader(raw: unknown, defaults: Partial<ExamHeader> = {}): ExamHeader {
  const value = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const read = (key: keyof ExamHeader) =>
    typeof value[key] === 'string' ? (value[key] as string) : defaults[key] || ''

  return {
    logoUrl: read('logoUrl'),
    institutionName: read('institutionName'),
    institutionSubName: read('institutionSubName'),
    institutionAddress: read('institutionAddress'),
    addressLine1: read('addressLine1'),
    addressLine2: read('addressLine2'),
    phone: read('phone'),
    academicYear: read('academicYear'),
    semester: read('semester'),
    groupName: read('groupName'),
    subject: read('subject'),
    examLabel: read('examLabel'),
    studentName: read('studentName'),
    date: read('date'),
  }
}
