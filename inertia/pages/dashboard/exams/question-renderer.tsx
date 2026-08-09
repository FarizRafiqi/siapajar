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

function detectCountFromText(text: string, defaultCount: number = 4): number {
  const match = /\b([1-9]|10)\b/.exec(text)
  if (match) {
    const parsed = Number.parseInt(match[1], 10)
    if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 12) return parsed
  }
  return defaultCount
}

function assetMessage(question: ExamQuestion): string {
  if (question.assetStatus === 'quota_unavailable') {
    return 'Ilustrasi tidak dibuat karena kuota generate gambar habis.'
  }
  if (question.assetStatus === 'failed') {
    return 'Ilustrasi belum tersedia. Generate ulang setelah konfigurasi AI diperbaiki.'
  }
  return 'Gambar belum tersedia.'
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
    question.type === 'visual' &&
    (question.visualType === 'Hitung' || question.visualType === 'Menghitung') &&
    (question.question.toLowerCase().includes('hitung') ||
      question.question.toLowerCase().includes('jumlah'))

  const countVal = detectCountFromText(question.question, 4)
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
              ●
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
              {option.imageUrl ? (
                <img
                  src={option.imageUrl}
                  alt=""
                  className={cn('h-10 w-10 object-contain', isGrayscale && 'grayscale')}
                />
              ) : option.imagePrompt ? (
                <span className="text-xs font-semibold text-neutral-500">
                  Gambar belum tersedia
                </span>
              ) : null}
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

      {question.type === 'visual' && !question.visualType?.toLowerCase().includes('tulis') && (
        <VisualRenderer question={question} isGrayscale={isGrayscale} />
      )}

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
              className="grid grid-cols-[160px_28px_1fr_28px_160px] items-center gap-2"
            >
              <div className="flex items-center justify-start min-h-[44px]">
                {left?.imageUrl ? (
                  <img
                    src={left.imageUrl}
                    alt=""
                    className={cn(
                      'h-10 w-10 object-contain mr-2 shrink-0',
                      isGrayscale && 'grayscale'
                    )}
                  />
                ) : null}
                <span className="text-sm font-semibold text-neutral-900 dark:text-white print:text-black">
                  {left?.label || ''}
                </span>
              </div>

              <div className="flex items-center justify-center">
                <span className="text-xs font-bold text-neutral-900 dark:text-white print:text-black leading-none select-none">
                  ●
                </span>
              </div>

              <div className="w-full" />

              <div className="flex items-center justify-center">
                <span className="text-xs font-bold text-neutral-900 dark:text-white print:text-black leading-none select-none">
                  ●
                </span>
              </div>

              <div className="flex items-center justify-start min-h-[44px]">
                {right?.imageUrl ? (
                  <img
                    src={right.imageUrl}
                    alt=""
                    className={cn(
                      'h-10 w-10 object-contain mr-2 shrink-0',
                      isGrayscale && 'grayscale'
                    )}
                  />
                ) : null}
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
  if (question.imageUrl) {
    return (
      <div className="ml-8 mt-4 flex flex-col items-center gap-3 text-center">
        <img
          src={question.imageUrl}
          alt="Gambar soal"
          className={cn('max-h-64 max-w-full object-contain', isGrayscale && 'grayscale')}
        />
        <div className="w-64 border-b border-dashed border-neutral-500 text-xs tracking-widest">
          ...................................
        </div>
      </div>
    )
  }

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
                <span className="px-2 text-xs font-semibold text-neutral-500">
                  {question.assetStatus === 'quota_unavailable'
                    ? 'Kuota gambar habis'
                    : 'Gambar belum tersedia'}
                </span>
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
        const itemImage = item.imageUrl

        return (
          <div
            key={`circle-item-${idx}`}
            className="flex flex-col items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4"
          >
            <div className={cn('flex flex-wrap justify-center gap-2', isGrayscale && 'grayscale')}>
              {Array.from({ length: item.count || 4 }).map((_, i) => (
                <span
                  key={`cnt-icon-${idx}-${i}`}
                  className="flex h-10 w-10 items-center justify-center"
                >
                  {itemImage ? (
                    <img src={itemImage} alt="" className="h-9 w-9 object-contain" />
                  ) : (
                    <span className="text-2xl text-neutral-800 print:text-black">●</span>
                  )}
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
  return (
    <div className="ml-8 mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 p-6 text-center dark:border-neutral-700">
      {question.imageUrl ? (
        <img
          src={question.imageUrl}
          alt="Mewarnai"
          className={cn('max-h-64 object-contain', isGrayscale && 'grayscale')}
        />
      ) : (
        <div className="flex min-h-32 w-full max-w-md flex-col items-center justify-center gap-3 border border-dashed border-neutral-400 text-neutral-600 dark:text-neutral-300">
          <span className="text-sm font-semibold">{assetMessage(question)}</span>
          <span className="text-xs">Generate ulang ilustrasi untuk lembar mewarnai.</span>
        </div>
      )}
    </div>
  )
}

function TracingRenderer({ question }: Readonly<{ question: ExamQuestion }>) {
  const traceText = question.traceText || question.question
  return (
    <div className="ml-8 mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center dark:border-neutral-700 dark:bg-neutral-800/40">
      {question.imageUrl ? (
        <img
          src={question.imageUrl}
          alt="Ilustrasi untuk ditebalkan"
          className="max-h-64 object-contain grayscale"
        />
      ) : question.imagePrompt ? (
        <div className="min-h-32 w-full max-w-md border border-dashed border-neutral-400 px-3 py-8 text-sm font-semibold text-neutral-500">
          {assetMessage(question)}
        </div>
      ) : (
        <div className="trace-text-dotted font-mono text-2xl font-bold tracking-[0.3em] text-neutral-500 select-none">
          {traceText}
        </div>
      )}
      <p className="mt-2 text-xs italic text-neutral-500 dark:text-neutral-400">
        (Tebalkan huruf / angka di atas mengikuti garis putus-putus)
      </p>
    </div>
  )
}

function VisualRenderer({
  question,
  isGrayscale,
}: Readonly<{ question: ExamQuestion; isGrayscale?: boolean }>) {
  return (
    <div className="ml-8 mt-4 flex min-h-32 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 p-5 text-center dark:border-neutral-700">
      {question.imageUrl ? (
        <img
          src={question.imageUrl}
          alt="Ilustrasi soal"
          className={cn('max-h-64 max-w-full object-contain', isGrayscale && 'grayscale')}
        />
      ) : (
        <span className="text-sm font-semibold text-neutral-500">{assetMessage(question)}</span>
      )}
    </div>
  )
}
