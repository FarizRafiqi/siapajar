import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ClipboardList, Trash2, Plus, CheckSquare, FileText, Palette, Camera } from 'lucide-react'
import { cn } from '~/lib/utils'

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
  content: Record<string, any>
  schoolClass: SchoolClass
  student: Student
  attachments?: Array<{ id: number; url: string; originalName: string; mimeType: string }>
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
  const [deletingAssessment, setDeletingAssessment] = useState<Assessment | null>(null)
  const [filterType, setFilterType] = useState<AssessmentType | 'all'>('all')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const hasClasses = classes.length > 0
  const hasStudents = classes.some((c) => c.students.length > 0)

  const { data, setData, processing, errors, reset } = useForm({
    classId: classes[0]?.id || 0,
    studentId: classes[0]?.students[0]?.id || 0,
    learningObjectiveId: 0,
    iktpIndicatorId: 0,
    achievementStatus: '',
    type: 'checklist' as AssessmentType,
    date: '',
    context: '',
    behavior: '',
    analysis: '',
    photoDescription: '',
    description: '',
    activity: '',
    narrative: '',
    indicators: '',
    note: '',
  })

  const selectedClass = classes.find((c) => c.id === data.classId)

  const handleAdd = () => {
    let content: Record<string, any> = {}
    if (data.type === 'checklist') {
      content = { indicators: data.indicators.split('\n').filter((s) => s.trim()), note: data.note }
    } else if (data.type === 'anecdotal_note') {
      content = { context: data.context, behavior: data.behavior, analysis: data.analysis }
    } else if (data.type === 'work_sample') {
      content = {
        photoDescription: data.photoDescription,
        description: data.description,
        analysis: data.analysis,
      }
    } else if (data.type === 'photo_series') {
      content = { activity: data.activity, narrative: data.narrative }
    }

    const payload = new FormData()
    payload.append('classId', String(data.classId))
    payload.append('studentId', String(data.studentId))
    payload.append('type', data.type)
    payload.append('date', data.date)
    payload.append('content', JSON.stringify(content))
    if (data.learningObjectiveId) payload.append('learningObjectiveId', String(data.learningObjectiveId))
    if (data.iktpIndicatorId) payload.append('iktpIndicatorId', String(data.iktpIndicatorId))
    if (data.achievementStatus) payload.append('achievementStatus', data.achievementStatus)
    selectedFiles.forEach((file) => payload.append('attachments', file))

    router.post('/paud-assessments', payload,
      {
        forceFormData: true,
        onSuccess: () => {
          setShowAddModal(false)
          setSelectedFiles([])
          reset()
        },
      }
    )
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
      title="Asesmen PAUD"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Asesmen PAUD' }]}
    >
      <Head title="Asesmen PAUD" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Asesmen PAUD</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Ceklis, catatan anekdot, hasil karya, dan foto berseri per anak
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={!hasClasses || !hasStudents}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Catat Asesmen
          </button>
        </div>

        {!hasClasses && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Buat kelompok dulu sebelum mencatat asesmen.
            </p>
            <Link
              href="/classes"
              className="mt-2 inline-block rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60"
            >
              Buat kelompok dulu →
            </Link>
          </div>
        )}
        {hasClasses && !hasStudents && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Tambah siswa dulu sebelum mencatat asesmen.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              filterType === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            )}
          >
            Semua
          </button>
          {(Object.keys(typeLabels) as AssessmentType[]).map((t) => {
            const Icon = TYPE_ICONS[t]
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  filterType === t
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                )}
              >
                <Icon className="h-4 w-4" />
                {typeLabels[t]}
              </button>
            )
          })}
        </div>

        {filteredAssessments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <ClipboardList className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada asesmen
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Catat asesmen pertama untuk anak didik Anda
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAssessments.map((item) => {
              const ItemIcon = TYPE_ICONS[item.type]
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-emerald-50 p-1 dark:bg-emerald-900/30">
                          <ItemIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          {item.student.fullName}
                        </h3>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                          {typeLabels[item.type]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Kelompok {item.schoolClass.name} •{' '}
                        {new Date(item.date).toLocaleDateString('id-ID')}
                      </p>
                      <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                        {item.type === 'checklist' && (
                          <>
                            <ul className="list-inside list-disc">
                              {(item.content.indicators ?? []).map((ind: string, i: number) => (
                                <li key={`ind-${i}-${ind.slice(0, 10)}`}>{ind}</li>
                              ))}
                            </ul>
                            {item.content.note && (
                              <p className="mt-1 italic">{item.content.note}</p>
                            )}
                          </>
                        )}
                        {item.type === 'anecdotal_note' && (
                          <p>
                            <strong>Latar:</strong> {item.content.context} —{' '}
                            <strong>Perilaku:</strong> {item.content.behavior} —{' '}
                            <strong>Analisis:</strong> {item.content.analysis}
                          </p>
                        )}
                        {item.type === 'work_sample' && (
                          <p>
                            <strong>{item.content.photoDescription}</strong> —{' '}
                            {item.content.description}
                            {item.content.analysis && <> ({item.content.analysis})</>}
                          </p>
                        )}
                        {item.type === 'photo_series' && (
                          <p>
                            <strong>{item.content.activity}</strong> — {item.content.narrative}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setDeletingAssessment(item)}
                      className="rounded-lg border border-neutral-200 p-2 text-red-600 hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {item.attachments && item.attachments.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {item.attachments.map((attachment) => (
                          attachment.mimeType === 'application/pdf'
                            ? <a key={attachment.id} href={attachment.url} target="_blank" rel="noreferrer" className="rounded border border-neutral-200 p-2 text-xs text-emerald-700 dark:border-neutral-700 dark:text-emerald-300">{attachment.originalName}</a>
                            : <a key={attachment.id} href={attachment.url} target="_blank" rel="noreferrer"><img src={attachment.url} alt={attachment.originalName} className="h-20 w-full rounded object-cover" /></a>
                         ))}
                       </div>
                     )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Catat Asesmen
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="type"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Jenis Asesmen
                </label>
                <select
                  id="type"
                  value={data.type}
                  onChange={(e) => setData('type', e.target.value as AssessmentType)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {(Object.keys(typeLabels) as AssessmentType[]).map((t) => (
                    <option key={t} value={t}>
                      {typeLabels[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="learningObjectiveId"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Tujuan Pembelajaran (opsional)
                </label>
                <select
                  id="learningObjectiveId"
                  value={data.learningObjectiveId}
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      learningObjectiveId: Number(e.target.value),
                      iktpIndicatorId: 0,
                    }))
                  }}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  <option value={0}>Tidak menghubungkan TP</option>
                  {curriculumObjectives.map((objective) => (
                    <option key={objective.id} value={objective.id}>
                      {objective.code} — {objective.title}
                    </option>
                  ))}
                </select>
              </div>
              {data.learningObjectiveId > 0 && (
                <div>
                  <label
                    htmlFor="iktpIndicatorId"
                    className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    IKTP / bukti perilaku
                  </label>
                  <select
                    id="iktpIndicatorId"
                    value={data.iktpIndicatorId}
                    onChange={(e) => setData('iktpIndicatorId', Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value={0}>Pilih indikator</option>
                    {curriculumObjectives
                      .find((objective) => objective.id === data.learningObjectiveId)
                      ?.indicators.map((indicator) => (
                        <option key={indicator.id} value={indicator.id}>
                          {indicator.description}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div>
                <label
                  htmlFor="achievementStatus"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Status ketercapaian
                </label>
                <select
                  id="achievementStatus"
                  value={data.achievementStatus}
                  onChange={(e) => setData('achievementStatus', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="">Belum dipilih</option>
                  <option value="belum_terlihat">Belum terlihat</option>
                  <option value="mulai_berkembang">Mulai berkembang</option>
                  <option value="berkembang_sesuai_harapan">Berkembang sesuai harapan</option>
                  <option value="berkembang_sangat_baik">Berkembang sangat baik</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="classId"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Kelompok
                </label>
                <select
                  id="classId"
                  value={data.classId}
                  onChange={(e) => {
                    const classId = Number(e.target.value)
                    const cls = classes.find((c) => c.id === classId)
                    setData((prev) => ({ ...prev, classId, studentId: cls?.students[0]?.id || 0 }))
                  }}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Kelompok {c.name}
                    </option>
                  ))}
                </select>
                {errors.classId && <p className="mt-1 text-sm text-red-500">{errors.classId}</p>}
              </div>
              <div>
                <label
                  htmlFor="studentId"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Anak
                </label>
                <select
                  id="studentId"
                  value={data.studentId}
                  onChange={(e) => setData('studentId', Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {(selectedClass?.students ?? []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName}
                    </option>
                  ))}
                </select>
                {errors.studentId && (
                  <p className="mt-1 text-sm text-red-500">{errors.studentId}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Tanggal
                </label>
                <input
                  id="date"
                  type="date"
                  value={data.date}
                  onChange={(e) => setData('date', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>

              {data.type === 'checklist' && (
                <>
                  <div>
                    <label
                      htmlFor="indicators"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Indikator Tercapai (satu per baris)
                    </label>
                    <textarea
                      id="indicators"
                      value={data.indicators}
                      onChange={(e) => setData('indicators', e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="note"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Catatan Singkat
                    </label>
                    <input
                      id="note"
                      type="text"
                      value={data.note}
                      onChange={(e) => setData('note', e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </>
              )}

              {data.type === 'anecdotal_note' && (
                <>
                  <div>
                    <label
                      htmlFor="context"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Latar Kejadian
                    </label>
                    <input
                      id="context"
                      type="text"
                      value={data.context}
                      onChange={(e) => setData('context', e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="behavior"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Perilaku yang Diamati
                    </label>
                    <input
                      id="behavior"
                      type="text"
                      value={data.behavior}
                      onChange={(e) => setData('behavior', e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="analysis"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Analisis
                    </label>
                    <input
                      id="analysis"
                      type="text"
                      value={data.analysis}
                      onChange={(e) => setData('analysis', e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </>
              )}

              {data.type === 'work_sample' && (
                <>
                  <div>
                    <label
                      htmlFor="photoDescription"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Judul Hasil Karya
                    </label>
                    <input
                      id="photoDescription"
                      type="text"
                      value={data.photoDescription}
                      onChange={(e) => setData('photoDescription', e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Deskripsi
                    </label>
                    <input
                      id="description"
                      type="text"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="workAnalysis"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Analisis Perkembangan
                    </label>
                    <input
                      id="workAnalysis"
                      type="text"
                      value={data.analysis}
                      onChange={(e) => setData('analysis', e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </>
              )}

              {data.type === 'photo_series' && (
                <>
                  <div>
                    <label
                      htmlFor="activity"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Kegiatan
                    </label>
                    <input
                      id="activity"
                      type="text"
                      value={data.activity}
                      onChange={(e) => setData('activity', e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="narrative"
                      className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Narasi Rangkaian Foto
                    </label>
                    <textarea
                      id="narrative"
                      value={data.narrative}
                      onChange={(e) => setData('narrative', e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </>
              )}

              {(data.type === 'work_sample' || data.type === 'photo_series') && (
                <div>
                  <label htmlFor="assessment-attachments" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Lampiran Foto/Karya (maks. 10 file)</label>
                  <input id="assessment-attachments" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []).slice(0, 10))} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white" />
                  {selectedFiles.length > 0 && <div className="mt-3 grid grid-cols-3 gap-2">{selectedFiles.map((file) => <div key={`${file.name}-${file.lastModified}`} className="relative rounded border border-neutral-200 p-2 text-xs dark:border-neutral-700"><span className="block truncate">{file.name}</span><button type="button" onClick={() => setSelectedFiles((current) => current.filter((item) => item !== file))} className="mt-1 text-red-600">Hapus</button></div>)}</div>}
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  reset()
                }}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleAdd}
                disabled={processing}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {deletingAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Asesmen?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Asesmen ini akan dihapus secara permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingAssessment(null)}
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
