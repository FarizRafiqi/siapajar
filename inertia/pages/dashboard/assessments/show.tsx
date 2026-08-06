import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, Link } from '@inertiajs/react'
import { useRef, useState } from 'react'
import { ArrowLeft, Download, Save } from 'lucide-react'

interface SchoolClass {
  id: number
  name: string
}

interface Student {
  id: number
  nis: string
  fullName: string
}

interface Score {
  id: number
  studentId: number
  value: number | null
  note: string | null
  student: Student
}

interface Assessment {
  id: number
  title: string
  subject: string
  type: 'formative' | 'summative'
  learningObjective: string | null
  date: string
  schoolClass: SchoolClass
  scores: Score[]
}

interface AssessmentShowProps {
  readonly assessment: Assessment
}

export default function AssessmentShow({ assessment }: AssessmentShowProps) {
  const [values, setValues] = useState<Record<number, { value: string; note: string }>>(() => {
    const initial: Record<number, { value: string; note: string }> = {}
    for (const s of assessment.scores) {
      initial[s.studentId] = { value: s.value === null ? '' : String(s.value), note: s.note ?? '' }
    }
    return initial
  })
  const [saving, setSaving] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const filledCount = Object.values(values).filter((v) => v.value !== '').length
  const totalCount = assessment.scores.length

  const handleValueChange = (studentId: number, value: string) => {
    setValues((prev) => ({ ...prev, [studentId]: { ...prev[studentId], value } }))
  }

  const handleNoteChange = (studentId: number, note: string) => {
    setValues((prev) => ({ ...prev, [studentId]: { ...prev[studentId], note } }))
  }

  const handleSaveAll = () => {
    setSaving(true)
    router.put(
      `/assessments/${assessment.id}/scores`,
      {
        scores: assessment.scores.map((s) => ({
          studentId: s.studentId,
          value: values[s.studentId]?.value === '' ? null : Number(values[s.studentId]?.value),
          note: values[s.studentId]?.note || null,
        })),
      },
      {
        preserveScroll: true,
        onFinish: () => setSaving(false),
      }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const next = inputRefs.current[index + 1]
      if (next) {
        next.focus()
      } else {
        handleSaveAll()
      }
    }
  }

  const handleExport = () => {
    window.location.href = `/assessments/${assessment.id}/export`
  }

  return (
    <DashboardWrapper
      title={assessment.title}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Penilaian', href: '/assessments' },
        { label: assessment.title },
      ]}
    >
      <Head title={assessment.title} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/assessments"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {assessment.title}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {assessment.subject} • Kelas {assessment.schoolClass.name} •{' '}
              {new Date(assessment.date).toLocaleDateString('id-ID')} • {filledCount} dari{' '}
              {totalCount} terisi
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Download className="h-4 w-4" />
            Export XLSX
          </button>
          <a
            href={`/assessments/${assessment.id}/export/pdf?disposition=inline`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Download className="h-4 w-4" /> PDF
          </a>
          <a
            href={`/assessments/${assessment.id}/export/docx`}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            DOCX
          </a>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    NIS
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Nilai
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody>
                {assessment.scores.map((score, index) => (
                  <tr
                    key={score.id}
                    className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                  >
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {score.student.nis}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                      {score.student.fullName}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        ref={(el) => {
                          inputRefs.current[index] = el
                        }}
                        type="number"
                        min={0}
                        max={100}
                        value={values[score.studentId]?.value ?? ''}
                        onChange={(e) => handleValueChange(score.studentId, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onBlur={handleSaveAll}
                        className="w-20 rounded-lg border border-neutral-300 px-2 py-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={values[score.studentId]?.note ?? ''}
                        onChange={(e) => handleNoteChange(score.studentId, e.target.value)}
                        onBlur={handleSaveAll}
                        className="w-full min-w-[160px] rounded-lg border border-neutral-300 px-2 py-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        placeholder="opsional"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  )
}
