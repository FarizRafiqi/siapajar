import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import {
  AdminSortButton,
  AdminTablePagination,
  AdminTableToolbar,
  type AdminSortDirection,
} from '~/components/dashboard/admin-table'
import { Head, router, useForm } from '@inertiajs/react'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { PackageOpen, Plus, Trash2, Pencil, Star, Users } from 'lucide-react'
import { cn } from '~/lib/utils'
import { packageFeaturesToHtml } from '~/lib/rich-text'

const RichTextEditor = lazy(() => import('~/components/ui/rich-text-editor'))

interface Package {
  id: number
  name: string
  displayName: string
  description: string | null
  priceMonthly: number
  priceYearly: number | null
  features: string[]
  isActive: boolean
  isHighlighted: boolean
  ctaLabel: string | null
  userCount: number
}

interface AdminPackagesIndexProps {
  readonly packages: Package[]
}

interface PackageFormData {
  name: string
  displayName: string
  description: string
  priceMonthly: number
  priceYearly: number
  features: string
  isHighlighted: boolean
  ctaLabel: string
}

const emptyForm: PackageFormData = {
  name: '',
  displayName: '',
  description: '',
  priceMonthly: 0,
  priceYearly: 0,
  features: '',
  isHighlighted: false,
  ctaLabel: '',
}

