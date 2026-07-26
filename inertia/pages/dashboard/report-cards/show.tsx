import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Download, Trophy } from 'lucide-react'

interface AcademicYear {
  id: number
  name: string
}

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface Semester {
  id: number
  name: string
  academicYear: AcademicYear
}

interface SubjectAverage {
  subject: string
  average: number | null
}

interface StudentReport {
  studentId: number
  nis: string
  fullName: string
  subjects: SubjectAverage[]
  overallAverage: number | null
  rank: number | null
}

interface NarrativeEntry {
  type: string
  typeLabel: string
  date: string
  content: Record<string, unknown>
}

interface PaudStudentNarrative {
  studentId: number
  nis: string
  fullName: string
  entries: NarrativeEntry[]
}

interface ReportCardShowProps {
  readonly mode: 'numeric' | 'narrative'
  readonly schoolClass: SchoolClass
  readonly semester: Semester
  readonly report?: { subjects: string[]; students: StudentReport[] }
  readonly narrative?: PaudStudentNarrative[]
}

function formatEntry(entry: NarrativeEntry) {
  const c = entry.content
  switch (entry.type) {
    case 'checklist': {
      const indicators = Array.isArray(c.indicators) ? (c.indicators as string[]) : []
      return [indicators.join(', '), typeof c.note === 'string' ? c.note : '']
        .filter(Boolean)
        .join(' — ')
    }
    case 'anecdotal_note':
      return `${c.context ?? '-'} — ${c.behavior ?? '-'} — ${c.analysis ?? '-'}`
    case 'work_sample':
      return `${c.photoDescription ?? '-'} — ${c.description ?? ''}`
    case 'photo_series':
      return `${c.activity ?? '-'} — ${c.narrative ?? ''}`
    default:
      return ''
  }
}

export default function ReportCardShow({
  mode,
  schoolClass,
  semester,
  report,
  narrative,
}: ReportCardShowProps) {
  const semesterLabel = `${semester.name} ${semester.academicYear.name}`
  const backHref = '/report-cards'

  return (
    <DashboardWrapper
      title={`Rapor — ${schoolClass.name}`}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Rapor & Peringkat', href: '/report-cards' },
        { label: schoolClass.name },
      ]}
    >
      <Head title={`Rapor — ${schoolClass.name}`} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href={backHref}
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Rapor — {schoolClass.name}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">{semesterLabel}</p>
          </div>
        </div>

        {mode === 'numeric' && report && (
          <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Peringkat
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      NIS
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Nama
                    </th>
                    {report.subjects.map((subject) => (
                      <th
                        key={subject}
                        className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400"
                      >
                        {subject}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Rata-rata
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Rapor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.students.map((student) => (
                    <tr
                      key={student.studentId}
                      className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                    >
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                        {student.rank === null ? (
                          '-'
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            {student.rank <= 3 && <Trophy className="h-3.5 w-3.5 text-amber-500" />}
                            {student.rank}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {student.nis}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                        {student.fullName}
                      </td>
                      {student.subjects.map((s) => (
                        <td
                          key={s.subject}
                          className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300"
                        >
                          {s.average === null ? '-' : s.average.toFixed(1)}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-sm font-semibold text-neutral-900 dark:text-white">
                        {student.overallAverage === null ? '-' : student.overallAverage.toFixed(1)}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/report-cards/${schoolClass.id}/${semester.id}/${student.studentId}/export`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {mode === 'narrative' && narrative && (
          <div className="space-y-4">
            {narrative.map((student) => (
              <div
                key={student.studentId}
                className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {student.fullName}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      NIS: {student.nis}
                    </p>
                  </div>
                  <a
                    href={`/report-cards/${schoolClass.id}/${semester.id}/${student.studentId}/export`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </a>
                </div>
                {student.entries.length === 0 ? (
                  <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                    Belum ada asesmen pada semester ini.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                    {student.entries.map((entry, i) => (
                      <li key={i}>
                        <span className="font-medium">{entry.typeLabel}</span>{' '}
                        <span className="text-neutral-500 dark:text-neutral-400">
                          ({new Date(entry.date).toLocaleDateString('id-ID')})
                        </span>
                        <p className="mt-0.5">{formatEntry(entry)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
