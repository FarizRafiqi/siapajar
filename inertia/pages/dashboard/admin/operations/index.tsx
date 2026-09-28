import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import {
  AdminSortButton,
  AdminTablePagination,
  AdminTableToolbar,
  type AdminSortDirection,
} from '~/components/dashboard/admin-table'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CreditCard,
  Database,
  Layers3,
  RefreshCw,
  Server,
} from 'lucide-react'

type Overview = {
  checkedAt: string
  queueDriver: string
  health: { database: 'ok' | 'degraded'; redis: 'ok' | 'degraded' | 'not_used' }
  metrics: null | {
    aiQueue: {
      pending: number
      processing: number
      failedTotal: number
      failedLast24Hours: number
      staleProcessing: number
      stalePending: number
      completedLast24Hours: number
      latencySampleCount: number
      latencyP50Ms: number | null
      latencyP95Ms: number | null
    }
    payments: { pendingMayar: number; oldestPendingAt: string | null }
    recentAuditEvents: {
      id: number
      action: string
      entityType: string | null
      entityId: string | null
      actorId: number | null
      createdAt: string
    }[]
    reconciliation: null | {
      at: string
      checked: number
      settled: number
      stillPending: number
      failures: number
      limitReached: boolean
    }
  }
}

type Props = { overview: Overview }

function formatDate(value: string | null) {
  if (!value) return 'Belum ada data'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Tidak tersedia' : date.toLocaleString('id-ID')
}