export default function AdminPackagesIndex({ packages }: AdminPackagesIndexProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [deletingPackage, setDeletingPackage] = useState<Package | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'users' | 'status'>('name')
  const [sortDirection, setSortDirection] = useState<AdminSortDirection>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const createForm = useForm<PackageFormData>(emptyForm)
  const editForm = useForm<PackageFormData>(emptyForm)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus, sortBy, sortDirection, pageSize])

  const filteredAndSortedPackages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return [...packages]
      .filter((pkg) => {
        const matchesSearch =
          !query ||
          `${pkg.displayName} ${pkg.name} ${pkg.description ?? ''}`.toLowerCase().includes(query)
        const matchesStatus =
          filterStatus === 'all' || (filterStatus === 'active' ? pkg.isActive : !pkg.isActive)
        return matchesSearch && matchesStatus
      })
      .sort((left, right) => {
        const leftValue =
          sortBy === 'price'
            ? left.priceMonthly
            : sortBy === 'users'
              ? left.userCount
              : sortBy === 'status'
                ? String(left.isActive)
                : left.displayName
        const rightValue =
          sortBy === 'price'
            ? right.priceMonthly
            : sortBy === 'users'
              ? right.userCount
              : sortBy === 'status'
                ? String(right.isActive)
                : right.displayName
        const comparison =
          typeof leftValue === 'number' && typeof rightValue === 'number'
            ? leftValue - rightValue
            : String(leftValue).localeCompare(String(rightValue), 'id', {
                numeric: true,
                sensitivity: 'base',
              })
        return sortDirection === 'asc' ? comparison : -comparison
      })
  }, [packages, searchQuery, filterStatus, sortBy, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPackages.length / pageSize))
  const paginatedPackages = filteredAndSortedPackages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleSort = (field: 'name' | 'price' | 'users' | 'status') => {
    if (sortBy === field) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDirection('asc')
    }
  }

  const resetFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
    setSortBy('name')
    setSortDirection('asc')
  }

  const handleCreate = () => {
    createForm.transform((data) => ({
      ...data,
      features: data.features.trim() ? [data.features] : [],
    }))
    createForm.post('/admin/packages', {
      onSuccess: () => {
        setShowCreateModal(false)
        createForm.reset()
      },
    })
  }

  const handleOpenEdit = (pkg: Package) => {
    editForm.setData({
      name: pkg.name,
      displayName: pkg.displayName,
      description: pkg.description ?? '',
      priceMonthly: pkg.priceMonthly,
      priceYearly: pkg.priceYearly ?? 0,
      features: packageFeaturesToHtml(pkg.features),
      isHighlighted: pkg.isHighlighted,
      ctaLabel: pkg.ctaLabel ?? '',
    })
    setEditingPackage(pkg)
  }

  const handleUpdate = () => {
    if (!editingPackage) return
    editForm.transform((data) => ({
      ...data,
      features: data.features.trim() ? [data.features] : [],
    }))
    editForm.put(`/admin/packages/${editingPackage.id}`, {
      onSuccess: () => setEditingPackage(null),
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
    <DashboardWrapper
      title="Kelola Paket"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Kelola Paket' }]}
    >
      <Head title="Kelola Paket" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Kelola Paket</h2>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Kelola paket langganan beserta daftar benefit yang tampil di landing page
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Tambah Paket
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <AdminTableToolbar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Cari nama, kode, atau deskripsi paket..."
            onReset={resetFilters}
            hasActiveFilters={Boolean(searchQuery) || filterStatus !== 'all'}
          >
            <select
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(event.target.value as 'all' | 'active' | 'inactive')
              }
              aria-label="Filter status paket"
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <option value="all">Semua status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif / arsip</option>
            </select>
          </AdminTableToolbar>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                <tr>
                  <th className="w-14 px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    No
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    <AdminSortButton
                      label="Paket"
                      active={sortBy === 'name'}
                      direction={sortDirection}
                      onClick={() => handleSort('name')}
                    />
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    <AdminSortButton
                      label="Harga bulanan"
                      active={sortBy === 'price'}
                      direction={sortDirection}
                      onClick={() => handleSort('price')}
                    />
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    <AdminSortButton
                      label="Pengguna"
                      active={sortBy === 'users'}
                      direction={sortDirection}
                      onClick={() => handleSort('users')}
                    />
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    <AdminSortButton
                      label="Status"
                      active={sortBy === 'status'}
                      direction={sortDirection}
                      onClick={() => handleSort('status')}
                    />
                  </th>
                  <th className="w-28 px-4 py-3.5 text-right font-semibold text-neutral-800 dark:text-neutral-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {filteredAndSortedPackages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <PackageOpen className="mx-auto h-10 w-10 text-neutral-400" />
                      <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">
                        {packages.length === 0 ? 'Belum ada paket' : 'Tidak ada paket yang cocok'}
                      </p>
                      <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                        {packages.length === 0
                          ? 'Buat paket pertama untuk ditampilkan di landing page.'
                          : 'Coba ubah kata kunci atau filter.'}
                      </p>
                      {packages.length > 0 && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-3 rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200"
                        >
                          Reset Filter
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  paginatedPackages.map((pkg, index) => {
                    const features = Array.isArray(pkg.features) ? pkg.features : []
                    const isInternal = pkg.name === 'internal_testing_unlimited'
                    return (
                      <tr
                        key={pkg.id}
                        className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                      >
                        <td className="px-4 py-4 font-semibold text-neutral-700 dark:text-neutral-300">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                            {pkg.displayName}
                            {pkg.isHighlighted && (
                              <Star
                                aria-label="Paket unggulan"
                                className="h-4 w-4 fill-amber-400 text-amber-500"
                              />
                            )}
                          </div>
                          <p className="mt-1 max-w-md text-sm text-neutral-700 dark:text-neutral-300">
                            {pkg.description || 'Tidak ada deskripsi'}
                          </p>
                          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                            Kode: <span className="font-mono">{pkg.name}</span> · {features.length}{' '}
                            benefit{isInternal ? ' · internal' : ''}
                          </p>
                        </td>
                        <td className="px-4 py-4 font-semibold text-emerald-700 dark:text-emerald-300">
                          {pkg.priceMonthly === 0
                            ? 'Gratis'
                            : `Rp${pkg.priceMonthly.toLocaleString('id-ID')}`}
                          <span className="font-normal text-neutral-600 dark:text-neutral-400">
                            {pkg.priceMonthly > 0 ? '/bulan' : ''}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            <Users className="h-4 w-4 text-sky-600" />
                            {pkg.userCount} pengguna
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(pkg)}
                            className={cn(
                              'inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold',
                              pkg.isActive
                                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                                : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                            )}
                          >
                            {pkg.isActive
                              ? 'Aktif'
                              : isInternal
                                ? 'Internal / nonaktif'
                                : 'Nonaktif / arsip'}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(pkg)}
                              aria-label={`Edit ${pkg.displayName}`}
                              title="Edit paket"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingPackage(pkg)}
                              disabled={pkg.userCount > 0}
                              aria-label={`Hapus ${pkg.displayName}`}
                              title={
                                pkg.userCount > 0
                                  ? 'Nonaktifkan paket karena masih dipakai pengguna'
                                  : 'Hapus paket'
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-rose-950/30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          <AdminTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedPackages.length}
            pageSize={pageSize}
            itemLabel="paket"
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-neutral-900">
            <h3 className="shrink-0 border-b border-neutral-200 px-6 py-4 text-lg font-semibold text-neutral-900 dark:border-neutral-800 dark:text-white">
              Tambah Paket
            </h3>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <PackageForm form={createForm} idPrefix="create" />
            </div>
            <div className="flex shrink-0 gap-3 border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false)
                  createForm.reset()
                }}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={createForm.processing}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {createForm.processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-neutral-900">
            <h3 className="shrink-0 border-b border-neutral-200 px-6 py-4 text-lg font-semibold text-neutral-900 dark:border-neutral-800 dark:text-white">
              Edit Paket — {editingPackage.displayName}
            </h3>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <PackageForm form={editForm} idPrefix="edit" hideName />
            </div>
            <div className="flex shrink-0 gap-3 border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingPackage(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={editForm.processing}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {editForm.processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Paket?
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Paket <strong>{deletingPackage.displayName}</strong> akan dihapus permanen. Paket yang
              masih dipakai pengguna tidak dapat dihapus dan sebaiknya dinonaktifkan sebagai arsip.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingPackage(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                type="button"
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

interface PackageFormProps {
  readonly form: ReturnType<typeof useForm<PackageFormData>>
  readonly idPrefix: string
  readonly hideName?: boolean
}

function PackageForm({ form, idPrefix, hideName }: PackageFormProps) {
  const { data, setData, errors } = form

  return (
    <div className="space-y-4">
      {!hideName && (
        <div>
          <label
            htmlFor={`${idPrefix}-name`}
            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Kode Paket
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
            placeholder="contoh: premium"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
      )}
      <div>
        <label
          htmlFor={`${idPrefix}-displayName`}
          className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Nama Tampilan
        </label>
        <input
          id={`${idPrefix}-displayName`}
          type="text"
          value={data.displayName}
          onChange={(e) => setData('displayName', e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
        />
        {errors.displayName && <p className="mt-1 text-sm text-red-500">{errors.displayName}</p>}
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-description`}
          className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Deskripsi
        </label>
        <input
          id={`${idPrefix}-description`}
          type="text"
          value={data.description}
          onChange={(e) => setData('description', e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`${idPrefix}-priceMonthly`}
            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Harga Bulanan
          </label>
          <div className="mt-1 flex">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-neutral-300 bg-neutral-100 px-3 text-sm font-medium text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              Rp
            </span>
            <input
              className="min-w-0 flex-1 rounded-r-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              id={`${idPrefix}-priceMonthly`}
              type="number"
              value={String(data.priceMonthly)}
              onChange={(e) => setData('priceMonthly', Number(e.target.value))}
              aria-label="Harga bulanan"
            />
          </div>
          {errors.priceMonthly && (
            <p className="mt-1 text-sm text-red-500">{errors.priceMonthly}</p>
          )}
        </div>
        <div>
          <label
            htmlFor={`${idPrefix}-priceYearly`}
            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Harga Tahunan
          </label>
          <div className="mt-1 flex">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-neutral-300 bg-neutral-100 px-3 text-sm font-medium text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              Rp
            </span>
            <input
              className="min-w-0 flex-1 rounded-r-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              id={`${idPrefix}-priceYearly`}
              type="number"
              value={String(data.priceYearly)}
              onChange={(e) => setData('priceYearly', Number(e.target.value))}
              aria-label="Harga tahunan"
            />
          </div>
        </div>
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-features`}
          className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Benefit / Fitur
        </label>
        <Suspense
          fallback={
            <div className="rounded-lg border border-neutral-300 bg-neutral-50 p-3 text-sm text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              Memuat editor...
            </div>
          }
        >
          <RichTextEditor
            value={data.features}
            onChange={(value) => setData('features', value)}
            placeholder="Tuliskan benefit paket dengan daftar, penebalan, atau tautan..."
          />
        </Suspense>
        {errors.features && <p className="mt-1 text-sm text-red-500">{errors.features}</p>}
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-ctaLabel`}
          className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Teks Tombol (opsional)
        </label>
        <input
          id={`${idPrefix}-ctaLabel`}
          type="text"
          value={data.ctaLabel}
          onChange={(e) => setData('ctaLabel', e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
          placeholder="contoh: Pilih Pro"
        />
      </div>
      <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-sm font-medium leading-5 text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          checked={data.isHighlighted}
          onChange={(e) => setData('isHighlighted', e.target.checked)}
          className="h-4 w-4 shrink-0 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
        />
        Tandai sebagai paket terpopuler (highlight di landing page)
      </label>
    </div>
  )
}
