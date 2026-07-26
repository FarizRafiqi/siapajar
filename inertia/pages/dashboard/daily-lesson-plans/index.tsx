import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { CalendarDays, Trash2, Eye, Sparkles } from 'lucide-react'
import { cn } from '~/lib/utils'

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface WeeklyLessonPlan {
  id: number
  theme: string
}

interface DailyLessonPlan {
  id: number
  date: string
  status: 'draft' | 'published'
  content: { tema?: string }
  schoolClass: SchoolClass
}

interface DailyLessonPlansIndexProps {
  readonly dailyLessonPlans: DailyLessonPlan[]
  readonly classes: SchoolClass[]
  readonly weeklyLessonPlans: WeeklyLessonPlan[]
}

export default function DailyLessonPlansIndex({
  dailyLessonPlans,
  classes,
  weeklyLessonPlans,
}: DailyLessonPlansIndexProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [deletingPlan, setDeletingPlan] = useState<DailyLessonPlan | null>(null)

  const hasClasses = classes.length > 0

  const { data, setData, post, processing, errors, reset } = useForm({
    classId: classes[0]?.id || 0,
    weeklyLessonPlanId: weeklyLessonPlans[0]?.id || undefined,
    theme: '',
    date: '',
  })

  const handleGenerate = () => {
    post('/rpph/generate', {
      onSuccess: () => {
        setShowGenerateModal(false)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingPlan) return
    router.delete(`/rpph/${deletingPlan.id}`, {
      onSuccess: () => setDeletingPlan(null),
    })
  }

  return (
    <DashboardWrapper title="RPPH" breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'RPPH' }]}>
      <Head title="RPPH" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">RPPH</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Rencana Pelaksanaan Pembelajaran Harian</p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            disabled={!hasClasses}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Generate RPPH
          </button>
        </div>

        {!hasClasses && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Buat kelas dulu sebelum generate RPPH.</p>
            <Link
              href="/classes"
              className="mt-2 inline-block rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60"
            >
              Buat kelas dulu →
            </Link>
          </div>
        )}

        {dailyLessonPlans.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <CalendarDays className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">Belum ada RPPH</h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">Generate rencana harian pertama Anda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dailyLessonPlans.map((item, index) => (
              <div key={item.id} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">{item.content?.tema || 'RPPH'}</h3>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        )}
                      >
                        {item.status === 'published' ? 'Terbit' : 'Draf'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                      <span>Kelompok {item.schoolClass.name}</span>
                      <span>•</span>
                      <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/rpph/${item.id}`}
                      className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeletingPlan(item)}
                      className="rounded-lg border border-neutral-200 p-2 text-red-600 hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Generate RPPH dengan AI</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="classId" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Kelompok
                </label>
                <select
                  id="classId"
                  value={data.classId}
                  onChange={(e) => setData('classId', Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      Kelompok {item.name}
                    </option>
                  ))}
                </select>
                {errors.classId && <p className="mt-1 text-sm text-red-500">{errors.classId}</p>}
              </div>
              {weeklyLessonPlans.length > 0 && (
                <div>
                  <label htmlFor="weeklyLessonPlanId" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    RPPM Terkait (opsional)
                  </label>
                  <select
                    id="weeklyLessonPlanId"
                    value={data.weeklyLessonPlanId ?? ''}
                    onChange={(e) => setData('weeklyLessonPlanId', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="">Tanpa RPPM</option>
                    {weeklyLessonPlans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.theme}
                      </option>
                    ))}
                  </select>
                  {errors.weeklyLessonPlanId && <p className="mt-1 text-sm text-red-500">{errors.weeklyLessonPlanId}</p>}
                </div>
              )}
              <div>
                <label htmlFor="theme" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Tema Hari Ini
                </label>
                <input
                  id="theme"
                  type="text"
                  value={data.theme}
                  onChange={(e) => setData('theme', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: Mengenal Bagian Tanaman"
                />
                {errors.theme && <p className="mt-1 text-sm text-red-500">{errors.theme}</p>}
              </div>
              <div>
                <label htmlFor="date" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Tanggal
                </label>
                <input
                  id="date"
                  type="date"
                  value={data.date}
                  onChange={(e) => setData('date', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
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
                {processing ? 'Sedang membuat...' : 'Generate'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {deletingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">Hapus RPPH?</h3>
            <p className="text-neutral-600 dark:text-neutral-400">RPPH ini akan dihapus secara permanen.</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingPlan(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button onClick={handleDelete} className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700">
                Hapus
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardWrapper>
  )
}
