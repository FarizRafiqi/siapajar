import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Coins,
  ExternalLink,
  History,
  RotateCw,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'

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
  id: number
  status: string
  startsAt: string
  endsAt: string | null
  billingCycle: string
  package: { displayName: string } | null
}

interface InvoiceItem {
  id: number
  invoiceNo: string
  packageName: string
  creditsAmount: number
  grossAmount: number
  status: 'pending' | 'paid' | 'expired' | 'failed'
  mayarPaymentUrl?: string
}

interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
}

function formatDate(value: string | null) {
  return value
    ? new Date(value).toLocaleDateString('id-ID', { dateStyle: 'long' })
    : 'Tidak dibatasi'
}

function HistoryPagination({
  meta,
  pageParam,
  perPageParam,
  otherParams,
  itemLabel,
}: Readonly<{
  meta: PaginationMeta
  pageParam: string
  perPageParam: string
  otherParams: Record<string, number>
  itemLabel: string
}>) {
  const firstPage = Math.max(1, Math.min(meta.currentPage - 2, meta.lastPage - 4))
  const lastPage = Math.min(meta.lastPage, firstPage + 4)
  const pageNumbers = Array.from(
    { length: Math.max(0, lastPage - firstPage + 1) },
    (_, index) => firstPage + index
  )
  const navigate = (page: number, perPage = meta.perPage) => {
    router.get(
      '/my-package',
      { ...otherParams, [pageParam]: page, [perPageParam]: perPage },
      { preserveState: true, preserveScroll: true }
    )
  }

  return (
    <div className="flex flex-col gap-3 border-t-2 border-neutral-200 pt-4 text-sm dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 font-medium text-neutral-700 dark:text-neutral-300">
        <span>
          Menampilkan{' '}
          <strong className="text-neutral-900 dark:text-white">
            {meta.total === 0 ? 0 : (meta.currentPage - 1) * meta.perPage + 1}-
            {Math.min(meta.currentPage * meta.perPage, meta.total)}
          </strong>{' '}
          dari <strong className="text-neutral-900 dark:text-white">{meta.total}</strong>{' '}
          {itemLabel}
        </span>
        <label className="flex items-center gap-2">
          <span>Baris per halaman</span>
          <select
            value={meta.perPage}
            onChange={(event) => navigate(1, Number.parseInt(event.target.value, 10))}
            className="rounded-xl border-2 border-black bg-white px-2 py-1 text-xs font-bold text-neutral-900 dark:border-white dark:bg-neutral-800 dark:text-white"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => navigate(Math.max(1, meta.currentPage - 1))}
          disabled={meta.currentPage <= 1}
          className="btn-kawaii-secondary !rounded-xl !px-2.5 !py-1.5 !text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => navigate(page)}
            className={cn(
              'h-8 min-w-8 rounded-xl border-2 px-2 text-xs font-black transition-colors',
              page === meta.currentPage
                ? 'border-black bg-emerald-400 text-neutral-950 dark:border-white dark:bg-emerald-500'
                : 'border-black bg-white text-neutral-900 hover:bg-neutral-100 dark:border-white dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700'
            )}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => navigate(Math.min(meta.lastPage, meta.currentPage + 1))}
          disabled={meta.currentPage >= meta.lastPage}
          className="btn-kawaii-secondary !rounded-xl !px-2.5 !py-1.5 !text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function InvoiceHistory({
  invoices,
  meta,
  subscriptionMeta,
}: Readonly<{
  invoices: InvoiceItem[]
  meta: PaginationMeta
  subscriptionMeta: PaginationMeta
}>) {
  const [checkingInvoice, setCheckingInvoice] = useState<string | null>(null)

  const handleCheckStatus = async (invoiceNo: string) => {
    setCheckingInvoice(invoiceNo)
    try {
      const response = await fetch(`/api/topup/invoices/${invoiceNo}`)
      const data = await response.json()
      if (response.ok) {
        if (data.status === 'paid') {
          toast.success('Pembayaran terkonfirmasi! Kredit telah ditambahkan ke akun Anda.')
          setTimeout(() => window.location.reload(), 1000)
        } else {
          toast.info(`Status tagihan: ${data.status.toUpperCase()}`)
        }
      } else {
        toast.error(data.message || 'Gagal memeriksa status tagihan')
      }
    } catch {
      toast.error('Gagal terhubung ke server')
    } finally {
      setCheckingInvoice(null)
    }
  }

  return (
    <section className="card-kawaii space-y-5 p-5 sm:p-7">
      <div>
        <h3 className="text-lg font-black text-neutral-900 dark:text-white">
          Riwayat Tagihan &amp; Top-Up
        </h3>
        <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Daftar transaksi dan penambahan kredit akun Anda
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-black bg-[#ffd670]/20 px-5 py-12 text-center dark:border-white dark:bg-amber-950/30">
          <Coins className="mx-auto h-10 w-10 text-neutral-800 dark:text-neutral-200" />
          <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-white">
            Belum ada riwayat tagihan
          </p>
          <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Tagihan top-up yang Anda buat akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-neutral-200 text-xs font-black uppercase text-neutral-800 dark:border-neutral-800 dark:text-neutral-200">
                <th className="px-3 pb-3">No. Invoice</th>
                <th className="px-3 pb-3">Paket &amp; Kredit</th>
                <th className="px-3 pb-3">Nominal</th>
                <th className="px-3 pb-3">Status</th>
                <th className="px-3 pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-100 dark:divide-neutral-800">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-3 py-3.5 font-mono text-xs font-black text-neutral-900 dark:text-white">
                    {invoice.invoiceNo}
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="font-bold text-neutral-900 dark:text-neutral-100">
                      {invoice.packageName}
                    </p>
                    <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      +{invoice.creditsAmount} Kredit
                    </p>
                  </td>
                  <td className="px-3 py-3.5 font-black text-neutral-900 dark:text-white">
                    Rp{invoice.grossAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={cn(
                        'inline-flex shrink-0 whitespace-nowrap rounded-full border-2 border-black px-2.5 py-1 text-xs font-black dark:border-white',
                        invoice.status === 'paid'
                          ? 'bg-emerald-200 text-neutral-950 dark:bg-emerald-300'
                          : invoice.status === 'pending'
                            ? 'bg-amber-200 text-neutral-950 dark:bg-amber-300'
                            : 'bg-rose-200 text-neutral-950 dark:bg-rose-300'
                      )}
                    >
                      {invoice.status === 'paid'
                        ? 'LUNAS'
                        : invoice.status === 'pending'
                          ? 'MENUNGGU'
                          : invoice.status === 'failed'
                            ? 'GAGAL'
                            : 'KEDALUWARSA'}
                    </span>
                  </td>
                  <td className="space-x-2 px-3 py-3.5 text-right">
                    {invoice.status === 'pending' && invoice.mayarPaymentUrl && (
                      <a
                        href={invoice.mayarPaymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-kawaii-primary !rounded-xl !px-3 !py-1.5 !text-xs"
                      >
                        Bayar Sekarang <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {invoice.status === 'pending' && (
                      <button
                        type="button"
                        disabled={checkingInvoice === invoice.invoiceNo}
                        onClick={() => handleCheckStatus(invoice.invoiceNo)}
                        className="btn-kawaii-secondary !rounded-xl !px-3 !py-1.5 !text-xs"
                      >
                        <RotateCw
                          className={cn(
                            'h-3 w-3',
                            checkingInvoice === invoice.invoiceNo && 'animate-spin'
                          )}
                        />
                        Cek Status
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <HistoryPagination
            meta={meta}
            pageParam="invoicePage"
            perPageParam="invoicePerPage"
            otherParams={{
              subscriptionPage: subscriptionMeta.currentPage,
              subscriptionPerPage: subscriptionMeta.perPage,
            }}
            itemLabel="tagihan"
          />
        </div>
      )}
    </section>
  )
}

function SubscriptionHistory({
  subscriptions,
  meta,
  invoiceMeta,
}: Readonly<{
  subscriptions: Subscription[]
  meta: PaginationMeta
  invoiceMeta: PaginationMeta
}>) {
  return (
    <section className="card-kawaii space-y-5 p-5 sm:p-7">
      <div>
        <h3 className="text-lg font-black text-neutral-900 dark:text-white">Riwayat Langganan</h3>
        <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Catatan paket yang pernah aktif pada akun Anda.
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-black bg-[#bcffbe]/25 px-5 py-10 text-center dark:border-white dark:bg-emerald-950/30">
          <History className="mx-auto h-10 w-10 text-neutral-800 dark:text-neutral-200" />
          <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-white">
            Belum ada riwayat langganan.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-neutral-200 text-xs font-black uppercase text-neutral-800 dark:border-neutral-800 dark:text-neutral-200">
                <th className="px-3 pb-3">Paket</th>
                <th className="px-3 pb-3">Periode</th>
                <th className="px-3 pb-3">Siklus</th>
                <th className="px-3 pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-100 dark:divide-neutral-800">
              {subscriptions.map((subscription) => (
                <tr
                  key={subscription.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <td className="px-3 py-3.5 font-bold text-neutral-900 dark:text-white">
                    {subscription.package?.displayName ?? 'Paket tidak tersedia'}
                  </td>
                  <td className="px-3 py-3.5 font-medium text-neutral-800 dark:text-neutral-200">
                    {formatDate(subscription.startsAt)} — {formatDate(subscription.endsAt)}
                  </td>
                  <td className="px-3 py-3.5 font-medium capitalize text-neutral-800 dark:text-neutral-200">
                    {subscription.billingCycle}
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="badge-kawaii-emerald">
                      {subscription.status === 'active' ? 'Aktif' : subscription.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <HistoryPagination
            meta={meta}
            pageParam="subscriptionPage"
            perPageParam="subscriptionPerPage"
            otherParams={{
              invoicePage: invoiceMeta.currentPage,
              invoicePerPage: invoiceMeta.perPage,
            }}
            itemLabel="langganan"
          />
        </div>
      )}
    </section>
  )
}

export default function MyPackage({
  package: packageData,
  activeSubscription,
  invoices = [],
  subscriptions = [],
  invoiceMeta,
  subscriptionMeta,
}: {
  package: PackageData | null
  activeSubscription: Subscription | null
  invoices?: InvoiceItem[]
  subscriptions?: Subscription[]
  invoiceMeta: PaginationMeta
  subscriptionMeta: PaginationMeta
}) {
  return (
    <DashboardWrapper
      title="Paket Saya"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Paket Saya' }]}
    >
      <Head title="Paket Saya — SiapAjar" />
      <div className="mx-auto max-w-6xl space-y-6 pb-8">
        <div className="flex flex-col gap-4 rounded-3xl border-2 border-black bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-5 text-white shadow-[4px_4px_0px_#000000] sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <span className="badge-kawaii-emerald !border-black !shadow-[2px_2px_0px_#000000]">
              <Coins className="h-3.5 w-3.5" /> Akun &amp; Saldo Kredit
            </span>
            <h2 className="mt-3 text-2xl font-black text-white">Paket Saya</h2>
            <p className="mt-1 text-sm font-medium text-emerald-50">
              Lihat paket aktif, masa berlaku, dan fitur yang tersedia untuk akun Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-topup-modal'))}
            className="btn-kawaii-primary shrink-0"
          >
            <Coins className="h-4 w-4" /> Top-Up Saldo Kredit
          </button>
        </div>
        {!packageData ? (
          <div className="rounded-3xl border-2 border-dashed border-black bg-[#ffd670]/20 p-10 text-center dark:border-white dark:bg-amber-950/30">
            <h3 className="text-lg font-black text-neutral-900 dark:text-white">
              Belum ada paket aktif
            </h3>
            <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Hubungi administrator untuk mengaktifkan paket.
            </p>
          </div>
        ) : (
          <section className="card-kawaii space-y-6 p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="badge-kawaii-emerald">Paket aktif</span>
                <h3 className="mt-3 text-2xl font-black text-neutral-900 dark:text-white">
                  {packageData.displayName}
                </h3>
                <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {packageData.description}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-black bg-[#ffd670] px-4 py-3 text-right shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-amber-300 dark:shadow-[2px_2px_0px_#ffffff]">
                <p className="text-xs font-bold text-neutral-900">Harga bulanan</p>
                <p className="font-black text-neutral-950">
                  Rp {packageData.priceMonthly.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            {activeSubscription && (
              <div className="grid gap-3 border-t-2 border-neutral-200 pt-5 sm:grid-cols-2 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Mulai berlangganan
                    </p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">
                      {formatDate(activeSubscription.startsAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Masa berlaku sampai
                    </p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">
                      {formatDate(activeSubscription.endsAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Link href="/usage" className="btn-kawaii-secondary">
                <TrendingUp className="h-4 w-4" /> Penggunaan
              </Link>
            </div>
            <div className="border-t-2 border-neutral-200 pt-5 dark:border-neutral-800">
              <h4 className="text-base font-black text-neutral-900 dark:text-white">Fitur paket</h4>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {packageData.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-200"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{' '}
                    {feature.replace(/<[^>]+>/g, '')}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
        <SubscriptionHistory
          subscriptions={subscriptions}
          meta={subscriptionMeta}
          invoiceMeta={invoiceMeta}
        />
        <InvoiceHistory
          invoices={invoices}
          meta={invoiceMeta}
          subscriptionMeta={subscriptionMeta}
        />
      </div>
    </DashboardWrapper>
  )
}
