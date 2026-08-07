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
  question: ExamQuestion
  number: number
  showAnswer?: boolean
  compact?: boolean
}

export function QuestionRenderer({
  question,
  number,
  showAnswer = false,
  compact = false,
}: QuestionRendererProps) {
  const meta = kindMeta[question.type] || kindMeta.visual
  const Icon = meta.icon
  const answer = question.answer?.trim().toUpperCase()

  return (
    <article
      className={cn(
        'rounded-2xl border border-neutral-200 bg-white shadow-sm print:border-none print:shadow-none print:p-0 dark:border-neutral-800 dark:bg-neutral-900',
        compact ? 'p-4' : 'p-6'
      )}
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 print:bg-none print:text-black">
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
          {question.instruction && (
            <p className="mt-1 text-sm italic text-neutral-500 dark:text-neutral-400 print:text-xs">
              Petunjuk: {question.instruction}
            </p>
          )}
        </div>
      </div>

      {/* Tipe 1: Pilihan Ganda (3 Opsi Horizontal) */}
      {question.type === 'multiple_choice' && (
        <div className="ml-10 mt-2 flex flex-wrap items-center gap-6 text-sm sm:gap-12 print:text-xs">
          {(question.options || []).map((option) => (
            <div
              key={`${question.id}-${option.label}`}
              className={cn(
                'flex items-center gap-2 font-medium',
                showAnswer && answer === option.label?.toUpperCase()
                  ? 'text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-neutral-800 dark:text-neutral-200 print:text-black'
              )}
            >
              <span className="font-semibold">{option.label.toLowerCase()}.</span>
              <span>{option.text || '...'}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tipe 2: Hubungkan Garis (Structure 5 Kolom Presisi) */}
      {question.type === 'matching' && <MatchingRenderer question={question} />}

      {/* Tipe 3: Tulis Nama Gambar / Artikan Kata */}
      {(question.type === 'fill_blank_image' || (question.type === 'visual' && question.visualType?.toLowerCase().includes('tulis'))) && (
        <ImageFillRenderer question={question} />
      )}

      {/* Tipe 4: Matematika / Pengurangan Vertikal */}
      {question.type === 'vertical_math' && <VerticalMathRenderer question={question} />}

      {/* Tipe 5: Hitung & Lingkari */}
      {question.type === 'count_and_circle' && <CountCircleRenderer question={question} />}

      {/* Tipe 6: Mewarnai (Coloring Sheet / Color by Label) */}
      {question.type === 'coloring' && <ColoringRenderer question={question} />}

      {/* Tipe 7: Tracing / Menebalkan */}
      {question.type === 'tracing' && (
        <div className="ml-10 mt-3 font-mono text-xl tracking-widest text-neutral-400 border-b border-dashed border-neutral-300 pb-2">
          {question.question}
        </div>
      )}

      {/* Uraian Standar */}
      {question.type === 'essay' && (
        <div className="ml-10 mt-3 space-y-3">
          {[1, 2, 3].map((line) => (
            <div
              key={line}
              className="h-8 border-b border-dashed border-neutral-300 dark:border-neutral-700"
            />
          ))}
        </div>
      )}

      {/* Bukti Diamati Praktik/Lisan */}
      {(question.type === 'practical' || question.type === 'oral') && (
        <div className="ml-10 mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 print:hidden dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
          <div className="flex items-center gap-2 font-semibold">
            <PencilLine className="h-4 w-4" /> Bukti yang diamati
          </div>
          <p className="mt-2">Catat respons, strategi, dan kemandirian anak selama kegiatan.</p>
        </div>
      )}

      {showAnswer && question.answer && (
        <div className="ml-10 mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 print:hidden dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
          <strong>Kunci / jawaban:</strong> {question.answer}
        </div>
      )}
      {showAnswer && question.explanation && (
        <div className="ml-10 mt-2 text-xs text-neutral-600 print:hidden dark:text-neutral-400">
          <strong>Pembahasan:</strong> {question.explanation}
        </div>
      )}
    </article>
  )
}

/** 5-Column Matching Renderer Presisi */
function MatchingRenderer({ question }: { question: ExamQuestion }) {
  const leftItems = question.leftItems || []
  const rightItems = question.rightItems || []
  const rowCount = Math.max(leftItems.length, rightItems.length, 3)

  return (
    <div className="ml-10 mt-4 w-full">
      <div className="space-y-4">
        {Array.from({ length: rowCount }, (_, index) => {
          const left = leftItems[index]
          const right = rightItems[index]
          return (
            <div key={index} className="grid grid-cols-[140px_24px_1fr_24px_160px] items-center gap-2">
              {/* Kolom 1: Item Kiri (Gambar / Icon / Teks) */}
              <div className="flex items-center justify-start min-h-[48px]">
                {left?.imageUrl ? (
                  <img src={left.imageUrl} alt="" className="h-12 w-12 object-contain" />
                ) : (
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white print:text-black">
                    {left?.label || ''}
                  </span>
                )}
              </div>

              {/* Kolom 2: Bullet Point Kiri */}
              <div className="flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-black text-black">●</span>
              </div>

              {/* Kolom 3: Area Kosong Garis (Gap) */}
              <div className="w-full" />

              {/* Kolom 4: Bullet Point Kanan */}
              <div className="flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-black text-black">●</span>
              </div>

              {/* Kolom 5: Item Kanan (Teks Pasangan) */}
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

/** Renderer Gambar + Dotted Lines (Tulis Nama) */
function ImageFillRenderer({ question }: { question: ExamQuestion }) {
  const options = question.leftItems && question.leftItems.length > 0 ? question.leftItems : [1, 2, 3]
  return (
    <div className="ml-10 mt-4 grid grid-cols-3 gap-6 text-center">
      {options.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 print:border-black dark:border-neutral-800 dark:bg-neutral-800">
            {typeof item === 'object' && item.imageUrl ? (
              <img src={item.imageUrl} alt="" className="h-16 w-16 object-contain" />
            ) : (
              <ImageIcon className="h-10 w-10 text-neutral-400" />
            )}
          </div>
          <div className="w-full text-xs text-neutral-500 font-mono tracking-widest">
            ...................................
          </div>
        </div>
      ))}
    </div>
  )
}

/** Renderer Matematika / Pengurangan Vertikal */
function VerticalMathRenderer({ question }: { question: ExamQuestion }) {
  const mathProblems = question.mathProblems || [
    { topNumber: 97, bottomNumber: 43, operator: '-' },
    { topNumber: 68, bottomNumber: 45, operator: '-' },
    { topNumber: 37, bottomNumber: 25, operator: '-' },
    { topNumber: 69, bottomNumber: 57, operator: '-' },
    { topNumber: 86, bottomNumber: 44, operator: '-' },
  ]

  return (
    <div className="ml-10 mt-4 flex flex-wrap items-center justify-between gap-6 font-mono text-base font-bold text-black">
      {mathProblems.map((prob, idx) => (
        <div key={idx} className="flex flex-col items-end border-b-2 border-black pb-1 px-2 w-16">
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

/** Renderer Hitung & Lingkari */
function CountCircleRenderer({ question }: { question: ExamQuestion }) {
  const countItems = question.countItems || [
    { count: 4, options: [6, 7, 8] },
    { count: 5, options: [10, 11, 12] },
  ]
  return (
    <div className="ml-10 mt-4 grid grid-cols-2 gap-6">
      {countItems.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center gap-3 rounded-xl border p-4">
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: item.count || 4 }).map((_, i) => (
              <ImageIcon key={i} className="h-6 w-6 text-neutral-700" />
            ))}
          </div>
          <div className="flex gap-4 font-bold text-sm">
            {item.options.map((num) => (
              <span key={num} className="rounded-full px-2 py-1 border border-neutral-300">
                {num}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Renderer Mewarnai (Line Art Outline) */
function ColoringRenderer({ question }: { question: ExamQuestion }) {
  return (
    <div className="ml-10 mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 p-6 text-center">
      {question.imageUrl ? (
        <img src={question.imageUrl} alt="Mewarnai" className="max-h-64 object-contain" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-neutral-500">
          <Palette className="h-12 w-12 text-neutral-400" />
          <span className="text-xs">{question.imagePrompt || 'Area Mewarnai Gambar'}</span>
        </div>
      )}
    </div>
  )
}

