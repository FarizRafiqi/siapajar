import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Gauge } from 'lucide-react'

interface UsageItem {
  featureKey: string
  label: string
  used: number
  limit: number | null
}

export default function Usage({
  periodLabel,
  usage,
}: Readonly<{ periodLabel: string; usage: UsageItem[] }>) {
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
      <div className="mx-auto max-w-6xl space-y-6 pb-8">
        <div className="card-kawaii p-5 sm:p-7">
          <Link
            href="/my-package"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-800 transition-colors hover:text-emerald-700 dark:text-neutral-200 dark:hover:text-emerald-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Paket Saya
          </Link>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border-2 border-black bg-[#70d6ff] p-3 text-neutral-950 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-[#70d6ff] dark:shadow-[2px_2px_0px_#ffffff]">
              <Gauge className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                Penggunaan
              </h2>
              <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Ringkasan pemakaian fitur untuk {periodLabel}.
              </p>
            </div>
          </div>
        </div>
        {usage.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-black bg-[#ffd670]/20 p-10 text-center dark:border-white dark:bg-amber-950/30">
            <Gauge className="mx-auto h-10 w-10 text-neutral-800 dark:text-neutral-200" />
            <p className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Belum ada penggunaan tercatat bulan ini.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {usage.map((item) => {
              const percent = item.limit ? Math.min(100, (item.used / item.limit) * 100) : 0
              return (
                <div key={item.featureKey} className="card-kawaii p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                      {item.label}
                    </h3>
                    <Gauge className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="mt-3 text-2xl font-black text-neutral-900 dark:text-white">
                    {item.used}{' '}
                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      / {item.limit ?? '∞'}
                    </span>
                  </p>
                  {item.limit && (
                    <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-black bg-neutral-100 dark:border-white dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all"
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
