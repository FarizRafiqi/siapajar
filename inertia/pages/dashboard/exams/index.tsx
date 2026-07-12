import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FileQuestion, Trash2, Eye, Sparkles } from 'lucide-react'
import { cn } from '~/lib/utils'

interface Kelas {
  id: number
  name: string
  gradeLevel: number
}

interface Soal {
  id: number
  title: string
  type: 'PTS' | 'PAS' | 'harian' | 'sumatif'
  status: 'draft' | 'published'
  questions: any[]
  created_at: string
  kelas: Kelas
}

interface Subject {
  id: number
  name: string
}

interface SoalIndexProps {
  readonly soal: Soal[]
  readonly kelas: Kelas[]
  readonly subjects: Subject[]
}

export default function SoalIndex({ soal, kelas, subjects }: SoalIndexProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [deletingSoal, setDeletingSoal] = useState<Soal | null>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    kelasId: kelas[0]?.id || 0,
    subject: '',
    type: 'harian' as const,
    topic: '',
    questionCount: 10,
  })

  const handleGenerate = () => {
    post('/exams/generate', {
      onSuccess: () => {
        setShowGenerateModal(false)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingSoal) return
    router.delete(`/exams/${deletingSoal.id}`, {
      onSuccess: () => setDeletingSoal(null),
    })
  }

  const soalTypes = [
    { value: 'harian', label: 'Soal Harian' },
    { value: 'PTS', label: 'PTS (Penilaian Tengah Semester)' },
    { value: 'PAS', label: 'PAS (Penilaian Akhir Semester)' },
    { value: 'sumatif', label: 'Sumatif' },
  ]

  return (
    <DashboardWrapper title="Dashboard">
      <Head title="Bank Soal" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Bank Soal</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Generate soal PTS/PAS dengan AI
            </p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Sparkles className="h-4 w-4" />
            Generate Soal
          </button>
        </div>

        {/* Soal List */}
        {soal.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <FileQuestion className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada soal
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Generate soal pertama Anda dengan AI
            </p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Generate Soal
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {soal.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {item.title}
                      </h3>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          item.type === 'PTS' || item.type === 'PAS'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        )}
                      >
                        {item.type}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        )}
                      >
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      Kelas {item.kelas.name} • {item.questions.length} soal
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/exams/${item.id}`}
                      className="rounded-lg border border-neutral-200 p-2 text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeletingSoal(item)}
                      className="rounded-lg border border-neutral-200 p-2 text-red-600 transition-colors hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Generate Soal dengan AI
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="kelasId" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Kelas
                </label>
                <select
                  id="kelasId"
                  value={data.kelasId}
                  onChange={(e) => setData('kelasId', Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {kelas.map((k) => (
                    <option key={k.id} value={k.id}>
                      Kelas {k.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="subject" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Mata Pelajaran
                </label>
                <select
                  id="subject"
                  value={data.subject}
                  onChange={(e) => setData('subject', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="">Pilih mata pelajaran</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                )}
              </div>
              <div>
                <label htmlFor="type" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Jenis Soal
                </label>
                <select
                  id="type"
                  value={data.type}
                  onChange={(e) => setData('type', e.target.value as any)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {soalTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="topic" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Topik / Materi
                </label>
                <input
                  id="topic"
                  type="text"
                  value={data.topic}
                  onChange={(e) => setData('topic', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: Bilangan Bulat"
                />
                {errors.topic && (
                  <p className="mt-1 text-sm text-red-500">{errors.topic}</p>
                )}
              </div>
              <div>
                <label htmlFor="questionCount" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Jumlah Soal
                </label>
                <input
                  id="questionCount"
                  type="number"
                  value={data.questionCount}
                  onChange={(e) => setData('questionCount', Number(e.target.value))}
                  min={5}
                  max={50}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowGenerateModal(false)
                  reset()
                }}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleGenerate}
                disabled={processing}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {processing ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Soal?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Soal <strong>{deletingSoal.title}</strong> akan dihapus secara permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingSoal(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </motion.div>
        </div>
      )}
    
    </DashboardWrapper>
  )
}
