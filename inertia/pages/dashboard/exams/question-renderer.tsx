import { Image, ListChecks, MessageSquareText, Mic2, PencilLine, Target } from 'lucide-react'
import { cn } from '~/lib/utils'
import type { ExamQuestion } from './question-types'

const kindMeta = {
  multiple_choice: { label: 'Pilihan ganda', icon: ListChecks },
  essay: { label: 'Uraian', icon: MessageSquareText },
  visual: { label: 'Aktivitas visual', icon: Image },
  practical: { label: 'Praktik / performa', icon: Target },
  oral: { label: 'Lisan', icon: Mic2 },
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
  const meta = kindMeta[question.type]
  const Icon = meta.icon
  const answer = question.answer?.trim().toUpperCase()

  return (
    <article
      className={cn(
        'rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900',
        compact ? 'p-4' : 'p-6'
      )}
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <Icon className="h-3.5 w-3.5" /> {meta.label}
            </span>
            {question.visualType && (
              <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                {question.visualType}
              </span>
            )}
          </div>
          <p className="text-base font-semibold leading-7 text-neutral-900 dark:text-white">
            {question.question || 'Pertanyaan belum diisi.'}
          </p>
          {question.instruction && (
            <p className="mt-2 text-sm italic text-neutral-500 dark:text-neutral-400">
              Petunjuk: {question.instruction}
            </p>
          )}
        </div>
      </div>

      {question.type === 'multiple_choice' && (
        <div className="ml-11 grid gap-2 sm:grid-cols-2">
          {(question.options || []).map((option) => (
            <div
              key={`${question.id}-${option.label}`}
              className={cn(
                'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
                showAnswer && answer === option.label
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                  : 'border-neutral-200 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'
              )}
            >
              <span className="font-bold">{option.label}.</span>
              <span>{option.text || '...'}</span>
            </div>
          ))}
        </div>
      )}
      {question.type === 'essay' && (
        <div className="ml-11 mt-3 space-y-2">
          {[1, 2, 3].map((line) => (
            <div
              key={line}
              className="h-8 border-b border-dashed border-neutral-300 dark:border-neutral-700"
            />
          ))}
        </div>
      )}
      {question.type === 'visual' && (
        <div className="ml-11 mt-4 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-5 dark:border-purple-900 dark:bg-purple-900/10">
          {question.imageUrl ? (
            <img
              src={question.imageUrl}
              alt="Ilustrasi soal"
              className="mx-auto max-h-56 rounded-lg object-contain"
            />
          ) : (
            <div className="flex min-h-28 flex-col items-center justify-center gap-2 text-center text-sm text-purple-700 dark:text-purple-300">
              <Image className="h-8 w-8" />
              <span>{question.imagePrompt || 'Area ilustrasi soal'}</span>
            </div>
          )}
        </div>
      )}
      {(question.type === 'practical' || question.type === 'oral') && (
        <div className="ml-11 mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
          <div className="flex items-center gap-2 font-semibold">
            <PencilLine className="h-4 w-4" /> Bukti yang diamati
          </div>
          <p className="mt-2">Catat respons, strategi, dan kemandirian anak selama kegiatan.</p>
        </div>
      )}
      {showAnswer && question.answer && (
        <div className="ml-11 mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
          <strong>Kunci / jawaban:</strong> {question.answer}
        </div>
      )}
      {showAnswer && question.explanation && (
        <div className="ml-11 mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          <strong>Pembahasan:</strong> {question.explanation}
        </div>
      )}
      {showAnswer && (question.rubric || question.scoringGuide) && (
        <div className="ml-11 mt-3 rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800 dark:border-purple-900 dark:bg-purple-900/20 dark:text-purple-200">
          <strong>Rubrik / panduan skor:</strong> {question.rubric || question.scoringGuide}
        </div>
      )}
    </article>
  )
}
