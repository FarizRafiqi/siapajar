import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, Link, router, useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus, Users, Pencil, Trash2, Eye } from 'lucide-react'

interface TahunAjaran {
  id: number
  name: string
}

interface Siswa {
  id: number
  nis: string
  fullName: string
}

interface Kelas {
  id: number
  name: string
  gradeLevel: number
  created_at: string
  tahunAjaran: TahunAjaran
  siswa: Siswa[]
}

interface KelasIndexProps {
  readonly kelas: Kelas[]
  readonly tahunAjaran: TahunAjaran[]
  readonly educationLevel: string
}

export default function KelasIndex({ kelas, tahunAjaran, educationLevel }: KelasIndexProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null)
  const [deletingKelas, setDeletingKelas] = useState<Kelas | null>(null)

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

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    tahunAjaranId: tahunAjaran[0]?.id || 0,
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
    if (!editingKelas) return
    put(`/classes/${editingKelas.id}`, {
      onSuccess: () => {
        setEditingKelas(null)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingKelas) return
    router.delete(`/classes/${deletingKelas.id}`, {
      onSuccess: () => setDeletingKelas(null),
    })
  }

  const openEditModal = (kelas: Kelas) => {
    setEditingKelas(kelas)
    setData({
      name: kelas.name,
      tahunAjaranId: kelas.tahunAjaran.id,
      gradeLevel: kelas.gradeLevel,
    })
  }

  return (
    <DashboardWrapper title="Dashboard">
      <Head title="Manajemen Kelas" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Manajemen Kelas</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Kelola kelas dan siswa Anda
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Tambah Kelas
          </button>
        </div>

        {/* Kelas Grid */}
        {kelas.length === 0 ? (
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
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Tambah Kelas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kelas.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      Kelas {item.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {isTk
                        ? `Kelompok ${item.gradeLevel === 0 ? 'A' : 'B'}`
                        : `Kelas ${item.gradeLevel}`} • {item.tahunAjaran.name}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {item.siswa.length} siswa
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
                    onClick={() => setDeletingKelas(item)}
                    className="flex items-center justify-center rounded-lg border border-neutral-200 px-3 py-2 text-red-600 transition-colors hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
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
              Tambah Kelas Baru
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="create_name" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Nama Kelas
                </label>
                <input
                  id="create_name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: 1A"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="create_tahunAjaranId" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Tahun Ajaran
                </label>
                <select
                  id="create_tahunAjaranId"
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
                <label htmlFor="create_gradeLevel" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
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

      {/* Edit Modal */}
      {editingKelas && (
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
                <label htmlFor="edit_name" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Nama Kelas
                </label>
                <input
                  id="edit_name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="edit_tahunAjaranId" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Tahun Ajaran
                </label>
                <select
                  id="edit_tahunAjaranId"
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
                <label htmlFor="edit_gradeLevel" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setEditingKelas(null)
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

      {/* Delete Confirmation Modal */}
      {deletingKelas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Kelas?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Semua siswa di kelas <strong>{deletingKelas.name}</strong> juga akan dihapus.
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingKelas(null)}
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
