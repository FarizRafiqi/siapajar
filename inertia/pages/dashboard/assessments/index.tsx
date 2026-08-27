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
            className="btn-kawaii-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Buat Penilaian
          </button>
        </div>

        {!canCreate && (
          <div className="rounded-2xl border-2 border-black bg-amber-100 p-4 shadow-[4px_4px_0px_#000000] dark:border-white dark:bg-amber-950/40 dark:shadow-[4px_4px_0px_#ffffff]">
            <p className="text-sm font-bold text-amber-950 dark:text-amber-200">
              Lengkapi dulu sebelum bisa buat penilaian:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {!hasClasses && (
                <Link href="/classes" className="btn-kawaii-amber !py-1.5 !px-3 !text-xs font-bold">
                  Buat kelas dulu →
                </Link>
              )}
              {!hasSubjects && (
                <Link
                  href="/subjects"
                  className="btn-kawaii-amber !py-1.5 !px-3 !text-xs font-bold"
                >
                  Tambah mata pelajaran dulu →
                </Link>
              )}
            </div>
          </div>
        )}

        {assessments.length === 0 ? (
          <div className="card-kawaii py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-neutral-100 shadow-[3px_3px_0px_#000000] dark:border-white dark:bg-neutral-800 dark:shadow-[3px_3px_0px_#ffffff]">
              <ClipboardCheck className="h-8 w-8 text-neutral-700 dark:text-neutral-300" />
            </div>
            <h3 className="mt-4 text-lg font-black text-neutral-900 dark:text-white">
              Belum ada penilaian
            </h3>
            <p className="mt-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Buat penilaian pertama untuk mulai input nilai
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map((item) => (
              <div
                key={item.id}
                className="card-kawaii p-4 sm:p-5 transition-all hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000000]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base font-black text-neutral-900 dark:text-white">
                        {item.title}
                      </h3>
                      <span
                        className={cn(
                          item.type === 'summative' ? 'badge-kawaii-amber' : 'badge-kawaii-emerald'
                        )}
                      >
                        {TYPE_LABELS[item.type]}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-300">
                      <span className="rounded-lg border border-black/20 bg-neutral-100 px-2 py-0.5 dark:border-white/20 dark:bg-neutral-800">
                        {item.subject}
                      </span>
                      <span>•</span>
                      <span>Kelas {item.schoolClass.name}</span>
                      <span>•</span>
                      <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href={`/assessments/${item.id}`}
                      className="btn-kawaii-secondary !p-2.5 !rounded-xl"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeletingAssessment(item)}
                      className="btn-kawaii-secondary !p-2.5 !rounded-xl !text-red-600 hover:!text-red-700 hover:!bg-red-50"
                      title="Hapus"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000000] dark:border-white dark:bg-neutral-900 dark:shadow-[8px_8px_0px_#ffffff]"
          >
            <h3 className="mb-4 text-xl font-black text-neutral-900 dark:text-white">
              Buat Penilaian Baru
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="classId"
                  className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                >
                  Kelas
                </label>
                <select
                  id="classId"
                  value={data.classId}
                  onChange={(e) => setData('classId', Number(e.target.value))}
                  className="w-full rounded-2xl border-2 border-black px-3.5 py-2.5 text-sm font-bold dark:border-white dark:bg-neutral-800 dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_#000000]"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Kelas {c.name}
                    </option>
                  ))}
                </select>
                {errors.classId && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.classId}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                >
                  Mata Pelajaran
                </label>
                <select
                  id="subject"
                  value={data.subject}
                  onChange={(e) => setData('subject', e.target.value)}
                  className="w-full rounded-2xl border-2 border-black px-3.5 py-2.5 text-sm font-bold dark:border-white dark:bg-neutral-800 dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_#000000]"
                >
                  <option value="">Pilih mata pelajaran</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.subject}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                >
                  Jenis
                </label>
                <select
                  id="type"
                  value={data.type}
                  onChange={(e) => setData('type', e.target.value as 'formative' | 'summative')}
                  className="w-full rounded-2xl border-2 border-black px-3.5 py-2.5 text-sm font-bold dark:border-white dark:bg-neutral-800 dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_#000000]"
                >
                  <option value="formative">Formatif</option>
                  <option value="summative">Sumatif</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="title"
                  className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                >
                  Judul Penilaian
                </label>
                <input
                  id="title"
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  className="w-full rounded-2xl border-2 border-black px-3.5 py-2.5 text-sm font-bold dark:border-white dark:bg-neutral-800 dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_#000000]"
                  placeholder="contoh: Ulangan Harian Bab 3"
                />
                {errors.title && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.title}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="learningObjective"
                  className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                >
                  Tujuan Pembelajaran (opsional)
                </label>
                <input
                  id="learningObjective"
                  type="text"
                  value={data.learningObjective}
                  onChange={(e) => setData('learningObjective', e.target.value)}
                  className="w-full rounded-2xl border-2 border-black px-3.5 py-2.5 text-sm font-bold dark:border-white dark:bg-neutral-800 dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_#000000]"
                />
                {errors.learningObjective && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.learningObjective}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                >
                  Tanggal
                </label>
                <input
                  id="date"
                  type="date"
                  value={data.date}
                  onChange={(e) => setData('date', e.target.value)}
                  className="w-full rounded-2xl border-2 border-black px-3.5 py-2.5 text-sm font-bold dark:border-white dark:bg-neutral-800 dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_#000000]"
                />
                {errors.date && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.date}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  reset()
                }}
                className="btn-kawaii-secondary flex-1"
              >
                Batal
              </button>
              <button
                onClick={handleCreate}
                disabled={processing}
                className="btn-kawaii-primary flex-1 disabled:opacity-50"
              >
                {processing ? 'Menyimpan...' : 'Buat'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {deletingAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000000] dark:border-white dark:bg-neutral-900 dark:shadow-[8px_8px_0px_#ffffff]"
          >
            <h3 className="mb-2 text-xl font-black text-neutral-900 dark:text-white">
              Hapus Penilaian?
            </h3>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Penilaian{' '}
              <strong className="text-neutral-900 dark:text-white">
                {deletingAssessment.title}
              </strong>{' '}
              beserta semua nilai siswa akan dihapus.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingAssessment(null)}
                className="btn-kawaii-secondary flex-1"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="btn-kawaii-primary !bg-red-500 hover:!bg-red-400 !text-white flex-1"
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
