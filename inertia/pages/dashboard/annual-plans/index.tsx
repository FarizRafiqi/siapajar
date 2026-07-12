import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Calendar, Trash2, Eye, Sparkles } from 'lucide-react'

interface TahunAjaran {
  id: number
  name: string
}

interface Prota {
  id: number
  subject: string
  content: any
  created_at: string
  tahunAjaran: TahunAjaran
}

interface ProtaIndexProps {
  readonly prota: Prota[]
  readonly tahunAjaran: TahunAjaran[]
}

export default function ProtaIndex({ prota, tahunAjaran }: ProtaIndexProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [deletingProta, setDeletingProta] = useState<Prota | null>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    tahunAjaranId: tahunAjaran[0]?.id || 0,
    subject: '',
  })

  const handleGenerate = () => {
    post('/annual-plans/generate', {
      onSuccess: () => {
        setShowGenerateModal(false)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingProta) return
    router.delete(`/annual-plans/${deletingProta.id}`, {
      onSuccess: () => setDeletingProta(null),
    })
  }

  const subjects = [
    'Bahasa Indonesia',
    'Matematika',
    'IPAS',
    'PPKn',
    'Bahasa Inggris',
    'Seni Budaya',
    'PJOK',
  ]

  return (
    <DashboardWrapper title="Dashboard">
      <Head title="Program Tahunan" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Program Tahunan (Protah)
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Rencana pembelajaran setahun dengan AI
            </p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Sparkles className="h-4 w-4" />
            Generate Protah
          </button>
        </div>

        {/* Prota List */}
        {prota.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <Calendar className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada program tahunan
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Generate protah pertama Anda dengan AI
            </p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Generate Protah
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {prota.map((item, index) => (
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
                      {item.tahunAjaran.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/annual-plans/${item.id}`}
                      className="rounded-lg border border-neutral-200 p-2 text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeletingProta(item)}
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
                Generate Protah dengan AI
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="tahunAjaranId" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Tahun Ajaran
                </label>
                <select
                  id="tahunAjaranId"
                  value={data.tahunAjaranId}
                  onChange={(e) => setData('tahunAjaranId', Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {tahunAjaran.map((ta) => (
                    <option key={ta.id} value={ta.id}>
                      {ta.name}
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
                    <option key={s} value={s}>
                      {s}
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
      {deletingProta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Protah?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Program tahunan <strong>{deletingProta.subject}</strong> akan dihapus secara permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingProta(null)}
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
