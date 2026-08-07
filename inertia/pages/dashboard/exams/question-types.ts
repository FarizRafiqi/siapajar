export type QuestionKind =
  | 'multiple_choice'
  | 'essay'
  | 'visual'
  | 'matching'
  | 'practical'
  | 'oral'
  | 'fill_blank_image'
  | 'vertical_math'
  | 'count_and_circle'
  | 'coloring'
  | 'tracing'

export interface QuestionOption {
  label: string
  text: string
  imageUrl?: string
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
  options: number[]
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
  options?: QuestionOption[]
  mathProblems?: VerticalMathProblem[]
  countItems?: CountItem[]
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

const QUESTION_KINDS: QuestionKind[] = [
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
]

function normalizeOption(value: unknown, index: number): QuestionOption {
  const fallbackLabel = String.fromCharCode(65 + index)
  const raw = typeof value === 'string' ? value.trim() : ''
  const match = raw.match(/^([A-Z])[.)\-:]?\s*(.*)$/i)
  return { label: match?.[1]?.toUpperCase() || fallbackLabel, text: match?.[2] || raw }
}

export function normalizeQuestion(raw: Record<string, unknown>, index: number): ExamQuestion {
  const rawType = typeof raw.type === 'string' ? raw.type : ''
  const type: QuestionKind = QUESTION_KINDS.includes(rawType as QuestionKind)
    ? (rawType as QuestionKind)
    : Array.isArray(raw.options) && raw.options.length > 0
      ? 'multiple_choice'
      : raw.visualType
        ? 'visual'
        : raw.rubric
          ? 'practical'
          : 'essay'

  const visualType = typeof raw.visualType === 'string' ? raw.visualType : undefined
  const inferredType = visualType?.toLowerCase().includes('hubung') ? 'matching' : type
  const normalizeItems = (value: unknown, side: 'left' | 'right'): MatchingItem[] => {
    const values = Array.isArray(value)
      ? value
      : typeof value === 'string'
        ? value.split(/\r?\n|;|•/).map((item) => item.trim())
        : []

    return values
      .map((item, itemIndex) => {
        if (typeof item === 'string') return { id: `${side}-${itemIndex + 1}`, label: item.trim() }
        const record = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
        const label =
          typeof record.label === 'string'
            ? record.label
            : typeof record.text === 'string'
              ? record.text
              : ''
        return {
          id: typeof record.id === 'string' ? record.id : `${side}-${itemIndex + 1}`,
          label,
          imageUrl:
            typeof record.imageUrl === 'string'
              ? record.imageUrl
              : typeof record.image === 'string'
                ? record.image
                : undefined,
        }
      })
      .filter((item) => item.label || item.imageUrl)
  }

  const leftValue = raw.leftItems ?? raw.left ?? raw.leftColumn ?? raw.itemsLeft
  const rightValue = raw.rightItems ?? raw.right ?? raw.rightColumn ?? raw.itemsRight

  return {
    id: typeof raw.id === 'number' ? raw.id : index + 1,
    type: inferredType,
    question: typeof raw.question === 'string' ? raw.question : '',
    instruction: typeof raw.instruction === 'string' ? raw.instruction : undefined,
    visualType,
    leftItems: normalizeItems(leftValue, 'left'),
    rightItems: normalizeItems(rightValue, 'right'),
    pairs: Array.isArray(raw.pairs ?? raw.answerPairs ?? raw.matches)
      ? ((raw.pairs ?? raw.answerPairs ?? raw.matches) as unknown[]).flatMap((pair: unknown) => {
          if (!pair || typeof pair !== 'object') return []
          const value = pair as Record<string, unknown>
          return typeof value.leftId === 'string' && typeof value.rightId === 'string'
            ? [{ leftId: value.leftId, rightId: value.rightId }]
            : []
        })
      : [],
    imagePrompt: typeof raw.imagePrompt === 'string' ? raw.imagePrompt : undefined,
    imageUrl: typeof raw.imageUrl === 'string' ? raw.imageUrl : undefined,
    options: Array.isArray(raw.options)
      ? raw.options.map((option, optionIndex) => normalizeOption(option, optionIndex))
      : undefined,
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
