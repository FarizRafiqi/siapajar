import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Loader2, Check, ArrowRight, UploadCloud, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type AssessmentType = 'checklist' | 'anecdotal_note' | 'work_sample' | 'photo_series'

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

interface CurriculumObjective {
  id: number
  code: string
  title: string
  indicators: Array<{ id: number; description: string; achievementCriteria: string }>
}

interface AiAssessmentModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onApply: (data: {
    type: AssessmentType
    classId: number
    studentId: number
    theme: string
    content: Record<string, any>
    activity?: string
    teacherNote?: string
    achievementStatus?: string
    files?: File[]
  }) => void
  readonly classes: SchoolClass[]
  readonly curriculumObjectives: CurriculumObjective[]
  readonly initialType?: AssessmentType
}

export default function AiAssessmentModal({
  isOpen,
  onClose,
  onApply,
  classes,
  curriculumObjectives,
  initialType = 'anecdotal_note',
}: AiAssessmentModalProps) {
  const [type, setType] = useState<AssessmentType>(initialType)
  const [classId, setClassId] = useState<number>(classes[0]?.id || 0)
  const [studentId, setStudentId] = useState<number>(classes[0]?.students[0]?.id || 0)
  const [theme, setTheme] = useState<string>('')

  // Form states initialized empty so placeholders display naturally
  const [context, setContext] = useState<string>('')
  const [observedBehaviorNotes, setObservedBehaviorNotes] = useState<string>('')
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<number>(0)
  const [roughNotes, setRoughNotes] = useState<string>('')
  const [workTitle, setWorkTitle] = useState<string>('')
  const [childQuotesOrDescription, setChildQuotesOrDescription] = useState<string>('')
  const [activityTitle, setActivityTitle] = useState<string>('')
  const [stageNotes, setStageNotes] = useState<string>('')

  // Uploaded files inside AI Modal
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<any | null>(null)

  const selectedClass = classes.find((c) => c.id === classId)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = Array.from(e.target.files || [])
    if (rawFiles.length === 0) return

    // Security & File Validation (ECC Security Guidelines)
    const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
    const maxSizeBytes = 5 * 1024 * 1024 // 5MB

    const validFiles: File[] = []
    for (const f of rawFiles) {
      if (!allowedTypes.has(f.type)) {
        toast.error(`Format file "${f.name}" tidak didukung. Harap gunakan JPG, PNG, atau WEBP.`)
        continue
      }
      if (f.size > maxSizeBytes) {
        toast.error(`Ukuran file "${f.name}" melebihi batas maksimal 5MB.`)
        continue
      }
      validFiles.push(f)
    }

    if (validFiles.length === 0) return

    const maxFiles = type === 'work_sample' ? 1 : 3
    const newFiles = [...uploadedFiles, ...validFiles].slice(0, maxFiles)
    setUploadedFiles(newFiles)

    // Generate previews
    const urls = newFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    const urls = newFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const handleGenerate = async () => {
    setLoading(true)
    setResult(null)

    const payload: Record<string, any> = {
      type,
      classId,
      studentId,
      theme,
    }

    if (type === 'anecdotal_note') {
      payload.context = context
      payload.observedBehaviorNotes = observedBehaviorNotes
    } else if (type === 'checklist') {
      payload.roughNotes = roughNotes
      if (selectedObjectiveId) {
        const obj = curriculumObjectives.find((o) => o.id === selectedObjectiveId)
        payload.learningObjective = obj ? `${obj.code} — ${obj.title}` : ''
        payload.targetIndicators = obj?.indicators.map((i) => i.description) || []
      }
    } else if (type === 'work_sample') {
      payload.workTitle = workTitle
      payload.childQuotesOrDescription = childQuotesOrDescription
    } else if (type === 'photo_series') {
      payload.activityTitle = activityTitle
      payload.stageNotes = stageNotes
    }

    try {
      const res = await fetch('/paud-assessments/generate-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menghasilkan draf asesmen AI')
      }

      setResult(json.result)
      toast.success('Draf analisis asesmen berhasil disusun AI!')
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat memanggil AI')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyToForm = () => {
    if (!result) return

    let content: Record<string, any> = {}
    let activity = ''
    let teacherNote = ''
    let achievementStatus = 'berkembang_sesuai_harapan'

    if (type === 'anecdotal_note') {
      content = {
        theme,
        context,
        observedEvent: result.kejadianTeramati,
        achievementAnalysis: result.analisisCapaian,
        behavior: result.kejadianTeramati,
        analysis: result.analisisCapaian,
      }
      activity = result.kejadianTeramati
      teacherNote = result.analisisCapaian
    } else if (type === 'checklist') {
      content = {
        theme,
        items: result.items || [],
        note: result.generalNote || '',
        indicators: (result.items || []).map((i: any) => i.indicator),
      }
      teacherNote = result.generalNote || ''
    } else if (type === 'work_sample') {
      content = {
        theme,
        workTitle,
        workDescription: result.workDescription,
        achievementAnalysis: result.achievementAnalysis,
        photoDescription: workTitle,
        description: result.workDescription,
        analysis: result.achievementAnalysis,
      }
      activity = workTitle
      teacherNote = result.achievementAnalysis
    } else if (type === 'photo_series') {
      content = {
        theme,
        activityTitle,
        stepDescriptions: result.stepDescriptions || [],
        achievementAnalysis: result.achievementAnalysis,
        activity: activityTitle,
        narrative: (result.stepDescriptions || []).join('\n'),
        analysis: result.achievementAnalysis,
      }
      activity = activityTitle
      teacherNote = result.achievementAnalysis
    }

    onApply({
      type,
      classId,
      studentId,
      theme,
      content,
      activity,
      teacherNote,
      achievementStatus,
      files: uploadedFiles,
    })

    toast.success('Draf AI & foto telah dimasukkan ke formulir asesmen!')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  AI Asisten Asesmen PAUD / RA
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Otomatisasi analisis capaian perkembangan anak format KBC/Kurikulum Merdeka
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body: 2-Column Split View from MD */}
          <div className="grid flex-1 grid-cols-1 overflow-x-hidden overflow-y-auto md:grid-cols-2 md:overflow-hidden">
            {/* Left Column: Form Configuration & Inputs */}
            <div className="space-y-3 overflow-x-hidden overflow-y-auto p-5 md:border-r md:border-neutral-200 md:dark:border-neutral-800">
              {/* Instrument Selection */}
              <div>
                <span
                  id="ai-instrument-label"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Pilih Instrumen Asesmen
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby="ai-instrument-label"
                  className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  {(
                    [
                      ['anecdotal_note', 'Catatan Anekdot'],
                      ['checklist', 'Ceklis IKTP'],
                      ['work_sample', 'Hasil Karya'],
                      ['photo_series', 'Foto Berseri'],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setType(key)
                        setResult(null)
                        setUploadedFiles([])
                        setPreviewUrls([])
                      }}
                      className={`cursor-pointer rounded-xl border p-2 text-center text-xs font-semibold transition-all ${
                        type === key
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Student & Class */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="ai-class-select"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Kelompok / Kelas
                  </label>
                  <select
                    id="ai-class-select"
                    value={classId}
                    onChange={(e) => {
                      const cId = Number(e.target.value)
                      setClassId(cId)
                      const cls = classes.find((c) => c.id === cId)
                      if (cls?.students[0]) setStudentId(cls.students[0].id)
                    }}
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        Kelompok {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ai-student-select"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Nama Siswa
                  </label>
                  <select
                    id="ai-student-select"
                    value={studentId}
                    onChange={(e) => setStudentId(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    {selectedClass?.students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.fullName} ({st.nis || '-'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Theme / Topik */}
              <div>
                <label
                  htmlFor="ai-theme-input"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Tema / Topik Pembelajaran
                </label>
                <input
                  id="ai-theme-input"
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Contoh: Kenalkan, Diriku, Indonesiaku"
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                />
              </div>

              {/* Dynamic Inputs per Type */}
              {type === 'anecdotal_note' && (
                <div className="space-y-2.5 rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
                  <div>
                    <label
                      htmlFor="ai-anecdotal-context"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Latar / Tempat / Konteks Kejadian
                    </label>
                    <input
                      id="ai-anecdotal-context"
                      type="text"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Contoh: Di area bermain balok saat kegiatan pagi"
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ai-anecdotal-notes"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Catatan Kasar Pengamatan Guru
                    </label>
                    <textarea
                      id="ai-anecdotal-notes"
                      rows={2}
                      value={observedBehaviorNotes}
                      onChange={(e) => setObservedBehaviorNotes(e.target.value)}
                      placeholder="Tuliskan apa yang dilakukan atau diucapkan anak..."
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                </div>
              )}

              {type === 'checklist' && (
                <div className="space-y-2.5 rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
                  {curriculumObjectives.length > 0 && (
                    <div>
                      <label
                        htmlFor="ai-objective-select"
                        className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                      >
                        Tujuan Pembelajaran (TP) Terkait
                      </label>
                      <select
                        id="ai-objective-select"
                        value={selectedObjectiveId}
                        onChange={(e) => setSelectedObjectiveId(Number(e.target.value))}
                        className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                      >
                        <option value={0}>-- Pilih TP dari Kurikulum --</option>
                        {curriculumObjectives.map((tp) => (
                          <option key={tp.id} value={tp.id}>
                            {tp.code} — {tp.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="ai-checklist-notes"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Kata Kunci / Catatan Observasi
                    </label>
                    <textarea
                      id="ai-checklist-notes"
                      rows={2}
                      value={roughNotes}
                      onChange={(e) => setRoughNotes(e.target.value)}
                      placeholder="Contoh: Mampu mengelompokkan balok, namun perlu bantuan menggunting..."
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                </div>
              )}

              {type === 'work_sample' && (
                <div className="space-y-2.5 rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
                  <div>
                    <label
                      htmlFor="ai-work-title"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Judul Karya Anak
                    </label>
                    <input
                      id="ai-work-title"
                      type="text"
                      value={workTitle}
                      onChange={(e) => setWorkTitle(e.target.value)}
                      placeholder="Contoh: Kolase Rumah Impian, Lukisan Jari"
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ai-child-quotes"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Celoteh Anak / Deskripsi Singkat Karya
                    </label>
                    <textarea
                      id="ai-child-quotes"
                      rows={2}
                      value={childQuotesOrDescription}
                      onChange={(e) => setChildQuotesOrDescription(e.target.value)}
                      placeholder="Contoh: 'Ini rumahku ada tamannya banyak bunga warna-warni...'"
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>

                  {/* Centered Image Upload Dropzone */}
                  <div>
                    <label
                      htmlFor="ai-upload-worksample"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Upload Foto Karya Anak (1 Foto)
                    </label>
                    <div className="mt-1 space-y-2">
                      <label
                        htmlFor="ai-upload-worksample"
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
                          id="ai-upload-worksample"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {previewUrls.length > 0 && (
                        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-2 shadow-xs dark:border-neutral-700 dark:bg-neutral-800">
                          <div className="flex items-center gap-2.5 truncate">
                            <img
                              src={previewUrls[0]}
                              alt="Preview Hasil Karya"
                              className="h-10 w-14 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700"
                            />
                            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
                              {uploadedFiles[0]?.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(0)}
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

              {type === 'photo_series' && (
                <div className="space-y-2.5 rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
                  <div>
                    <label
                      htmlFor="ai-activity-title"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Judul Aktivitas Kegiatan
                    </label>
                    <input
                      id="ai-activity-title"
                      type="text"
                      value={activityTitle}
                      onChange={(e) => setActivityTitle(e.target.value)}
                      placeholder="Contoh: Membuat Adonan Playdough Alami"
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ai-stage-notes"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Catatan Kasar Tahapan Proses (Minimal 3 Tahap)
                    </label>
                    <textarea
                      id="ai-stage-notes"
                      rows={2}
                      value={stageNotes}
                      onChange={(e) => setStageNotes(e.target.value)}
                      placeholder="Contoh: 1. Menakar bahan; 2. Menguleni; 3. Mencetak..."
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>

                  {/* Centered Multi Image Upload Dropzone */}
                  <div>
                    <label
                      htmlFor="ai-upload-photoseries"
                      className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Upload Foto Berseri (Maksimal 3 Foto)
                    </label>
                    <div className="mt-1 space-y-2">
                      <label
                        htmlFor="ai-upload-photoseries"
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
                          id="ai-upload-photoseries"
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {previewUrls.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {previewUrls.map((url, idx) => (
                            <div
                              key={url}
                              className="relative h-16 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-xs dark:border-neutral-700 dark:bg-neutral-800"
                            >
                              <img
                                src={url}
                                alt={`Tahap ${idx + 1}`}
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-bold text-white">
                                T{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(idx)}
                                className="absolute top-1 right-1 cursor-pointer rounded-full bg-red-600 p-0.5 text-white shadow-xs hover:bg-red-700"
                                title="Hapus foto"
                              >
                                <Trash2 className="h-3 w-3" />
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

            {/* Right Column: Live AI Output Preview & Actions */}
            <div className="flex flex-col justify-between overflow-x-hidden overflow-y-auto bg-neutral-50/50 p-5 dark:bg-neutral-900/50">
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Draf Analisis Asesmen AI
                  </span>
                  {result && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <Check className="h-3.5 w-3.5" />
                      Siap Diterapkan
                    </span>
                  )}
                </div>

                {!result ? (
                  <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-800/40">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-400">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                      Belum Ada Draf Hasil
                    </p>
                    <p className="mt-1 max-w-xs text-xs text-neutral-500 dark:text-neutral-400">
                      Lengkapi data di sebelah kiri, lalu klik tombol <b>Generate Draf AI</b> untuk
                      menyusun analisis otomatis.
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-3 rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-sm dark:border-emerald-900/50 dark:bg-neutral-800"
                  >
                    {type === 'anecdotal_note' && (
                      <div className="space-y-2.5 text-xs">
                        <div>
                          <span className="font-bold text-neutral-900 dark:text-neutral-100">
                            Kejadian Teramati:
                          </span>
                          <p className="mt-1 rounded-xl bg-neutral-50 p-2.5 text-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200">
                            {result.kejadianTeramati}
                          </p>
                        </div>
                        <div>
                          <span className="font-bold text-neutral-900 dark:text-neutral-100">
                            Analisis Capaian Perkembangan:
                          </span>
                          <p className="mt-1 rounded-xl bg-neutral-50 p-2.5 text-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200">
                            {result.analisisCapaian}
                          </p>
                        </div>
                      </div>
                    )}

                    {type === 'checklist' && (
                      <div className="space-y-2 text-xs">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100">
                          Butir Indikator IKTP:
                        </span>
                        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                          {(result.items || []).map((it: any, i: number) => (
                            <div
                              key={it.indicator || i}
                              className="flex items-start gap-2 rounded-lg bg-neutral-50 p-2 dark:bg-neutral-900/60"
                            >
                              <span
                                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                  it.status === 'sudah_muncul'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                }`}
                              >
                                {it.status === 'sudah_muncul' ? 'Sudah Muncul' : 'Belum Muncul'}
                              </span>
                              <span className="text-neutral-800 dark:text-neutral-200">
                                {it.indicator}
                                {it.event && (
                                  <span className="block text-[11px] text-neutral-500 dark:text-neutral-400">
                                    {it.event}
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                        {result.generalNote && (
                          <p className="mt-2 text-neutral-600 italic dark:text-neutral-400">
                            Catatan Guru: {result.generalNote}
                          </p>
                        )}
                      </div>
                    )}

                    {type === 'work_sample' && (
                      <div className="space-y-2.5 text-xs">
                        <div>
                          <span className="font-bold text-neutral-900 dark:text-neutral-100">
                            Deskripsi Hasil Karya:
                          </span>
                          <p className="mt-1 rounded-xl bg-neutral-50 p-2.5 text-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200">
                            {result.workDescription}
                          </p>
                        </div>
                        <div>
                          <span className="font-bold text-neutral-900 dark:text-neutral-100">
                            Analisis Capaian:
                          </span>
                          <p className="mt-1 rounded-xl bg-neutral-50 p-2.5 text-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200">
                            {result.achievementAnalysis}
                          </p>
                        </div>
                      </div>
                    )}

                    {type === 'photo_series' && (
                      <div className="space-y-2.5 text-xs">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100">
                          Tahapan Aktivitas:
                        </span>
                        <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
                          {(result.stepDescriptions || []).map((step: string, sIdx: number) => (
                            <div
                              key={step + sIdx}
                              className="rounded-lg bg-neutral-50 p-2 text-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200"
                            >
                              <span className="font-bold text-emerald-600 mr-1.5">{sIdx + 1}.</span>
                              {step}
                            </div>
                          ))}
                        </div>
                        <div>
                          <span className="font-bold text-neutral-900 dark:text-neutral-100">
                            Analisis Capaian:
                          </span>
                          <p className="mt-1 rounded-xl bg-neutral-50 p-2.5 text-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200">
                            {result.achievementAnalysis}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              Tutup
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyusun Analisis...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Draf AI
                  </>
                )}
              </button>

              {result && (
                <button
                  type="button"
                  onClick={handleApplyToForm}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                >
                  <span>Terapkan ke Form Asesmen</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
