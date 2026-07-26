import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, useForm, Link } from '@inertiajs/react'
import { useState } from 'react'
import { ArrowLeft, Download, Pencil, Save, X } from 'lucide-react'

interface AcademicYear {
  id: number
  name: string
}

interface AnnualPlanContent {
  kompetensi?: string[]
  alokasiWaktu?: string[]
  kegiatan?: string[]
  minggu?: string[]
  [key: string]: string[] | undefined
}

interface AnnualPlan {
  id: number
  subject: string
  content: AnnualPlanContent
  createdAt: string
  academicYear: AcademicYear
}

interface AnnualPlanShowProps {
  readonly annualPlan: AnnualPlan
}

const SECTIONS = [
  { key: 'kompetensi', title: 'Kompetensi', icon: '📚' },
  { key: 'alokasiWaktu', title: 'Alokasi Waktu', icon: '⏰' },
  { key: 'kegiatan', title: 'Kegiatan Pembelajaran', icon: '📝' },
  { key: 'minggu', title: 'Pembagian Minggu', icon: '📅' },
]

export default function AnnualPlanShow({ annualPlan }: AnnualPlanShowProps) {
  const [editing, setEditing] = useState(false)

  const { data, setData, put, processing, reset } = useForm({
    subject: annualPlan.subject,
    content: annualPlan.content ?? {},
  })

  const handleSave = () => {
    put(`/annual-plans/${annualPlan.id}`, {
      onSuccess: () => setEditing(false),
    })
  }

  const handleCancelEdit = () => {
    reset()
    setEditing(false)
  }

  const handleExport = () => {
    window.location.href = `/annual-plans/${annualPlan.id}/export`
  }

  return (
    <DashboardWrapper
      title={`Protah — ${annualPlan.subject}`}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Protah', href: '/annual-plans' },
        { label: annualPlan.subject },
      ]}
    >
      <Head title={`Protah — ${annualPlan.subject}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/annual-plans"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Program Tahunan — {annualPlan.subject}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {annualPlan.academicYear.name}
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

        {/* Isi Protah */}
        <div className="space-y-4">
          {SECTIONS.map((section, index) => {
            const items = annualPlan.content?.[section.key] ?? []
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
