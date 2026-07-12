import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, Trash2, UserPlus } from 'lucide-react'

interface Siswa {
  id: number
  nis: string
  fullName: string
}

interface TahunAjaran {
  id: number
  name: string
}

interface Kelas {
  id: number
  name: string
  gradeLevel: number
  created_at: string
  tahunAjaran: TahunAjaran
  siswa: Siswa[]
}

interface KelasShowProps {
  kelas: Kelas
}

export default function KelasShow({ kelas }: Readonly<KelasShowProps>) {
  const [showAddSiswa, setShowAddSiswa] = useState(false)
  const [deletingSiswa, setDeletingSiswa] = useState<Siswa | null>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    nis: '',
    fullName: '',
  })

  const handleAddSiswa = () => {
    post(`/classes/${kelas.id}/students`, {
      onSuccess: () => {
        setShowAddSiswa(false)
        reset()
      },
    })
  }

  const handleDeleteSiswa = () => {
    if (!deletingSiswa) return
    router.delete(`/classes/${kelas.id}/students/${deletingSiswa.id}`, {
      onSuccess: () => setDeletingSiswa(null),
    })
  }

  return (
    <DashboardWrapper title="Dashboard">
      <Head title={`Kelas ${kelas.name}`} />

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
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Kelas {kelas.name}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Kelas {kelas.gradeLevel} • {kelas.tahunAjaran.name} • {kelas.siswa.length} siswa
            </p>
          </div>
          <button
            onClick={() => setShowAddSiswa(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <UserPlus className="h-4 w-4" />
            Tambah Siswa
          </button>
        </div>

        {/* Siswa Table */}
        {kelas.siswa.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <UserPlus className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada siswa
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Tambahkan siswa ke kelas ini
            </p>
            <button
              onClick={() => setShowAddSiswa(true)}
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
                    <th className="px-4 py-3 text-right text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {kelas.siswa.map((siswa, index) => (
                    <tr
                      key={siswa.id}
                      className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                    >
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {siswa.nis}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                        {siswa.fullName}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setDeletingSiswa(siswa)}
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Siswa Modal */}
      {showAddSiswa && (
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
                <label htmlFor="nis" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  NIS (Nomor Induk Siswa)
                </label>
                <input
                  id="nis"
                  type="text"
                  value={data.nis}
                  onChange={(e) => setData('nis', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: 001234"
                />
                {errors.nis && (
                  <p className="mt-1 text-sm text-red-500">{errors.nis}</p>
                )}
              </div>
              <div>
                <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Nama Lengkap
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={data.fullName}
                  onChange={(e) => setData('fullName', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: Ahmad Rizki"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowAddSiswa(false)
                  reset()
                }}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleAddSiswa}
                disabled={processing}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {processing ? 'Menambahkan...' : 'Tambah'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Siswa Confirmation Modal */}
      {deletingSiswa && (
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
              Siswa <strong>{deletingSiswa.fullName}</strong> akan dihapus dari kelas ini.
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingSiswa(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteSiswa}
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
