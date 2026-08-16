import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  ClipboardList,
  Trash2,
  Plus,
  CheckSquare,
  FileText,
  Palette,
  Camera,
  File,
  FileImage,
  ExternalLink,
  X,
  Sparkles,
  Download,
  MoreVertical,
  ChevronDown,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UploadCloud,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import AiAssessmentModal from './components/ai-assessment-modal'
import BundleExportModal from './components/bundle-export-modal'

interface Student {
  id: number
  nis: string
  fullName: string
}

interface SchoolClass {
  id: number
  name: string
  students: Student[]
}

type AssessmentType = 'checklist' | 'anecdotal_note' | 'work_sample' | 'photo_series'

interface Assessment {
  id: number
  type: AssessmentType
  date: string
  activity?: string
  teacherNote?: string
  achievementStatus?: string
  content: Record<string, any>
  schoolClass: SchoolClass
  student: Student
  attachments?: Array<{ id: number; url: string; originalName: string; mimeType: string }>
}

function AttachmentIcon({ mimeType }: Readonly<{ mimeType: string }>) {
  if (mimeType.startsWith('image/')) return <FileImage className="h-4 w-4 text-emerald-600" />
  if (mimeType === 'application/pdf') return <FileText className="h-4 w-4 text-rose-600" />
  return <File className="h-4 w-4 text-neutral-500" />
}

interface CurriculumObjective {
  id: number
  code: string
  title: string
  indicators: Array<{ id: number; description: string; achievementCriteria: string }>
}

interface PaudAssessmentsIndexProps {
  readonly assessments: Assessment[]
  readonly classes: SchoolClass[]
  readonly typeLabels: Record<AssessmentType, string>
  readonly curriculumObjectives: CurriculumObjective[]
}

const TYPE_ICONS: Record<AssessmentType, React.ComponentType<{ className?: string }>> = {
  checklist: CheckSquare,
  anecdotal_note: FileText,
  work_sample: Palette,
  photo_series: Camera,
}

