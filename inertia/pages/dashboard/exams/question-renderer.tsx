import {
  GitCompareArrows,
  Image as ImageIcon,
  ListChecks,
  MessageSquareText,
  Mic2,
  Palette,
  PencilLine,
  Search,
  Sparkles,
  Target,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import type { ExamQuestion } from './question-types'

const kindMeta = {
  multiple_choice: { label: 'Pilihan ganda', icon: ListChecks },
  essay: { label: 'Uraian', icon: MessageSquareText },
  visual: { label: 'Aktivitas visual', icon: ImageIcon },
  matching: { label: 'Hubungkan garis', icon: GitCompareArrows },
  practical: { label: 'Praktik / performa', icon: Target },
  oral: { label: 'Lisan', icon: Mic2 },
  fill_blank_image: { label: 'Tulis nama gambar', icon: PencilLine },
  vertical_math: { label: 'Hitung pengurangan / penjumlahan', icon: Sparkles },
  count_and_circle: { label: 'Hitung & lingkari', icon: Search },
  coloring: { label: 'Mewarnai gambar', icon: Palette },
  tracing: { label: 'Menebalkan garis/huruf', icon: PencilLine },
} as const

interface QuestionRendererProps {
  question: ExamQuestion & { icon?: string; iconType?: string }
  number: number
  showAnswer?: boolean
  compact?: boolean
  colorMode?: 'grayscale' | 'color'
}

function detectObjectIcon(text: string, aiIcon?: string): string {
  if (aiIcon) {
    const aiLower = aiIcon.toLowerCase()
    if (aiLower.includes('apel') || aiLower.includes('apple')) return '🍎'
    if (aiLower.includes('balon') || aiLower.includes('balloon')) return '🎈'
    if (aiLower.includes('bintang') || aiLower.includes('star')) return '⭐'
    if (aiLower.includes('bunga') || aiLower.includes('flower')) return '🌸'
    if (aiLower.includes('ikan') || aiLower.includes('fish')) return '🐟'
    if (aiLower.includes('mobil') || aiLower.includes('car')) return '🚗'
    if (aiLower.includes('kucing') || aiLower.includes('cat')) return '🐱'
    if (aiLower.includes('burung') || aiLower.includes('bird')) return '🐦'
    if (aiLower.includes('daun') || aiLower.includes('leaf')) return '🍃'
    if (aiLower.includes('bola') || aiLower.includes('ball')) return '⚽'
    if (aiLower.includes('permen') || aiLower.includes('candy')) return '🍬'
    if (aiLower.includes('jeruk') || aiLower.includes('orange')) return '🍊'
    if (aiLower.includes('pisang') || aiLower.includes('banana')) return '🍌'
    if (aiLower.includes('rumah') || aiLower.includes('house')) return '🏠'
    if (aiLower.includes('topi') || aiLower.includes('hat')) return '🧢'
  }

  const lower = text.toLowerCase()
  if (lower.includes('apel') || lower.includes('apple')) return '🍎'
  if (lower.includes('balon') || lower.includes('balloon')) return '🎈'
  if (lower.includes('bintang') || lower.includes('star')) return '⭐'
  if (lower.includes('bunga') || lower.includes('flower')) return '🌸'
  if (lower.includes('ikan') || lower.includes('fish')) return '🐟'
  if (lower.includes('mobil') || lower.includes('car')) return '🚗'
  if (lower.includes('kucing') || lower.includes('cat')) return '🐱'
  if (lower.includes('burung') || lower.includes('bird')) return '🐦'
  if (lower.includes('daun') || lower.includes('leaf')) return '🍃'
  if (lower.includes('bola') || lower.includes('ball')) return '⚽'
  if (lower.includes('permen') || lower.includes('candy')) return '🍬'
  if (lower.includes('jeruk') || lower.includes('orange')) return '🍊'
  if (lower.includes('pisang') || lower.includes('banana')) return '🍌'
  if (lower.includes('rumah') || lower.includes('house')) return '🏠'
  if (lower.includes('topi') || lower.includes('hat')) return '🧢'
  return '⭐'
}

function detectCountFromText(text: string, defaultCount: number = 4): number {
  const match = /\b([1-9]|10)\b/.exec(text)
  if (match) {
    const parsed = Number.parseInt(match[1], 10)
    if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 12) return parsed
  }
  return defaultCount
}

