import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowLeft, Trash2, UserPlus, Pencil, Upload } from 'lucide-react'

interface Student {
  id: number
  nis: string
  fullName: string
  parentPhone?: string | null
}

interface AcademicYear {
  id: number
  name: string
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

interface ClassShowProps {
  schoolClass: SchoolClass
  educationLevel: string
}

export default function ClassShow({ schoolClass, educationLevel }: Readonly<ClassShowProps>) {
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [importing, setImporting] = useState(false)
  const importInputRef = useRef<HTMLInputElement>(null)

  const isTk = educationLevel === 'tk'
  const groupLetter = (
    schoolClass.groupContext || (schoolClass.gradeLevel === 0 ? 'A' : 'B')
  ).toUpperCase()
  const rombel = schoolClass.rombelNumber ? String(schoolClass.rombelNumber).trim() : '1'
  const rombelCode = isTk ? `${groupLetter}${rombel}` : ''
  const gradeLabel = isTk ? `Kelompok ${rombelCode}` : `Kelas ${schoolClass.gradeLevel}`

  const formatClassDisplayName = (item: SchoolClass) => {
    if (isTk) {
      const gLetter = (item.groupContext || (item.gradeLevel === 0 ? 'A' : 'B')).toUpperCase()
      const rNum = item.rombelNumber ? String(item.rombelNumber).trim() : '1'
      const code = `${gLetter}${rNum}`
      const rawName = item.name ? item.name.trim() : ''
      const isRedundant =
        !rawName ||
        rawName.toUpperCase() === code ||
        rawName.toUpperCase() === `KELOMPOK ${gLetter}` ||
        rawName.toUpperCase() === `KELOMPOK ${code}`

      if (!isRedundant) {
        return `RA / ${code} (${rawName})`
      }
      return `RA / ${code}`
    }
    return `Kelas ${item.name}`
  }

  const displayTitle = formatClassDisplayName(schoolClass)

  const { data, setData, post, processing, errors, reset } = useForm({
    nis: '',
    fullName: '',
    parentPhone: '',
  })

  const editForm = useForm({
    nis: '',
    fullName: '',
    parentPhone: '',
  })

  const handleAddStudent = () => {
    post(`/classes/${schoolClass.id}/students`, {
      onSuccess: () => {
        setShowAddStudent(false)
        reset()
      },
    })
  }

  const handleOpenEdit = (student: Student) => {
    editForm.setData({
      nis: student.nis,
      fullName: student.fullName,
      parentPhone: student.parentPhone || '',
    })
    setEditingStudent(student)
  }

  const handleUpdateStudent = () => {
    if (!editingStudent) return
    editForm.put(`/classes/${schoolClass.id}/students/${editingStudent.id}`, {
      onSuccess: () => setEditingStudent(null),
    })
  }

  const handleDeleteStudent = () => {
    if (!deletingStudent) return
    router.delete(`/classes/${schoolClass.id}/students/${deletingStudent.id}`, {
      onSuccess: () => setDeletingStudent(null),
    })
  }

  const handleImportClick = () => {
    importInputRef.current?.click()
  }

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setImporting(true)
    router.post(`/classes/${schoolClass.id}/students/import`, formData, {
      forceFormData: true,
      onFinish: () => {
        setImporting(false)
        if (importInputRef.current) {
          importInputRef.current.value = ''
        }
      },
    })
  }

  return (
    <DashboardWrapper
      title={displayTitle}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Kelas', href: '/classes' },
        { label: displayTitle },
      ]}
    >
      <Head title={displayTitle} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/classes"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{displayTitle}</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {gradeLabel} • {schoolClass.academicYear.name} • {schoolClass.students.length} siswa
            </p>
          </div>
          <input
            ref={importInputRef}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={handleImportFileChange}
          />
          <button
            onClick={handleImportClick}
            disabled={importing}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Upload className="h-4 w-4" />
            {importing ? 'Mengimpor...' : 'Import Dapodik'}
          </button>
          <button
            onClick={() => setShowAddStudent(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <UserPlus className="h-4 w-4" />
            Tambah Siswa
          </button>
        </div>

        {/* Tabel Siswa */}
        {schoolClass.students.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <UserPlus className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada siswa
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Tambahkan siswa ke kelas ini
            </p>
            <button
              onClick={() => setShowAddStudent(true)}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Tambah Siswa
            </button>
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
                      NIS
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Nama Lengkap
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      No. HP Ortu
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schoolClass.students.map((student, index) => (
                    <tr
                      key={student.id}
                      className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                    >
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {student.nis}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                        {student.fullName}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {student.parentPhone || '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingStudent(student)}
                            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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

      {/* Modal Tambah Siswa */}
      {showAddStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Tambah Siswa
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="nis"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  NIS (Nomor Induk Siswa)
                </label>
                <input
                  id="nis"
                  type="text"
                  value={data.nis}
                  onChange={(e) => setData('nis', e.target.value)}
                  pattern="[0-9]*"
                  title="NIS hanya boleh berisi angka"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: 001234"
                />
                {errors.nis && <p className="mt-1 text-sm text-red-500">{errors.nis}</p>}
              </div>
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Nama Lengkap
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={data.fullName}
                  onChange={(e) => setData('fullName', e.target.value)}
                  pattern="[a-zA-Z\s.'-]+"
                  title="Nama lengkap hanya boleh berisi huruf, spasi, titik, apostrof, dan tanda hubung"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: Ahmad Rizki"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
              </div>
              <div>
                <label
                  htmlFor="parentPhone"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  No. HP Orang Tua/Wali
                </label>
                <input
                  id="parentPhone"
                  type="text"
                  value={data.parentPhone}
                  onChange={(e) => setData('parentPhone', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: 081234567890"
                />
                {errors.parentPhone && (
                  <p className="mt-1 text-sm text-red-500">{errors.parentPhone}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowAddStudent(false)
                  reset()
                }}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleAddStudent}
                disabled={processing}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {processing ? 'Menambahkan...' : 'Tambah'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Edit Siswa */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Edit Siswa
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="editNis"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  NIS (Nomor Induk Siswa)
                </label>
                <input
                  id="editNis"
                  type="text"
                  value={editForm.data.nis}
                  onChange={(e) => editForm.setData('nis', e.target.value)}
                  pattern="[0-9]*"
                  title="NIS hanya boleh berisi angka"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
                {editForm.errors.nis && (
                  <p className="mt-1 text-sm text-red-500">{editForm.errors.nis}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="editFullName"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Nama Lengkap
                </label>
                <input
                  id="editFullName"
                  type="text"
                  value={editForm.data.fullName}
                  onChange={(e) => editForm.setData('fullName', e.target.value)}
                  pattern="[a-zA-Z\s.'-]+"
                  title="Nama lengkap hanya boleh berisi huruf, spasi, titik, apostrof, dan tanda hubung"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
                {editForm.errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{editForm.errors.fullName}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="editParentPhone"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  No. HP Orang Tua/Wali
                </label>
                <input
                  id="editParentPhone"
                  type="text"
                  value={editForm.data.parentPhone}
                  onChange={(e) => editForm.setData('parentPhone', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: 081234567890"
                />
                {editForm.errors.parentPhone && (
                  <p className="mt-1 text-sm text-red-500">{editForm.errors.parentPhone}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditingStudent(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStudent}
                disabled={editForm.processing}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {editForm.processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Siswa */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Siswa?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Siswa <strong>{deletingStudent.fullName}</strong> akan dihapus dari kelas ini.
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingStudent(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteStudent}
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
