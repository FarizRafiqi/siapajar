import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface School {
  id: number
  name: string
  npsn: string | null
}

interface AdminSchoolsIndexProps {
  readonly schools: School[]
}

export default function AdminSchoolsIndex({ schools }: AdminSchoolsIndexProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    npsn: '',
  })

  const handleCreate = () => {
    post('/admin/schools', {
      onSuccess: () => {
        setShowCreateModal(false)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingSchool) return
    router.delete(`/admin/schools/${deletingSchool.id}`, {
      onSuccess: () => setDeletingSchool(null),
    })
  }

  return (
    <DashboardWrapper
      title="Sekolah"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Sekolah' }]}
    >
      <Head title="Sekolah" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Sekolah</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Kelola daftar sekolah untuk menautkan guru dan kepala sekolah
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Tambah Sekolah
          </button>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Nama Sekolah
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    NPSN
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school) => (
                  <tr
                    key={school.id}
                    className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                      {school.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {school.npsn || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeletingSchool(school)}
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
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Tambah Sekolah
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Nama Sekolah
                </label>
                <input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: SD Negeri 1 Jakarta"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label
                  htmlFor="npsn"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  NPSN (opsional)
                </label>
                <input
                  id="npsn"
                  type="text"
                  value={data.npsn}
                  onChange={(e) => setData('npsn', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
                {errors.npsn && <p className="mt-1 text-sm text-red-500">{errors.npsn}</p>}
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
          </div>
        </div>
      )}

      {deletingSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Sekolah?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Sekolah <strong>{deletingSchool.name}</strong> akan dihapus. Guru/kepala sekolah yang
              tertaut akan kehilangan tautan sekolahnya.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingSchool(null)}
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
          </div>
        </div>
      )}
    </DashboardWrapper>
  )
}
