import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Users } from 'lucide-react'

interface AcademicYear {
  id: number
  name: string
}

interface Student {
  id: number
  nis: string
  fullName: string
}

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
  academicYear: AcademicYear
  students: Student[]
}

interface Teacher {
  id: number
  fullName: string | null
  email: string
  educationLevel: string | null
}

interface PrincipalTeacherProps {
  readonly teacher: Teacher
  readonly classes: SchoolClass[]
}

export default function PrincipalTeacher({ teacher, classes }: PrincipalTeacherProps) {
  return (
    <DashboardWrapper
      title={teacher.fullName || teacher.email}
      breadcrumbs={[
        { label: 'Dashboard', href: '/principal' },
        { label: teacher.fullName || teacher.email },
      ]}
    >
      <Head title={teacher.fullName || teacher.email} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/principal"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {teacher.fullName || '-'}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {teacher.email} •{' '}
              {teacher.educationLevel
                ? teacher.educationLevel.toUpperCase()
                : 'Jenjang belum diisi'}
            </p>
          </div>
        </div>

        {classes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <Users className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada kelas
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map((schoolClass) => (
              <div
                key={schoolClass.id}
                className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">
                    {schoolClass.name} — {schoolClass.academicYear.name}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {schoolClass.students.length} siswa
                  </p>
                </div>
                {schoolClass.students.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-100 dark:border-neutral-800">
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            NIS
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            Nama
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {schoolClass.students.map((student) => (
                          <tr
                            key={student.id}
                            className="border-b border-neutral-50 last:border-0 dark:border-neutral-900"
                          >
                            <td className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400">
                              {student.nis}
                            </td>
                            <td className="px-4 py-2 text-sm text-neutral-900 dark:text-white">
                              {student.fullName}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
