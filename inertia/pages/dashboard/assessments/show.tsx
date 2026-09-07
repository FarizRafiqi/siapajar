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
        {/* Header toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/assessments"
              className="btn-kawaii-secondary !p-2.5 !rounded-2xl"
              title="Kembali ke Daftar Penilaian"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {assessment.title}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {assessment.subject} • Kelas {assessment.schoolClass.name} •{' '}
                {new Date(assessment.date).toLocaleDateString('id-ID')} •{' '}
                <span className="font-bold text-neutral-900 dark:text-white">
                  {filledCount} dari {totalCount} terisi
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="btn-kawaii-secondary !py-2.5 !px-3.5 !text-xs font-bold"
            >
              <Download className="h-4 w-4" />
              Export XLSX
            </button>
            <a
              href={`/assessments/${assessment.id}/export/pdf?disposition=inline`}
              target="_blank"
              rel="noreferrer"
              className="btn-kawaii-secondary !py-2.5 !px-3.5 !text-xs font-bold"
            >
              <Download className="h-4 w-4" /> PDF
            </a>
            <a
              href={`/assessments/${assessment.id}/export/docx`}
              className="btn-kawaii-secondary !py-2.5 !px-3.5 !text-xs font-bold"
            >
              DOCX
            </a>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="btn-kawaii-primary !py-2.5 !px-4 !text-xs font-bold disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Menyimpan...' : 'Simpan Semua'}
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0px_#000000] dark:border-white dark:bg-neutral-900 dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-black bg-emerald-100 dark:border-white dark:bg-neutral-800">
                  <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                    No
                  </th>
                  <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                    NIS
                  </th>
                  <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                    Nama Siswa
                  </th>
                  <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                    Nilai (0 - 100)
                  </th>
                  <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                    Catatan Perkembangan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10 dark:divide-white/10">
                {assessment.scores.map((score, index) => (
                  <tr
                    key={score.id}
                    className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                  >
                    <td className="px-4 py-3 text-sm font-bold text-neutral-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      {score.student.nis}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-neutral-900 dark:text-white">
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
                        className="w-24 rounded-xl border-2 border-black bg-white px-3 py-1.5 text-sm font-black text-neutral-900 focus:shadow-[2px_2px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white dark:focus:shadow-[2px_2px_0px_#ffffff]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={values[score.studentId]?.note ?? ''}
                        onChange={(e) => handleNoteChange(score.studentId, e.target.value)}
                        onBlur={handleSaveAll}
                        className="w-full min-w-[200px] rounded-xl border-2 border-black bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:shadow-[2px_2px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white dark:focus:shadow-[2px_2px_0px_#ffffff]"
                        placeholder="Tambahkan catatan (opsional)..."
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
