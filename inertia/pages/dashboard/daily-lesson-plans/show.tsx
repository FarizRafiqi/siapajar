import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, useForm, Link } from '@inertiajs/react'
import { useState } from 'react'
import { ArrowLeft, Save, Pencil, X, Download } from 'lucide-react'
import { cn } from '~/lib/utils'
import DocumentWorkflowMeta from '~/components/dashboard/document-workflow-meta'
import DocumentWorkflowActions from '~/components/dashboard/document-workflow-actions'
import { useDocumentAutosave } from '~/hooks/use-document-autosave'
import {
  DocumentSectionEditor,
  DocumentSectionValue,
} from '~/components/ui/document-section-editor'

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface WeeklyLessonPlan {
  id: number
  theme: string
}

interface DailyLessonPlanContent {
  tema?: string
  kegiatanPembuka?: string[]
  kegiatanInti?: string[]
  kegiatanPenutup?: string[]
  alatBahan?: string[]
  rencanaAsesmen?: string[]
  [key: string]: string[] | string | undefined
}

interface DailyLessonPlan {
  id: number
  date: string
  status: 'draft' | 'published'
  content: DailyLessonPlanContent
  schoolClass: SchoolClass
  weeklyLessonPlan?: WeeklyLessonPlan | null
}

interface DailyLessonPlanShowProps {
  readonly dailyLessonPlan: DailyLessonPlan
  readonly workflow?: {
    status: 'draft' | 'published' | 'archived'
    lastSavedAt?: string | null
    version?: number
  }
}

const SECTIONS = [
  { key: 'kegiatanPembuka', title: 'Kegiatan Pembuka', icon: '🌅' },
  { key: 'kegiatanInti', title: 'Kegiatan Inti', icon: '🎨' },
  { key: 'kegiatanPenutup', title: 'Kegiatan Penutup', icon: '🌇' },
  { key: 'alatBahan', title: 'Alat dan Bahan', icon: '🧰' },
  { key: 'rencanaAsesmen', title: 'Rencana Asesmen', icon: '✅' },
]

export default function DailyLessonPlanShow({
  dailyLessonPlan,
  workflow,
}: DailyLessonPlanShowProps) {
  const [editing, setEditing] = useState(false)
  const title = dailyLessonPlan.content?.tema || 'RPPH'

  const { data, setData, put, processing, reset } = useForm({
    status: dailyLessonPlan.status,
    content: dailyLessonPlan.content ?? {},
  })
  useDocumentAutosave(
    'rpph',
    dailyLessonPlan.id,
    data.content,
    data.status as 'draft' | 'published',
    editing
  )

  const handleSave = () => {
    put(`/rpph/${dailyLessonPlan.id}`, {
      onSuccess: () => setEditing(false),
    })
  }

  const handleCancelEdit = () => {
    reset()
    setEditing(false)
  }

  const handleTogglePublish = () => {
    const nextStatus = dailyLessonPlan.status === 'published' ? 'draft' : 'published'
    setData('status', nextStatus)
    put(`/rpph/${dailyLessonPlan.id}`, {
      onSuccess: () => setEditing(false),
    })
  }

  const isPublished = dailyLessonPlan.status === 'published'

  return (
    <DashboardWrapper
      title={title}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'RPPH', href: '/rpph' },
        { label: title },
      ]}
    >
      <Head title={title} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/rpph"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{title}</h2>
              <button
                onClick={handleTogglePublish}
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
                  isPublished
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
                )}
              >
                {isPublished ? 'Terbit' : 'Draf'}
              </button>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              Kelompok {dailyLessonPlan.schoolClass.name} •{' '}
              {new Date(dailyLessonPlan.date).toLocaleDateString('id-ID')}
              {dailyLessonPlan.weeklyLessonPlan && (
                <> • RPPM: {dailyLessonPlan.weeklyLessonPlan.theme}</>
              )}
            </p>
            <DocumentWorkflowMeta
              status={workflow?.status ?? (dailyLessonPlan.status as 'draft' | 'published')}
              lastSavedAt={workflow?.lastSavedAt}
              version={workflow?.version}
              templateKey={workflow?.templateKey}
            />
          </div>
          <div className="flex gap-2">
            <a
              href={`/rpph/${dailyLessonPlan.id}/export/pdf?disposition=inline`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Download className="h-4 w-4" /> PDF
            </a>
            <a
              href={`/rpph/${dailyLessonPlan.id}/export`}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              DOCX
            </a>
            <DocumentWorkflowActions
              type="rpph"
              id={dailyLessonPlan.id}
              status={workflow?.status ?? (dailyLessonPlan.status as 'draft' | 'published')}
              templateKey={workflow?.templateKey}
            />
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

        <div className="space-y-4">
          {SECTIONS.map((section, index) => {
            const items = (dailyLessonPlan.content?.[section.key] as string[] | undefined) ?? []
            const draftItems = (data.content?.[section.key] as string[] | undefined) ?? []

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
                  <DocumentSectionEditor
                    value={draftItems}
                    onChange={(value) =>
                      setData('content', { ...data.content, [section.key]: value })
                    }
                    placeholder={`Masukkan ${section.title.toLowerCase()}`}
                  />
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
