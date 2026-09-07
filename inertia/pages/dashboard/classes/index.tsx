import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus, Users, Pencil, Trash2 } from 'lucide-react'

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
  groupContext?: 'a' | 'b' | null
  rombelNumber?: string | null
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
    rombelNumber: '',
  })

  const formatClassDisplayName = (item: SchoolClass) => {
    if (isTk) {
      const groupLetter = (item.groupContext || (item.gradeLevel === 0 ? 'A' : 'B')).toUpperCase()
      const rombel = item.rombelNumber ? String(item.rombelNumber).trim() : '1'
      const code = `${groupLetter}${rombel}`
      const rawName = item.name ? item.name.trim() : ''
      const isRedundant =
        !rawName ||
        rawName.toUpperCase() === code ||
        rawName.toUpperCase() === `KELOMPOK ${groupLetter}` ||
        rawName.toUpperCase() === `KELOMPOK ${code}`

      if (!isRedundant) {
        return `RA / ${code} (${rawName})`
      }
      return `RA / ${code}`
    }
    return `Kelas ${item.name}`
  }

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
      rombelNumber: schoolClass.rombelNumber || '',
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-neutral-200 pb-4 dark:border-neutral-800">
          <div>
            <h2 className="text-2xl font-black text-neutral-950 dark:text-white">
              Manajemen Kelas
            </h2>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
              Kelola kelompok belajar, kelas, dan data peserta didik Anda
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!hasAcademicYear}
            className="btn-kawaii-primary"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Kelas</span>
          </button>
        </div>

        {!hasAcademicYear && (
          <div className="rounded-2xl border-2 border-black dark:border-white bg-amber-100 p-4 text-sm font-bold text-amber-950 dark:bg-amber-950/40 dark:text-amber-200 shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#ffffff]">
            Belum ada tahun ajaran. Hubungi administrator untuk menambahkan tahun ajaran sebelum
            membuat kelas.
          </div>
        )}

        {/* Daftar Kelas */}
        {classes.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-neutral-400 py-12 text-center bg-white/60 dark:bg-neutral-900/40 p-6">
            <Users className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-black text-neutral-950 dark:text-white">
              Belum ada kelas
            </h3>
            <p className="mt-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              Mulai dengan membuat kelompok belajar atau kelas baru
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={!hasAcademicYear}
              className="mt-4 btn-kawaii-primary"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Kelas</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((item) => (
              <div
                key={item.id}
                role="link"
                tabIndex={0}
                onClick={() => router.visit(`/classes/${item.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ')
                    router.visit(`/classes/${item.id}`)
                }}
                className="cursor-pointer rounded-3xl border-2 border-black dark:border-white bg-white p-5 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000000] dark:hover:shadow-[6px_6px_0px_#ffffff] dark:bg-neutral-900 transition-all"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black text-neutral-950 dark:text-white">
                      {formatClassDisplayName(item)}
                    </h3>
                    <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mt-1">
                      {gradeLabel(item.gradeLevel)} • {item.academicYear.name}
                    </p>
                  </div>
                  <span className="badge-kawaii-emerald">{item.students.length} siswa</span>
                </div>

                <div
                  className="flex justify-end gap-2 pt-2 border-t-2 border-neutral-100 dark:border-neutral-800"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    onClick={() => openEditModal(item)}
                    className="btn-kawaii-secondary !p-2 !rounded-xl"
                    title="Edit Kelas"
                    aria-label="Edit Kelas"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingClass(item)}
                    className="btn-kawaii-secondary !p-2 !rounded-xl !text-red-600 hover:!bg-red-50 dark:hover:!bg-red-950/30"
                    title="Hapus Kelas"
                    aria-label="Hapus Kelas"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] border-2 border-black dark:border-white dark:bg-neutral-900"
          >
            <h3 className="mb-4 text-lg font-black text-neutral-950 dark:text-white border-b-2 border-neutral-100 pb-3 dark:border-neutral-800">
              Tambah Kelas Baru
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="create_academicYearId"
                  className="mb-1 block text-sm font-black text-neutral-950 dark:text-neutral-200"
                >
                  Tahun Ajaran
                </label>
                <select
                  id="create_academicYearId"
                  value={data.academicYearId}
                  onChange={(e) => setData('academicYearId', Number(e.target.value))}
                  className="w-full rounded-2xl border-2 border-black dark:border-white px-3.5 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-white focus:shadow-[3px_3px_0px_#000000]"
                >
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
                </select>
                {errors.academicYearId && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.academicYearId}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="create_gradeLevel"
                  className="mb-1 block text-sm font-black text-neutral-950 dark:text-neutral-200"
                >
                  {isTk ? 'Kelompok Usia' : 'Tingkat Kelas'}
                </label>
                <select
                  id="create_gradeLevel"
                  value={data.gradeLevel}
                  onChange={(e) => setData('gradeLevel', Number(e.target.value))}
                  className="w-full rounded-2xl border-2 border-black dark:border-white px-3.5 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-white focus:shadow-[3px_3px_0px_#000000]"
                >
                  {gradeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.gradeLevel && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.gradeLevel}</p>
                )}
              </div>

              {isTk && (
                <div>
                  <label
                    htmlFor="create_rombelNumber"
                    className="mb-1 block text-sm font-black text-neutral-950 dark:text-neutral-200"
                  >
                    Nomor Rombel (Paralel)
                  </label>
                  <input
                    id="create_rombelNumber"
                    type="text"
                    value={data.rombelNumber}
                    onChange={(e) => setData('rombelNumber', e.target.value)}
                    className="w-full rounded-2xl border-2 border-black dark:border-white px-3.5 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-white focus:shadow-[3px_3px_0px_#000000]"
                    placeholder="contoh: 1 (untuk A1 / B1) atau 2 (untuk A2 / B2)"
                  />
                  <p className="mt-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Kode otomatis:{' '}
                    <span className="badge-kawaii-emerald !py-0.2 !px-2 !text-[10px] ml-1">
                      {data.gradeLevel === 0 ? 'A' : 'B'}
                      {data.rombelNumber ? data.rombelNumber.trim() : '1'}
                    </span>
                  </p>
                  {errors.rombelNumber && (
                    <p className="mt-1 text-xs font-bold text-red-500">{errors.rombelNumber}</p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="create_name"
                  className="mb-1 block text-sm font-black text-neutral-950 dark:text-neutral-200"
                >
                  {isTk ? 'Nama / Julukan Rombel' : 'Nama Kelas'}
                </label>
                <input
                  id="create_name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-2xl border-2 border-black dark:border-white px-3.5 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-white focus:shadow-[3px_3px_0px_#000000]"
                  placeholder={isTk ? 'contoh: Ibrahim / Mawar' : 'contoh: 1A'}
                />
                {isTk && (
                  <p className="mt-2 rounded-2xl border-2 border-black dark:border-white bg-[#f8be9e]/20 p-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-[2px_2px_0px_#000000]">
                    Preview di Cover RPM:{' '}
                    <strong className="text-emerald-700 dark:text-emerald-400 font-black">
                      RA / {data.gradeLevel === 0 ? 'A' : 'B'}
                      {data.rombelNumber ? data.rombelNumber.trim() : '1'}
                      {data.name.trim() ? ` (${data.name.trim().toUpperCase()})` : ''}
                    </strong>
                  </p>
                )}
                {errors.name && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  reset()
                }}
                className="flex-1 btn-kawaii-secondary"
              >
                Batal
              </button>
              <button
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

      {/* Modal Edit */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] border-2 border-black dark:border-white dark:bg-neutral-900"
          >
            <h3 className="mb-4 text-lg font-black text-neutral-950 dark:text-white border-b-2 border-neutral-100 pb-3 dark:border-neutral-800">
              Edit Kelas
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="edit_academicYearId"
                  className="mb-1 block text-sm font-black text-neutral-950 dark:text-neutral-200"
                >
                  Tahun Ajaran
                </label>
                <select
                  id="edit_academicYearId"
                  value={data.academicYearId}
                  onChange={(e) => setData('academicYearId', Number(e.target.value))}
                  className="w-full rounded-2xl border-2 border-black dark:border-white px-3.5 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-white focus:shadow-[3px_3px_0px_#000000]"
                >
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
                </select>
                {errors.academicYearId && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.academicYearId}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="edit_gradeLevel"
                  className="mb-1 block text-sm font-black text-neutral-950 dark:text-neutral-200"
                >
                  {isTk ? 'Kelompok Usia' : 'Tingkat Kelas'}
                </label>
                <select
                  id="edit_gradeLevel"
                  value={data.gradeLevel}
                  onChange={(e) => setData('gradeLevel', Number(e.target.value))}
                  className="w-full rounded-2xl border-2 border-black dark:border-white px-3.5 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-white focus:shadow-[3px_3px_0px_#000000]"
                >
                  {gradeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.gradeLevel && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.gradeLevel}</p>
                )}
              </div>

              {isTk && (
                <div>
                  <label
                    htmlFor="edit_rombelNumber"
                    className="mb-1 block text-sm font-black text-neutral-950 dark:text-neutral-200"
                  >
                    Nomor Rombel (Paralel)
                  </label>
                  <input
                    id="edit_rombelNumber"
                    type="text"
                    value={data.rombelNumber}
                    onChange={(e) => setData('rombelNumber', e.target.value)}
                    className="w-full rounded-2xl border-2 border-black dark:border-white px-3.5 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-white focus:shadow-[3px_3px_0px_#000000]"
                    placeholder="contoh: 1 (untuk A1 / B1) atau 2 (untuk A2 / B2)"
                  />
                  <p className="mt-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Kode otomatis:{' '}
                    <span className="badge-kawaii-emerald !py-0.2 !px-2 !text-[10px] ml-1">
                      {data.gradeLevel === 0 ? 'A' : 'B'}
                      {data.rombelNumber ? data.rombelNumber.trim() : '1'}
                    </span>
                  </p>
                  {errors.rombelNumber && (
                    <p className="mt-1 text-xs font-bold text-red-500">{errors.rombelNumber}</p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="edit_name"
                  className="mb-1 block text-sm font-black text-neutral-950 dark:text-neutral-200"
                >
                  {isTk ? 'Nama / Julukan Rombel' : 'Nama Kelas'}
                </label>
                <input
                  id="edit_name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-2xl border-2 border-black dark:border-white px-3.5 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-white focus:shadow-[3px_3px_0px_#000000]"
                  placeholder={isTk ? 'contoh: Ibrahim / Mawar' : 'contoh: 1A'}
                />
                {isTk && (
                  <p className="mt-2 rounded-2xl border-2 border-black dark:border-white bg-[#f8be9e]/20 p-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-[2px_2px_0px_#000000]">
                    Preview di Cover RPM:{' '}
                    <strong className="text-emerald-700 dark:text-emerald-400 font-black">
                      RA / {data.gradeLevel === 0 ? 'A' : 'B'}
                      {data.rombelNumber ? data.rombelNumber.trim() : '1'}
                      {data.name.trim() ? ` (${data.name.trim().toUpperCase()})` : ''}
                    </strong>
                  </p>
                )}
                {errors.name && (
                  <p className="mt-1 text-xs font-bold text-red-500">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setEditingClass(null)
                  reset()
                }}
                className="flex-1 btn-kawaii-secondary"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                disabled={processing}
                className="flex-1 btn-kawaii-primary"
              >
                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deletingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] border-2 border-black dark:border-white dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-black text-neutral-950 dark:text-white border-b-2 border-neutral-100 pb-3 dark:border-neutral-800">
              Hapus Kelas {deletingClass.name}?
            </h3>
            <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Menghapus kelas ini juga akan menghapus:
            </p>
            <ul className="mt-2 space-y-1 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              <li>• {deletingClass.students.length} data siswa</li>
              <li>• Semua modul ajar / RPPM / RPPH kelas ini</li>
              <li>• Semua soal kelas ini</li>
              <li>• Semua program semester kelas ini</li>
              <li>• Semua penilaian, nilai, dan asesmen PAUD kelas ini</li>
            </ul>
            <p className="mt-3 text-xs font-black text-red-600 dark:text-red-400">
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingClass(null)}
                className="flex-1 btn-kawaii-secondary"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 btn-kawaii-primary !bg-red-500 hover:!bg-red-400 !text-white"
              >
                Ya, Hapus
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardWrapper>
  )
}
