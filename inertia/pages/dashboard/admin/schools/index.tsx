import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import {
  AdminSortButton,
  AdminTablePagination,
  AdminTableToolbar,
  type AdminSortDirection,
} from '~/components/dashboard/admin-table'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'
import { Building2, Pencil, Plus, Trash2, Users, X } from 'lucide-react'

interface School {
  id: number
  name: string
  npsn: string | null
  userCount: number
}

interface AdminSchoolsIndexProps {
  readonly schools: School[]
}

type SortField = 'name' | 'npsn' | 'users'

export default function AdminSchoolsIndex({ schools }: AdminSchoolsIndexProps) {
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingSchool, setEditingSchool] = useState<School | null>(null)
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<AdminSortDirection>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const form = useForm({ name: '', npsn: '' })

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortBy, sortDirection, pageSize])

  const filteredAndSortedSchools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return [...schools]
      .filter(
        (school) => !query || `${school.name} ${school.npsn ?? ''}`.toLowerCase().includes(query)
      )
      .sort((left, right) => {
        const leftValue =
          sortBy === 'users' ? left.userCount : sortBy === 'npsn' ? (left.npsn ?? '') : left.name
        const rightValue =
          sortBy === 'users' ? right.userCount : sortBy === 'npsn' ? (right.npsn ?? '') : right.name
        const comparison =
          typeof leftValue === 'number' && typeof rightValue === 'number'
            ? leftValue - rightValue
            : String(leftValue).localeCompare(String(rightValue), 'id', {
                numeric: true,
                sensitivity: 'base',
              })
        return sortDirection === 'asc' ? comparison : -comparison
      })
  }, [schools, searchQuery, sortBy, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedSchools.length / pageSize))
  const paginatedSchools = filteredAndSortedSchools.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDirection('asc')
    }
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSortBy('name')
    setSortDirection('asc')
  }

  const openCreateModal = () => {
    form.clearErrors()
    form.reset()
    setEditingSchool(null)
    setShowFormModal(true)
  }

  const openEditModal = (school: School) => {
    form.clearErrors()
    form.setData({ name: school.name, npsn: school.npsn ?? '' })
    setEditingSchool(school)
    setShowFormModal(true)
  }

  const closeFormModal = () => {
    setShowFormModal(false)
    setEditingSchool(null)
    form.reset()
    form.clearErrors()
  }

  const handleSave = (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (editingSchool) {
      form.put(`/admin/schools/${editingSchool.id}`, { onSuccess: closeFormModal })
    } else {
      form.post('/admin/schools', { onSuccess: closeFormModal })
    }
  }

  const handleDelete = () => {
    if (!deletingSchool) return
    router.delete(`/admin/schools/${deletingSchool.id}`, {
      onSuccess: () => setDeletingSchool(null),
    })
  }

  return (
    <DashboardWrapper
      title="Sekolah"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Sekolah' }]}
    >
      <Head title="Sekolah" />

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="rounded-2xl border-2 border-black bg-amber-200 p-2.5 text-neutral-950 shadow-[2px_2px_0px_#000000]">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Sekolah</h2>
            </div>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              Kelola master sekolah dan lihat anggota yang tertaut ke masing-masing sekolah.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-[3px_3px_0px_#000000] transition hover:bg-emerald-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000]"
          >
            <Plus className="h-4 w-4" />
            Tambah Sekolah
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Penautan guru dan kepala sekolah dilakukan di halaman <strong>Kelola Pengguna</strong>.
            Gunakan jumlah anggota di tabel untuk memantau hasil penautan.
          </p>
          <Link
            href="/admin/users"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-emerald-700 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-400 dark:text-emerald-100 dark:hover:bg-emerald-900/40"
          >
            Kelola Pengguna
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <AdminTableToolbar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Cari nama sekolah atau NPSN..."
            onReset={resetFilters}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                <tr>
                  <th className="w-14 px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    No
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    <AdminSortButton
                      label="Nama Sekolah"
                      active={sortBy === 'name'}
                      direction={sortDirection}
                      onClick={() => handleSort('name')}
                    />
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    <AdminSortButton
                      label="NPSN"
                      active={sortBy === 'npsn'}
                      direction={sortDirection}
                      onClick={() => handleSort('npsn')}
                    />
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    <AdminSortButton
                      label="Anggota"
                      active={sortBy === 'users'}
                      direction={sortDirection}
                      onClick={() => handleSort('users')}
                    />
                  </th>
                  <th className="w-28 px-4 py-3.5 text-right font-semibold text-neutral-800 dark:text-neutral-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {filteredAndSortedSchools.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <Building2 className="mx-auto h-10 w-10 text-neutral-400" />
                      <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">
                        {schools.length === 0
                          ? 'Belum ada sekolah'
                          : 'Tidak ada sekolah yang cocok'}
                      </p>
                      <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                        {schools.length === 0
                          ? 'Tambahkan sekolah pertama untuk mulai menautkan pengguna.'
                          : 'Coba ubah kata kunci atau reset filter.'}
                      </p>
                      {schools.length > 0 && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-3 rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                        >
                          Reset Filter
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  paginatedSchools.map((school, index) => (
                    <tr
                      key={school.id}
                      className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-4 py-3.5 font-semibold text-neutral-700 dark:text-neutral-300">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-neutral-900 dark:text-white">
                        {school.name}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-700 dark:text-neutral-300">
                        {school.npsn || 'Belum diisi'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-900 dark:bg-sky-950/60 dark:text-sky-200">
                          <Users className="h-3.5 w-3.5" />
                          {school.userCount} pengguna
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(school)}
                            aria-label={`Edit ${school.name}`}
                            title="Edit sekolah"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingSchool(school)}
                            aria-label={`Hapus ${school.name}`}
                            title="Hapus sekolah"
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
            totalItems={filteredAndSortedSchools.length}
            pageSize={pageSize}
            itemLabel="sekolah"
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
                  {editingSchool ? 'Edit Sekolah' : 'Tambah Sekolah'}
                </h3>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                  Data ini menjadi master untuk penautan pengguna.
                </p>
              </div>
              <button
                type="button"
                onClick={closeFormModal}
                aria-label="Tutup modal"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                <div>
                  <label
                    htmlFor="school-name"
                    className="mb-1.5 block text-sm font-semibold text-neutral-800 dark:text-neutral-200"
                  >
                    Nama Sekolah
                  </label>
                  <input
                    id="school-name"
                    type="text"
                    value={form.data.name}
                    onChange={(event) => form.setData('name', event.target.value)}
                    placeholder="Contoh: SD Negeri 1 Jakarta"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  {form.errors.name && (
                    <p className="mt-1 text-sm text-rose-600">{form.errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="school-npsn"
                    className="mb-1.5 block text-sm font-semibold text-neutral-800 dark:text-neutral-200"
                  >
                    NPSN <span className="font-normal text-neutral-600">(opsional)</span>
                  </label>
                  <input
                    id="school-npsn"
                    type="text"
                    value={form.data.npsn}
                    onChange={(event) => form.setData('npsn', event.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  {form.errors.npsn && (
                    <p className="mt-1 text-sm text-rose-600">{form.errors.npsn}</p>
                  )}
                </div>
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
                  {form.processing ? 'Menyimpan...' : editingSchool ? 'Simpan Perubahan' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Sekolah?
            </h3>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              Sekolah <strong>{deletingSchool.name}</strong> akan dihapus. Tautan sekolah pada
              pengguna akan dikosongkan, tetapi akun dan dokumen mereka tetap aman.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingSchool(null)}
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Hapus Sekolah
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  )
}
