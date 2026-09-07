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

const formatCycle = (value: string) => {
  if (value === 'monthly') return 'Bulanan'
  if (value === 'yearly') return 'Tahunan'
  if (value === 'manual') return 'Manual'
  return value
}

const formatStatus = (value: string) => {
  if (value === 'active') return 'Aktif'
  if (value === 'expired') return 'Berakhir'
  if (value === 'cancelled') return 'Dibatalkan'
  return value
}

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
      <div className="mx-auto max-w-6xl space-y-6 pb-8">
        <div className="card-kawaii p-5 sm:p-7">
          <Link
            href="/my-package"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-800 transition-colors hover:text-emerald-700 dark:text-neutral-200 dark:hover:text-emerald-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Paket Saya
          </Link>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border-2 border-black bg-[#bcffbe] p-3 text-neutral-950 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-[#bcffbe] dark:shadow-[2px_2px_0px_#ffffff]">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                Riwayat Langganan
              </h2>
              <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Catatan paket yang pernah aktif pada akun Anda.
              </p>
            </div>
          </div>
        </div>
        {subscriptions.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-black bg-[#bcffbe]/25 p-10 text-center dark:border-white dark:bg-emerald-950/30">
            <CalendarDays className="mx-auto h-10 w-10 text-neutral-800 dark:text-neutral-200" />
            <p className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Belum ada riwayat langganan.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((item) => (
              <div
                key={item.id}
                className="card-kawaii flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                      {item.package?.displayName ?? 'Paket tidak tersedia'}
                    </h3>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {formatDate(item.startsAt)} — {formatDate(item.endsAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge-kawaii-sky">{formatCycle(item.billingCycle)}</span>
                  <span className="badge-kawaii-emerald">{formatStatus(item.status)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