function humanize(value: string) {
  return value.replace(/[._-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}

function HealthBadge({ status, label }: { status: 'ok' | 'degraded' | 'not_used'; label: string }) {
  const isHealthy = status === 'ok'
  const isUnused = status === 'not_used'
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
        isHealthy
          ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100'
          : isUnused
            ? 'border-neutral-300 bg-neutral-100 text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100'
            : 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100'
      }`}
    >
      {isHealthy ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <AlertTriangle className="h-3.5 w-3.5" />
      )}
      {label}: {isHealthy ? 'Sehat' : isUnused ? 'Tidak dipakai' : 'Terganggu'}
    </span>
  )
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string
  value: string | number
  detail?: string
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-950 dark:text-white">{value}</p>
      {detail ? (
        <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{detail}</p>
      ) : null}
    </div>
  )
}

export default function AdminOperationsIndex({ overview }: Props) {
  const [auditSearch, setAuditSearch] = useState('')
  const [auditScope, setAuditScope] = useState<'all' | 'payment' | 'admin'>('all')
  const [auditSort, setAuditSort] = useState<'createdAt' | 'action'>('createdAt')
  const [auditDirection, setAuditDirection] = useState<AdminSortDirection>('desc')
  const [auditPage, setAuditPage] = useState(1)
  const [auditPageSize, setAuditPageSize] = useState(5)
  const metrics = overview.metrics
  const queue = metrics?.aiQueue
  const payments = metrics?.payments
  const reconciliation = metrics?.reconciliation
  const filteredAuditEvents = useMemo(() => {
    const search = auditSearch.trim().toLowerCase()
    return (metrics?.recentAuditEvents ?? [])
      .filter((event) => auditScope === 'all' || event.action.startsWith(`${auditScope}.`))
      .filter((event) => {
        if (!search) return true
        return [event.action, event.entityType ?? '', event.entityId ?? '', event.actorId ?? '']
          .join(' ')
          .toLowerCase()
          .includes(search)
      })
      .sort((left, right) => {
        const compared =
          auditSort === 'createdAt'
            ? Date.parse(left.createdAt) - Date.parse(right.createdAt)
            : left.action.localeCompare(right.action)
        return auditDirection === 'asc' ? compared : -compared
      })
  }, [metrics?.recentAuditEvents, auditDirection, auditScope, auditSearch, auditSort])
  const auditTotalPages = Math.max(1, Math.ceil(filteredAuditEvents.length / auditPageSize))
  const visibleAuditEvents = filteredAuditEvents.slice(
    (auditPage - 1) * auditPageSize,
    auditPage * auditPageSize
  )

  const toggleAuditSort = (key: 'createdAt' | 'action') => {
    if (auditSort === key) setAuditDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'))
    else {
      setAuditSort(key)
      setAuditDirection(key === 'createdAt' ? 'desc' : 'asc')
    }
    setAuditPage(1)
  }

  const resetAuditFilters = () => {
    setAuditSearch('')
    setAuditScope('all')
    setAuditPage(1)
  }

  return (
    <DashboardWrapper
      title="Operasional"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Operasional' }]}
    >
      <Head title="Operasional — SiapAjar" />
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-neutral-950 dark:text-white">
              <Activity className="h-6 w-6" /> Ringkasan Operasional
            </h1>
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
              Status infrastruktur, antrean AI, latensi generator, dan rekonsiliasi pembayaran.
            </p>
          </div>
          <p className="text-sm text-neutral-800 dark:text-neutral-100">
            Diperiksa {formatDate(overview.checkedAt)}
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <Database className="h-5 w-5 shrink-0 text-neutral-800 dark:text-neutral-100" />
            <HealthBadge label="Database" status={overview.health.database} />
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <Server className="h-5 w-5 shrink-0 text-neutral-800 dark:text-neutral-100" />
            <HealthBadge label="Redis" status={overview.health.redis} />
            <span className="ml-auto text-sm text-neutral-700 dark:text-neutral-300">
              Driver {overview.queueDriver}
            </span>
          </div>
        </section>

        {!metrics ? (
          <div className="rounded-xl border border-rose-300 bg-rose-50 p-5 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100">
            Database tidak dapat dihubungi; metrik operasional belum tersedia.
          </div>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-950 dark:text-white">
                <Layers3 className="h-5 w-5" /> Antrean AI
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                  label="Menunggu"
                  value={queue!.pending}
                  detail={`${queue!.stalePending} tidak berubah > 20 menit`}
                />
                <Metric
                  label="Berjalan"
                  value={queue!.processing}
                  detail={`${queue!.staleProcessing} tidak diperbarui > 20 menit`}
                />
                <Metric
                  label="Gagal 24 jam"
                  value={queue!.failedLast24Hours}
                  detail={`${queue!.failedTotal} gagal tercatat total`}
                />
                <Metric
                  label="Selesai 24 jam"
                  value={queue!.completedLast24Hours}
                  detail={`${queue!.latencySampleCount} sampel latensi (maks. 5.000)`}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Metric
                  label="Latensi p50 generator"
                  value={queue!.latencyP50Ms === null ? '—' : `${queue!.latencyP50Ms} ms`}
                />
                <Metric
                  label="Latensi p95 generator"
                  value={queue!.latencyP95Ms === null ? '—' : `${queue!.latencyP95Ms} ms`}
                />
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-950 dark:text-white">
                  <CreditCard className="h-5 w-5" /> Pembayaran Mayar
                </h2>
                <Metric
                  label="Invoice masih pending"
                  value={payments!.pendingMayar}
                  detail={`Pending tertua: ${formatDate(payments!.oldestPendingAt)}`}
                />
              </div>
              <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-950 dark:text-white">
                  <RefreshCw className="h-5 w-5" /> Rekonsiliasi Harian
                </h2>
                {reconciliation ? (
                  <>
                    <p className="text-sm text-neutral-800 dark:text-neutral-100">
                      Run terakhir: {formatDate(reconciliation.at)}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Metric label="Diperiksa" value={reconciliation.checked} />
                      <Metric label="Berhasil dibayar" value={reconciliation.settled} />
                      <Metric label="Masih pending" value={reconciliation.stillPending} />
                      <Metric label="Kesalahan" value={reconciliation.failures} />
                    </div>
                    {reconciliation.limitReached ? (
                      <p className="flex items-center gap-2 text-sm text-amber-900 dark:text-amber-100">
                        <Clock3 className="h-4 w-4 shrink-0" /> Batas batch tercapai; sisa invoice
                        dilanjutkan pada run berikutnya.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Belum ada run rekonsiliasi tercatat.
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-3 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">
                Aktivitas Audit Terbaru
              </h2>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Menampilkan maksimal 10 event payment/admin terbaru.
              </p>
              <AdminTableToolbar
                search={auditSearch}
                onSearchChange={(value) => {
                  setAuditSearch(value)
                  setAuditPage(1)
                }}
                placeholder="Cari aktivitas audit..."
                onReset={resetAuditFilters}
                hasActiveFilters={Boolean(auditSearch) || auditScope !== 'all'}
              >
                <select
                  value={auditScope}
                  onChange={(event) => {
                    setAuditScope(event.target.value as typeof auditScope)
                    setAuditPage(1)
                  }}
                  aria-label="Filter kategori audit"
                  className="rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                >
                  <option value="all">Semua aktivitas</option>
                  <option value="payment">Payment</option>
                  <option value="admin">Admin</option>
                </select>
              </AdminTableToolbar>
              {visibleAuditEvents.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="border-b border-neutral-200 text-neutral-800 dark:border-neutral-800 dark:text-neutral-100">
                      <tr>
                        <th className="px-3 py-2 font-semibold">
                          <AdminSortButton
                            label="Waktu"
                            active={auditSort === 'createdAt'}
                            direction={auditDirection}
                            onClick={() => toggleAuditSort('createdAt')}
                          />
                        </th>
                        <th className="px-3 py-2 font-semibold">
                          <AdminSortButton
                            label="Aktivitas"
                            active={auditSort === 'action'}
                            direction={auditDirection}
                            onClick={() => toggleAuditSort('action')}
                          />
                        </th>
                        <th className="px-3 py-2 font-semibold">Objek</th>
                        <th className="px-3 py-2 font-semibold">Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {visibleAuditEvents.map((event) => (
                        <tr
                          key={event.id}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                        >
                          <td className="whitespace-nowrap px-3 py-3 text-neutral-800 dark:text-neutral-100">
                            {formatDate(event.createdAt)}
                          </td>
                          <td className="px-3 py-3 font-medium text-neutral-900 dark:text-white">
                            {humanize(event.action)}
                          </td>
                          <td className="px-3 py-3 text-neutral-800 dark:text-neutral-100">
                            {event.entityType ? humanize(event.entityType) : 'Umum'}
                            {event.entityId ? ` #${event.entityId}` : ''}
                          </td>
                          <td className="px-3 py-3 text-neutral-800 dark:text-neutral-100">
                            {event.actorId === null ? 'Sistem' : `ID ${event.actorId}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {metrics.recentAuditEvents.length
                    ? 'Tidak ada aktivitas yang cocok dengan pencarian. Reset filter untuk melihat kembali.'
                    : 'Belum ada aktivitas payment/admin yang tercatat.'}
                </p>
              )}
              <AdminTablePagination
                currentPage={auditPage}
                totalPages={auditTotalPages}
                totalItems={filteredAuditEvents.length}
                pageSize={auditPageSize}
                itemLabel="event"
                onPageChange={setAuditPage}
                onPageSizeChange={(size) => {
                  setAuditPageSize(size)
                  setAuditPage(1)
                }}
              />
            </section>
          </>
        )}
      </div>
    </DashboardWrapper>
  )
}
