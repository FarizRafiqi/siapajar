import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm } from '@inertiajs/react'
import { lazy, Suspense, useState } from 'react'
import { Plus, Trash2, Pencil, Star } from 'lucide-react'
import { cn } from '~/lib/utils'
import { packageFeaturesToHtml, sanitizeRichText } from '~/lib/rich-text'

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

  const createForm = useForm<PackageFormData>(emptyForm)
  const editForm = useForm<PackageFormData>(emptyForm)

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
            <p className="text-neutral-600 dark:text-neutral-400">
              Kelola paket langganan beserta daftar benefit yang tampil di landing page
            </p>
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
          {packages.map((pkg) => {
            const features = Array.isArray(pkg.features) ? pkg.features : []

            return (
              <div
                key={pkg.id}
                className="flex flex-col rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {pkg.displayName}
                    </h3>
                    {pkg.isHighlighted && (
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="rounded-lg p-1 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingPackage(pkg)}
                      className="rounded-lg p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {pkg.description}
                </p>
                <p className="mt-2 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {pkg.priceMonthly === 0
                    ? 'Gratis'
                    : `Rp${pkg.priceMonthly.toLocaleString('id-ID')}`}
                  {pkg.priceMonthly > 0 && (
                    <span className="text-sm font-normal text-neutral-500">/bulan</span>
                  )}
                </p>
                {features.length === 1 && /<\/?[a-z][^>]*>/i.test(features[0]) ? (
                  <div
                    className="rich-text-content prose prose-sm mt-3 max-w-none flex-1 text-neutral-600 dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: sanitizeRichText(features[0]) }}
                  />
                ) : features.length > 0 ? (
                  <ul className="mt-3 flex-1 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-1.5">
                        <span className="text-emerald-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : null}
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
            )
          })}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Tambah Paket
            </h3>
            <PackageForm form={createForm} idPrefix="create" />
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  createForm.reset()
                }}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
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
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Edit Paket — {editingPackage.displayName}
            </h3>
            <PackageForm form={editForm} idPrefix="edit" hideName />
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditingPackage(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Paket?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Paket <strong>{deletingPackage.displayName}</strong> akan dihapus. User yang memakai
              paket ini akan kehilangan paketnya.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingPackage(null)}
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
            <div className="rounded-lg border border-neutral-300 bg-neutral-50 p-3 text-sm text-neutral-500 dark:border-neutral-600 dark:bg-neutral-800">
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
      <label className="flex items-center gap-2 text-sm font-medium leading-5 text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          checked={data.isHighlighted}
          onChange={(e) => setData('isHighlighted', e.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
        />
        Tandai sebagai paket terpopuler (highlight di landing page)
      </label>
    </div>
  )
}
