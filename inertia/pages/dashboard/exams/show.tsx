import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download } from 'lucide-react'
import { cn } from '~/lib/utils'

interface Kelas {
  id: number
  name: string
  gradeLevel: number
}

interface Question {
  id: number
  type: string
  question: string
  options: string[]
  answer: string
  explanation: string
}

interface Soal {
  id: number
  title: string
  type: 'PTS' | 'PAS' | 'harian' | 'sumatif'
  status: 'draft' | 'published'
  questions: Question[]
  created_at: string
  kelas: Kelas
}

interface SoalShowProps {
  readonly soal: Soal
}

export default function SoalShow({ soal }: SoalShowProps) {
  const handleExport = () => {
    // Future implementation: DOCX export
    alert('Export DOCX akan segera tersedia')
  }

  return (
    <DashboardWrapper title="Dashboard">
      <Head title={soal.title} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/soal"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {soal.title}
              </h2>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  soal.type === 'PTS' || soal.type === 'PAS'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                )}
              >
                {soal.type}
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  soal.status === 'published'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                )}
              >
                {soal.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              Kelas {soal.kelas.name} • {soal.questions.length} soal
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Download className="h-4 w-4" />
            Export DOCX
          </button>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {soal.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {index + 1}
                </span>
                <p className="flex-1 text-neutral-900 dark:text-white">{question.question}</p>
              </div>

              {question.options && question.options.length > 0 && (
                <div className="ml-10 space-y-2">
                  {question.options.map((option) => (
                    <div
                      key={option}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm',
                        option.startsWith(question.answer)
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'border-neutral-200 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'
                      )}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}

              {question.explanation && (
                <div className="ml-10 mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  <strong>Pembahasan:</strong> {question.explanation}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    
    </DashboardWrapper>
  )
}
