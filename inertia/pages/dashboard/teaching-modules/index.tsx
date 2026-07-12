import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { BookOpen, Trash2, Eye, Sparkles } from 'lucide-react'
import { cn } from '~/lib/utils'

interface Kelas {
  id: number
  name: string
  gradeLevel: number
}

interface ModulAjar {
  id: number
  title: string
  subject: string
  phase: string
  status: 'draft' | 'published'
  created_at: string
  kelas: Kelas
}

interface Subject {
  id: number
  name: string
}

interface ModulAjarIndexProps {
  readonly modulAjar: ModulAjar[]
  readonly kelas: Kelas[]
  readonly subjects: Subject[]
}

export default function ModulAjarIndex({ modulAjar, kelas, subjects }: ModulAjarIndexProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [deletingModul, setDeletingModul] = useState<ModulAjar | null>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    kelasId: kelas[0]?.id || 0,
    subject: '',
    topic: '',
    phase: 'B',
  })

  const handleGenerate = () => {
    post('/teaching-modules/generate', {
      onSuccess: () => {
        setShowGenerateModal(false)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingModul) return
    router.delete(`/teaching-modules/${deletingModul.id}`, {
      onSuccess: () => setDeletingModul(null),
    })
  }

  return (
    <DashboardWrapper title="Dashboard">
      <Head title="Modul Ajar" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Modul Ajar</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Generate modul ajar Kurikulum Merdeka dengan AI
            </p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Sparkles className="h-4 w-4" />
            Generate Modul Ajar
          </button>
        </div>

        {/* Modul Ajar List */}
        {modulAjar.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <BookOpen className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada modul ajar
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Generate modul ajar pertama Anda dengan AI
            </p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Generate Modul Ajar
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {modulAjar.map((item, index) => (
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
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        )}
                      >
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                      <span>{item.subject}</span>
                      <span>•</span>
                      <span>Kelas {item.kelas.name}</span>
                      <span>•</span>
                      <span>Fase {item.phase}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/teaching-modules/${item.id}`}
                      className="rounded-lg border border-neutral-200 p-2 text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeletingModul(item)}
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
                Generate Modul Ajar dengan AI
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
                <label htmlFor="topic" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Topik / Tema
                </label>
                <input
                  id="topic"
                  type="text"
                  value={data.topic}
                  onChange={(e) => setData('topic', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: Memahami Bilangan Bulat"
                />
                {errors.topic && (
                  <p className="mt-1 text-sm text-red-500">{errors.topic}</p>
                )}
              </div>
              <div>
                <label htmlFor="phase" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Fase Kurikulum Merdeka
                </label>
                <select
                  id="phase"
                  value={data.phase}
                  onChange={(e) => setData('phase', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((p) => (
                    <option key={p} value={p}>
                      Fase {p}
                    </option>
                  ))}
                </select>
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
      {deletingModul && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Modul Ajar?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Modul ajar <strong>{deletingModul.title}</strong> akan dihapus secara permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingModul(null)}
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
