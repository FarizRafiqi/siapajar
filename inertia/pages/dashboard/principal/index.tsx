import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, Link } from '@inertiajs/react'
import { Users, GraduationCap, ArrowRight, School } from 'lucide-react'

interface Teacher {
  id: number
  fullName: string | null
  email: string
  educationLevel: string | null
  classCount: number
  studentCount: number
}

interface PrincipalIndexProps {
  readonly school: { id: number; name: string | null } | null
  readonly teachers: Teacher[]
}

export default function PrincipalIndex({ school, teachers }: PrincipalIndexProps) {
  return (
    <DashboardWrapper title="Dashboard Kepala Sekolah" breadcrumbs={[{ label: 'Dashboard' }]}>
      <Head title="Dashboard Kepala Sekolah" />

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <School className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {school?.name || 'Sekolah Anda'}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Pantauan guru, kelas, dan siswa di sekolah Anda (khusus baca)
            </p>
          </div>
        </div>

        {!school && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Akun Anda belum terhubung ke sekolah manapun. Hubungi admin untuk menautkan sekolah
              Anda.
            </p>
          </div>
        )}

        {school && teachers.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <Users className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada guru
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Belum ada guru yang terdaftar di sekolah ini.
            </p>
          </div>
        )}

        {teachers.length > 0 && (
          <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Nama Guru
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Jenjang
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Kelas
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Siswa
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {teacher.fullName || '-'}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {teacher.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {teacher.educationLevel ? teacher.educationLevel.toUpperCase() : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        <span className="inline-flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {teacher.classCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        {teacher.studentCount}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/principal/teachers/${teacher.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                          Lihat Kelas
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
