import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, Link } from '@inertiajs/react'
import { useState } from 'react'
import { Award, ArrowRight } from 'lucide-react'

interface AcademicYear {
  id: number
  name: string
}

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
  academicYear: AcademicYear
}

interface Semester {
  id: number
  name: string
  isActive: boolean
  academicYear: AcademicYear
}

interface ReportCardsIndexProps {
  readonly classes: SchoolClass[]
  readonly semesters: Semester[]
  readonly isTk: boolean
}

export default function ReportCardsIndex({ classes, semesters, isTk }: ReportCardsIndexProps) {
  const [classId, setClassId] = useState<number | ''>(classes[0]?.id ?? '')
  const [semesterId, setSemesterId] = useState<number | ''>(
    semesters.find((s) => s.isActive)?.id ?? semesters[0]?.id ?? ''
  )

  const canView = classId !== '' && semesterId !== ''
  const hasClasses = classes.length > 0
  const hasSemesters = semesters.length > 0

  return (
    <DashboardWrapper
      title="Rapor & Peringkat"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Rapor & Peringkat' }]}
    >
      <Head title="Rapor & Peringkat" />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Rapor & Peringkat</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            {isTk
              ? 'Ringkasan perkembangan siswa per semester berdasarkan asesmen PAUD'
              : 'Rata-rata nilai per mata pelajaran dan peringkat kelas per semester'}
          </p>
        </div>

        {(!hasClasses || !hasSemesters) && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              {!hasClasses ? 'Buat kelas terlebih dahulu.' : 'Belum ada semester yang tersedia.'}
            </p>
          </div>
        )}

        {hasClasses && hasSemesters && (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="classId"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {isTk ? 'Kelompok' : 'Kelas'}
                </label>
                <select
                  id="classId"
                  value={classId}
                  onChange={(e) => setClassId(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.academicYear.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="semesterId"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Semester
                </label>
                <select
                  id="semesterId"
                  value={semesterId}
                  onChange={(e) => setSemesterId(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.academicYear.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Link
              href={canView ? `/report-cards/${classId}/${semesterId}` : '#'}
              className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              aria-disabled={!canView}
            >
              <Award className="h-4 w-4" />
              Lihat Rapor & Peringkat
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
