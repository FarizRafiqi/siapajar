import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, Link } from '@inertiajs/react'
import { CalendarDays, Check, History, TrendingUp } from 'lucide-react'

interface Entitlement {
  featureKey: string
  limitValue: number | null
  isEnabled: boolean
}

interface PackageData {
  displayName: string
  description: string | null
  priceMonthly: number
  features: string[]
  entitlements: Entitlement[]
}

interface Subscription {
  startsAt: string
  endsAt: string | null
  billingCycle: string
}

function formatDate(value: string | null) {
  return value
    ? new Date(value).toLocaleDateString('id-ID', { dateStyle: 'long' })
    : 'Tidak dibatasi'
}

export default function MyPackage({
  package: packageData,
  activeSubscription,
}: {
  package: PackageData | null
  activeSubscription: Subscription | null
}) {
  return (
    <DashboardWrapper
      title="Paket Saya"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Paket Saya' }]}
    >
      <Head title="Paket Saya — SiapAjar" />
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Paket Saya</h2>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Lihat paket aktif, masa berlaku, dan fitur yang tersedia untuk akun Anda.
          </p>
        </div>
        {!packageData ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Belum ada paket aktif
            </h3>
            <p className="mt-2 text-sm text-neutral-500">
              Hubungi administrator untuk mengaktifkan paket.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 dark:border-emerald-900/60 dark:bg-neutral-900">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Paket aktif
                </p>
                <h3 className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
                  {packageData.displayName}
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {packageData.description}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-100 px-4 py-3 text-right dark:bg-emerald-900/40">
                <p className="text-xs text-neutral-500">Harga bulanan</p>
                <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                  Rp {packageData.priceMonthly.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            {activeSubscription && (
              <div className="mt-6 grid gap-3 border-t border-neutral-200 pt-5 sm:grid-cols-2 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-500">Mulai berlangganan</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {formatDate(activeSubscription.startsAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-500">Masa berlaku sampai</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {formatDate(activeSubscription.endsAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/usage"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <TrendingUp className="h-4 w-4" /> Penggunaan
              </Link>
              <Link
                href="/subscriptions"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <History className="h-4 w-4" /> Riwayat Langganan
              </Link>
            </div>
            <div className="mt-6 border-t border-neutral-200 pt-5 dark:border-neutral-800">
              <h4 className="font-semibold text-neutral-900 dark:text-white">Fitur paket</h4>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {packageData.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{' '}
                    {feature.replace(/<[^>]+>/g, '')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
