import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Calendar, Trash2, Eye, Plus } from 'lucide-react'
import CurriculumSequenceSelect from '~/components/dashboard/curriculum_sequence_select'

interface AcademicYear {
  id: number
  name: string
}

interface Subject {
  id: number
  name: string
}

interface AnnualPlan {
  id: number
  subject: string
  createdAt: string
  academicYear: AcademicYear
}

interface AnnualPlansIndexProps {
  readonly annualPlans: AnnualPlan[]
  readonly academicYears: AcademicYear[]
  readonly subjects: Subject[]
  readonly sequences: { id: number; title: string; context: string }[]
}

export default function AnnualPlansIndex({
  annualPlans,
  academicYears,
  subjects,
  sequences,
}: AnnualPlansIndexProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [deletingPlan, setDeletingPlan] = useState<AnnualPlan | null>(null)

  const hasAcademicYear = academicYears.length > 0
  const hasSubjects = subjects.length > 0
  const canGenerate = hasAcademicYear && hasSubjects

  const { data, setData, post, processing, errors, reset } = useForm({
    academicYearId: academicYears[0]?.id || 0,
    subject: '',
    learningSequenceId: undefined as number | undefined,
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
    if (!deletingPlan) return
    router.delete(`/annual-plans/${deletingPlan.id}`, {
      onSuccess: () => setDeletingPlan(null),
    })
  }

  return (
    <DashboardWrapper
      title="Program Tahunan"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Protah' }]}
    >
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
            type="button"
            onClick={() => setShowGenerateModal(true)}
            disabled={!canGenerate}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Generate Protah
          </button>
        </div>

        {/* Prasyarat belum lengkap */}
        {!canGenerate && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Lengkapi dulu sebelum bisa generate Protah:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {!hasAcademicYear && (
                <span className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
                  Belum ada tahun ajaran — hubungi administrator
                </span>
              )}
              {!hasSubjects && (
                <Link
                  href="/subjects"
                  className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 underline hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200"
                >
                  Belum ada mata pelajaran — tambah sekarang &rarr;
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Daftar Protah */}
        {annualPlans.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <Calendar className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-white">
              Belum ada Program Tahunan
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              {canGenerate
                ? 'Klik tombol "Generate Protah" untuk membuat Protah otomatis dengan AI.'
                : 'Lengkapi prasyarat di atas untuk mulai membuat Protah.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {annualPlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {plan.academicYear?.name ?? 'Tahun Ajaran'}
                    </span>
                    <h3 className="mt-2 font-semibold text-neutral-900 dark:text-white">
                      {plan.subject}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeletingPlan(plan)}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <span className="text-xs text-neutral-400">
                    {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString('id-ID') : '-'}
                  </span>
                  <Link
                    href={`/annual-plans/${plan.id}`}
                    className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    <Eye className="h-4 w-4" />
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Generate */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Generate Protah dengan AI
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="academicYearId"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Tahun Ajaran
                </label>
                <select
                  id="academicYearId"
                  value={data.academicYearId}
                  onChange={(e) => setData('academicYearId', Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
                </select>
                {errors.academicYearId && (
                  <p className="mt-1 text-sm text-red-500">{errors.academicYearId}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
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
                {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
              </div>
              <CurriculumSequenceSelect
                sequences={sequences}
                value={data.learningSequenceId}
                onChange={(value) => setData('learningSequenceId', value)}
              />
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
                {processing ? 'Sedang membuat...' : 'Generate'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deletingPlan && (
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
              Program tahunan <strong>{deletingPlan.subject}</strong> akan dihapus secara permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingPlan(null)}
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
