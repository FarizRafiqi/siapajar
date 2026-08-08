import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { Trash2, Shield } from 'lucide-react'

interface Package {
  id: number
  displayName: string
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

export default function AdminUsersIndex({ users, packages, schools }: AdminUsersIndexProps) {
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

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

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Kelola Pengguna</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Kelola role dan paket semua pengguna
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Sekolah
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Paket
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Belum ada pengguna
                      </p>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Belum ada akun pengguna yang terdaftar di sistem.
                      </p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                        {user.fullName || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.school?.id ?? ''}
                          onChange={(e) => handleSchoolChange(user, e.target.value)}
                          className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        >
                          <option value="">Belum ditautkan</option>
                          {schools.map((school) => (
                            <option key={school.id} value={school.id}>
                              {school.name}
                            </option>
                          ))}
                        </select>
                        {user.educationLevel && (
                          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            {user.educationLevel.toUpperCase()}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user, e.target.value)}
                          className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        >
                          {Object.entries(ROLE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.package?.id ?? ''}
                          onChange={(e) => handlePackageChange(user, e.target.value)}
                          className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        >
                          <option value="">Tanpa paket</option>
                          {packages.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.displayName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
        </div>
      </div>

      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Hapus User?
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              User <strong>{deletingUser.fullName || deletingUser.email}</strong> beserta semua data
              terkait akan dihapus permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingUser(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  )
}
