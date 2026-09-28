import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import {
  AdminSortButton,
  AdminTablePagination,
  AdminTableToolbar,
  type AdminSortDirection,
} from '~/components/dashboard/admin-table'
import { Head, router, useForm } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Pencil, Plus, Trash2, X } from 'lucide-react'
import { cn } from '~/lib/utils'

interface AcademicYear {
  id: number
  name: string
  isActive: boolean
}

interface AdminAcademicYearsIndexProps {
  readonly academicYears: AcademicYear[]
}

type SortField = 'name' | 'status'

export default function AdminAcademicYearsIndex({ academicYears }: AdminAcademicYearsIndexProps) {
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null)
  const [deletingYear, setDeletingYear] = useState<AcademicYear | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [sortBy, setSortBy] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<AdminSortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const form = useForm({ name: '', isActive: true })

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus, sortBy, sortDirection, pageSize])

  const filteredAndSortedYears = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return [...academicYears]
      .filter((year) => {
        const matchesSearch = !query || year.name.toLowerCase().includes(query)
        const matchesStatus =
          filterStatus === 'all' || (filterStatus === 'active' ? year.isActive : !year.isActive)
        return matchesSearch && matchesStatus
      })
      .sort((left, right) => {
        const leftValue = sortBy === 'status' ? String(left.isActive) : left.name
        const rightValue = sortBy === 'status' ? String(right.isActive) : right.name
        const comparison = String(leftValue).localeCompare(String(rightValue), 'id', {
          numeric: true,
          sensitivity: 'base',
        })
        return sortDirection === 'asc' ? comparison : -comparison
      })
  }, [academicYears, searchQuery, filterStatus, sortBy, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedYears.length / pageSize))
  const paginatedYears = filteredAndSortedYears.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDirection(field === 'name' ? 'desc' : 'asc')
    }
  }

  const resetFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
    setSortBy('name')
    setSortDirection('desc')
  }

  const openCreateModal = () => {
    form.clearErrors()
    form.setData({ name: '', isActive: true })
    setEditingYear(null)
    setShowFormModal(true)
  }

  const openEditModal = (year: AcademicYear) => {
    form.clearErrors()
    form.setData({ name: year.name, isActive: year.isActive })
    setEditingYear(year)
    setShowFormModal(true)
  }

  const closeFormModal = () => {
    setShowFormModal(false)
    setEditingYear(null)
    form.reset()
    form.clearErrors()
  }

  const handleSave = (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (editingYear) {
      form.put(`/admin/academic-years/${editingYear.id}`, { onSuccess: closeFormModal })
    } else {
      form.post('/admin/academic-years', { onSuccess: closeFormModal })
    }
  }

  const handleToggleActive = (year: AcademicYear) => {
    router.put(`/admin/academic-years/${year.id}`, { isActive: !year.isActive })
  }

  const handleDelete = () => {
    if (!deletingYear) return
    router.delete(`/admin/academic-years/${deletingYear.id}`, {
      onSuccess: () => setDeletingYear(null),
    })
  }

  return (
    <DashboardWrapper
      title="Tahun Ajaran"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Tahun Ajaran' }]}
    >
      <Head title="Tahun Ajaran" />

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="rounded-2xl border-2 border-black bg-violet-200 p-2.5 text-neutral-950 shadow-[2px_2px_0px_#000000]">
                <CalendarDays className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Tahun Ajaran</h2>
            </div>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              Kelola tahun ajaran yang dapat dipakai oleh seluruh sekolah dan dokumen pembelajaran.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-[3px_3px_0px_#000000] hover:bg-emerald-400"
          >
            <Plus className="h-4 w-4" />
            Tambah Tahun Ajaran
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <AdminTableToolbar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Cari tahun ajaran..."
            onReset={resetFilters}
            hasActiveFilters={Boolean(searchQuery) || filterStatus !== 'all'}
          >
            <select
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(event.target.value as 'all' | 'active' | 'inactive')
              }
              aria-label="Filter status tahun ajaran"
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <option value="all">Semua status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </AdminTableToolbar>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                <tr>
                  <th className="w-14 px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    No
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    <AdminSortButton
                      label="Tahun Ajaran"
                      active={sortBy === 'name'}
                      direction={sortDirection}
                      onClick={() => handleSort('name')}
                    />
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    <AdminSortButton
                      label="Status"
                      active={sortBy === 'status'}
                      direction={sortDirection}
                      onClick={() => handleSort('status')}
                    />
                  </th>
                  <th className="w-28 px-4 py-3.5 text-right font-semibold text-neutral-800 dark:text-neutral-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {filteredAndSortedYears.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center">
                      <CalendarDays className="mx-auto h-10 w-10 text-neutral-400" />
                      <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">
                        {academicYears.length === 0
                          ? 'Belum ada tahun ajaran'
                          : 'Tidak ada tahun ajaran yang cocok'}
                      </p>
                      <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                        {academicYears.length === 0
                          ? 'Tambahkan tahun ajaran agar data pembelajaran dapat dikelola.'
                          : 'Coba ubah kata kunci atau filter.'}
                      </p>
                      {academicYears.length > 0 && (
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
                ) : (
                  paginatedYears.map((year, index) => (
                    <tr
                      key={year.id}
                      className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-4 py-3.5 font-semibold text-neutral-700 dark:text-neutral-300">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-neutral-900 dark:text-white">
                        {year.name}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(year)}
                          className={cn(
                            'rounded-full px-2.5 py-1 text-xs font-semibold',
                            year.isActive
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                              : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                          )}
                        >
                          {year.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(year)}
                            aria-label={`Edit ${year.name}`}
                            title="Edit tahun ajaran"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingYear(year)}
                            aria-label={`Hapus ${year.name}`}
                            title="Hapus tahun ajaran"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 dark:hover:bg-rose-950/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <AdminTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedYears.length}
            pageSize={pageSize}
            itemLabel="tahun ajaran"
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex shrink-0 items-start justify-between border-b border-neutral-200 p-6 dark:border-neutral-800">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {editingYear ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
                </h3>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                  Gunakan format tahun ajaran yang konsisten, misalnya 2026/2027.
                </p>
              </div>
              <button
                type="button"
                onClick={closeFormModal}
                aria-label="Tutup modal"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                <div>
                  <label
                    htmlFor="academic-year-name"
                    className="mb-1.5 block text-sm font-semibold text-neutral-800 dark:text-neutral-200"
                  >
                    Nama Tahun Ajaran
                  </label>
                  <input
                    id="academic-year-name"
                    type="text"
                    value={form.data.name}
                    onChange={(event) => form.setData('name', event.target.value)}
                    placeholder="Contoh: 2026/2027"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  {form.errors.name && (
                    <p className="mt-1 text-sm text-rose-600">{form.errors.name}</p>
                  )}
                </div>
                <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  <input
                    type="checkbox"
                    checked={form.data.isActive}
                    onChange={(event) => form.setData('isActive', event.target.checked)}
                    className="h-4 w-4 shrink-0 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Jadikan aktif
                </label>
              </div>
              <div className="flex shrink-0 justify-end gap-3 border-t border-neutral-200 p-6 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={form.processing}
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {form.processing ? 'Menyimpan...' : editingYear ? 'Simpan Perubahan' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Tahun Ajaran?
            </h3>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              Tahun ajaran <strong>{deletingYear.name}</strong> beserta data kelas dan dokumen yang
              bergantung padanya dapat terpengaruh.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingYear(null)}
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Hapus Tahun Ajaran
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  )
}
