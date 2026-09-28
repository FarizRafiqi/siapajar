import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { AdminTablePagination, AdminTableToolbar } from '~/components/dashboard/admin-table'
import { Head, router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { AlertTriangle, Check, ShieldAlert, X } from 'lucide-react'

type FraudCase = {
  id: number
  type: string
  status: 'open' | 'approved' | 'rejected'
  evidence: Record<string, unknown>
  createdAt: string
  userId: number | null
}

type PaginationMeta = {
  currentPage?: number
  lastPage?: number
  perPage?: number
  total: number
}

type Props = {
  cases: { data: FraudCase[]; meta: PaginationMeta }
  filters: { status: string; q?: string; perPage?: number; page?: number }
}

const TYPE_LABELS: Record<string, string> = {
  free_benefit_identity_reuse: 'Penggunaan benefit gratis berulang',
}

const STATUS_LABELS: Record<FraudCase['status'], string> = {
  open: 'Perlu ditinjau',
  approved: 'Disetujui',
  rejected: 'Ditolak',
}

function humanize(value: string) {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}

function formatEvidence(evidence: Record<string, unknown>) {
  return Object.entries(evidence).flatMap(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.entries(value as Record<string, unknown>).map(([nestedKey, nestedValue]) => ({
        label: `${humanize(key)}: ${humanize(nestedKey)}`,
        value: typeof nestedValue === 'string' ? nestedValue : JSON.stringify(nestedValue),
      }))
    }
    return [
      {
        label: humanize(key),
        value: typeof value === 'string' ? value : JSON.stringify(value),
      },
    ]
  })
}

function getQuery(status: string, search: string, perPage: number, page: number) {
  return { status: status === 'all' ? undefined : status, q: search || undefined, perPage, page }
}

export default function AdminFraudIndex({ cases, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.q ?? '')
  const [status, setStatus] = useState(filters.status || 'all')
  const [reviewing, setReviewing] = useState<{
    id: number
    status: 'approved' | 'rejected'
  } | null>(null)
  const perPage = Number(cases.meta.perPage ?? filters.perPage ?? 15)
  const currentPage = Number(cases.meta.currentPage ?? filters.page ?? 1)
  const serverSearch = filters.q ?? ''
  const serverStatus = filters.status || 'all'
  const totalPages = Number(
    cases.meta.lastPage ?? Math.max(1, Math.ceil(cases.meta.total / perPage))
  )

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchQuery === serverSearch && status === serverStatus) return
      router.get('/admin/fraud-cases', getQuery(status, searchQuery, perPage, 1), {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      })
    }, 350)
    return () => window.clearTimeout(timeout)
  }, [searchQuery, status, serverSearch, serverStatus, perPage])

  const changePage = (page: number) => {
    router.get('/admin/fraud-cases', getQuery(status, searchQuery, perPage, page), {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const changePageSize = (nextPerPage: number) => {
    router.get('/admin/fraud-cases', getQuery(status, searchQuery, nextPerPage, 1), {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const resetFilters = () => {
    setSearchQuery('')
    setStatus('all')
  }

  const review = () => {
    if (!reviewing) return
    router.put(
      `/admin/fraud-cases/${reviewing.id}`,
      { status: reviewing.status },
      {
        onSuccess: () => setReviewing(null),
      }
    )
  }

  return (
    <DashboardWrapper
      title="Review Anti-Fraud"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Review Anti-Fraud' }]}
    >
      <Head title="Review Anti-Fraud — SiapAjar" />
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border-2 border-black bg-rose-100 p-6 shadow-[4px_4px_0px_#000000] dark:bg-rose-950/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border-2 border-black bg-rose-300 p-3 text-neutral-950 shadow-[2px_2px_0px_#000000]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-950 dark:text-white">
                Review Anti-Fraud
              </h1>
              <p className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">
                Tinjau sinyal penyalahgunaan benefit dengan bukti yang tersedia. Keputusan review
                tidak mengubah kredit secara otomatis.
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-rose-300 bg-white px-3 py-1.5 text-sm font-semibold text-rose-900 dark:border-rose-800 dark:bg-neutral-900 dark:text-rose-200">
            {cases.meta.total} kasus
          </span>
        </header>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <AdminTableToolbar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Cari tipe kasus atau ID akun..."
            onReset={resetFilters}
            hasActiveFilters={Boolean(searchQuery) || status !== 'all'}
          >
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter status kasus"
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <option value="all">Semua status</option>
              <option value="open">Perlu ditinjau</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </AdminTableToolbar>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                <tr>
                  <th className="w-14 px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    No
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    Kasus
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    Akun
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    Bukti
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-right font-semibold text-neutral-800 dark:text-neutral-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {cases.data.length ? (
                  cases.data.map((item, index) => (
                    <tr
                      key={item.id}
                      className="align-top hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-4 py-4 font-semibold text-neutral-700 dark:text-neutral-300">
                        {(currentPage - 1) * perPage + index + 1}
                      </td>
                      <td className="px-4 py-4 font-medium text-neutral-900 dark:text-white">
                        <div>{TYPE_LABELS[item.type] ?? humanize(item.type)}</div>
                        <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                          Kasus #{item.id}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-neutral-800 dark:text-neutral-100">
                        {item.userId ? `Akun #${item.userId}` : 'Akun tidak tersedia'}
                      </td>
                      <td className="max-w-sm px-4 py-4 text-sm text-neutral-800 dark:text-neutral-100">
                        <div className="space-y-1">
                          {formatEvidence(item.evidence).map((entry) => (
                            <div key={`${entry.label}-${entry.value}`}>
                              <span className="font-semibold">{entry.label}:</span> {entry.value}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'open' ? 'bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:text-amber-200' : item.status === 'approved' ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200' : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'}`}
                        >
                          {item.status === 'open' ? (
                            <AlertTriangle className="h-3.5 w-3.5" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          {STATUS_LABELS[item.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {item.status === 'open' ? (
                          <div className="inline-flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setReviewing({ id: item.id, status: 'approved' })}
                              className="rounded-lg border border-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-950/30"
                            >
                              Setujui Kasus
                            </button>
                            <button
                              type="button"
                              onClick={() => setReviewing({ id: item.id, status: 'rejected' })}
                              className="rounded-lg border border-rose-600 px-2.5 py-1.5 text-xs font-semibold text-rose-900 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-950/30"
                            >
                              Tolak Kasus
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            Sudah ditinjau
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <ShieldAlert className="mx-auto h-10 w-10 text-neutral-400" />
                      <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">
                        Belum ada kasus yang cocok
                      </p>
                      <p className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">
                        Coba ubah filter atau kata kunci pencarian.
                      </p>
                      {(searchQuery || status !== 'all') && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-3 rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200"
                        >
                          Reset Filter
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <AdminTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={cases.meta.total}
            pageSize={perPage}
            itemLabel="kasus"
            onPageChange={changePage}
            onPageSizeChange={changePageSize}
          />
        </div>
      </div>

      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Konfirmasi Review
                </h2>
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                  Tandai kasus #{reviewing.id} sebagai{' '}
                  {reviewing.status === 'approved' ? 'disetujui' : 'ditolak'}?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewing(null)}
                aria-label="Tutup modal"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewing(null)}
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={review}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${reviewing.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
              >
                {reviewing.status === 'approved' ? 'Setujui Kasus' : 'Tolak Kasus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  )
}
