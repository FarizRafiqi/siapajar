import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import {
  AdminSortButton,
  AdminTablePagination,
  AdminTableToolbar,
  type AdminSortDirection,
} from '~/components/dashboard/admin-table'
import { Head, router } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'
import { Shield, Trash2, UserRound, X } from 'lucide-react'

interface Package {
  id: number
  displayName: string
  isActive?: boolean
}

interface School {
  id: number
  name: string
}

interface User {
  id: number
  fullName: string | null
  email: string
  role: string
  schoolName: string | null
  educationLevel: string | null
  package: Package | null
  school: School | null
}

interface AdminUsersIndexProps {
  readonly users: User[]
  readonly packages: Package[]
  readonly schools: School[]
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  guru: 'Guru',
  kepala_sekolah: 'Kepala Sekolah',
}

function humanize(value: string) {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}

type SortField = 'name' | 'email' | 'role'

export default function AdminUsersIndex({ users, packages, schools }: AdminUsersIndexProps) {
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterSchool, setFilterSchool] = useState('all')
  const [filterPackage, setFilterPackage] = useState('all')
  const [sortBy, setSortBy] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<AdminSortDirection>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterRole, filterSchool, filterPackage, sortBy, sortDirection, pageSize])

  const filteredAndSortedUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return [...users]
      .filter((user) => {
        const matchesSearch =
          !query ||
          [
            user.fullName ?? '',
            user.email,
            user.school?.name ?? user.schoolName ?? '',
            ROLE_LABELS[user.role] ?? humanize(user.role),
          ]
            .join(' ')
            .toLowerCase()
            .includes(query)
        const matchesRole = filterRole === 'all' || user.role === filterRole
        const matchesSchool =
          filterSchool === 'all' || String(user.school?.id ?? '') === filterSchool
        const matchesPackage =
          filterPackage === 'all' || String(user.package?.id ?? '') === filterPackage
        return matchesSearch && matchesRole && matchesSchool && matchesPackage
      })
      .sort((left, right) => {
        const leftValue =
          sortBy === 'email'
            ? left.email
            : sortBy === 'role'
              ? (ROLE_LABELS[left.role] ?? humanize(left.role))
              : (left.fullName ?? left.email)
        const rightValue =
          sortBy === 'email'
            ? right.email
            : sortBy === 'role'
              ? (ROLE_LABELS[right.role] ?? humanize(right.role))
              : (right.fullName ?? right.email)
        const comparison = String(leftValue).localeCompare(String(rightValue), 'id', {
          numeric: true,
          sensitivity: 'base',
        })
        return sortDirection === 'asc' ? comparison : -comparison
      })
  }, [users, searchQuery, filterRole, filterSchool, filterPackage, sortBy, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedUsers.length / pageSize))
  const paginatedUsers = filteredAndSortedUsers.slice(
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
    setFilterRole('all')
    setFilterSchool('all')
    setFilterPackage('all')
    setSortBy('name')
    setSortDirection('asc')
  }

  const handleRoleChange = (user: User, role: string) => {
    router.put(`/admin/users/${user.id}`, {
      role,
      packageId: user.package?.id ?? null,
      schoolId: user.school?.id ?? null,
    })
  }

  const handlePackageChange = (user: User, packageId: string) => {
    router.put(`/admin/users/${user.id}`, {
      role: user.role,
      packageId: packageId ? Number(packageId) : null,
      schoolId: user.school?.id ?? null,
    })
  }

  const handleSchoolChange = (user: User, schoolId: string) => {
    router.put(`/admin/users/${user.id}`, {
      role: user.role,
      packageId: user.package?.id ?? null,
      schoolId: schoolId ? Number(schoolId) : null,
    })
  }

  const handleDelete = () => {
    if (!deletingUser) return
    router.delete(`/admin/users/${deletingUser.id}`, {
      onSuccess: () => setDeletingUser(null),
    })
  }

  return (
    <DashboardWrapper
      title="Kelola Pengguna"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Kelola Pengguna' }]}
    >
      <Head title="Kelola Pengguna" />

      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-2xl border-2 border-black bg-sky-200 p-2.5 text-neutral-950 shadow-[2px_2px_0px_#000000]">
              <UserRound className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Kelola Pengguna</h2>
          </div>
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
            Kelola role, sekolah, dan paket setiap pengguna. Penautan kepala sekolah dilakukan
            melalui role dan sekolah pada baris yang sama.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <AdminTableToolbar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Cari nama, email, sekolah, atau role..."
            onReset={resetFilters}
            hasActiveFilters={
              Boolean(searchQuery) ||
              filterRole !== 'all' ||
              filterSchool !== 'all' ||
              filterPackage !== 'all'
            }
          >
            <select
              value={filterRole}
              onChange={(event) => setFilterRole(event.target.value)}
              aria-label="Filter role"
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <option value="all">Semua role</option>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={filterSchool}
              onChange={(event) => setFilterSchool(event.target.value)}
              aria-label="Filter sekolah"
              className="max-w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <option value="all">Semua sekolah</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
            <select
              value={filterPackage}
              onChange={(event) => setFilterPackage(event.target.value)}
              aria-label="Filter paket"
              className="max-w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <option value="all">Semua paket</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.displayName}
                  {pkg.isActive === false ? ' (nonaktif)' : ''}
                </option>
              ))}
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
                      label="Nama"
                      active={sortBy === 'name'}
                      direction={sortDirection}
                      onClick={() => handleSort('name')}
                    />
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    <AdminSortButton
                      label="Email"
                      active={sortBy === 'email'}
                      direction={sortDirection}
                      onClick={() => handleSort('email')}
                    />
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    Sekolah
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    <AdminSortButton
                      label="Role"
                      active={sortBy === 'role'}
                      direction={sortDirection}
                      onClick={() => handleSort('role')}
                    />
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    Paket
                  </th>
                  <th className="w-24 px-4 py-3.5 text-right font-semibold text-neutral-800 dark:text-neutral-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {filteredAndSortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <UserRound className="mx-auto h-10 w-10 text-neutral-400" />
                      <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">
                        {users.length === 0
                          ? 'Belum ada pengguna'
                          : 'Tidak ada pengguna yang cocok'}
                      </p>
                      <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                        {users.length === 0
                          ? 'Akun pengguna yang terdaftar akan tampil di sini.'
                          : 'Coba ubah kata kunci atau filter.'}
                      </p>
                      {users.length > 0 && (
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
                  paginatedUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-4 py-3.5 font-semibold text-neutral-700 dark:text-neutral-300">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-neutral-900 dark:text-white">
                        {user.fullName || 'Belum diisi'}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-700 dark:text-neutral-300">
                        {user.email}
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={user.school?.id ?? ''}
                          onChange={(event) => handleSchoolChange(user, event.target.value)}
                          aria-label={`Sekolah untuk ${user.fullName || user.email}`}
                          className="max-w-56 rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        >
                          <option value="">Belum ditautkan</option>
                          {schools.map((school) => (
                            <option key={school.id} value={school.id}>
                              {school.name}
                            </option>
                          ))}
                        </select>
                        {user.educationLevel && (
                          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                            Jenjang: {user.educationLevel.toUpperCase()}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={user.role}
                          onChange={(event) => handleRoleChange(user, event.target.value)}
                          aria-label={`Role untuk ${user.fullName || user.email}`}
                          className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        >
                          {Object.entries(ROLE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={user.package?.id ?? ''}
                          onChange={(event) => handlePackageChange(user, event.target.value)}
                          aria-label={`Paket untuk ${user.fullName || user.email}`}
                          className="max-w-48 rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        >
                          <option value="">Tanpa paket</option>
                          {packages.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>
                              {pkg.displayName}
                              {pkg.isActive === false ? ' (nonaktif)' : ''}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setDeletingUser(user)}
                          aria-label={`Hapus ${user.fullName || user.email}`}
                          title="Hapus pengguna"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
            totalItems={filteredAndSortedUsers.length}
            pageSize={pageSize}
            itemLabel="pengguna"
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-2.5">
              <Shield className="h-5 w-5 text-rose-600" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Hapus Pengguna?
              </h3>
            </div>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              Pengguna <strong>{deletingUser.fullName || deletingUser.email}</strong> beserta data
              terkait akan dihapus permanen.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Hapus Pengguna
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  )
}
