import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus, Users, Pencil, Trash2, Eye } from 'lucide-react'

interface AcademicYear {
  id: number
  name: string
}

interface Student {
  id: number
  nis: string
  fullName: string
}

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
  createdAt: string
  academicYear: AcademicYear
  students: Student[]
}

interface ClassesIndexProps {
  readonly classes: SchoolClass[]
  readonly academicYears: AcademicYear[]
  readonly educationLevel: string
}

export default function ClassesIndex({
  classes,
  academicYears,
  educationLevel,
}: ClassesIndexProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null)
  const [deletingClass, setDeletingClass] = useState<SchoolClass | null>(null)

  const isTk = educationLevel === 'tk'
  const gradeOptions = isTk
    ? [
        { value: 0, label: 'Kelompok A (4-5 tahun)' },
        { value: 1, label: 'Kelompok B (5-6 tahun)' },
      ]
    : [
        { value: 1, label: 'Kelas 1' },
        { value: 2, label: 'Kelas 2' },
        { value: 3, label: 'Kelas 3' },
        { value: 4, label: 'Kelas 4' },
        { value: 5, label: 'Kelas 5' },
        { value: 6, label: 'Kelas 6' },
      ]

  const gradeLabel = (level: number) =>
    isTk ? `Kelompok ${level === 0 ? 'A' : 'B'}` : `Kelas ${level}`

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    academicYearId: academicYears[0]?.id || 0,
    gradeLevel: isTk ? 0 : 1,
  })

  const handleCreate = () => {
    post('/classes', {
      onSuccess: () => {
        setShowCreateModal(false)
        reset()
      },
    })
  }

  const handleUpdate = () => {
    if (!editingClass) return
    put(`/classes/${editingClass.id}`, {
      onSuccess: () => {
        setEditingClass(null)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingClass) return
    router.delete(`/classes/${deletingClass.id}`, {
      onSuccess: () => setDeletingClass(null),
    })
  }

  const openEditModal = (schoolClass: SchoolClass) => {
    setEditingClass(schoolClass)
    setData({
      name: schoolClass.name,
      academicYearId: schoolClass.academicYear.id,
      gradeLevel: schoolClass.gradeLevel,
    })
  }

  const hasAcademicYear = academicYears.length > 0

  return (
    <DashboardWrapper
      title="Manajemen Kelas"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Kelas' }]}
    >
      <Head title="Manajemen Kelas" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Manajemen Kelas</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Kelola kelas dan siswa Anda</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!hasAcademicYear}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Tambah Kelas
          </button>
        </div>

        {!hasAcademicYear && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            Belum ada tahun ajaran. Hubungi administrator untuk menambahkan tahun ajaran sebelum
            membuat kelas.
          </div>
        )}

        {/* Daftar Kelas */}
        {classes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <Users className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada kelas
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Mulai dengan membuat kelas baru
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={!hasAcademicYear}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Tambah Kelas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      Kelas {item.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {gradeLabel(item.gradeLevel)} • {item.academicYear.name}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {item.students.length} siswa
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/classes/${item.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-200 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <Eye className="h-4 w-4" />
                    Lihat
                  </Link>
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex items-center justify-center rounded-lg border border-neutral-200 px-3 py-2 text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingClass(item)}
                    className="flex items-center justify-center rounded-lg border border-neutral-200 px-3 py-2 text-red-600 transition-colors hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Tambah Kelas Baru
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="create_name"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Nama Kelas
                </label>
                <input
                  id="create_name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder={isTk ? 'contoh: Mawar' : 'contoh: 1A'}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label
                  htmlFor="create_academicYearId"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Tahun Ajaran
                </label>
                <select
                  id="create_academicYearId"
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
                  htmlFor="create_gradeLevel"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {isTk ? 'Kelompok' : 'Tingkat Kelas'}
                </label>
                <select
                  id="create_gradeLevel"
                  value={data.gradeLevel}
                  onChange={(e) => setData('gradeLevel', Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {gradeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.gradeLevel && (
                  <p className="mt-1 text-sm text-red-500">{errors.gradeLevel}</p>
                )}
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
                {processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Edit */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Edit Kelas
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="edit_name"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Nama Kelas
                </label>
                <input
                  id="edit_name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label
                  htmlFor="edit_academicYearId"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Tahun Ajaran
                </label>
                <select
                  id="edit_academicYearId"
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
                  htmlFor="edit_gradeLevel"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {isTk ? 'Kelompok' : 'Tingkat Kelas'}
                </label>
                <select
                  id="edit_gradeLevel"
                  value={data.gradeLevel}
                  onChange={(e) => setData('gradeLevel', Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {gradeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.gradeLevel && (
                  <p className="mt-1 text-sm text-red-500">{errors.gradeLevel}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setEditingClass(null)
                  reset()
                }}
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

      {/* Modal Konfirmasi Hapus */}
      {deletingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Kelas {deletingClass.name}?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Menghapus kelas ini juga akan menghapus:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>• {deletingClass.students.length} data siswa</li>
              <li>• Semua modul ajar / RPPM / RPPH kelas ini</li>
              <li>• Semua soal kelas ini</li>
              <li>• Semua program semester kelas ini</li>
              <li>• Semua penilaian, nilai, dan asesmen PAUD kelas ini</li>
            </ul>
            <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingClass(null)}
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
