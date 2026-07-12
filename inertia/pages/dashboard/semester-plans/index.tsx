import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { CalendarDays, Trash2, Eye, Sparkles } from 'lucide-react'

interface Kelas {
  id: number
  name: string
  gradeLevel: number
}

interface Semester {
  id: number
  name: string
  tahunAjaran: {
    name: string
  }
}

interface Promes {
  id: number
  subject: string
  content: any
  created_at: string
  kelas: Kelas
  semester: Semester
}

interface Subject {
  id: number
  name: string
}

interface PromesIndexProps {
  readonly promes: Promes[]
  readonly kelas: Kelas[]
  readonly semester: Semester[]
  readonly subjects: Subject[]
}

export default function PromesIndex({ promes, kelas, semester, subjects }: PromesIndexProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [deletingPromes, setDeletingPromes] = useState<Promes | null>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    kelasId: kelas[0]?.id || 0,
    semesterId: semester[0]?.id || 0,
    subject: '',
  })

  const handleGenerate = () => {
    post('/semester-plans/generate', {
      onSuccess: () => {
        setShowGenerateModal(false)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingPromes) return
    router.delete(`/semester-plans/${deletingPromes.id}`, {
      onSuccess: () => setDeletingPromes(null),
    })
  }

  return (
    <DashboardWrapper title="Dashboard">
      <Head title="Program Semester" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Program Semester (Promes)
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Rencana pembelajaran per semester dengan AI
            </p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Sparkles className="h-4 w-4" />
            Generate Promes
          </button>
        </div>

        {/* Promes List */}
        {promes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <CalendarDays className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada program semester
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Generate promes pertama Anda dengan AI
            </p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Generate Promes
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {promes.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {item.subject}
                    </h3>
                    <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      Kelas {item.kelas.name} • {item.semester.name} {item.semester.tahunAjaran.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/semester-plans/${item.id}`}
                      className="rounded-lg border border-neutral-200 p-2 text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeletingPromes(item)}
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
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Generate Promes dengan AI
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
                <label htmlFor="semesterId" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Semester
                </label>
                <select
                  id="semesterId"
                  value={data.semesterId}
                  onChange={(e) => setData('semesterId', Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {semester.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.tahunAjaran.name}
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
      {deletingPromes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Promes?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Program semester <strong>{deletingPromes.subject}</strong> akan dihapus secara permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingPromes(null)}
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
