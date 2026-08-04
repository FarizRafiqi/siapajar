import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, useForm, Link } from '@inertiajs/react'
import { useState } from 'react'
import { ArrowLeft, Save, Download, Pencil, X } from 'lucide-react'
import { cn } from '~/lib/utils'
import DocumentWorkflowMeta from '~/components/dashboard/document-workflow-meta'
import DocumentWorkflowActions from '~/components/dashboard/document-workflow-actions'
import { useDocumentAutosave } from '~/hooks/use-document-autosave'
import { DocumentSectionEditor, DocumentSectionValue } from '~/components/ui/document-section-editor'

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface TeachingModuleContent {
  kompetensiDasar?: string[]
  tujuanPembelajaran?: string[]
  kegiatan?: string[]
  penilaian?: string[]
  sumberBelajar?: string[]
  [key: string]: string[] | undefined
}

interface TeachingModule {
  id: number
  title: string
  subject: string
  phase: string
  status: 'draft' | 'published'
  content: TeachingModuleContent
  createdAt: string
  schoolClass: SchoolClass
}

interface TeachingModuleShowProps {
  readonly teachingModule: TeachingModule
  readonly workflow?: { status: 'draft' | 'published' | 'archived'; lastSavedAt?: string | null; version?: number }
}

const SECTIONS = [
  { key: 'kompetensiDasar', title: 'Kompetensi Dasar', icon: '📚' },
  { key: 'tujuanPembelajaran', title: 'Tujuan Pembelajaran', icon: '🎯' },
  { key: 'kegiatan', title: 'Kegiatan Pembelajaran', icon: '📝' },
  { key: 'penilaian', title: 'Penilaian', icon: '✅' },
  { key: 'sumberBelajar', title: 'Sumber Belajar', icon: '📖' },
]

export default function TeachingModuleShow({ teachingModule, workflow }: TeachingModuleShowProps) {
  const [editing, setEditing] = useState(false)

  const { data, setData, put, processing, reset } = useForm({
    title: teachingModule.title,
    subject: teachingModule.subject,
    phase: teachingModule.phase,
    status: teachingModule.status,
    content: teachingModule.content ?? {},
  })
  useDocumentAutosave('teaching_module', teachingModule.id, data.content, data.status as 'draft' | 'published', editing)

  const handleSave = () => {
    put(`/teaching-modules/${teachingModule.id}`, {
      onSuccess: () => setEditing(false),
    })
  }

  const handleCancelEdit = () => {
    reset()
    setEditing(false)
  }

  const handleTogglePublish = () => {
    const nextStatus = teachingModule.status === 'published' ? 'draft' : 'published'
    setData('status', nextStatus)
    put(`/teaching-modules/${teachingModule.id}`, {
      onSuccess: () => setEditing(false),
    })
  }

  const handleExport = () => {
    window.location.href = `/teaching-modules/${teachingModule.id}/export`
  }

  const handleExportPdf = () => {
    window.location.href = `/teaching-modules/${teachingModule.id}/export/pdf`
  }

  const isPublished = teachingModule.status === 'published'

  return (
    <DashboardWrapper
      title={teachingModule.title}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Modul Ajar', href: '/teaching-modules' },
        { label: teachingModule.title },
      ]}
    >
      <Head title={teachingModule.title} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/teaching-modules"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {teachingModule.title}
              </h2>
              <button
                onClick={handleTogglePublish}
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
                  isPublished
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
                )}
                title={isPublished ? 'Klik untuk jadikan draf' : 'Klik untuk terbitkan'}
              >
                {isPublished ? 'Terbit' : 'Draf'}
              </button>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              {teachingModule.subject} • Kelas {teachingModule.schoolClass.name} • Fase{' '}
              {teachingModule.phase}
            </p>
            <DocumentWorkflowMeta status={workflow?.status ?? (teachingModule.status as 'draft' | 'published')} lastSavedAt={workflow?.lastSavedAt} version={workflow?.version} templateKey={workflow?.templateKey} />
          </div>
          <div className="flex gap-2">
            <DocumentWorkflowActions type="teaching_module" id={teachingModule.id} status={workflow?.status ?? (teachingModule.status as 'draft' | 'published')} templateKey={workflow?.templateKey} />
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

        {/* Isi Modul */}
        <div className="space-y-4">
          {SECTIONS.map((section, index) => {
            const items = teachingModule.content?.[section.key] ?? []
            const draftItems = data.content?.[section.key] ?? []

            return (
              <div
                key={section.key}
                className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                  <span>{section.icon}</span>
                  {section.title}
                </h3>
                {editing ? (
                  <DocumentSectionEditor value={draftItems} onChange={(value) => setData('content', { ...data.content, [section.key]: value })} placeholder={`Masukkan ${section.title.toLowerCase()}`} />
                ) : (
                  <DocumentSectionValue value={items} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DashboardWrapper>
  )
}
