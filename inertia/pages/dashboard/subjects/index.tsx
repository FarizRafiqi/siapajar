import { Head, router, useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus, BookOpen, Pencil, Trash2 } from 'lucide-react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { cn } from '~/lib/utils'

interface Subject {
  id: number
  name: string
  educationLevel: string
  gradeLevel: number | null
  isActive: boolean
}

interface SubjectsIndexProps {
  subjects: Subject[]
  educationLevel: string
}

export default function SubjectsIndex({ subjects, educationLevel }: Readonly<SubjectsIndexProps>) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    educationLevel: educationLevel || 'sd',
    gradeLevel: null as number | null,
  })

  const handleCreate = () => {
    post('/subjects', {
      onSuccess: () => {
        setShowCreateModal(false)
        reset()
      },
    })
  }

  const handleUpdate = () => {
    if (!editingSubject) return
    put(`/subjects/${editingSubject.id}`, {
      onSuccess: () => {
        setEditingSubject(null)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingSubject) return
    router.delete(`/subjects/${deletingSubject.id}`, {
      onSuccess: () => setDeletingSubject(null),
    })
  }

  const handleToggleActive = (subject: Subject) => {
    router.put(`/subjects/${subject.id}`, {
      isActive: !subject.isActive,
    })
  }

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject)
    setData({
      name: subject.name,
      educationLevel: subject.educationLevel,
      gradeLevel: subject.gradeLevel,
    })
  }

  const isTk = educationLevel === 'tk'
  const gradeOptions = isTk
    ? [
        { value: null, label: 'Semua Kelompok' },
        { value: 0, label: 'Kelompok A (4-5 tahun)' },
        { value: 1, label: 'Kelompok B (5-6 tahun)' },
      ]
    : [
        { value: null, label: 'Semua Kelas' },
        { value: 1, label: 'Kelas 1' },
        { value: 2, label: 'Kelas 2' },
        { value: 3, label: 'Kelas 3' },
        { value: 4, label: 'Kelas 4' },
        { value: 5, label: 'Kelas 5' },
        { value: 6, label: 'Kelas 6' },
      ]

  const handleAddDefaults = () => {
    router.post('/subjects/defaults')
  }

  return (
    <DashboardWrapper
      title="Mata Pelajaran"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Mata Pelajaran' }]}
    >
      <Head title="Mata Pelajaran" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-neutral-200 pb-4 dark:border-neutral-800">
          <div>
            <h2 className="text-2xl font-black text-neutral-950 dark:text-white">Mata Pelajaran</h2>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
              Kelola mata pelajaran dan muatan pembelajaran untuk jenjang{' '}
              {isTk ? 'TK/PAUD/RA' : 'SD'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {subjects.length === 0 && (
              <button type="button" onClick={handleAddDefaults} className="btn-kawaii-secondary">
                <span>Tambah Default</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="btn-kawaii-primary"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Mapel</span>
            </button>
          </div>
        </div>

        {/* Subjects List */}
        {subjects.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-neutral-400 py-12 text-center bg-white/60 dark:bg-neutral-900/40 p-6">
            <BookOpen className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-black text-neutral-950 dark:text-white">
              Belum ada mata pelajaran
            </h3>
            <p className="mt-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              Tambahkan mata pelajaran atau gunakan template bawaan {isTk ? 'TK/PAUD/RA' : 'SD'}
            </p>
            <div className="mt-4 flex justify-center gap-2.5">
              <button type="button" onClick={handleAddDefaults} className="btn-kawaii-secondary">
                <span>Tambah Default</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="btn-kawaii-primary"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Manual</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="card-kawaii p-4 sm:p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neutral-200 dark:border-neutral-800">
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-300">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-300">
                      Nama Mata Pelajaran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-300">
                      Kelas/Kelompok
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-300">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-300">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-neutral-100 dark:divide-neutral-800">
                  {subjects.map((subject, index) => (
                    <tr
                      key={subject.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-sm font-bold text-neutral-950 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-black text-neutral-950 dark:text-white">
                        {subject.name}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        {subject.gradeLevel === null
                          ? 'Semua'
                          : isTk
                            ? `Kelompok ${subject.gradeLevel === 0 ? 'A' : 'B'}`
                            : `Kelas ${subject.gradeLevel}`}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(subject)}
                          className={cn(
                            'cursor-pointer transition-all',
                            subject.isActive ? 'badge-kawaii-emerald' : 'badge-kawaii-coral'
                          )}
                        >
                          {subject.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(subject)}
                            className="btn-kawaii-secondary !p-2 !rounded-xl"
                            title="Edit Mata Pelajaran"
                            aria-label="Edit Mata Pelajaran"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingSubject(subject)}
                            className="btn-kawaii-secondary !p-2 !rounded-xl !text-red-600 hover:!bg-red-50 dark:hover:!bg-red-950/30"
                            title="Hapus Mata Pelajaran"
                            aria-label="Hapus Mata Pelajaran"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] border-2 border-black dark:border-white dark:bg-neutral-900"
          >
            <h3 className="mb-4 text-lg font-black text-neutral-950 dark:text-white border-b-2 border-neutral-100 pb-3 dark:border-neutral-800">
              Tambah Mata Pelajaran
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-black text-neutral-950 dark:text-neutral-200">
                  Nama Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-2xl border-2 border-black dark:border-white px-3.5 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-white focus:shadow-[3px_3px_0px_#000000]"
                  placeholder={isTk ? 'contoh: Motorik Kasar' : 'contoh: Bahasa Indonesia'}
                />
                {errors.name && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-black text-neutral-950 dark:text-neutral-200">
                  Kelas/Kelompok (opsional)
                </label>
                <select
                  value={data.gradeLevel ?? ''}
                  onChange={(e) =>
                    setData('gradeLevel', e.target.value === '' ? null : Number(e.target.value))
                  }
                  className="w-full rounded-2xl border-2 border-black dark:border-white px-3.5 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-white focus:shadow-[3px_3px_0px_#000000]"
                >
                  {gradeOptions.map((opt) => (
                    <option key={opt.value ?? 'all'} value={opt.value ?? ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false)
                  reset()
                }}
                className="flex-1 btn-kawaii-secondary"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={processing}
                className="flex-1 btn-kawaii-primary"
              >
                {processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] border-2 border-black dark:border-white dark:bg-neutral-900"
          >
            <h3 className="mb-4 text-lg font-black text-neutral-950 dark:text-white border-b-2 border-neutral-100 pb-3 dark:border-neutral-800">
              Edit Mata Pelajaran
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-black text-neutral-950 dark:text-neutral-200">
                  Nama Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-2xl border-2 border-black dark:border-white px-3.5 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-white focus:shadow-[3px_3px_0px_#000000]"
                />
                {errors.name && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-black text-neutral-950 dark:text-neutral-200">
                  Kelas/Kelompok (opsional)
                </label>
                <select
                  value={data.gradeLevel ?? ''}
                  onChange={(e) =>
                    setData('gradeLevel', e.target.value === '' ? null : Number(e.target.value))
                  }
                  className="w-full rounded-2xl border-2 border-black dark:border-white px-3.5 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-white focus:shadow-[3px_3px_0px_#000000]"
                >
                  {gradeOptions.map((opt) => (
                    <option key={opt.value ?? 'all'} value={opt.value ?? ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingSubject(null)
                  reset()
                }}
                className="flex-1 btn-kawaii-secondary"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={processing}
                className="flex-1 btn-kawaii-primary"
              >
                {processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] border-2 border-black dark:border-white dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-black text-neutral-950 dark:text-white border-b-2 border-neutral-100 pb-3 dark:border-neutral-800">
              Hapus Mata Pelajaran?
            </h3>
            <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Mata pelajaran{' '}
              <strong className="text-neutral-950 dark:text-white font-black">
                {deletingSubject.name}
              </strong>{' '}
              akan dihapus permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingSubject(null)}
                className="flex-1 btn-kawaii-secondary"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 btn-kawaii-primary !bg-red-500 hover:!bg-red-400 !text-white"
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
