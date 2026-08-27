import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
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
  X,
  Sparkles,
  Download,
  ChevronDown,
  Layers,
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
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              data-tour="assessment-ai"
              type="button"
              onClick={() => setShowAiModal(true)}
              disabled={!hasClasses || !hasStudents}
              className="btn-kawaii-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              Buat dengan AI
            </button>

            <button
              data-tour="assessment-create"
              type="button"
              onClick={() => setShowAddModal(true)}
              disabled={!hasClasses || !hasStudents}
              className="btn-kawaii-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Catat Manual
            </button>

            {/* Aksi & Opsi Popover Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                className="btn-kawaii-secondary"
              >
                <span>Aksi & Opsi</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showActionsDropdown && (
                <div
                  className="absolute right-0 z-30 mt-2 w-64 rounded-2xl border-2 border-black bg-white p-2.5 shadow-[6px_6px_0px_#000000] dark:border-white dark:bg-neutral-900 dark:shadow-[6px_6px_0px_#ffffff]"
                  onMouseLeave={() => setShowActionsDropdown(false)}
                >
                  <button
                    data-tour="assessment-bundle"
                    type="button"
                    onClick={() => {
                      setShowActionsDropdown(false)
                      setShowBundleModal(true)
                    }}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-transparent p-2.5 text-left text-xs font-bold text-neutral-800 transition-all hover:border-black hover:bg-emerald-100 dark:text-neutral-200 dark:hover:border-white dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300"
                  >
                    <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Ekspor Bundel Dokumen (PPM KBC)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowActionsDropdown(false)
                      window.dispatchEvent(new CustomEvent('start-paud-tour'))
                    }}
                    className="mt-1 flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-transparent p-2.5 text-left text-xs font-bold text-neutral-800 transition-all hover:border-black hover:bg-neutral-100 dark:text-neutral-200 dark:hover:border-white dark:hover:bg-neutral-800"
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
          <div className="flex items-center gap-3 rounded-2xl border-2 border-black bg-amber-100 p-4 shadow-[4px_4px_0px_#000000] dark:border-white dark:bg-amber-950/40 dark:shadow-[4px_4px_0px_#ffffff]">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-950 dark:text-amber-300" />
            <div className="flex-1 text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
              <span>Kelompok Belajar Belum Ada:</span> Silakan tambahkan kelompok (kelas) terlebih
              dahulu sebelum membuat asesmen.
            </div>
            <Link href="/classes" className="btn-kawaii-amber !py-1.5 !px-3 !text-xs font-bold">
              Buat Kelompok →
            </Link>
          </div>
        )}

        {hasClasses && !hasStudents && (
          <div className="flex items-center gap-3 rounded-2xl border-2 border-black bg-amber-100 p-4 shadow-[4px_4px_0px_#000000] dark:border-white dark:bg-amber-950/40 dark:shadow-[4px_4px_0px_#ffffff]">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-950 dark:text-amber-300" />
            <div className="flex-1 text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
              <span>Daftar Siswa Belum Ada:</span> Tambahkan data anak didik ke dalam kelompok agar
              asesmen dapat dicatat per anak.
            </div>
          </div>
        )}

        {/* Filters Tabs */}
        <div data-tour="assessment-filters" className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={cn(
              filterType === 'all'
                ? 'btn-kawaii-primary !py-1.5 !px-3.5 !text-xs'
                : 'btn-kawaii-secondary !py-1.5 !px-3.5 !text-xs'
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
                  'inline-flex items-center gap-1.5',
                  filterType === t
                    ? 'btn-kawaii-primary !py-1.5 !px-3.5 !text-xs'
                    : 'btn-kawaii-secondary !py-1.5 !px-3.5 !text-xs'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{typeLabels[t]}</span>
                <span className="ml-0.5 rounded-full border border-black/20 bg-black/10 px-1.5 py-0.2 text-[10px] font-black dark:border-white/20 dark:bg-white/20">
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Assessment Items Grid / Cards */}
        {filteredAssessments.length === 0 ? (
          <div className="card-kawaii py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-neutral-100 shadow-[3px_3px_0px_#000000] dark:border-white dark:bg-neutral-800 dark:shadow-[3px_3px_0px_#ffffff]">
              <ClipboardList className="h-8 w-8 text-neutral-700 dark:text-neutral-300" />
            </div>
            <h3 className="mt-4 text-lg font-black text-neutral-900 dark:text-white">
              Belum Ada Asesmen
            </h3>
            <p className="mt-1 text-xs font-medium text-neutral-600 dark:text-neutral-400">
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
                  className="card-kawaii flex flex-col justify-between p-5 transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000]"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-black bg-emerald-200 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-emerald-900/60">
                          <ItemIcon className="h-5 w-5 text-emerald-950 dark:text-emerald-200" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-neutral-900 dark:text-white">
                            {item.student.fullName}
                          </h4>
                          <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                            Kelompok {item.schoolClass.name} •{' '}
                            {new Date(item.date).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>

                      <span className="badge-kawaii-emerald shrink-0 whitespace-nowrap text-xs">
                        {typeLabels[item.type]}
                      </span>
                    </div>

                    {/* Theme Badge */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-lg border-2 border-black/20 bg-neutral-100 px-2.5 py-0.5 text-[11px] font-bold text-neutral-800 dark:border-white/20 dark:bg-neutral-800 dark:text-neutral-200">
                        Tema: {themeName}
                      </span>
                    </div>

                    {/* Content Snippet */}
                    <div className="mt-3 rounded-2xl border-2 border-black/15 bg-neutral-50 p-3.5 text-xs text-neutral-800 dark:border-white/20 dark:bg-neutral-800/50 dark:text-neutral-200">
                      {item.type === 'anecdotal_note' && (
                        <div className="space-y-1.5">
                          <p>
                            <strong className="font-black text-neutral-900 dark:text-white">
                              Kejadian:{' '}
                            </strong>
                            {rawContent.observedEvent || rawContent.behavior || '-'}
                          </p>
                          <p className="text-neutral-700 dark:text-neutral-300">
                            <strong className="font-black text-neutral-900 dark:text-white">
                              Analisis:{' '}
                            </strong>
                            {rawContent.achievementAnalysis || rawContent.analysis || '-'}
                          </p>
                        </div>
                      )}

                      {item.type === 'checklist' && (
                        <div>
                          <p className="font-black text-neutral-900 dark:text-white">
                            Indikator Teramati:
                          </p>
                          <ul className="mt-1 list-inside list-disc space-y-0.5 font-medium text-neutral-700 dark:text-neutral-300">
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
                        <div className="space-y-1.5">
                          <p className="font-black text-neutral-900 dark:text-white">
                            {rawContent.workTitle || rawContent.photoDescription || 'Hasil Karya'}
                          </p>
                          <p className="text-neutral-700 dark:text-neutral-300">
                            {rawContent.workDescription || rawContent.description || '-'}
                          </p>
                        </div>
                      )}

                      {item.type === 'photo_series' && (
                        <div className="space-y-1.5">
                          <p className="font-black text-neutral-900 dark:text-white">
                            {rawContent.activityTitle || rawContent.activity || 'Foto Berseri'}
                          </p>
                          <p className="text-neutral-700 dark:text-neutral-300">
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
                            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black/30 bg-white px-2.5 py-1 text-[11px] font-bold text-neutral-800 shadow-[2px_2px_0px_#000000] hover:translate-y-[-1px] dark:border-white/30 dark:bg-neutral-800 dark:text-neutral-200 dark:shadow-[2px_2px_0px_#ffffff]"
                          >
                            <AttachmentIcon mimeType={att.mimeType} />
                            <span className="max-w-[120px] truncate">{att.originalName}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-4 flex items-center justify-between border-t-2 border-black/10 pt-3 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setSelectedAssessment(item)}
                      className="btn-kawaii-secondary !py-1.5 !px-3 !text-xs font-bold"
                    >
                      Lihat Rinci
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/paud-assessments/${item.id}/export/pdf`}
                        className="btn-kawaii-secondary !py-1.5 !px-2.5 !text-xs !bg-rose-100 hover:!bg-rose-200 !text-rose-950 font-bold"
                        title="Unduh format PDF PPM KBC"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </a>

                      <a
                        href={`/paud-assessments/${item.id}/export`}
                        className="btn-kawaii-secondary !py-1.5 !px-2.5 !text-xs !bg-emerald-100 hover:!bg-emerald-200 !text-emerald-950 font-bold"
                        title="Unduh format Word DOCX PPM KBC"
                      >
                        <Download className="h-3.5 w-3.5" /> DOCX
                      </a>

                      <button
                        type="button"
                        onClick={() => setDeletingAssessment(item)}
                        className="btn-kawaii-secondary !p-1.5 !text-red-600 hover:!text-red-700 hover:!bg-red-50"
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
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[8px_8px_0px_#000000] dark:border-white dark:bg-neutral-900 dark:shadow-[8px_8px_0px_#ffffff]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b-2 border-black px-6 py-4 dark:border-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-black bg-emerald-200 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-emerald-900/60">
                  <ClipboardList className="h-5 w-5 text-emerald-950 dark:text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white">
                    Catat Asesmen Manual
                  </h3>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Formulir pencatatan langsung instrumen asesmen pembelajaran PPM KBC
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-kawaii-secondary !p-2 !rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-4 overflow-x-hidden overflow-y-auto p-6 text-sm">
              {/* Instrument Selection */}
              <div>
                <span
                  id="manual-instrument-label"
                  className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                >
                  Pilih Instrumen Asesmen
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby="manual-instrument-label"
                  className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4"
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
                      className={cn(
                        data.type === t.id
                          ? 'btn-kawaii-primary !py-2 !px-2.5 !text-xs'
                          : 'btn-kawaii-secondary !py-2 !px-2.5 !text-xs'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Student, Class & Date */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="manual-class-select"
                    className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
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
                    className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
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
                    className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                  >
                    Nama Siswa
                  </label>
                  <select
                    id="manual-student-select"
                    value={data.studentId}
                    onChange={(e) => setData('studentId', Number(e.target.value))}
                    className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
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
                    className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                  >
                    Tanggal
                  </label>
                  <input
                    id="manual-date-input"
                    type="date"
                    value={data.date}
                    onChange={(e) => setData('date', e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Theme / Topik */}
              <div>
                <label
                  htmlFor="manual-theme-input"
                  className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                >
                  Tema / Topik Pembelajaran
                </label>
                <input
                  id="manual-theme-input"
                  type="text"
                  value={data.theme}
                  onChange={(e) => setData('theme', e.target.value)}
                  placeholder="Contoh: Kenalkan, Diriku, Indonesiaku"
                  className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                />
              </div>

              {/* Type specific fields in Card */}
              {data.type === 'anecdotal_note' && (
                <div className="space-y-3 rounded-2xl border-2 border-black/20 bg-neutral-50 p-4 dark:border-white/20 dark:bg-neutral-800/40">
                  <div>
                    <label
                      htmlFor="manual-context-input"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                    >
                      Latar Kejadian / Waktu
                    </label>
                    <input
                      id="manual-context-input"
                      type="text"
                      value={data.context}
                      onChange={(e) => setData('context', e.target.value)}
                      placeholder="Contoh: Saat bermain balok di sudut konstruksi..."
                      className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manual-observedevent-input"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                    >
                      Peristiwa / Perilaku Teramati
                    </label>
                    <textarea
                      id="manual-observedevent-input"
                      value={data.observedEvent}
                      onChange={(e) => setData('observedEvent', e.target.value)}
                      rows={3}
                      placeholder="Deskripsikan fakta obyektif kejadian yang teramati..."
                      className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white p-3 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manual-analysis-input"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                    >
                      Analisis Capaian Perkembangan
                    </label>
                    <textarea
                      id="manual-analysis-input"
                      value={data.achievementAnalysis}
                      onChange={(e) => setData('achievementAnalysis', e.target.value)}
                      rows={2}
                      placeholder="Analisis kemandirian, empati, atau regulasi diri anak..."
                      className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white p-3 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {data.type === 'checklist' && (
                <div className="space-y-3 rounded-2xl border-2 border-black/20 bg-neutral-50 p-4 dark:border-white/20 dark:bg-neutral-800/40">
                  <div>
                    <label
                      htmlFor="manual-indicatorstext-input"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                    >
                      Daftar Indikator IKTP (Satu baris per indikator)
                    </label>
                    <textarea
                      id="manual-indicatorstext-input"
                      value={data.indicatorsText}
                      onChange={(e) => setData('indicatorsText', e.target.value)}
                      rows={4}
                      placeholder={`Contoh:\n- Menyebutkan nama teman dengan ramah (Sudah)\n- Mengembalikan mainan ke tempatnya (Belum)`}
                      className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white p-3 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manual-note-input"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                    >
                      Catatan Tambahan Guru
                    </label>
                    <input
                      id="manual-note-input"
                      type="text"
                      value={data.note}
                      onChange={(e) => setData('note', e.target.value)}
                      placeholder="Contoh: Perlu stimulasi konsistensi saat beres-beres mainan"
                      className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {data.type === 'work_sample' && (
                <div className="space-y-3 rounded-2xl border-2 border-black/20 bg-neutral-50 p-4 dark:border-white/20 dark:bg-neutral-800/40">
                  <div>
                    <label
                      htmlFor="manual-worktitle-input"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                    >
                      Nama / Judul Hasil Karya
                    </label>
                    <input
                      id="manual-worktitle-input"
                      type="text"
                      value={data.workTitle}
                      onChange={(e) => setData('workTitle', e.target.value)}
                      placeholder="Contoh: Lukisan Jari 'Kebunku Indah'"
                      className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manual-workdesc-input"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                    >
                      Deskripsi Foto / Celoteh Anak
                    </label>
                    <textarea
                      id="manual-workdesc-input"
                      value={data.workDescription}
                      onChange={(e) => setData('workDescription', e.target.value)}
                      rows={3}
                      placeholder="Contoh: 'Ini gambar pohon apel merah yang besar di rumah nenek...'"
                      className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white p-3 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manual-workanalysis-input"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                    >
                      Analisis Capaian Perkembangan
                    </label>
                    <textarea
                      id="manual-workanalysis-input"
                      value={data.achievementAnalysis}
                      onChange={(e) => setData('achievementAnalysis', e.target.value)}
                      rows={2}
                      placeholder="Analisis motorik halus, koordinasi mata-tangan, kreativitas..."
                      className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white p-3 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                    />
                  </div>

                  {/* Centered Single Image Upload Dropzone */}
                  <div>
                    <label
                      htmlFor="manual-upload-worksample"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                    >
                      Upload Foto Hasil Karya
                    </label>
                    <div className="mt-1.5 space-y-2">
                      <label
                        htmlFor="manual-upload-worksample"
                        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black bg-white p-5 text-center transition-all hover:bg-emerald-50 dark:border-white dark:bg-neutral-800/40 dark:hover:bg-neutral-800"
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <UploadCloud className="mb-2 h-8 w-8 text-neutral-700 dark:text-neutral-300" />
                          <p className="mb-1 text-xs font-bold text-neutral-900 dark:text-white">
                            <span className="text-emerald-600 dark:text-emerald-400 underline">
                              Klik untuk unggah
                            </span>{' '}
                            atau seret foto ke sini
                          </p>
                          <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
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
                        <div className="flex items-center justify-between rounded-xl border-2 border-black bg-white p-2 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-neutral-800 dark:shadow-[2px_2px_0px_#ffffff]">
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black bg-emerald-200 text-xs font-bold text-emerald-950 dark:border-white dark:bg-emerald-900 dark:text-emerald-200">
                              1
                            </span>
                            <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                              {selectedFiles[0]?.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedFiles([])}
                            className="btn-kawaii-secondary !p-1.5 !text-red-600 hover:!text-red-700"
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
                <div className="space-y-3 rounded-2xl border-2 border-black/20 bg-neutral-50 p-4 dark:border-white/20 dark:bg-neutral-800/40">
                  <div>
                    <label
                      htmlFor="manual-activitytitle-input"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                    >
                      Judul Kegiatan / Proyek
                    </label>
                    <input
                      id="manual-activitytitle-input"
                      type="text"
                      value={data.activityTitle}
                      onChange={(e) => setData('activityTitle', e.target.value)}
                      placeholder="Contoh: Membuat Kolase Daun Kering"
                      className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="manual-stage1-input"
                        className="block text-xs font-bold text-neutral-700 dark:text-neutral-300"
                      >
                        Deskripsi Tahap 1 (Awal)
                      </label>
                      <textarea
                        id="manual-stage1-input"
                        value={data.stage1}
                        onChange={(e) => setData('stage1', e.target.value)}
                        rows={2}
                        placeholder="Tahap persiapan..."
                        className="mt-1 w-full rounded-xl border-2 border-black bg-white p-2.5 text-xs font-bold text-neutral-900 focus:shadow-[2px_2px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="manual-stage2-input"
                        className="block text-xs font-bold text-neutral-700 dark:text-neutral-300"
                      >
                        Deskripsi Tahap 2 (Proses)
                      </label>
                      <textarea
                        id="manual-stage2-input"
                        value={data.stage2}
                        onChange={(e) => setData('stage2', e.target.value)}
                        rows={2}
                        placeholder="Tahap pengerjaan..."
                        className="mt-1 w-full rounded-xl border-2 border-black bg-white p-2.5 text-xs font-bold text-neutral-900 focus:shadow-[2px_2px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="manual-stage3-input"
                        className="block text-xs font-bold text-neutral-700 dark:text-neutral-300"
                      >
                        Deskripsi Tahap 3 (Hasil)
                      </label>
                      <textarea
                        id="manual-stage3-input"
                        value={data.stage3}
                        onChange={(e) => setData('stage3', e.target.value)}
                        rows={2}
                        placeholder="Tahap penyelesaian..."
                        className="mt-1 w-full rounded-xl border-2 border-black bg-white p-2.5 text-xs font-bold text-neutral-900 focus:shadow-[2px_2px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="manual-stageanalysis-input"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                    >
                      Analisis Capaian Perkembangan
                    </label>
                    <textarea
                      id="manual-stageanalysis-input"
                      value={data.achievementAnalysis}
                      onChange={(e) => setData('achievementAnalysis', e.target.value)}
                      rows={2}
                      placeholder="Analisis konsistensi dan kemandirian anak sepanjang kegiatan..."
                      className="mt-1.5 w-full rounded-2xl border-2 border-black bg-white p-3 text-xs sm:text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                    />
                  </div>

                  {/* Centered Multi Image Upload Dropzone */}
                  <div>
                    <label
                      htmlFor="manual-upload-photoseries"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                    >
                      Upload Foto Berseri (Maksimal 3 Foto)
                    </label>
                    <div className="mt-1.5 space-y-2">
                      <label
                        htmlFor="manual-upload-photoseries"
                        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black bg-white p-5 text-center transition-all hover:bg-emerald-50 dark:border-white dark:bg-neutral-800/40 dark:hover:bg-neutral-800"
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <UploadCloud className="mb-2 h-8 w-8 text-neutral-700 dark:text-neutral-300" />
                          <p className="mb-1 text-xs font-bold text-neutral-900 dark:text-white">
                            <span className="text-emerald-600 dark:text-emerald-400 underline">
                              Klik untuk unggah
                            </span>{' '}
                            atau seret foto ke sini
                          </p>
                          <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
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
                              className="flex items-center justify-between rounded-xl border-2 border-black bg-white p-2 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-neutral-800 dark:shadow-[2px_2px_0px_#ffffff]"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-black bg-emerald-200 text-[11px] font-bold text-emerald-950 dark:border-white dark:bg-emerald-900 dark:text-emerald-200">
                                  T{fIdx + 1}
                                </span>
                                <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedFiles((prev) => prev.filter((_, i) => i !== fIdx))
                                }
                                className="btn-kawaii-secondary !p-1.5 !text-red-600 hover:!text-red-700"
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
            <div className="flex items-center justify-between border-t-2 border-black px-6 py-4 dark:border-white">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-kawaii-secondary"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveAssessment}
                disabled={processing}
                className="btn-kawaii-primary disabled:opacity-50"
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
            className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-3xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000000] dark:border-white dark:bg-neutral-900 dark:shadow-[8px_8px_0px_#ffffff]"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="badge-kawaii-emerald text-xs">
                  {typeLabels[selectedAssessment.type]}
                </span>
                <h3 className="mt-2 text-xl font-black text-neutral-900 dark:text-white">
                  {selectedAssessment.student.fullName}
                </h3>
                <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                  Kelompok {selectedAssessment.schoolClass.name} •{' '}
                  {new Date(selectedAssessment.date).toLocaleDateString('id-ID')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssessment(null)}
                className="btn-kawaii-secondary !p-2 !rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 space-y-4 overflow-y-auto text-sm text-neutral-800 dark:text-neutral-200 pr-1">
              {selectedAssessment.type === 'anecdotal_note' && (
                <div className="space-y-3">
                  <div>
                    <h5 className="font-black text-neutral-900 dark:text-white">Latar Kejadian:</h5>
                    <p className="mt-1 rounded-2xl border-2 border-black/15 bg-neutral-50 p-3.5 text-neutral-800 dark:border-white/15 dark:bg-neutral-800/50 dark:text-neutral-200">
                      {selectedAssessment.content.context || '-'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-black text-neutral-900 dark:text-white">
                      Kejadian Teramati:
                    </h5>
                    <p className="mt-1 rounded-2xl border-2 border-black/15 bg-neutral-50 p-3.5 text-neutral-800 dark:border-white/15 dark:bg-neutral-800/50 dark:text-neutral-200">
                      {selectedAssessment.content.observedEvent ||
                        selectedAssessment.content.behavior ||
                        '-'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-black text-neutral-900 dark:text-white">
                      Analisis Capaian Perkembangan:
                    </h5>
                    <p className="mt-1 rounded-2xl border-2 border-black/15 bg-neutral-50 p-3.5 text-neutral-800 dark:border-white/15 dark:bg-neutral-800/50 dark:text-neutral-200">
                      {selectedAssessment.content.achievementAnalysis ||
                        selectedAssessment.content.analysis ||
                        '-'}
                    </p>
                  </div>
                </div>
              )}

              {selectedAssessment.type === 'checklist' && (
                <div className="space-y-3">
                  <h5 className="font-black text-neutral-900 dark:text-white">Indikator IKTP:</h5>
                  <div className="space-y-2">
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
                          className="flex items-center justify-between rounded-2xl border-2 border-black/15 bg-neutral-50 p-3 dark:border-white/15 dark:bg-neutral-800/50"
                        >
                          <span className="font-bold text-neutral-900 dark:text-neutral-100">
                            {name}
                          </span>
                          <span
                            className={cn(
                              'shrink-0',
                              isAppeared ? 'badge-kawaii-emerald' : 'badge-kawaii-coral'
                            )}
                          >
                            {isAppeared ? 'Sudah Muncul' : 'Belum Muncul'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  {selectedAssessment.content.note && (
                    <div>
                      <h5 className="font-black text-neutral-900 dark:text-white">Catatan Guru:</h5>
                      <p className="mt-1 rounded-2xl border-2 border-black/15 bg-neutral-50 p-3.5 italic text-neutral-800 dark:border-white/15 dark:bg-neutral-800/50 dark:text-neutral-200">
                        {selectedAssessment.content.note}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedAssessment.type === 'work_sample' && (
                <div className="space-y-3">
                  <div>
                    <h5 className="font-black text-neutral-900 dark:text-white">Judul Karya:</h5>
                    <p className="mt-1 rounded-2xl border-2 border-black/15 bg-neutral-50 p-3.5 font-bold text-neutral-900 dark:border-white/15 dark:bg-neutral-800/50 dark:text-white">
                      {selectedAssessment.content.workTitle ||
                        selectedAssessment.content.photoDescription ||
                        '-'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-black text-neutral-900 dark:text-white">
                      Deskripsi Foto / Celoteh Anak:
                    </h5>
                    <p className="mt-1 rounded-2xl border-2 border-black/15 bg-neutral-50 p-3.5 text-neutral-800 dark:border-white/15 dark:bg-neutral-800/50 dark:text-neutral-200">
                      {selectedAssessment.content.workDescription ||
                        selectedAssessment.content.description ||
                        '-'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-black text-neutral-900 dark:text-white">
                      Analisis Capaian Perkembangan:
                    </h5>
                    <p className="mt-1 rounded-2xl border-2 border-black/15 bg-neutral-50 p-3.5 text-neutral-800 dark:border-white/15 dark:bg-neutral-800/50 dark:text-neutral-200">
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
                    <h5 className="font-black text-neutral-900 dark:text-white">
                      Kegiatan Proyek:
                    </h5>
                    <p className="mt-1 rounded-2xl border-2 border-black/15 bg-neutral-50 p-3.5 font-bold text-neutral-900 dark:border-white/15 dark:bg-neutral-800/50 dark:text-white">
                      {selectedAssessment.content.activityTitle ||
                        selectedAssessment.content.activity ||
                        '-'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-black text-neutral-900 dark:text-white">Tahapan:</h5>
                    <div className="mt-1 space-y-2">
                      {(
                        selectedAssessment.content.stepDescriptions ||
                        (selectedAssessment.content.narrative
                          ? [selectedAssessment.content.narrative]
                          : [])
                      ).map((step: string, sIdx: number) => (
                        <div
                          key={sIdx}
                          className="rounded-2xl border-2 border-black/15 bg-neutral-50 p-3 text-xs text-neutral-800 dark:border-white/15 dark:bg-neutral-800/50 dark:text-neutral-200"
                        >
                          <strong className="text-neutral-900 dark:text-white">
                            Tahap {sIdx + 1}:
                          </strong>{' '}
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-black text-neutral-900 dark:text-white">
                      Analisis Capaian Perkembangan:
                    </h5>
                    <p className="mt-1 rounded-2xl border-2 border-black/15 bg-neutral-50 p-3.5 text-neutral-800 dark:border-white/15 dark:bg-neutral-800/50 dark:text-neutral-200">
                      {selectedAssessment.content.achievementAnalysis ||
                        selectedAssessment.content.analysis ||
                        '-'}
                    </p>
                  </div>
                </div>
              )}

              {/* Attachments in Detail */}
              {selectedAssessment.attachments && selectedAssessment.attachments.length > 0 && (
                <div className="border-t-2 border-black/15 pt-3 dark:border-white/15">
                  <h5 className="mb-2 font-black text-neutral-900 dark:text-white">
                    Lampiran Foto ({selectedAssessment.attachments.length}):
                  </h5>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {selectedAssessment.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={`${att.url}?disposition=inline`}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col items-center rounded-2xl border-2 border-black bg-neutral-50 p-2 shadow-[2px_2px_0px_#000000] hover:translate-y-[-1px] dark:border-white dark:bg-neutral-800/60 dark:shadow-[2px_2px_0px_#ffffff]"
                      >
                        {att.mimeType.startsWith('image/') ? (
                          <img
                            src={att.url}
                            alt={att.originalName}
                            className="h-24 w-full rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-full items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                            <AttachmentIcon mimeType={att.mimeType} />
                          </div>
                        )}
                        <span className="mt-1.5 max-w-full truncate text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
                          {att.originalName}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-4 flex items-center justify-between border-t-2 border-black/15 pt-4 dark:border-white/15">
              <button
                type="button"
                onClick={() => {
                  setDeletingAssessment(selectedAssessment)
                  setSelectedAssessment(null)
                }}
                className="btn-kawaii-secondary !text-red-600 hover:!text-red-700 hover:!bg-red-50 !py-2 !px-3.5 !text-xs font-bold"
              >
                <Trash2 className="h-4 w-4" /> Hapus Asesmen
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`/paud-assessments/${selectedAssessment.id}/export/pdf`}
                  className="btn-kawaii-secondary !py-2 !px-3.5 !text-xs !bg-rose-100 hover:!bg-rose-200 !text-rose-950 font-bold"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download className="h-4 w-4" /> Unduh PDF
                </a>
                <a
                  href={`/paud-assessments/${selectedAssessment.id}/export`}
                  className="btn-kawaii-primary !py-2 !px-3.5 !text-xs font-bold"
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
            className="w-full max-w-md rounded-3xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000000] dark:border-white dark:bg-neutral-900 dark:shadow-[8px_8px_0px_#ffffff]"
          >
            <h4 className="text-xl font-black text-neutral-900 dark:text-white">
              Hapus Asesmen Ini?
            </h4>
            <p className="mt-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Asesmen milik{' '}
              <strong className="text-neutral-900 dark:text-white">
                {deletingAssessment.student.fullName}
              </strong>{' '}
              ({typeLabels[deletingAssessment.type]}) beserta seluruh foto lampiran akan dihapus
              permanen.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingAssessment(null)}
                className="btn-kawaii-secondary flex-1"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn-kawaii-primary !bg-red-500 hover:!bg-red-400 !text-white flex-1"
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