export default function PaudAssessmentsIndex({
  assessments,
  classes,
  typeLabels,
  curriculumObjectives,
}: PaudAssessmentsIndexProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [showBundleModal, setShowBundleModal] = useState(false)
  const [showActionsDropdown, setShowActionsDropdown] = useState(false)

  const [deletingAssessment, setDeletingAssessment] = useState<Assessment | null>(null)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [filterType, setFilterType] = useState<AssessmentType | 'all'>('all')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const hasClasses = classes.length > 0
  const hasStudents = classes.some((c) => c.students.length > 0)

  const { data, setData, processing, errors, reset } = useForm({
    classId: classes[0]?.id || 0,
    studentId: classes[0]?.students[0]?.id || 0,
    learningObjectiveId: 0,
    iktpIndicatorId: 0,
    achievementStatus: 'berkembang_sesuai_harapan',
    type: 'anecdotal_note' as AssessmentType,
    date: new Date().toISOString().split('T')[0],
    theme: '',
    // Anecdotal
    context: '',
    observedEvent: '',
    achievementAnalysis: '',
    // Checklist
    indicatorsText: '',
    note: '',
    // Work Sample
    workTitle: '',
    workDescription: '',
    // Photo Series
    activityTitle: '',
    stage1: '',
    stage2: '',
    stage3: '',
  })

  const selectedClass = classes.find((c) => c.id === data.classId)

  const handleApplyFromAi = (aiData: {
    type: AssessmentType
    classId: number
    studentId: number
    theme: string
    content: Record<string, any>
    activity?: string
    teacherNote?: string
    achievementStatus?: string
    files?: File[]
  }) => {
    setData((prev) => ({
      ...prev,
      type: aiData.type,
      classId: aiData.classId,
      studentId: aiData.studentId,
      theme: aiData.theme || 'Kenalkan',
      context: aiData.content.context || '',
      observedEvent: aiData.content.observedEvent || aiData.content.behavior || '',
      achievementAnalysis: aiData.content.achievementAnalysis || aiData.content.analysis || '',
      workTitle: aiData.content.workTitle || aiData.content.photoDescription || '',
      workDescription: aiData.content.workDescription || aiData.content.description || '',
      activityTitle: aiData.content.activityTitle || aiData.content.activity || '',
      stage1: aiData.content.stepDescriptions?.[0] || '',
      stage2: aiData.content.stepDescriptions?.[1] || '',
      stage3: aiData.content.stepDescriptions?.[2] || '',
      indicatorsText: (aiData.content.items || [])
        .map((it: any) => `${it.indicator} [${it.status === 'sudah_muncul' ? 'V' : 'X'}]`)
        .join('\n'),
      note: aiData.content.note || '',
      achievementStatus: aiData.achievementStatus || 'berkembang_sesuai_harapan',
    }))
    if (aiData.files && aiData.files.length > 0) {
      setSelectedFiles(aiData.files)
    }
    setShowAddModal(true)
  }

  const handleSaveAssessment = () => {
    let content: Record<string, any> = { theme: data.theme }

    if (data.type === 'anecdotal_note') {
      content = {
        theme: data.theme,
        context: data.context,
        observedEvent: data.observedEvent,
        achievementAnalysis: data.achievementAnalysis,
        // legacy compatibility
        behavior: data.observedEvent,
        analysis: data.achievementAnalysis,
      }
    } else if (data.type === 'checklist') {
      const parsedItems = data.indicatorsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const isNo = line.includes('[X]') || line.toLowerCase().includes('belum')
          const cleanText = line.replace(/\[V\]|\[X\]|\[v\]|\[x\]/g, '').trim()
          return {
            indicator: cleanText,
            status: isNo ? 'belum_muncul' : 'sudah_muncul',
          }
        })
      content = {
        theme: data.theme,
        items: parsedItems,
        note: data.note,
        indicators: parsedItems.map((i) => i.indicator),
      }
    } else if (data.type === 'work_sample') {
      content = {
        theme: data.theme,
        workTitle: data.workTitle,
        workDescription: data.workDescription,
        achievementAnalysis: data.achievementAnalysis,
        photoDescription: data.workTitle,
        description: data.workDescription,
        analysis: data.achievementAnalysis,
      }
    } else if (data.type === 'photo_series') {
      const stepDescriptions = [data.stage1, data.stage2, data.stage3].filter(Boolean)
      content = {
        theme: data.theme,
        activityTitle: data.activityTitle,
        stepDescriptions,
        achievementAnalysis: data.achievementAnalysis,
        activity: data.activityTitle,
        narrative: stepDescriptions.join('\n'),
        analysis: data.achievementAnalysis,
      }
    }

    const payload = new FormData()
    payload.append('classId', String(data.classId))
    payload.append('studentId', String(data.studentId))
    payload.append('type', data.type)
    payload.append('date', data.date)
    payload.append('content', JSON.stringify(content))
    if (data.learningObjectiveId)
      payload.append('learningObjectiveId', String(data.learningObjectiveId))
    if (data.iktpIndicatorId) payload.append('iktpIndicatorId', String(data.iktpIndicatorId))
    if (data.achievementStatus) payload.append('achievementStatus', data.achievementStatus)

    selectedFiles.forEach((file) => payload.append('attachments', file))

    router.post('/paud-assessments', payload, {
      forceFormData: true,
      onSuccess: () => {
        setShowAddModal(false)
        setSelectedFiles([])
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingAssessment) return
    router.delete(`/paud-assessments/${deletingAssessment.id}`, {
      onSuccess: () => setDeletingAssessment(null),
    })
  }

  const filteredAssessments =
    filterType === 'all' ? assessments : assessments.filter((a) => a.type === filterType)

  return (
    <DashboardWrapper
      title="Asesmen RA / TK"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Asesmen RA / TK' }]}
    >
      <Head title="Asesmen RA / TK" />

      <div className="space-y-6">
        {/* Page Header */}
        <div
          data-tour="assessment-intro"
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Asesmen Perkembangan PAUD / RA
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Dokumentasikan 4 instrumen: Catatan Anekdot, Ceklis IKTP, Hasil Karya, & Foto Berseri
            </p>
          </div>

          {/* Action Buttons with consolidated dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              data-tour="assessment-ai"
              type="button"
              onClick={() => setShowAiModal(true)}
              disabled={!hasClasses || !hasStudents}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              Buat dengan AI
            </button>

            <button
              data-tour="assessment-create"
              type="button"
              onClick={() => setShowAddModal(true)}
              disabled={!hasClasses || !hasStudents}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-neutral-800 shadow-xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
              Catat Manual
            </button>

            {/* Aksi & Opsi Popover Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-neutral-800 shadow-xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                <span>Aksi & Opsi</span>
                <ChevronDown className="h-4 w-4 text-neutral-500" />
              </button>

              {showActionsDropdown && (
                <div
                  className="absolute right-0 z-30 mt-2 w-60 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
                  onMouseLeave={() => setShowActionsDropdown(false)}
                >
                  <button
                    data-tour="assessment-bundle"
                    type="button"
                    onClick={() => {
                      setShowActionsDropdown(false)
                      setShowBundleModal(true)
                    }}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-neutral-800 hover:bg-emerald-50 hover:text-emerald-700 dark:text-neutral-200 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
                  >
                    <Layers className="h-4 w-4 text-emerald-600" />
                    Ekspor Bundel Dokumen (PPM KBC)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowActionsDropdown(false)
                      window.dispatchEvent(new CustomEvent('start-paud-tour'))
                    }}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <HelpCircle className="h-4 w-4 text-neutral-500" />
                    Panduan Penggunaan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Warning if no classes or students */}
        {!hasClasses && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800/80 dark:bg-amber-950/20">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
            <div className="flex-1 text-sm text-amber-900 dark:text-amber-200">
              <span className="font-semibold">Kelompok Belajar Belum Ada:</span> Silakan tambahkan
              kelompok (kelas) terlebih dahulu sebelum membuat asesmen.
            </div>
            <Link
              href="/classes"
              className="rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700"
            >
              Buat Kelompok →
            </Link>
          </div>
        )}

        {hasClasses && !hasStudents && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800/80 dark:bg-amber-950/20">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
            <div className="flex-1 text-sm text-amber-900 dark:text-amber-200">
              <span className="font-semibold">Daftar Siswa Belum Ada:</span> Tambahkan data anak
              didik ke dalam kelompok agar asesmen dapat dicatat per anak.
            </div>
          </div>
        )}

        {/* Filters Tabs */}
        <div data-tour="assessment-filters" className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={cn(
              'cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-all',
              filterType === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            )}
          >
            Semua ({assessments.length})
          </button>
          {(Object.keys(typeLabels) as AssessmentType[]).map((t) => {
            const Icon = TYPE_ICONS[t]
            const count = assessments.filter((a) => a.type === t).length
            return (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all',
                  filterType === t
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{typeLabels[t]}</span>
                <span className="ml-0.5 rounded-full bg-black/10 px-1.5 py-0.2 text-[10px] dark:bg-white/20">
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Assessment Items Grid / Cards */}
        {filteredAssessments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 py-16 text-center dark:border-neutral-700 dark:bg-neutral-800/20">
            <ClipboardList className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-white">
              Belum Ada Asesmen
            </h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Gunakan tombol &quot;Buat dengan AI&quot; atau &quot;Catat Manual&quot; untuk
              mendokumentasikan asesmen.
            </p>
          </div>
        ) : (
          <div data-tour="assessment-list" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredAssessments.map((item) => {
              const ItemIcon = TYPE_ICONS[item.type]
              const rawContent = item.content || {}
              const themeName = rawContent.theme || item.activity || 'Umum'

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-700"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-xl bg-emerald-50 p-2 dark:bg-emerald-950/40">
                          <ItemIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                            {item.student.fullName}
                          </h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Kelompok {item.schoolClass.name} •{' '}
                            {new Date(item.date).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {typeLabels[item.type]}
                      </span>
                    </div>

                    {/* Theme Badge */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        Tema: {themeName}
                      </span>
                    </div>

                    {/* Content Snippet */}
                    <div className="mt-3 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-200">
                      {item.type === 'anecdotal_note' && (
                        <div className="space-y-1">
                          <p>
                            <strong className="text-neutral-900 dark:text-white">Kejadian: </strong>
                            {rawContent.observedEvent || rawContent.behavior || '-'}
                          </p>
                          <p className="text-neutral-600 dark:text-neutral-300">
                            <strong className="text-neutral-900 dark:text-white">Analisis: </strong>
                            {rawContent.achievementAnalysis || rawContent.analysis || '-'}
                          </p>
                        </div>
                      )}

                      {item.type === 'checklist' && (
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            Indikator Teramati:
                          </p>
                          <ul className="mt-1 list-inside list-disc space-y-0.5 text-neutral-700 dark:text-neutral-300">
                            {(rawContent.items || rawContent.indicators || [])
                              .slice(0, 3)
                              .map((ind: any, i: number) => {
                                const text = typeof ind === 'string' ? ind : ind.indicator
                                const status =
                                  typeof ind === 'object' && ind.status === 'sudah_muncul'
                                    ? ' (Sudah)'
                                    : ''
                                return <li key={i}>{text + status}</li>
                              })}
                          </ul>
                        </div>
                      )}

                      {item.type === 'work_sample' && (
                        <div className="space-y-1">
                          <p className="font-bold text-neutral-900 dark:text-white">
                            {rawContent.workTitle || rawContent.photoDescription || 'Hasil Karya'}
                          </p>
                          <p className="text-neutral-600 dark:text-neutral-300">
                            {rawContent.workDescription || rawContent.description || '-'}
                          </p>
                        </div>
                      )}

                      {item.type === 'photo_series' && (
                        <div className="space-y-1">
                          <p className="font-bold text-neutral-900 dark:text-white">
                            {rawContent.activityTitle || rawContent.activity || 'Foto Berseri'}
                          </p>
                          <p className="text-neutral-600 dark:text-neutral-300">
                            {(rawContent.stepDescriptions || []).join(' → ') ||
                              rawContent.narrative ||
                              '-'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Attachments preview */}
                    {item.attachments && item.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.attachments.map((att) => (
                          <a
                            key={att.id}
                            href={`${att.url}?disposition=inline`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[11px] font-medium text-neutral-700 hover:border-emerald-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                          >
                            <AttachmentIcon mimeType={att.mimeType} />
                            <span className="max-w-[120px] truncate">{att.originalName}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setSelectedAssessment(item)}
                      className="cursor-pointer text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                    >
                      Lihat Rinci
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/paud-assessments/${item.id}/export/pdf`}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300"
                        title="Unduh format PDF PPM KBC"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </a>

                      <a
                        href={`/paud-assessments/${item.id}/export`}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
                        title="Unduh format Word DOCX PPM KBC"
                      >
                        <Download className="h-3.5 w-3.5" /> DOCX
                      </a>

                      <button
                        type="button"
                        onClick={() => setDeletingAssessment(item)}
                        className="cursor-pointer rounded-lg p-1 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                        title="Hapus asesmen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Manual / Edit Assessment Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-400">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Catat Asesmen Manual
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Formulir pencatatan langsung instrumen asesmen pembelajaran PPM KBC
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="cursor-pointer rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-3.5 overflow-x-hidden overflow-y-auto p-5 text-sm">
              {/* Instrument Selection */}
              <div>
                <span
                  id="manual-instrument-label"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Pilih Instrumen Asesmen
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby="manual-instrument-label"
                  className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  {[
                    { id: 'anecdotal_note', label: 'Catatan Anekdot' },
                    { id: 'checklist', label: 'Ceklis IKTP' },
                    { id: 'work_sample', label: 'Hasil Karya' },
                    { id: 'photo_series', label: 'Foto Berseri' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setData('type', t.id as AssessmentType)
                        setSelectedFiles([])
                      }}
                      className={`cursor-pointer rounded-xl border p-2 text-center text-xs font-semibold transition-all ${
                        data.type === t.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Student, Class & Date */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="manual-class-select"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Kelompok / Kelas
                  </label>
                  <select
                    id="manual-class-select"
                    value={data.classId}
                    onChange={(e) => {
                      const cid = Number(e.target.value)
                      setData('classId', cid)
                      const cls = classes.find((c) => c.id === cid)
                      if (cls?.students[0]) setData('studentId', cls.students[0].id)
                    }}
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelompok {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="manual-student-select"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Nama Siswa
                  </label>
                  <select
                    id="manual-student-select"
                    value={data.studentId}
                    onChange={(e) => setData('studentId', Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    {(selectedClass?.students || []).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.nis || '-'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="manual-date-input"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Tanggal
                  </label>
                  <input
                    id="manual-date-input"
                    type="date"
                    value={data.date}
                    onChange={(e) => setData('date', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  />
                </div>
              </div>

              {/* Theme / Topik */}
              <div>
                <label
                  htmlFor="manual-theme-input"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Tema / Topik Pembelajaran
                </label>
                <input
                  id="manual-theme-input"
                  type="text"
                  value={data.theme}
                  onChange={(e) => setData('theme', e.target.value)}
                  placeholder="Contoh: Kenalkan, Diriku, Indonesiaku"
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                />
              </div>

              {/* Type specific fields in Card */}
              {data.type === 'anecdotal_note' && (
                <div className="space-y-2.5 rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30">
                  <div>
                    <label
                      htmlFor="manual-context-input"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Latar / Tempat / Konteks Kejadian
                    </label>
                    <input
                      id="manual-context-input"
                      type="text"
                      value={data.context}
                      onChange={(e) => setData('context', e.target.value)}
                      placeholder="Contoh: Saat bermain peran di sudut balok"
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manual-observed-input"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Keterangan / Kejadian Teramati
                    </label>
                    <textarea
                      id="manual-observed-input"
                      value={data.observedEvent}
                      onChange={(e) => setData('observedEvent', e.target.value)}
                      rows={3}
                      placeholder="Uraikan apa yang dilakukan atau diucapkan anak secara faktual..."
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manual-analysis-input"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Analisis Capaian Perkembangan
                    </label>
                    <textarea
                      id="manual-analysis-input"
                      value={data.achievementAnalysis}
                      onChange={(e) => setData('achievementAnalysis', e.target.value)}
                      rows={3}
                      placeholder="Uraikan capaian CP yang terindikasi dari peristiwa..."
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                </div>
              )}

              {data.type === 'checklist' && (
                <div className="space-y-2.5 rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30">
                  <div>
                    <label
                      htmlFor="manual-indicators-input"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Daftar Indikator IKTP (1 per baris, akhiri [V] untuk Muncul atau [X] untuk
                      Belum)
                    </label>
                    <textarea
                      id="manual-indicators-input"
                      value={data.indicatorsText}
                      onChange={(e) => setData('indicatorsText', e.target.value)}
                      rows={4}
                      placeholder="Anak mampu menyapa guru dengan ramah [V]&#10;Anak mampu merapikan alat main sendiri [V]&#10;Anak mampu memakai sepatu mandiri [X]"
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-xs font-mono text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manual-note-input"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Catatan Tambahan Guru
                    </label>
                    <input
                      id="manual-note-input"
                      type="text"
                      value={data.note}
                      onChange={(e) => setData('note', e.target.value)}
                      placeholder="Catatan perkembangan khusus jika ada..."
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                </div>
              )}

              {data.type === 'work_sample' && (
                <div className="space-y-2.5 rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30">
                  <div>
                    <label
                      htmlFor="manual-worktitle-input"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Judul Karya
                    </label>
                    <input
                      id="manual-worktitle-input"
                      type="text"
                      value={data.workTitle}
                      onChange={(e) => setData('workTitle', e.target.value)}
                      placeholder="Contoh: Kolase Burung Hantu, Lukisan Jari"
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manual-workdesc-input"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Deskripsi Foto / Celoteh Anak
                    </label>
                    <textarea
                      id="manual-workdesc-input"
                      value={data.workDescription}
                      onChange={(e) => setData('workDescription', e.target.value)}
                      rows={2}
                      placeholder="Celoteh anak mengenai karya yang dibuatnya..."
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manual-workanalysis-input"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Analisis Capaian Perkembangan
                    </label>
                    <textarea
                      id="manual-workanalysis-input"
                      value={data.achievementAnalysis}
                      onChange={(e) => setData('achievementAnalysis', e.target.value)}
                      rows={2}
                      placeholder="Analisis perkembangan motorik halus, seni, dan bahasa..."
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>

                  {/* Centered Image Upload Dropzone */}
                  <div>
                    <label
                      htmlFor="manual-upload-worksample"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Upload Foto Karya Anak (1 Foto)
                    </label>
                    <div className="mt-1 space-y-2">
                      <label
                        htmlFor="manual-upload-worksample"
                        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-white p-5 text-center transition-all hover:border-emerald-500 hover:bg-emerald-50/20 dark:border-neutral-700 dark:bg-neutral-800/40 dark:hover:border-emerald-500/50 dark:hover:bg-neutral-800"
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <UploadCloud className="mb-2 h-8 w-8 text-neutral-400 dark:text-neutral-500" />
                          <p className="mb-1 text-xs text-neutral-700 dark:text-neutral-300">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              Klik untuk unggah
                            </span>{' '}
                            atau seret foto ke sini
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            PNG, JPG, atau WEBP (Maksimal 1 foto, maks 5MB)
                          </p>
                        </div>
                        <input
                          id="manual-upload-worksample"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => {
                            const rawFiles = Array.from(e.target.files || [])
                            const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
                            const valid = rawFiles.filter(
                              (f) => allowedTypes.has(f.type) && f.size <= 5 * 1024 * 1024
                            )
                            setSelectedFiles(valid.slice(0, 1))
                          }}
                          className="hidden"
                        />
                      </label>

                      {selectedFiles.length > 0 && (
                        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-2 shadow-xs dark:border-neutral-700 dark:bg-neutral-800">
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                              1
                            </span>
                            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                              {selectedFiles[0]?.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedFiles([])}
                            className="cursor-pointer rounded-lg p-1 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                            title="Hapus foto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {data.type === 'photo_series' && (
                <div className="space-y-2.5 rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30">
                  <div>
                    <label
                      htmlFor="manual-activitytitle-input"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Judul Kegiatan / Proyek
                    </label>
                    <input
                      id="manual-activitytitle-input"
                      type="text"
                      value={data.activityTitle}
                      onChange={(e) => setData('activityTitle', e.target.value)}
                      placeholder="Contoh: Membuat Kolase Daun Kering"
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="manual-stage1-input"
                        className="block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Deskripsi Tahap 1 (Awal)
                      </label>
                      <textarea
                        id="manual-stage1-input"
                        value={data.stage1}
                        onChange={(e) => setData('stage1', e.target.value)}
                        rows={2}
                        placeholder="Tahap persiapan..."
                        className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="manual-stage2-input"
                        className="block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Deskripsi Tahap 2 (Proses)
                      </label>
                      <textarea
                        id="manual-stage2-input"
                        value={data.stage2}
                        onChange={(e) => setData('stage2', e.target.value)}
                        rows={2}
                        placeholder="Tahap pengerjaan..."
                        className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="manual-stage3-input"
                        className="block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Deskripsi Tahap 3 (Hasil)
                      </label>
                      <textarea
                        id="manual-stage3-input"
                        value={data.stage3}
                        onChange={(e) => setData('stage3', e.target.value)}
                        rows={2}
                        placeholder="Tahap penyelesaian..."
                        className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="manual-stageanalysis-input"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Analisis Capaian Perkembangan
                    </label>
                    <textarea
                      id="manual-stageanalysis-input"
                      value={data.achievementAnalysis}
                      onChange={(e) => setData('achievementAnalysis', e.target.value)}
                      rows={2}
                      placeholder="Analisis konsistensi dan kemandirian anak sepanjang kegiatan..."
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>

                  {/* Centered Multi Image Upload Dropzone */}
                  <div>
                    <label
                      htmlFor="manual-upload-photoseries"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Upload Foto Berseri (Maksimal 3 Foto)
                    </label>
                    <div className="mt-1 space-y-2">
                      <label
                        htmlFor="manual-upload-photoseries"
                        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-white p-5 text-center transition-all hover:border-emerald-500 hover:bg-emerald-50/20 dark:border-neutral-700 dark:bg-neutral-800/40 dark:hover:border-emerald-500/50 dark:hover:bg-neutral-800"
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <UploadCloud className="mb-2 h-8 w-8 text-neutral-400 dark:text-neutral-500" />
                          <p className="mb-1 text-xs text-neutral-700 dark:text-neutral-300">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              Klik untuk unggah
                            </span>{' '}
                            atau seret foto ke sini
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            PNG, JPG, atau WEBP (Hingga 3 foto tahapan, maks 5MB per foto)
                          </p>
                        </div>
                        <input
                          id="manual-upload-photoseries"
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => {
                            const rawFiles = Array.from(e.target.files || [])
                            const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
                            const valid = rawFiles.filter(
                              (f) => allowedTypes.has(f.type) && f.size <= 5 * 1024 * 1024
                            )
                            setSelectedFiles(valid.slice(0, 3))
                          }}
                          className="hidden"
                        />
                      </label>

                      {selectedFiles.length > 0 && (
                        <div className="space-y-1.5">
                          {selectedFiles.map((file, fIdx) => (
                            <div
                              key={file.name + fIdx}
                              className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-2 shadow-xs dark:border-neutral-700 dark:bg-neutral-800"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                  T{fIdx + 1}
                                </span>
                                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedFiles((prev) => prev.filter((_, i) => i !== fIdx))
                                }
                                className="cursor-pointer rounded-lg p-1 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                                title="Hapus foto"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveAssessment}
                disabled={processing}
                className="cursor-pointer rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
              >
                {processing ? 'Menyimpan...' : 'Simpan Asesmen'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {typeLabels[selectedAssessment.type]}
                </span>
                <h3 className="mt-2 text-xl font-bold text-neutral-900 dark:text-white">
                  {selectedAssessment.student.fullName}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Kelompok {selectedAssessment.schoolClass.name} •{' '}
                  {new Date(selectedAssessment.date).toLocaleDateString('id-ID')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssessment(null)}
                className="cursor-pointer rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 space-y-4 overflow-y-auto text-sm text-neutral-800 dark:text-neutral-200">
              {selectedAssessment.type === 'anecdotal_note' && (
                <div className="space-y-3">
                  <div>
                    <h5 className="font-bold text-neutral-900 dark:text-white">Latar Kejadian:</h5>
                    <p className="mt-1 rounded-xl bg-neutral-50 p-3 text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                      {selectedAssessment.content.context || '-'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-neutral-900 dark:text-white">
                      Kejadian Teramati:
                    </h5>
                    <p className="mt-1 rounded-xl bg-neutral-50 p-3 text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                      {selectedAssessment.content.observedEvent ||
                        selectedAssessment.content.behavior ||
                        '-'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-neutral-900 dark:text-white">
                      Analisis Capaian Perkembangan:
                    </h5>
                    <p className="mt-1 rounded-xl bg-neutral-50 p-3 text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                      {selectedAssessment.content.achievementAnalysis ||
                        selectedAssessment.content.analysis ||
                        '-'}
                    </p>
                  </div>
                </div>
              )}

              {selectedAssessment.type === 'checklist' && (
                <div className="space-y-3">
                  <h5 className="font-bold text-neutral-900 dark:text-white">Indikator IKTP:</h5>
                  <div className="space-y-1.5">
                    {(
                      selectedAssessment.content.items ||
                      selectedAssessment.content.indicators ||
                      []
                    ).map((ind: any, idx: number) => {
                      const isObj = typeof ind === 'object'
                      const name = isObj ? ind.indicator : ind
                      const isAppeared = isObj ? ind.status === 'sudah_muncul' : true
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl bg-neutral-50 p-2.5 dark:bg-neutral-800/50"
                        >
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">
                            {name}
                          </span>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isAppeared
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                            }`}
                          >
                            {isAppeared ? 'Sudah Muncul' : 'Belum Muncul'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  {selectedAssessment.content.note && (
                    <div>
                      <h5 className="font-bold text-neutral-900 dark:text-white">Catatan Guru:</h5>
                      <p className="mt-1 rounded-xl bg-neutral-50 p-3 italic text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                        {selectedAssessment.content.note}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedAssessment.type === 'work_sample' && (
                <div className="space-y-3">
                  <div>
                    <h5 className="font-bold text-neutral-900 dark:text-white">Judul Karya:</h5>
                    <p className="mt-1 rounded-xl bg-neutral-50 p-3 font-semibold text-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-200">
                      {selectedAssessment.content.workTitle ||
                        selectedAssessment.content.photoDescription ||
                        '-'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-neutral-900 dark:text-white">
                      Deskripsi Foto / Celoteh Anak:
                    </h5>
                    <p className="mt-1 rounded-xl bg-neutral-50 p-3 text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                      {selectedAssessment.content.workDescription ||
                        selectedAssessment.content.description ||
                        '-'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-neutral-900 dark:text-white">
                      Analisis Capaian Perkembangan:
                    </h5>
                    <p className="mt-1 rounded-xl bg-neutral-50 p-3 text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                      {selectedAssessment.content.achievementAnalysis ||
                        selectedAssessment.content.analysis ||
                        '-'}
                    </p>
                  </div>
                </div>
              )}

              {selectedAssessment.type === 'photo_series' && (
                <div className="space-y-3">
                  <div>
                    <h5 className="font-bold text-neutral-900 dark:text-white">Kegiatan Proyek:</h5>
                    <p className="mt-1 rounded-xl bg-neutral-50 p-3 font-semibold text-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-200">
                      {selectedAssessment.content.activityTitle ||
                        selectedAssessment.content.activity ||
                        '-'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-neutral-900 dark:text-white">Tahapan:</h5>
                    <div className="mt-1 space-y-1.5">
                      {(
                        selectedAssessment.content.stepDescriptions ||
                        (selectedAssessment.content.narrative
                          ? [selectedAssessment.content.narrative]
                          : [])
                      ).map((step: string, sIdx: number) => (
                        <div
                          key={sIdx}
                          className="rounded-xl bg-neutral-50 p-2.5 text-xs text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300"
                        >
                          <strong>Tahap {sIdx + 1}:</strong> {step}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-neutral-900 dark:text-white">
                      Analisis Capaian Perkembangan:
                    </h5>
                    <p className="mt-1 rounded-xl bg-neutral-50 p-3 text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                      {selectedAssessment.content.achievementAnalysis ||
                        selectedAssessment.content.analysis ||
                        '-'}
                    </p>
                  </div>
                </div>
              )}

              {/* Attachments in Detail */}
              {selectedAssessment.attachments && selectedAssessment.attachments.length > 0 && (
                <div className="border-t border-neutral-200 pt-3 dark:border-neutral-800">
                  <h5 className="mb-2 font-bold text-neutral-900 dark:text-white">
                    Lampiran Foto ({selectedAssessment.attachments.length}):
                  </h5>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {selectedAssessment.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={`${att.url}?disposition=inline`}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col items-center rounded-xl border border-neutral-200 bg-neutral-50 p-2 hover:border-emerald-400 dark:border-neutral-700 dark:bg-neutral-800/60"
                      >
                        {att.mimeType.startsWith('image/') ? (
                          <img
                            src={att.url}
                            alt={att.originalName}
                            className="h-24 w-full rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-full items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                            <AttachmentIcon mimeType={att.mimeType} />
                          </div>
                        )}
                        <span className="mt-1.5 max-w-full truncate text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                          {att.originalName}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setDeletingAssessment(selectedAssessment)
                  setSelectedAssessment(null)
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
              >
                <Trash2 className="h-4 w-4" /> Hapus Asesmen
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`/paud-assessments/${selectedAssessment.id}/export/pdf`}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download className="h-4 w-4" /> Unduh PDF
                </a>
                <a
                  href={`/paud-assessments/${selectedAssessment.id}/export`}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                >
                  <Download className="h-4 w-4" /> Unduh DOCX
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {deletingAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
          >
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">
              Hapus Asesmen Ini?
            </h4>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Asesmen milik <strong>{deletingAssessment.student.fullName}</strong> (
              {typeLabels[deletingAssessment.type]}) beserta seluruh foto lampiran akan dihapus
              permanen.
            </p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingAssessment(null)}
                className="cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Ya, Hapus
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Assistant Modal */}
      <AiAssessmentModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onApply={handleApplyFromAi}
        classes={classes}
        curriculumObjectives={curriculumObjectives}
        initialType={filterType === 'all' ? 'anecdotal_note' : filterType}
      />

      {/* Bundle Export Modal */}
      <BundleExportModal
        isOpen={showBundleModal}
        onClose={() => setShowBundleModal(false)}
        classes={classes}
      />
    </DashboardWrapper>
  )
}
