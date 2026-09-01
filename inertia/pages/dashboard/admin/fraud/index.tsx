import { Head, router } from '@inertiajs/react'
import { ShieldAlert } from 'lucide-react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'

type FraudCase = {
  id: number
  type: string
  status: string
  evidence: Record<string, unknown>
  createdAt: string
  userId: number | null
}
type Props = { cases: { data: FraudCase[]; meta: { total: number } }; filters: { status: string } }

export default function AdminFraudIndex({ cases, filters }: Props) {
  const review = (id: number, status: 'approved' | 'rejected') =>
    router.put(`/admin/fraud-cases/${id}`, { status })
  return (
    <DashboardWrapper
      title="Review Anti-Fraud"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Review Anti-Fraud' }]}
    >
      <Head title="Review Anti-Fraud — SiapAjar" />
      <div className="space-y-6">
        <header className="flex items-center gap-3">
          <ShieldAlert className="h-7 w-7 text-rose-700" />
          <div>
            <h1 className="text-2xl font-bold text-neutral-950 dark:text-white">
              Review Anti-Fraud
            </h1>
            <p className="text-sm text-neutral-800 dark:text-neutral-100">
              Tinjau sinyal abuse tanpa mengubah kredit atau entitlement secara otomatis.
            </p>
          </div>
        </header>
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-900 dark:border-neutral-800 dark:text-white">
              <tr>
                <th className="p-3">Kasus</th>
                <th className="p-3">Akun</th>
                <th className="p-3">Bukti</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cases.data.length ? (
                cases.data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-neutral-100 align-top hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                  >
                    <td className="p-3 font-medium text-neutral-900 dark:text-white">
                      {item.type}
                    </td>
                    <td className="p-3 text-neutral-800 dark:text-neutral-100">
                      #{item.userId ?? '—'}
                    </td>
                    <td className="max-w-sm p-3 text-xs text-neutral-800 dark:text-neutral-100">
                      <code className="break-words">{JSON.stringify(item.evidence)}</code>
                    </td>
                    <td className="p-3 text-neutral-900 dark:text-white">{item.status}</td>
                    <td className="p-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => review(item.id, 'approved')}
                          className="rounded-lg border border-emerald-600 px-2 py-1 text-xs font-semibold text-emerald-800"
                        >
                          Tinjau valid
                        </button>
                        <button
                          onClick={() => review(item.id, 'rejected')}
                          className="rounded-lg border border-rose-600 px-2 py-1 text-xs font-semibold text-rose-800"
                        >
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-neutral-800 dark:text-neutral-100"
                  >
                    Belum ada kasus yang perlu ditinjau.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-neutral-800 dark:text-neutral-100">
          {cases.meta.total} kasus{' '}
          {filters.status !== 'all' ? `dengan status ${filters.status}` : ''}
        </p>
      </div>
    </DashboardWrapper>
  )
}
