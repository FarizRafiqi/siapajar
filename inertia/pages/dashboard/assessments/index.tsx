import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ClipboardCheck, Trash2, Eye, Plus } from 'lucide-react'
import { cn } from '~/lib/utils'

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface Subject {
  id: number
  name: string
}

interface Assessment {
  id: number
  title: string
  subject: string
  type: 'formative' | 'summative'
  date: string
  schoolClass: SchoolClass
}

interface AssessmentsIndexProps {
  readonly assessments: Assessment[]
  readonly classes: SchoolClass[]
  readonly subjects: Subject[]
}

const TYPE_LABELS: Record<string, string> = {
  formative: 'Formatif',
  summative: 'Sumatif',
}

export default function AssessmentsIndex({
  assessments,
  classes,
  subjects,
}: AssessmentsIndexProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deletingAssessment, setDeletingAssessment] = useState<Assessment | null>(null)

  const hasClasses = classes.length > 0
  const hasSubjects = subjects.length > 0
  const canCreate = hasClasses && hasSubjects

  const { data, setData, post, processing, errors, reset } = useForm({
    classId: classes[0]?.id || 0,
    subject: '',
    type: 'formative' as 'formative' | 'summative',
    title: '',
    learningObjective: '',
    date: '',
  })

  const handleCreate = () => {
    post('/assessments', {
      onSuccess: () => {
        setShowCreateModal(false)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingAssessment) return
    router.delete(`/assessments/${deletingAssessment.id}`, {
      onSuccess: () => setDeletingAssessment(null),
    })
  }

  return (
    <DashboardWrapper
      title="Penilaian"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Penilaian' }]}
    >
      <Head title="Penilaian" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Penilaian</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Input nilai per kelas, satu tabel untuk semua siswa
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!canCreate}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Buat Penilaian
          </button>
        </div>

        {!canCreate && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Lengkapi dulu sebelum bisa buat penilaian:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {!hasClasses && (
                <Link
                  href="/classes"
                  className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60"
                >
                  Buat kelas dulu →
                </Link>
              )}
              {!hasSubjects && (
                <Link
                  href="/subjects"
                  className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60"
                >
                  Tambah mata pelajaran dulu →
                </Link>
              )}
            </div>
          </div>
        )}

        {assessments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <ClipboardCheck className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada penilaian
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Buat penilaian pertama untuk mulai input nilai
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map((item, index) => (
              <div
                key={item.id}
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
                          item.type === 'summative'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        )}
                      >
                        {TYPE_LABELS[item.type]}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                      <span>{item.subject}</span>
                      <span>•</span>
                      <span>Kelas {item.schoolClass.name}</span>
                      <span>•</span>
                      <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/assessments/${item.id}`}
                      className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeletingAssessment(item)}
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

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Buat Penilaian Baru
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="classId"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Kelas
                </label>
                <select
                  id="classId"
                  value={data.classId}
                  onChange={(e) => setData('classId', Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Kelas {c.name}
                    </option>
                  ))}
                </select>
                {errors.classId && <p className="mt-1 text-sm text-red-500">{errors.classId}</p>}
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
              <div>
                <label
                  htmlFor="type"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Jenis
                </label>
                <select
                  id="type"
                  value={data.type}
                  onChange={(e) => setData('type', e.target.value as 'formative' | 'summative')}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="formative">Formatif</option>
                  <option value="summative">Sumatif</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Judul Penilaian
                </label>
                <input
                  id="title"
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: Ulangan Harian Bab 3"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>
              <div>
                <label
                  htmlFor="learningObjective"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Tujuan Pembelajaran (opsional)
                </label>
                <input
                  id="learningObjective"
                  type="text"
                  value={data.learningObjective}
                  onChange={(e) => setData('learningObjective', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
                {errors.learningObjective && (
                  <p className="mt-1 text-sm text-red-500">{errors.learningObjective}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
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
                  setShowCreateModal(false)
                  reset()
                }}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleCreate}
                disabled={processing}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {processing ? 'Menyimpan...' : 'Buat'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {deletingAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Penilaian?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Penilaian <strong>{deletingAssessment.title}</strong> beserta semua nilai siswa akan
              dihapus.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingAssessment(null)}
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
