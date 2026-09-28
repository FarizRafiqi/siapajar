import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router } from '@inertiajs/react'
import { PackageOpen, Save } from 'lucide-react'
import { useState } from 'react'

interface Entitlement {
  featureKey: string
  label: string
  isEnabled: boolean
  limitValue: number | null
}
interface PackageData {
  id: number
  displayName: string
  isActive?: boolean
  entitlements: Entitlement[]
}

export default function Entitlements({ packages }: { packages: PackageData[] }) {
  const [saving, setSaving] = useState<string | null>(null)
  const [limitDrafts, setLimitDrafts] = useState<Record<string, string>>({})
  const update = (pkg: PackageData, item: Entitlement, changes: Partial<Entitlement>) => {
    const key = `${pkg.id}:${item.featureKey}`
    setSaving(key)
    router.put(
      `/admin/entitlements/${pkg.id}`,
      {
        featureKey: item.featureKey,
        isEnabled: changes.isEnabled ?? item.isEnabled,
        limitValue: changes.limitValue === undefined ? item.limitValue : changes.limitValue,
      },
      {
        onSuccess: () => {
          if (changes.limitValue !== undefined) {
            setLimitDrafts((current) => {
              const next = { ...current }
              delete next[key]
              return next
            })
          }
        },
        onFinish: () => setSaving(null),
      }
    )
  }

  const saveLimit = (pkg: PackageData, item: Entitlement) => {
    const key = `${pkg.id}:${item.featureKey}`
    const draft = limitDrafts[key]
    if (draft === undefined) return
    const nextLimit = draft.trim() === '' ? null : Number(draft)
    if (nextLimit !== null && (!Number.isFinite(nextLimit) || nextLimit < 0)) return
    if (nextLimit === item.limitValue) {
      setLimitDrafts((current) => {
        const next = { ...current }
        delete next[key]
        return next
      })
      return
    }
    update(pkg, item, { limitValue: nextLimit })
  }

  return (
    <DashboardWrapper
      title="Hak Fitur Paket"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Hak Fitur Paket' }]}
    >
      <Head title="Hak Fitur Paket — SiapAjar" />
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Hak Fitur Paket</h2>
          <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            Atur fitur dan batas penggunaan untuk setiap paket. Paket nonaktif tetap ditampilkan
            sebagai arsip agar konfigurasi lamanya dapat ditinjau.
          </p>
        </div>
        {packages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <PackageOpen className="mx-auto h-10 w-10 text-neutral-400" />
            <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">
              Belum ada paket
            </p>
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
              Buat paket terlebih dahulu sebelum mengatur hak fiturnya.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {pkg.displayName}
                  </h3>
                  <span
                    className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${pkg.isActive === false ? 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300' : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'}`}
                  >
                    {pkg.isActive === false ? 'Nonaktif / arsip' : 'Aktif'}
                  </span>
                </div>
                <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <div className="min-w-[360px] overflow-hidden">
                    <div className="grid grid-cols-[1fr_100px_100px] gap-3 border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                      <span>Fitur</span>
                      <span>Aktif</span>
                      <span>Batas</span>
                    </div>
                    {pkg.entitlements.map((item) => {
                      const key = `${pkg.id}:${item.featureKey}`
                      return (
                        <div
                          key={item.featureKey}
                          className="grid grid-cols-[1fr_100px_100px] items-center gap-3 border-b border-neutral-100 px-3 py-3 last:border-0 dark:border-neutral-800"
                        >
                          <span className="text-sm text-neutral-800 dark:text-neutral-200">
                            {item.label}
                          </span>
                          <input
                            type="checkbox"
                            checked={item.isEnabled}
                            disabled={saving === key}
                            onChange={(event) =>
                              update(pkg, item, { isEnabled: event.target.checked })
                            }
                            className="h-4 w-4 shrink-0 accent-emerald-600"
                            aria-label={`${item.label} aktif untuk ${pkg.displayName}`}
                          />
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                              limitDrafts[key] ?? (item.limitValue === null ? '' : item.limitValue)
                            }
                            disabled={saving === key}
                            onChange={(event) =>
                              setLimitDrafts((current) => ({
                                ...current,
                                [key]: event.target.value,
                              }))
                            }
                            onBlur={() => saveLimit(pkg, item)}
                            className="w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            placeholder="Tanpa batas"
                            aria-label={`Batas ${item.label} untuk ${pkg.displayName}`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <Save className="h-3.5 w-3.5" /> Perubahan batas tersimpan saat selesai diedit.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
