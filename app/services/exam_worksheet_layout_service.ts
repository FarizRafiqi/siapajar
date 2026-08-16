export const PAUD_MAX_ITEMS_PER_TYPE = 5
export const PAUD_WORKSHEET_CAPACITY = 15

export interface WorksheetQuestionGroup {
  key: string
  title: string
  letter: string
  questions: Record<string, any>[]
}

const TYPE_TITLES: Record<string, string> = {
  multiple_choice: 'Pilihan Ganda',
  matching: 'Hubungkan Garis',
  coloring: 'Warnai Sesuai Petunjuk',
  tracing: 'Tebalkan',
  fill_blank_image: 'Tulis Nama Gambar',
  count_and_circle: 'Hitung dan Lingkari',
  vertical_math: 'Hitung Bersusun',
  number_writing: 'Tulis Angka Bilangan',
  practical: 'Praktik',
  oral: 'Kegiatan Lisan',
  essay: 'Isian',
  visual: 'Aktivitas Visual',
}

const LEGACY_TITLE_MAP: Record<string, string> = {
  'counting objects': 'Hitung dan Lingkari',
  'count and circle': 'Hitung dan Lingkari',
  'line art coloring': 'Mewarnai Gambar',
  'tracing line art': 'Menebalkan Gambar',
  'word tracing': 'Menebalkan Kata',
  'coloring by number': 'Mewarnai Sesuai Bilangan',
  'image multiple choice': 'Pilihan Ganda Bergambar',
}

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function worksheetQuestionKey(question: Record<string, any>): string {
  return clean(question.sectionKey || question.section || question.type) || 'activity'
}

export function worksheetQuestionTitle(question: Record<string, any>): string {
  const explicit = clean(question.sectionTitle).replace(/^[A-Z]\.?\s+/i, '')
  if (explicit) {
    const normalized = explicit.toLocaleLowerCase('id-ID').replaceAll(/[_-]+/g, ' ').trim()
    if (LEGACY_TITLE_MAP[normalized]) return LEGACY_TITLE_MAP[normalized]
    if (!normalized.includes(' ') && /^[a-z]+$/.test(normalized)) {
      return TYPE_TITLES[clean(question.type)] || 'Aktivitas'
    }
    return explicit
  }
  return TYPE_TITLES[clean(question.type)] || 'Aktivitas'
}

export function worksheetQuestionCost(question: Record<string, any>): number {
  const type = clean(question.type)
  if (type === 'coloring' || type === 'tracing' || type === 'visual') return 4
  if (type === 'fill_blank_image') return question.imageUrl || question.imagePrompt ? 3 : 1
  if (type === 'matching') return 2
  if (type === 'count_and_circle') return 2
  return 1
}

function capTypeCount(
  questions: Record<string, any>[],
  maxPerType = PAUD_MAX_ITEMS_PER_TYPE
): Record<string, any>[] {
  const counts = new Map<string, number>()
  return questions.filter((question) => {
    const type = clean(question.type) || 'activity'
    const count = counts.get(type) || 0
    if (count >= maxPerType) return false
    counts.set(type, count + 1)
    return true
  })
}

function normalizeCountItems(question: Record<string, any>) {
  if (question.type !== 'count_and_circle') return question
  const items = Array.isArray(question.countItems) ? question.countItems.slice(0, 5) : []
  const usedCounts = new Set<number>()
  question.countItems = items.map((item: Record<string, any>, index: number) => {
    let count = Math.max(1, Math.min(12, Number(item?.count) || index + 1))
    while (usedCounts.has(count) && count < 12) count += 1
    usedCounts.add(count)
    const options = Array.isArray(item?.options) ? item.options : [count - 1, count, count + 1]
    const uniqueOptions = [
      ...new Set(options.map((value: unknown) => Number(value)).filter(Number.isFinite)),
    ]
      .filter((value) => value > 0)
      .slice(0, 4)
    while (uniqueOptions.length < 3) uniqueOptions.push(count + uniqueOptions.length)
    return {
      ...item,
      count,
      options: uniqueOptions.slice(0, 4),
      sectionItemLetter: String.fromCharCode(97 + index),
    }
  })
  return question
}

export function fitPaudQuestionSet(
  input: Record<string, any>[],
  requestedCount: number
): Record<string, any>[] {
  const requested = Math.max(
    1,
    Math.min(requestedCount || PAUD_MAX_ITEMS_PER_TYPE, PAUD_MAX_ITEMS_PER_TYPE)
  )
  const capped = capTypeCount(input, requested).map((question) =>
    normalizeCountItems({ ...question })
  )
  let result = capped
  let cost = result.reduce((sum, question) => sum + worksheetQuestionCost(question), 0)

  // Preserve section order and reduce expensive visual blocks first when the
  // worksheet would become unreadable. Keep at least two sections when trimming.
  while (cost > PAUD_WORKSHEET_CAPACITY && result.length > 2) {
    const countsBySection = new Map<string, number>()
    for (const question of result) {
      const key = worksheetQuestionKey(question)
      countsBySection.set(key, (countsBySection.get(key) || 0) + 1)
    }
    const duplicateIndex = result
      .map((question, index) => ({ question, index }))
      .filter(({ index }) => {
        const key = worksheetQuestionKey(result[index])
        return (countsBySection.get(key) || 0) > 1
      })
      .sort(
        (a, b) => worksheetQuestionCost(b.question) - worksheetQuestionCost(a.question)
      )[0]?.index
    let removableIndex = duplicateIndex
    if (removableIndex === undefined && countsBySection.size > 2) {
      const removableSection = [...countsBySection.keys()].sort((a, b) => {
        const aQuestion = result.find((question) => worksheetQuestionKey(question) === a)
        const bQuestion = result.find((question) => worksheetQuestionKey(question) === b)
        return worksheetQuestionCost(bQuestion || {}) - worksheetQuestionCost(aQuestion || {})
      })[0]
      if (removableSection) {
        result = result.filter((question) => worksheetQuestionKey(question) !== removableSection)
        cost = result.reduce((sum, question) => sum + worksheetQuestionCost(question), 0)
        continue
      }
    }
    if (removableIndex === undefined) break
    result = result.filter((_, index) => index !== removableIndex)
    cost = result.reduce((sum, question) => sum + worksheetQuestionCost(question), 0)
  }

  const sectionCounters = new Map<string, number>()
  let currentSection = ''
  let sectionIndex = -1
  return result.map((question) => {
    const sectionKey = worksheetQuestionKey(question)
    if (sectionKey !== currentSection) {
      currentSection = sectionKey
      sectionIndex += 1
    }
    const itemNumber = (sectionCounters.get(sectionKey) || 0) + 1
    sectionCounters.set(sectionKey, itemNumber)
    return {
      ...question,
      sectionKey,
      sectionTitle: worksheetQuestionTitle(question),
      sectionLetter: String.fromCharCode(65 + sectionIndex),
      sectionQuestionNumber: itemNumber,
    }
  })
}

export function groupWorksheetQuestions(
  questions: Record<string, any>[]
): WorksheetQuestionGroup[] {
  const groups: WorksheetQuestionGroup[] = []
  for (const question of questions) {
    const key = worksheetQuestionKey(question)
    const last = groups.at(-1)
    if (!last || last.key !== key) {
      groups.push({
        key,
        title: worksheetQuestionTitle(question),
        letter: clean(question.sectionLetter) || String.fromCharCode(65 + groups.length),
        questions: [question],
      })
    } else {
      last.questions.push(question)
    }
  }
  return groups
}

export function questionTypeTitles(): Record<string, string> {
  return { ...TYPE_TITLES }
}
