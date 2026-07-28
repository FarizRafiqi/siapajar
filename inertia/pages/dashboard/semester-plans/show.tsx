import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, useForm, Link } from '@inertiajs/react'
import { useState } from 'react'
import { ArrowLeft, Download, Pencil, Save, X } from 'lucide-react'

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface Semester {
  id: number
  name: string
  academicYear: {
    name: string
  }
}

interface SemesterPlanContent {
  minggu?: string[]
  kegiatan?: string[]
  target?: string[]
  materi?: string[]
  [key: string]: string[] | undefined
}

interface SemesterPlan {
  id: number
  subject: string
  content: SemesterPlanContent
  createdAt: string
  schoolClass: SchoolClass
  semester: Semester
}

interface SemesterPlanShowProps {
  readonly semesterPlan: SemesterPlan
}

const SECTIONS = [
  { key: 'minggu', title: 'Pembagian Minggu', icon: '📅' },
  { key: 'kegiatan', title: 'Kegiatan Pembelajaran', icon: '📝' },
  { key: 'target', title: 'Target Pembelajaran', icon: '🎯' },
  { key: 'materi', title: 'Materi Pembelajaran', icon: '📚' },
]

export default function SemesterPlanShow({ semesterPlan }: SemesterPlanShowProps) {
  const [editing, setEditing] = useState(false)

  const { data, setData, put, processing, reset } = useForm({
    subject: semesterPlan.subject,
    content: semesterPlan.content ?? {},
  })

  const handleSave = () => {
    put(`/semester-plans/${semesterPlan.id}`, {
      onSuccess: () => setEditing(false),
    })
  }

  const handleCancelEdit = () => {
    reset()
    setEditing(false)
  }

  const handleExport = () => {
    window.location.href = `/semester-plans/${semesterPlan.id}/export`
  }

  const handleExportPdf = () => {
    window.location.href = `/semester-plans/${semesterPlan.id}/export/pdf`
  }

  return (
    <DashboardWrapper
      title={`Promes — ${semesterPlan.subject}`}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Promes', href: '/semester-plans' },
        { label: semesterPlan.subject },
      ]}
    >
      <Head title={`Promes — ${semesterPlan.subject}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/semester-plans"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Program Semester — {semesterPlan.subject}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Kelas {semesterPlan.schoolClass.name} • {semesterPlan.semester.name}{' '}
              {semesterPlan.semester.academicYear.name}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Download className="h-4 w-4" />
              Export DOCX
            </button>
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            {editing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  <X className="h-4 w-4" />
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={processing}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {processing ? 'Menyimpan...' : 'Simpan'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Isi Promes */}
        <div className="space-y-4">
          {SECTIONS.map((section) => {
            const items = semesterPlan.content?.[section.key] ?? []
            const draftItems = data.content?.[section.key] ?? []

            return (
              <div key={section.key} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                  <span>{section.icon}</span>
                  {section.title}
                </h3>
                {editing ? (
                  <textarea
                    value={draftItems.join('\n')}
                    onChange={(e) =>
                      setData('content', {
                        ...data.content,
                        [section.key]: e.target.value.split('\n').filter((line) => line.trim()),
                      })
                    }
                    rows={6}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    placeholder={`Masukkan ${section.title.toLowerCase()} (satu item per baris)`}
                  />
                ) : (
                  <ul className="space-y-2">
                    {items.length === 0 ? (
                      <li className="text-neutral-500 dark:text-neutral-400">Belum ada konten</li>
                    ) : (
                      items.map((item: string, i: number) => (
                        <li
                          key={`${section.key}-${i}`}
                          className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300"
                        >
                          <span className="mt-1 text-emerald-500">•</span>
                          {item}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DashboardWrapper>
  )
}
