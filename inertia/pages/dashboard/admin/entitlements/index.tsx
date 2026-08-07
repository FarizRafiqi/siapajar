import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router } from '@inertiajs/react'
import { Save } from 'lucide-react'
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
  entitlements: Entitlement[]
}

export default function Entitlements({ packages }: { packages: PackageData[] }) {
  const [saving, setSaving] = useState<string | null>(null)
  const update = (pkg: PackageData, item: Entitlement, changes: Partial<Entitlement>) => {
    setSaving(`${pkg.id}:${item.featureKey}`)
    router.put(
      `/admin/entitlements/${pkg.id}`,
      {
        featureKey: item.featureKey,
        isEnabled: changes.isEnabled ?? item.isEnabled,
        limitValue: changes.limitValue === undefined ? item.limitValue : changes.limitValue,
      },
      { onFinish: () => setSaving(null) }
    )
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
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Atur fitur dan batas penggunaan untuk setiap paket.
          </p>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {pkg.displayName}
              </h3>
              <div className="mt-4 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                <div className="grid grid-cols-[1fr_100px_100px] gap-3 border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
                  {' '}
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
                      <span className="text-sm text-neutral-700 dark:text-neutral-200">
                        {item.label}
                      </span>
                      <input
                        type="checkbox"
                        checked={item.isEnabled}
                        disabled={saving === key}
                        onChange={(event) => update(pkg, item, { isEnabled: event.target.checked })}
                        className="h-4 w-4 accent-emerald-600"
                        aria-label={`${item.label} aktif untuk ${pkg.displayName}`}
                      />
                      <input
                        type="number"
                        min="0"
                        value={item.limitValue ?? ''}
                        disabled={saving === key}
                        onChange={(event) =>
                          update(pkg, item, {
                            limitValue:
                              event.target.value === '' ? null : Number(event.target.value),
                          })
                        }
                        className="w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        placeholder="∞"
                        aria-label={`Batas ${item.label} untuk ${pkg.displayName}`}
                      />
                    </div>
                  )
                })}
              </div>
              <p className="mt-3 flex items-center gap-1 text-xs text-neutral-500">
                <Save className="h-3.5 w-3.5" /> Perubahan tersimpan otomatis.
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardWrapper>
  )
}
