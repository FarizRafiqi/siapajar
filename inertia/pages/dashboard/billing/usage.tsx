import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Gauge } from 'lucide-react'

interface UsageItem {
  featureKey: string
  label: string
  used: number
  limit: number | null
}

export default function Usage({ periodLabel, usage }: Readonly<{ periodLabel: string; usage: UsageItem[] }>) {
  return (
    <DashboardWrapper
      title="Penggunaan"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Paket Saya', href: '/my-package' },
        { label: 'Penggunaan' },
      ]}
    >
      <Head title="Penggunaan — SiapAjar" />
      <div className="space-y-6">
        <div>
          <Link
            href="/my-package"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Paket Saya
          </Link>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Penggunaan</h2>
          <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            Ringkasan pemakaian fitur untuk {periodLabel}.
          </p>
        </div>
        {usage.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-700">
            <Gauge className="mx-auto h-10 w-10 text-neutral-400" />
            <p className="mt-3 text-sm text-neutral-500">
              Belum ada penggunaan tercatat bulan ini.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {usage.map((item) => {
              const percent = item.limit ? Math.min(100, (item.used / item.limit) * 100) : 0
              return (
                <div
                  key={item.featureKey}
                  className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{item.label}</h3>
                    <Gauge className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-neutral-900 dark:text-white">
                    {item.used}{' '}
                    <span className="text-sm font-normal text-neutral-500">
                      / {item.limit ?? '∞'}
                    </span>
                  </p>
                  {item.limit && (
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
