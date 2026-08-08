import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '~/lib/utils'

interface AcademicYear {
  id: number
  name: string
  isActive: boolean
}

interface AdminAcademicYearsIndexProps {
  readonly academicYears: AcademicYear[]
}

export default function AdminAcademicYearsIndex({ academicYears }: AdminAcademicYearsIndexProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deletingYear, setDeletingYear] = useState<AcademicYear | null>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
  })

  const handleCreate = () => {
    post('/admin/academic-years', {
      onSuccess: () => {
        setShowCreateModal(false)
        reset()
      },
    })
  }

  const handleToggleActive = (year: AcademicYear) => {
    router.put(`/admin/academic-years/${year.id}`, { isActive: !year.isActive })
  }

  const handleDelete = () => {
    if (!deletingYear) return
    router.delete(`/admin/academic-years/${deletingYear.id}`, {
      onSuccess: () => setDeletingYear(null),
    })
  }

  return (
    <DashboardWrapper
      title="Tahun Ajaran"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Tahun Ajaran' }]}
    >
      <Head title="Tahun Ajaran" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Tahun Ajaran</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Kelola tahun ajaran untuk seluruh sekolah
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Tambah Tahun Ajaran
          </button>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Tahun Ajaran
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
                {academicYears.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-12 text-center">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Belum ada tahun ajaran
                      </p>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Tambahkan tahun ajaran agar data pembelajaran dapat dikelola.
                      </p>
                    </td>
                  </tr>
                ) : (
                  academicYears.map((year) => (
                    <tr
                      key={year.id}
                      className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                        {year.name}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(year)}
                          className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-medium',
                            year.isActive
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                          )}
                        >
                          {year.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setDeletingYear(year)}
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Tambah Tahun Ajaran
            </h3>
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Nama Tahun Ajaran
              </label>
              <input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                placeholder="contoh: 2026/2027"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
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

      {deletingYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Tahun Ajaran?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Tahun ajaran <strong>{deletingYear.name}</strong> beserta semua kelas dan data di
              dalamnya akan terhapus permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingYear(null)}
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
