import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, CalendarDays } from 'lucide-react'

interface Subscription {
  id: number
  status: string
  billingCycle: string
  startsAt: string
  endsAt: string | null
  package: { displayName: string } | null
}

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString('id-ID', { dateStyle: 'long' }) : 'Tidak dibatasi'

export default function Subscriptions({
  subscriptions,
}: Readonly<{ subscriptions: Subscription[] }>) {
  return (
    <DashboardWrapper
      title="Riwayat Langganan"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Paket Saya', href: '/my-package' },
        { label: 'Riwayat Langganan' },
      ]}
    >
      <Head title="Riwayat Langganan — SiapAjar" />
      <div className="space-y-6">
        <div>
          <Link
            href="/my-package"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Paket Saya
          </Link>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Riwayat Langganan
          </h2>
          <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            Catatan paket yang pernah aktif pada akun Anda.
          </p>
        </div>
        {subscriptions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700">
            Belum ada riwayat langganan.
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {item.package?.displayName ?? 'Paket tidak tersedia'}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {formatDate(item.startsAt)} — {formatDate(item.endsAt)}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium capitalize text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
