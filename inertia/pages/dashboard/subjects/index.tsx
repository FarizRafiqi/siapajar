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
    post('/dashboard/subjects', {
      onSuccess: () => {
        setShowCreateModal(false)
        reset()
      },
    })
  }

  const handleUpdate = () => {
    if (!editingSubject) return
    put(`/dashboard/subjects/${editingSubject.id}`, {
      onSuccess: () => {
        setEditingSubject(null)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingSubject) return
    router.delete(`/dashboard/subjects/${deletingSubject.id}`, {
      onSuccess: () => setDeletingSubject(null),
    })
  }

  const handleToggleActive = (subject: Subject) => {
    router.put(`/dashboard/subjects/${subject.id}`, {
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

  const tkSubjects = [
    'Motorik Kasar',
    'Motorik Halus',
    'Kognitif',
    'Bahasa & Literasi',
    'Seni & Kreativitas',
    'Sosial-Emosional',
    'Agama & Moral',
    'Bermain di Luar',
    'Musik & Gerak',
  ]

  const sdSubjects = [
    'Bahasa Indonesia',
    'Matematika',
    'IPAS',
    'PPKn',
    'Bahasa Inggris',
    'Seni Budaya',
    'PJOK',
    'Muatan Lokal',
  ]

  const defaultSubjects = isTk ? tkSubjects : sdSubjects

  const handleAddDefaults = () => {
    defaultSubjects.forEach((name) => {
      router.post('/dashboard/subjects', {
        name,
        educationLevel,
        gradeLevel: null,
      })
    })
  }

  return (
    <DashboardWrapper title="Mata Pelajaran" breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Mata Pelajaran' }]}>
      <Head title="Mata Pelajaran" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Mata Pelajaran</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Kelola mata pelajaran untuk educationLevel {isTk ? 'TK/PAUD' : 'SD'}
            </p>
          </div>
          <div className="flex gap-2">
            {subjects.length === 0 && (
              <button
                onClick={handleAddDefaults}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Tambah Default
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Tambah Mapel
            </button>
          </div>
        </div>

        {/* Subjects List */}
        {subjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <BookOpen className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada mata pelajaran
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Tambahkan mata pelajaran atau gunakan default {isTk ? 'TK/PAUD' : 'SD'}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={handleAddDefaults}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Tambah Default
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Tambah Manual
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Nama Mata Pelajaran
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Kelas/Kelompok
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject, index) => (
                    <motion.tr
                      key={subject.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                    >
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                        {subject.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {subject.gradeLevel === null
                          ? 'Semua'
                          : isTk
                            ? `Kelompok ${subject.gradeLevel === 0 ? 'A' : 'B'}`
                            : `Kelas ${subject.gradeLevel}`}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(subject)}
                          className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
                            subject.isActive
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                          )}
                        >
                          {subject.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(subject)}
                            className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingSubject(subject)}
                            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Tambah Mata Pelajaran
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Nama Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder={isTk ? 'contoh: Motorik Kasar' : 'contoh: Bahasa Indonesia'}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Kelas/Kelompok (opsional)
                </label>
                <select
                  value={data.gradeLevel ?? ''}
                  onChange={(e) => setData('gradeLevel', e.target.value === '' ? null : Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
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
                onClick={() => { setShowCreateModal(false); reset() }}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleCreate}
                disabled={processing}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Edit Mata Pelajaran
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Nama Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Kelas/Kelompok (opsional)
                </label>
                <select
                  value={data.gradeLevel ?? ''}
                  onChange={(e) => setData('gradeLevel', e.target.value === '' ? null : Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
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
                onClick={() => { setEditingSubject(null); reset() }}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                disabled={processing}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Mata Pelajaran?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Mata pelajaran <strong>{deletingSubject.name}</strong> akan dihapus permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingSubject(null)}
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
