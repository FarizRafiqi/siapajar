import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '~/lib/utils'

interface Package {
  id: number
  name: string
  displayName: string
  description: string | null
  priceMonthly: number
  priceYearly: number | null
  isActive: boolean
}

interface AdminPackagesIndexProps {
  readonly packages: Package[]
}

export default function AdminPackagesIndex({ packages }: AdminPackagesIndexProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deletingPackage, setDeletingPackage] = useState<Package | null>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    displayName: '',
    description: '',
    priceMonthly: 0,
    priceYearly: 0,
  })

  const handleCreate = () => {
    post('/admin/packages', {
      onSuccess: () => {
        setShowCreateModal(false)
        reset()
      },
    })
  }

  const handleToggleActive = (pkg: Package) => {
    router.put(`/admin/packages/${pkg.id}`, { isActive: !pkg.isActive })
  }

  const handleDelete = () => {
    if (!deletingPackage) return
    router.delete(`/admin/packages/${deletingPackage.id}`, {
      onSuccess: () => setDeletingPackage(null),
    })
  }

  return (
    <DashboardWrapper title="Manage Packages" breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Manage Packages' }]}>
      <Head title="Manage Packages" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Manage Packages</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Kelola paket langganan</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Tambah Paket
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900 dark:text-white">{pkg.displayName}</h3>
                <button
                  onClick={() => setDeletingPackage(pkg)}
                  className="rounded-lg p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{pkg.description}</p>
              <p className="mt-2 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                Rp{pkg.priceMonthly.toLocaleString('id-ID')}
                <span className="text-sm font-normal text-neutral-500">/bulan</span>
              </p>
              <button
                onClick={() => handleToggleActive(pkg)}
                className={cn(
                  'mt-3 w-full rounded-lg px-3 py-1.5 text-sm font-medium',
                  pkg.isActive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                )}
              >
                {pkg.isActive ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">Tambah Paket</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Kode Paket
                </label>
                <input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: premium"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Nama Tampilan
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={data.displayName}
                  onChange={(e) => setData('displayName', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
                {errors.displayName && <p className="mt-1 text-sm text-red-500">{errors.displayName}</p>}
              </div>
              <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Deskripsi
                </label>
                <input
                  id="description"
                  type="text"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priceMonthly" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Harga Bulanan
                  </label>
                  <input
                    id="priceMonthly"
                    type="number"
                    value={data.priceMonthly}
                    onChange={(e) => setData('priceMonthly', Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  />
                  {errors.priceMonthly && <p className="mt-1 text-sm text-red-500">{errors.priceMonthly}</p>}
                </div>
                <div>
                  <label htmlFor="priceYearly" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Harga Tahunan
                  </label>
                  <input
                    id="priceYearly"
                    type="number"
                    value={data.priceYearly}
                    onChange={(e) => setData('priceYearly', Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  />
                </div>
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

      {deletingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">Hapus Paket?</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Paket <strong>{deletingPackage.displayName}</strong> akan dihapus. User yang memakai paket ini akan kehilangan paketnya.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingPackage(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button onClick={handleDelete} className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  )
}
