import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileQuestion,
  Image as ImageIcon,
  LoaderCircle,
  PenLine,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { cn } from '~/lib/utils'

export type ExamType = 'midterm' | 'final' | 'daily' | 'summative'

export const EXAM_TYPES: { value: ExamType; label: string; short: string }[] = [
  { value: 'daily', label: 'Ulangan Harian', short: 'Harian' },
  { value: 'midterm', label: 'PTS (Penilaian Tengah Semester)', short: 'PTS' },
  { value: 'final', label: 'PAS (Penilaian Akhir Semester)', short: 'PAS' },
  { value: 'summative', label: 'Sumatif', short: 'Sumatif' },
]

export const examTypeLabel = (type: ExamType) =>
  EXAM_TYPES.find((t) => t.value === type)?.short ?? type

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface Subject {
  id: number
  name: string
}

interface Exam {
  id: number
  title: string
  type: ExamType
  status: 'draft' | 'published'
  questions: unknown[]
  createdAt: string
  schoolClass: SchoolClass
  generationStatus?: GenerationStatus
  generationProgress?: GenerationProgress
}

type GenerationStatus =
  'queued' | 'researching' | 'generating_questions' | 'generating_images' | 'completed' | 'failed'

interface GenerationError {
  stage: GenerationStatus
  message: string
  questionId?: number
  item?: number
}

interface GenerationProgress {
  stage: GenerationStatus
  current: number
  total: number
  message: string
  errors: GenerationError[]
}

interface ExamsIndexProps {
  readonly exams: Exam[]
  readonly classes: SchoolClass[]
  readonly subjects: Subject[]
}

