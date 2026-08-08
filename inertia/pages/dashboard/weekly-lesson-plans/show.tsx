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

interface WeeklyLessonPlanContent {
  nilaiAgamaBudiPekerti?: string[]
  jatiDiri?: string[]
  literasiSainsTeknologi?: string[]
  rencanaKegiatan?: string[]
  [key: string]: string[] | undefined
}

interface WeeklyLessonPlan {
  id: number
  theme: string
  weekStartDate: string
  status: 'draft' | 'published'
  content: WeeklyLessonPlanContent
  schoolClass: SchoolClass
}

interface WeeklyLessonPlanShowProps {
  readonly weeklyLessonPlan: WeeklyLessonPlan
  readonly workflow?: {
    status: 'draft' | 'published' | 'archived'
    lastSavedAt?: string | null
    version?: number
    templateKey?: string
  }
}

const SECTIONS = [
  { key: 'nilaiAgamaBudiPekerti', title: 'Nilai Agama dan Budi Pekerti', icon: '🙏' },
  { key: 'jatiDiri', title: 'Jati Diri', icon: '🧒' },
  {
    key: 'literasiSainsTeknologi',
    title: 'Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni',
    icon: '🔬',
  },
  { key: 'rencanaKegiatan', title: 'Rencana Kegiatan Mingguan', icon: '📝' },
]

export default function WeeklyLessonPlanShow({
  weeklyLessonPlan,
  workflow,
}: WeeklyLessonPlanShowProps) {
  const [editing, setEditing] = useState(false)

  const { data, setData, put, processing, reset } = useForm<{
    theme: string
    status: 'draft' | 'published'
    content: Record<string, string[]>
  }>({
    theme: weeklyLessonPlan.theme,
    status: weeklyLessonPlan.status,
    content: (weeklyLessonPlan.content as Record<string, string[]>) ?? {},
  })
  useDocumentAutosave(
    'rppm',
    weeklyLessonPlan.id,
    data.content,
    data.status,
    editing
  )

  const handleSave = () => {
    put(`/rppm/${weeklyLessonPlan.id}`, {
      onSuccess: () => setEditing(false),
    })
  }

  const handleCancelEdit = () => {
    reset()
    setEditing(false)
  }

  const handleTogglePublish = () => {
    const nextStatus = weeklyLessonPlan.status === 'published' ? 'draft' : 'published'
    setData('status', nextStatus)
    put(`/rppm/${weeklyLessonPlan.id}`, {
      onSuccess: () => setEditing(false),
    })
  }

  const isPublished = weeklyLessonPlan.status === 'published'

  return (
    <DashboardWrapper
      title={weeklyLessonPlan.theme}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'RPPM', href: '/rppm' },
        { label: weeklyLessonPlan.theme },
      ]}
    >
      <Head title={weeklyLessonPlan.theme} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/rppm"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {weeklyLessonPlan.theme}
              </h2>
              <button
                type="button"
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
              Kelompok {weeklyLessonPlan.schoolClass.name} • Minggu{' '}
              {new Date(weeklyLessonPlan.weekStartDate).toLocaleDateString('id-ID')}
            </p>
            <DocumentWorkflowMeta
              status={workflow?.status ?? weeklyLessonPlan.status}
              lastSavedAt={workflow?.lastSavedAt}
              version={workflow?.version}
              templateKey={workflow?.templateKey}
            />
          </div>
          <div className="flex gap-2">
            <a
              href={`/rppm/${weeklyLessonPlan.id}/export/pdf?disposition=inline`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Download className="h-4 w-4" /> PDF
            </a>
            <a
              href={`/rppm/${weeklyLessonPlan.id}/export`}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              DOCX
            </a>
            <DocumentWorkflowActions
              type="rppm"
              id={weeklyLessonPlan.id}
              status={workflow?.status ?? weeklyLessonPlan.status}
              templateKey={workflow?.templateKey}
            />
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  <X className="h-4 w-4" />
                  Batal
                </button>
                <button
                  type="button"
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
                type="button"
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
          {SECTIONS.map((section) => {
            const items = weeklyLessonPlan.content?.[section.key] ?? []
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
                  <DocumentSectionEditor
                    value={draftItems}
                    onChange={(value) =>
                      setData('content', {
                        ...data.content,
                        [section.key]: (Array.isArray(value) ? value : [value]) as string[],
                      })
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