export function QuestionRenderer({
  question,
  number,
  showAnswer = false,
  compact = false,
  colorMode = 'grayscale',
}: Readonly<QuestionRendererProps>) {
  const meta = kindMeta[question.type] || kindMeta.visual
  const Icon = meta.icon
  const answer = question.answer?.trim().toUpperCase()

  const isCountingQuestion =
    (question.type === 'count_and_circle' || question.visualType === 'Hitung') &&
    (question.question.toLowerCase().includes('hitung') ||
      question.question.toLowerCase().includes('jumlah'))

  const countVal = detectCountFromText(question.question, 4)
  const iconEmoji = detectObjectIcon(question.question || '', question.icon || question.iconType)
  const isGrayscale = colorMode === 'grayscale'

  return (
    <article
      className={cn(
        'rounded-2xl border border-neutral-200 bg-white shadow-sm print:border-none print:shadow-none print:p-0 dark:border-neutral-800 dark:bg-neutral-900',
        compact ? 'p-4' : 'p-6'
      )}
    >
      <div className="mb-3 flex items-start gap-2">
        <span className="w-6 shrink-0 text-base font-bold text-neutral-900 dark:text-white print:text-black">
          {number}.
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2 print:hidden">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <Icon className="h-3.5 w-3.5" /> {meta.label}
            </span>
            {question.visualType && (
              <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                {question.visualType}
              </span>
            )}
          </div>
          <p className="text-base font-semibold leading-7 text-neutral-900 dark:text-white print:text-black print:text-sm">
            {question.question || 'Pertanyaan belum diisi.'}
          </p>
        </div>
      </div>

      {isCountingQuestion && (
        <div
          className={cn(
            'ml-8 my-2 flex flex-wrap items-center gap-3 py-1',
            isGrayscale && 'grayscale'
          )}
        >
          {Array.from({ length: countVal }).map((_, idx) => (
            <span key={`obj-${number}-${idx}`} className="text-3xl leading-none select-none">
              {iconEmoji}
            </span>
          ))}
        </div>
      )}

      {question.type === 'multiple_choice' && (
        <div className="ml-8 mt-3 flex flex-wrap items-center gap-6 text-sm sm:gap-12 print:text-xs">
          {(question.options && question.options.length > 0
            ? question.options
            : [
                { label: 'a', text: 'Pilihan A' },
                { label: 'b', text: 'Pilihan B' },
                { label: 'c', text: 'Pilihan C' },
              ]
          ).map((option) => (
            <div
              key={`${question.id || number}-${option.label}`}
              className={cn(
                'flex items-center gap-2 font-medium',
                showAnswer && answer === option.label?.toUpperCase()
                  ? 'text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-neutral-800 dark:text-neutral-200 print:text-black'
              )}
            >
              <span className="font-semibold">{option.label.toLowerCase()}.</span>
              <span className="font-semibold text-neutral-900 dark:text-white print:text-black">
                {option.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {question.type === 'matching' && (
        <MatchingRenderer question={question} isGrayscale={isGrayscale} />
      )}

      {(question.type === 'fill_blank_image' ||
        (question.type === 'visual' && question.visualType?.toLowerCase().includes('tulis'))) && (
        <ImageFillRenderer question={question} isGrayscale={isGrayscale} />
      )}

      {question.type === 'vertical_math' && <VerticalMathRenderer question={question} />}

      {question.type === 'count_and_circle' && (
        <CountCircleRenderer question={question} isGrayscale={isGrayscale} />
      )}

      {question.type === 'coloring' && (
        <ColoringRenderer question={question} isGrayscale={isGrayscale} />
      )}

      {question.type === 'tracing' && <TracingRenderer question={question} />}

      {question.type === 'essay' && (
        <div className="ml-8 mt-3 space-y-3">
          {[1, 2, 3].map((lineKey) => (
            <div
              key={`line-${number}-${lineKey}`}
              className="h-8 border-b border-dashed border-neutral-300 dark:border-neutral-700"
            />
          ))}
        </div>
      )}

      {(question.type === 'practical' || question.type === 'oral') && (
        <div className="ml-8 mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 print:hidden dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
          <div className="flex items-center gap-2 font-semibold">
            <PencilLine className="h-4 w-4" /> Bukti yang diamati
          </div>
          <p className="mt-2">Catat respons, strategi, dan kemandirian anak selama kegiatan.</p>
        </div>
      )}

      {showAnswer && question.answer && (
        <div className="ml-8 mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 print:hidden dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
          <strong>Kunci / jawaban:</strong> {question.answer}
        </div>
      )}
      {showAnswer && question.explanation && (
        <div className="ml-8 mt-2 text-xs text-neutral-600 print:hidden dark:text-neutral-400">
          <strong>Pembahasan:</strong> {question.explanation}
        </div>
      )}
    </article>
  )
}

function MatchingRenderer({
  question,
  isGrayscale,
}: Readonly<{ question: ExamQuestion; isGrayscale?: boolean }>) {
  const leftItems = question.leftItems || []
  const rightItems = question.rightItems || []
  const rowCount = Math.max(leftItems.length, rightItems.length, 3)

  return (
    <div className="ml-8 mt-4 w-full">
      <div className="space-y-4">
        {Array.from({ length: rowCount }, (_, index) => {
          const left = leftItems[index]
          const right = rightItems[index]

          return (
            <div
              key={`match-row-${left?.id || index}`}
              className="grid grid-cols-[140px_24px_1fr_24px_160px] items-center gap-2"
            >
              <div className="flex items-center justify-start min-h-[48px]">
                {left?.imageUrl ? (
                  <img
                    src={left.imageUrl}
                    alt=""
                    className={cn('h-12 w-12 object-contain', isGrayscale && 'grayscale')}
                  />
                ) : (
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white print:text-black">
                    {left?.label || ''}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-neutral-900 dark:bg-white print:bg-black" />
              </div>

              <div className="w-full" />

              <div className="flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-neutral-900 dark:bg-white print:bg-black" />
              </div>

              <div className="flex items-center justify-start min-h-[48px]">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white print:text-black">
                  {right?.label || ''}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ImageFillRenderer({
  question,
  isGrayscale,
}: Readonly<{ question: ExamQuestion; isGrayscale?: boolean }>) {
  const options =
    question.leftItems && question.leftItems.length > 0
      ? question.leftItems
      : [
          { id: '1', label: 'Apel' },
          { id: '2', label: 'Bunga' },
          { id: '3', label: 'Ikan' },
        ]
  return (
    <div className="ml-8 mt-4 grid grid-cols-3 gap-6 text-center">
      {options.map((item, idx) => {
        const itemLabel = typeof item === 'object' ? item.label || '' : String(item)
        const iconEmoji = detectObjectIcon(itemLabel)

        return (
          <div
            key={`fill-img-${typeof item === 'object' ? item.id || idx : idx}`}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 print:border-black dark:border-neutral-800 dark:bg-neutral-800">
              {typeof item === 'object' && item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt=""
                  className={cn('h-16 w-16 object-contain', isGrayscale && 'grayscale')}
                />
              ) : (
                <span className={cn('text-4xl', isGrayscale && 'grayscale')}>{iconEmoji}</span>
              )}
            </div>
            <div className="w-full text-xs text-neutral-500 font-mono tracking-widest">
              ...................................
            </div>
          </div>
        )
      })}
    </div>
  )
}

function VerticalMathRenderer({ question }: Readonly<{ question: ExamQuestion }>) {
  const mathProblems = question.mathProblems || [
    { topNumber: 97, bottomNumber: 43, operator: '-' },
    { topNumber: 68, bottomNumber: 45, operator: '-' },
    { topNumber: 37, bottomNumber: 25, operator: '-' },
    { topNumber: 69, bottomNumber: 57, operator: '-' },
    { topNumber: 86, bottomNumber: 44, operator: '-' },
  ]

  return (
    <div className="ml-8 mt-4 flex flex-wrap items-center justify-between gap-6 font-mono text-base font-bold text-neutral-900 dark:text-white print:text-black">
      {mathProblems.map((prob, idx) => (
        <div
          key={`vmath-${idx}-${prob.topNumber}`}
          className="flex flex-col items-end border-b-2 border-neutral-900 dark:border-white pb-1 px-2 w-16 print:border-black"
        >
          <span>{prob.topNumber}</span>
          <span className="flex items-center justify-between w-full">
            <span>{prob.operator}</span>
            <span>{prob.bottomNumber}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

function CountCircleRenderer({
  question,
  isGrayscale,
}: Readonly<{ question: ExamQuestion; isGrayscale?: boolean }>) {
  const countItems = question.countItems || [
    { count: 4, options: [3, 4, 5] },
    { count: 5, options: [4, 5, 6] },
  ]

  return (
    <div className="ml-8 mt-4 grid grid-cols-2 gap-6">
      {countItems.map((item, idx) => {
        const itemIcon = detectObjectIcon(question.question || '')

        return (
          <div
            key={`circle-item-${idx}`}
            className="flex flex-col items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4"
          >
            <div className={cn('flex flex-wrap justify-center gap-2', isGrayscale && 'grayscale')}>
              {Array.from({ length: item.count || 4 }).map((_, i) => (
                <span key={`cnt-icon-${idx}-${i}`} className="text-2xl">
                  {itemIcon}
                </span>
              ))}
            </div>
            <div className="flex gap-4 font-bold text-sm text-neutral-900 dark:text-white">
              {item.options.map((num) => (
                <span
                  key={`cnt-num-${idx}-${num}`}
                  className="rounded-full px-3 py-1 border border-neutral-300 dark:border-neutral-700"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ColoringRenderer({
  question,
  isGrayscale,
}: Readonly<{ question: ExamQuestion; isGrayscale?: boolean }>) {
  const iconEmoji = detectObjectIcon(question.question || question.imagePrompt || '')

  return (
    <div className="ml-8 mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 p-6 text-center dark:border-neutral-700">
      {question.imageUrl ? (
        <img
          src={question.imageUrl}
          alt="Mewarnai"
          className={cn('max-h-64 object-contain', isGrayscale && 'grayscale')}
        />
      ) : (
        <div className="flex flex-col items-center gap-3 text-neutral-600 dark:text-neutral-300">
          <span className={cn('text-6xl animate-pulse', isGrayscale && 'grayscale')}>
            {iconEmoji}
          </span>
          <span className="text-xs font-semibold">
            {question.imagePrompt || `Area Mewarnai (${question.question})`}
          </span>
        </div>
      )}
    </div>
  )
}

function TracingRenderer({ question }: Readonly<{ question: ExamQuestion }>) {
  return (
    <div className="ml-8 mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center dark:border-neutral-700 dark:bg-neutral-800/40">
      <div className="font-mono text-2xl font-bold tracking-[0.3em] text-neutral-400 border-b-2 border-dashed border-neutral-300 pb-2 dark:border-neutral-700 select-none">
        {question.question}
      </div>
      <p className="mt-2 text-xs italic text-neutral-500 dark:text-neutral-400">
        (Tebalkan huruf / angka di atas mengikuti garis putus-putus)
      </p>
    </div>
  )
}