export default function ExamsIndex({ exams, classes, subjects }: ExamsIndexProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [deletingExam, setDeletingExam] = useState<Exam | null>(null)
  const [generation, setGeneration] = useState<{
    examId: number
    status: GenerationStatus
    progress: GenerationProgress
  } | null>(null)
  const [pollingExamId, setPollingExamId] = useState<number | null>(null)
  const [requestError, setRequestError] = useState('')

  const hasClasses = classes.length > 0
  const hasSubjects = subjects.length > 0
  const canGenerate = hasClasses && hasSubjects

  const { data, setData, errors, reset } = useForm({
    classId: classes[0]?.id || 0,
    subject: '',
    type: 'daily' as ExamType,
    examMode: 'tertulis_visual' as
      'tertulis_visual' | 'lisan' | 'multiple_choice' | 'essay' | 'practical',
    topic: '',
    questionCount: 5,
  })

  const getXsrfToken = () => {
    const match = /XSRF-TOKEN=([^;]+)/.exec(document.cookie)
    return match ? decodeURIComponent(match[1]) : ''
  }

  const initialGenerationProgress = (): GenerationProgress => ({
    stage: 'queued',
    current: 0,
    total: 0,
    message: 'Menunggu proses pembuatan naskah...',
    errors: [],
  })

  const resetGeneration = () => {
    setGeneration(null)
    setPollingExamId(null)
    setRequestError('')
    reset()
  }

  const handleGenerate = async () => {
    setRequestError('')
    setGeneration({ examId: 0, status: 'queued', progress: initialGenerationProgress() })

    try {
      const response = await fetch('/exams/generate', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getXsrfToken(),
        },
        body: JSON.stringify(data),
      })
      const payload = (await response.json().catch(() => null)) as {
        examId?: number
        status?: GenerationStatus
        progress?: GenerationProgress
        message?: string
        errors?: { field?: string; message?: string }[]
      } | null

      if (!response.ok || !payload?.examId) {
        const validationMessage = payload?.errors
          ?.map((error) => error.message)
          .filter(Boolean)
          .join(', ')
        setRequestError(validationMessage || payload?.message || 'Pembuatan naskah gagal dimulai.')
        setGeneration(null)
        return
      }

      setGeneration({
        examId: payload.examId,
        status: payload.status || 'queued',
        progress: payload.progress || initialGenerationProgress(),
      })
      setPollingExamId(payload.examId)
    } catch {
      setRequestError('Tidak dapat terhubung ke server. Coba lagi.')
      setGeneration(null)
    }
  }

  useEffect(() => {
    if (!pollingExamId) return
    let active = true

    const poll = async () => {
      try {
        const response = await fetch(`/exams/${pollingExamId}/generation-status`, {
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
        })
        const payload = (await response.json().catch(() => null)) as {
          status?: GenerationStatus
          progress?: GenerationProgress
        } | null
        if (!active || !response.ok || !payload?.status || !payload.progress) return

        setGeneration((current) =>
          current ? { ...current, status: payload.status!, progress: payload.progress! } : current
        )
        if (payload.status === 'completed' || payload.status === 'failed') {
          setPollingExamId(null)
          router.reload({ only: ['exams'] })
        }
      } catch {
        // Poll berikutnya tetap mencoba; proses backend tidak dibatalkan oleh gangguan jaringan.
      }
    }

    void poll()
    const interval = window.setInterval(() => void poll(), 1000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [pollingExamId])

  const handleDelete = () => {
    if (!deletingExam) return
    router.delete(`/exams/${deletingExam.id}`, {
      onSuccess: () => setDeletingExam(null),
    })
  }

  const isMajorExam = (type: ExamType) => type === 'midterm' || type === 'final'
  const isGenerating = Boolean(
    generation && generation.status !== 'completed' && generation.status !== 'failed'
  )
  const generationStages: {
    id: GenerationStatus
    label: string
    icon: typeof Search
  }[] = [
    { id: 'researching', label: 'Meriset kurikulum dan menyusun struktur soal', icon: Search },
    {
      id: 'generating_questions',
      label: 'Memformulasikan pertanyaan dan kunci jawaban',
      icon: PenLine,
    },
    {
      id: 'generating_images',
      label: 'Menyiapkan ilustrasi visual dan gambar soal',
      icon: ImageIcon,
    },
  ]
  const generationStageRank = (stage: GenerationStatus) => {
    const ranks: Record<GenerationStatus, number> = {
      queued: 0,
      researching: 1,
      generating_questions: 2,
      generating_images: 3,
      completed: 4,
      failed: -1,
    }
    return ranks[stage]
  }
  const openGenerateModal = () => {
    resetGeneration()
    setShowGenerateModal(true)
  }

  return (
    <DashboardWrapper
      title="Bank Soal"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Bank Soal' }]}
    >
      <Head title="Bank Soal" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Bank Soal</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Generate soal PTS/PAS dengan AI
            </p>
          </div>
          <button
            onClick={openGenerateModal}
            disabled={!canGenerate}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Generate Soal
          </button>
        </div>

        {/* Prasyarat belum lengkap */}
        {!canGenerate && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Lengkapi dulu sebelum bisa generate soal:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {!hasClasses && (
                <Link
                  href="/classes"
                  className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60"
                >
                  Buat kelas dulu →
                </Link>
              )}
              {!hasSubjects && (
                <Link
                  href="/subjects"
                  className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60"
                >
                  Tambah mata pelajaran dulu →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Daftar Soal */}
        {exams.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <FileQuestion className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada soal
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Generate soal pertama Anda dengan AI
            </p>
            <button
              onClick={openGenerateModal}
              disabled={!canGenerate}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Generate Soal
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {exams.map((item) => (
              <div
                key={item.id}
                role="link"
                tabIndex={0}
                onClick={() => router.visit(`/exams/${item.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') router.visit(`/exams/${item.id}`)
                }}
                className="cursor-pointer rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {item.title}
                      </h3>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          isMajorExam(item.type)
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        )}
                      >
                        {examTypeLabel(item.type)}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          item.generationStatus && item.generationStatus !== 'completed'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                            : item.status === 'published'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        )}
                      >
                        {item.generationStatus && item.generationStatus !== 'completed'
                          ? item.generationStatus === 'failed'
                            ? 'Gagal dibuat'
                            : 'Sedang dibuat'
                          : item.status === 'published'
                            ? 'Terbit'
                            : 'Draf'}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      Kelas {item.schoolClass.name} • {(item.questions ?? []).length} soal
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      onClick={() => setDeletingExam(item)}
                      className="rounded-lg border border-neutral-200 p-2 text-red-600 transition-colors hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Generate */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Generate Soal dengan AI
              </h3>
            </div>
            {generation ? (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {isGenerating ? (
                      <LoaderCircle className="h-6 w-6 animate-spin" />
                    ) : generation.status === 'completed' ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <AlertCircle className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                      {isGenerating
                        ? 'Sedang Membuat Naskah Soal...'
                        : generation.status === 'completed'
                          ? 'Naskah Soal Selesai'
                          : 'Pembuatan Naskah Berhenti'}
                    </h4>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {generation.progress.message}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 rounded-xl bg-neutral-50 p-4 text-left dark:bg-neutral-800/50">
                  {generationStages.map((stage, index) => {
                    const stageRank = generationStageRank(stage.id)
                    const currentRank = generationStageRank(generation.progress.stage)
                    const complete = generation.status === 'completed' || currentRank > stageRank
                    const active = isGenerating && generation.progress.stage === stage.id
                    const Icon = stage.icon
                    return (
                      <div
                        key={stage.id}
                        className={cn(
                          'flex items-center gap-2.5 text-xs font-semibold',
                          complete || active
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-neutral-500 dark:text-neutral-400'
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]',
                            complete || active
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                          )}
                        >
                          {complete ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
                        </span>
                        <Icon className="h-3.5 w-3.5" />
                        <span>{stage.label}</span>
                        {active && <LoaderCircle className="ml-auto h-3.5 w-3.5 animate-spin" />}
                      </div>
                    )
                  })}
                </div>

                {generation.progress.total > 0 && (
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                      <span>
                        {generation.progress.current} dari {generation.progress.total} proses
                      </span>
                      <span>
                        {Math.round(
                          (generation.progress.current / generation.progress.total) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all"
                        style={{
                          width:
                            Math.min(
                              100,
                              Math.round(
                                (generation.progress.current / generation.progress.total) * 100
                              )
                            ) + '%',
                        }}
                      />
                    </div>
                  </div>
                )}

                {generation.progress.errors.length > 0 && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-left dark:border-red-900/50 dark:bg-red-950/30">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-300">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Ada proses yang gagal
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-red-700 dark:text-red-300">
                      {generation.progress.errors.map((error, index) => (
                        <li key={index}>
                          {error.questionId ? 'Soal ' + error.questionId + ': ' : ''}
                          {error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!isGenerating && (
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetGeneration}
                      className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      Tutup
                    </button>
                    {generation.status === 'completed' && generation.examId > 0 && (
                      <button
                        type="button"
                        onClick={() => router.visit('/exams/' + generation.examId)}
                        className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                      >
                        Buka Naskah
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                {requestError && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{requestError}</span>
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="classId"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Kelas
                    </label>
                    <select
                      id="classId"
                      value={data.classId}
                      onChange={(e) => setData('classId', Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    >
                      {classes.map((item) => (
                        <option key={item.id} value={item.id}>
                          Kelas {item.name}
                        </option>
                      ))}
                    </select>
                    {errors.classId && (
                      <p className="mt-1 text-sm text-red-500">{errors.classId}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Mata Pelajaran
                    </label>
                    <select
                      id="subject"
                      value={data.subject}
                      onChange={(e) => setData('subject', e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    >
                      <option value="">Pilih mata pelajaran</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="type"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Jenis Soal
                    </label>
                    <select
                      id="type"
                      value={data.type}
                      onChange={(e) => setData('type', e.target.value as ExamType)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    >
                      {EXAM_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                  </div>
                  <div>
                    <label
                      htmlFor="examMode"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Format Naskah Soal
                    </label>
                    <select
                      id="examMode"
                      value={data.examMode}
                      onChange={(e) => setData('examMode', e.target.value as any)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    >
                      <option value="tertulis_visual">
                        Campuran sesuai karakteristik mata pelajaran (disarankan)
                      </option>
                      <option value="lisan">
                        Soal Lisan (Hafalan Surah, Doa, & Tanya Jawab - RA/TK)
                      </option>
                      <option value="multiple_choice">Pilihan Ganda Saja</option>
                      <option value="essay">Uraian Saja</option>
                      <option value="practical">Praktik / Performa</option>
                    </select>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {data.examMode === 'multiple_choice'
                        ? 'Semua butir dibuat dalam format pilihan ganda.'
                        : data.examMode === 'tertulis_visual'
                          ? 'Satu naskah dapat berisi pilihan ganda, isian, hubungkan garis, hitung, dan aktivitas visual sesuai mata pelajaran.'
                          : 'Format naskah mengikuti pilihan yang dipilih.'}
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="topic"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Topik / Materi
                    </label>
                    <input
                      id="topic"
                      type="text"
                      value={data.topic}
                      onChange={(e) => setData('topic', e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                      placeholder="contoh: Bilangan Bulat"
                    />
                    {errors.topic && <p className="mt-1 text-sm text-red-500">{errors.topic}</p>}
                  </div>
                  <div>
                    <label
                      htmlFor="questionCount"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Maksimal Butir per Bagian
                    </label>
                    <input
                      id="questionCount"
                      type="number"
                      value={data.questionCount}
                      onChange={(e) => setData('questionCount', Number(e.target.value))}
                      min={1}
                      max={5}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    />
                    {errors.questionCount && (
                      <p className="mt-1 text-sm text-red-500">{errors.questionCount}</p>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setShowGenerateModal(false)
                      resetGeneration()
                    }}
                    className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => void handleGenerate()}
                    disabled={isGenerating}
                    className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Generate
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deletingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Soal?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Soal <strong>{deletingExam.title}</strong> akan dihapus secara permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingExam(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardWrapper>
  )
}
