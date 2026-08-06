export type QuestionKind = 'multiple_choice' | 'essay' | 'visual' | 'practical' | 'oral'

export interface QuestionOption {
  label: string
  text: string
}

export interface ExamQuestion {
  id: number
  type: QuestionKind
  question: string
  instruction?: string
  visualType?: string
  imagePrompt?: string
  imageUrl?: string
  options?: QuestionOption[]
  answer?: string
  explanation?: string
  rubric?: string
  scoringGuide?: string
}

export interface ExamHeader {
  institutionName: string
  institutionAddress: string
  academicYear: string
  semester: string
  groupName: string
  subject: string
  examLabel: string
  studentName: string
  date: string
}

const QUESTION_KINDS: QuestionKind[] = ['multiple_choice', 'essay', 'visual', 'practical', 'oral']

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

  return {
    id: typeof raw.id === 'number' ? raw.id : index + 1,
    type,
    question: typeof raw.question === 'string' ? raw.question : '',
    instruction: typeof raw.instruction === 'string' ? raw.instruction : undefined,
    visualType: typeof raw.visualType === 'string' ? raw.visualType : undefined,
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
    institutionName: read('institutionName'),
    institutionAddress: read('institutionAddress'),
    academicYear: read('academicYear'),
    semester: read('semester'),
    groupName: read('groupName'),
    subject: read('subject'),
    examLabel: read('examLabel'),
    studentName: read('studentName'),
    date: read('date'),
  }
}
