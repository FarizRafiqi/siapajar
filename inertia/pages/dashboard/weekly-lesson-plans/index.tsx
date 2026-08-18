import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { BookOpen, Trash2, Sparkles, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'
import CurriculumSequenceSelect from '~/components/dashboard/curriculum_sequence_select'

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface CurriculumPreset {
  id: number
  educationLevel: 'tk' | 'sd'
  semester: number
  weekNumber: number | null
  code: string
  themeTitle: string
  subthemeTitle: string | null
  phase: string
  groupContext: string | null
  data: {
    description?: string
    dpl?: string[]
    kbcValues?: string[]
    loosePartsSuggestions?: string[]
  } | null
  isActive: boolean
  sortOrder: number
}

interface WeeklyLessonPlan {
  id: number
  theme: string
  weekStartDate: string
  status: 'draft' | 'published'
  content?: {
    theme?: string
    subtheme?: string
    semester?: number
    weekNumber?: number
    groupContext?: string
    identification?: {
      studentCharacteristics?: string
      dpl?: string[]
      kbcValues?: string[]
    }
  }
  schoolClass: SchoolClass
}

interface WeeklyLessonPlansIndexProps {
  readonly weeklyLessonPlans: WeeklyLessonPlan[]
  readonly classes: SchoolClass[]
  readonly sequences: { id: number; title: string; context: string }[]
  readonly presets: CurriculumPreset[]
  readonly defaultSemester: number
}

const GENERATION_STEPS = [
  'Menganalisis Tema, Subtopik, dan Capaian Pembelajaran (CP & TP)',
  'Merumuskan Nilai Panca Cinta KBC & Dimensi Profil Lulusan (DPL)',
  'Merancang Inti Kegiatan Main 5 Hari (Senin–Jumat) dengan Loose Parts & STEAM',
  'Menyusun Indikator Ketercapaian Asesmen (IKTP)',
  'Memfinalisasi & Memvalidasi Format Dokumen Modul Ajar (RPM)...',
]

export default function WeeklyLessonPlansIndex({
  weeklyLessonPlans,
  classes,
  sequences,
  presets,
  defaultSemester,
}: WeeklyLessonPlansIndexProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [deletingPlan, setDeletingPlan] = useState<WeeklyLessonPlan | null>(null)
  const [selectedSemester, setSelectedSemester] = useState<number>(defaultSemester || 1)
  const [usePreset, setUsePreset] = useState(true)
  const [currentStepIdx, setCurrentStepIdx] = useState(0)

  const hasClasses = classes.length > 0

  const { data, setData, post, processing, errors, reset } = useForm({
    classId: classes[0]?.id || 0,
    theme: '',
    subtheme: '',
    semester: defaultSemester || 1,
    weekNumber: 1,
    presetId: undefined as number | undefined,
    weekStartDate: '',
    learningSequenceId: undefined as number | undefined,
  })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (processing) {
      setCurrentStepIdx(0)
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => (prev < GENERATION_STEPS.length - 1 ? prev + 1 : prev))
      }, 3500)
    } else {
      setCurrentStepIdx(0)
    }
    return () => clearInterval(interval)
  }, [processing])

  const filteredPresets = presets.filter((p) => p.semester === selectedSemester)

  const handleSelectPreset = (preset: CurriculumPreset) => {
    setData((prev) => ({
      ...prev,
      presetId: preset.id,
      theme: preset.themeTitle,
      subtheme: preset.subthemeTitle || '',
      semester: preset.semester,
      weekNumber: preset.weekNumber || 1,
    }))
  }

  const handleGenerate = () => {
    post('/rppm/generate', {
      onSuccess: () => {
        setShowGenerateModal(false)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingPlan) return
    router.delete(`/rppm/${deletingPlan.id}`, {
      onSuccess: () => setDeletingPlan(null),
    })
  }

  return (
    <DashboardWrapper
      title="Modul Ajar (RPM)"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Modul Ajar (RPM)' }]}
    >
      <Head title="Modul Ajar (RPM KBC RA)" />

      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              Modul Ajar Mingguan (RPM KBC RA)
            </h2>
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
              Rencana Pembelajaran Mendalam Kurikulum Berbasis Cinta (KBC) — RA & PAUD Fase Fondasi.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (filteredPresets.length > 0) {
                handleSelectPreset(filteredPresets[0])
              }
              setShowGenerateModal(true)
            }}
            disabled={!hasClasses}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Generate RPM dengan AI
          </button>
        </div>

        {!hasClasses && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
              Belum ada data Kelompok / Kelas.
            </p>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
              Tambahkan kelompok usia anak terlebih dahulu sebelum membuat Modul Ajar (RPM).
            </p>
            <Link
              href="/classes"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
            >
              Kelola Kelompok →
            </Link>
          </div>
        )}

        {weeklyLessonPlans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-700 bg-white dark:bg-neutral-900">
            <BookOpen className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">
              Belum ada Modul Ajar (RPM)
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              Klik tombol &quot;Generate RPM dengan AI&quot; untuk membuat rencana pembelajaran 1
              pekan otomatis sesuai tema Kemenag & Kurikulum Merdeka.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weeklyLessonPlans.map((item) => {
              const weekNum = item.content?.weekNumber
              const semesterNum = item.content?.semester
              const subtheme = item.content?.subtheme
              const kbcList = item.content?.identification?.kbcValues || []

              return (
                <Link
                  key={item.id}
                  href={`/rppm/${item.id}`}
                  className="group relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-emerald-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {weekNum ? (
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300">
                            Pekan {weekNum}
                          </span>
                        ) : null}
                        {semesterNum ? (
                          <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                            Smt {semesterNum}
                          </span>
                        ) : null}
                      </div>

                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0',
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        )}
                      >
                        {item.status === 'published' ? 'Terbit' : 'Draf'}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-neutral-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 transition">
                      {item.theme}
                    </h3>

                    {subtheme ? (
                      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1">
                        Subtopik: {subtheme}
                      </p>
                    ) : null}

                    {kbcList.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {kbcList.slice(0, 2).map((kbc) => (
                          <span
                            key={kbc}
                            className="rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                          >
                            {kbc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                        {item.schoolClass.name}
                      </span>
                      <span>•</span>
                      <span>{new Date(item.weekStartDate).toLocaleDateString('id-ID')}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDeletingPlan(item)
                      }}
                      className="rounded p-1 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                      title="Hapus RPM"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Generate AI RPM */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2.5 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Generate Modul Ajar (RPM KBC RA)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Otomasi perencanaan 1 pekan berbasis Panca Cinta KBC, DPL, dan Loose Parts.
                </p>
              </div>
            </div>

            {/* Transparent Step Progress Tracker when AI is generating */}
            {processing ? (
              <div className="my-6 rounded-2xl bg-emerald-50/70 p-5 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      AI sedang merancang Modul Ajar RPM...
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      Proses ini menyusun detail kurikulum 5 hari dengan pendekatan mendalam.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {GENERATION_STEPS.map((stepText, idx) => {
                    const isDone = idx < currentStepIdx
                    const isCurrent = idx === currentStepIdx
                    const isUpcoming = idx > currentStepIdx

                    let StepIcon = (
                      <div className="h-4 w-4 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[10px] text-neutral-400 shrink-0">
                        {idx + 1}
                      </div>
                    )
                    if (isDone) {
                      StepIcon = (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )
                    } else if (isCurrent) {
                      StepIcon = (
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )
                    }

                    return (
                      <div
                        key={stepText}
                        className={cn(
                          'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-all',
                          isCurrent &&
                            'bg-white shadow-sm font-bold text-emerald-900 dark:bg-neutral-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700',
                          isDone && 'text-emerald-700 dark:text-emerald-400 font-medium',
                          isUpcoming && 'text-neutral-400 dark:text-neutral-600 opacity-60'
                        )}
                      >
                        {StepIcon}
                        <span>{stepText}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {/* Kelompok */}
                <div>
                  <label
                    htmlFor="field-classId"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Kelompok / Kelas Target
                  </label>
                  <select
                    id="field-classId"
                    value={data.classId}
                    onChange={(e) => setData('classId', Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.classId && <p className="mt-1 text-xs text-rose-600">{errors.classId}</p>}
                </div>

                {/* Toggle Mode Preset Standar / Custom */}
                <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      Sumber Tema Mingguan:
                    </span>
                    <div className="flex rounded-lg bg-neutral-200 p-0.5 dark:bg-neutral-700">
                      <button
                        type="button"
                        onClick={() => setUsePreset(true)}
                        className={cn(
                          'rounded-md px-2.5 py-1 text-xs font-semibold transition',
                          usePreset
                            ? 'bg-white text-emerald-700 shadow-sm dark:bg-neutral-900 dark:text-emerald-400'
                            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                        )}
                      >
                        Preset Resmi Pemerintah
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUsePreset(false)
                          setData('presetId', undefined)
                        }}
                        className={cn(
                          'rounded-md px-2.5 py-1 text-xs font-semibold transition',
                          !usePreset
                            ? 'bg-white text-emerald-700 shadow-sm dark:bg-neutral-900 dark:text-emerald-400'
                            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                        )}
                      >
                        Input Tema Manual
                      </button>
                    </div>
                  </div>

                  {usePreset ? (
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          Semester:
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSemester(1)
                              setData('semester', 1)
                            }}
                            className={cn(
                              'rounded-md px-2 py-1 text-xs font-semibold border',
                              selectedSemester === 1
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'border-neutral-300 bg-white text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                            )}
                          >
                            Semester 1 (Ganjil)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSemester(2)
                              setData('semester', 2)
                            }}
                            className={cn(
                              'rounded-md px-2 py-1 text-xs font-semibold border',
                              selectedSemester === 2
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'border-neutral-300 bg-white text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                            )}
                          >
                            Semester 2 (Genap)
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="field-presetSelection"
                          className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                        >
                          Pilih Tema Pekan (1 s.d 18)
                        </label>
                        <select
                          id="field-presetSelection"
                          value={data.presetId || ''}
                          onChange={(e) => {
                            const id = Number(e.target.value)
                            const p = filteredPresets.find((item) => item.id === id)
                            if (p) handleSelectPreset(p)
                          }}
                          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        >
                          {filteredPresets.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.weekNumber ? `Pekan ${p.weekNumber}: ` : ''}
                              {p.themeTitle}
                              {p.subthemeTitle ? ` (${p.subthemeTitle})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="field-manualSemester"
                          className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                        >
                          Semester
                        </label>
                        <select
                          id="field-manualSemester"
                          value={data.semester}
                          onChange={(e) => setData('semester', Number(e.target.value))}
                          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        >
                          <option value={1}>Semester 1</option>
                          <option value={2}>Semester 2</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="field-manualWeek"
                          className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                        >
                          Pekan Ke-
                        </label>
                        <input
                          id="field-manualWeek"
                          type="number"
                          min={1}
                          max={25}
                          value={data.weekNumber}
                          onChange={(e) => setData('weekNumber', Number(e.target.value))}
                          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Tema & Subtema Inputs */}
                <div>
                  <label
                    htmlFor="field-theme"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Topik / Tema Utama
                  </label>
                  <input
                    id="field-theme"
                    type="text"
                    required
                    value={data.theme}
                    onChange={(e) => setData('theme', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    placeholder="Contoh: Aku Hamba Allah yang Taat"
                  />
                  {errors.theme && <p className="mt-1 text-xs text-rose-600">{errors.theme}</p>}
                </div>

                <div>
                  <label
                    htmlFor="field-subtheme"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Subtopik / Subtema (Opsional)
                  </label>
                  <input
                    id="field-subtheme"
                    type="text"
                    value={data.subtheme}
                    onChange={(e) => setData('subtheme', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    placeholder="Contoh: Mengenal Ciptaan Allah & Tubuhku"
                  />
                </div>

                {/* Tanggal Mulai Minggu */}
                <div>
                  <label
                    htmlFor="field-weekStartDate"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Tanggal Mulai Pekan (Hari Senin)
                  </label>
                  <input
                    id="field-weekStartDate"
                    type="date"
                    required
                    value={data.weekStartDate}
                    onChange={(e) => setData('weekStartDate', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  {errors.weekStartDate && (
                    <p className="mt-1 text-xs text-rose-600">{errors.weekStartDate}</p>
                  )}
                </div>

                {/* CP / ATP Reference */}
                <CurriculumSequenceSelect
                  sequences={sequences}
                  value={data.learningSequenceId}
                  onChange={(value) => setData('learningSequenceId', value)}
                />
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                disabled={processing}
                onClick={() => {
                  setShowGenerateModal(false)
                  reset()
                }}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={processing}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Sedang Menyusun...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate RPM Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deletingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
          >
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Hapus Modul Ajar (RPM)?
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Modul Ajar{' '}
              <strong className="text-neutral-900 dark:text-white">
                &quot;{deletingPlan.theme}&quot;
              </strong>{' '}
              akan dihapus secara permanen.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingPlan(null)}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
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
