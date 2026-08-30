import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, useForm, Link } from '@inertiajs/react'
import { useState } from 'react'
import {
  ArrowLeft,
  Save,
  Pencil,
  X,
  Download,
  BookOpen,
  Heart,
  Sparkles,
  Layers,
  Calendar,
  ClipboardCheck,
  FileText,
  Users,
  Compass,
  CheckCircle2,
  ListChecks,
  ExternalLink,
  Image as ImageIcon,
  Camera,
  CheckSquare,
  ChevronDown,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import DocumentWorkflowMeta from '~/components/dashboard/document-workflow-meta'
import DocumentWorkflowActions from '~/components/dashboard/document-workflow-actions'
import { useDocumentAutosave } from '~/hooks/use-document-autosave'
import RichTextEditor from '~/components/ui/rich-text-editor'
import { DocumentSectionEditor } from '~/components/ui/document-section-editor'

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface DailyCoreActivity {
  day: string
  title: string
  activities: string[]
  looseParts?: string[]
  steamFocus?: string
  stage?: string
  activitiesDetail?: Array<{
    name?: string
    focus?: string
    materials?: string
    instructions?: string
    benefits?: string
  }>
}

export interface LoadedWeeklyAssessments {
  anecdotes: Array<{
    id: number
    date: string
    studentName: string
    event: string
    analysis: string
  }>
  checklists: Array<{
    no: number
    indicator: string
    sudahMuncul: boolean
    belumMuncul: boolean
    note: string
    studentName: string
  }>
  studentChecklists?: Array<{
    studentId?: number
    studentName: string
    items: Array<{
      no: number
      indicator: string
      sudahMuncul: boolean
      belumMuncul: boolean
      note: string
      studentName?: string
    }>
  }>
  workSamples: Array<{
    id: number
    date: string
    studentName: string
    description: string
    analysis: string
    storedName?: string
  }>
  photoSeries: Array<{
    id: number
    date: string
    studentName: string
    description: string
    analysis: string
    attachments: Array<{ id: number; storedName: string }>
  }>
}

export type AnecdoteItem = LoadedWeeklyAssessments['anecdotes'][number]
export type ChecklistItem = LoadedWeeklyAssessments['checklists'][number]
export type WorkSampleItem = LoadedWeeklyAssessments['workSamples'][number]
export type PhotoSeriesItem = LoadedWeeklyAssessments['photoSeries'][number]

export interface WorkflowData {
  status: 'draft' | 'published' | 'archived'
  lastSavedAt?: string | null
  version?: number
  templateKey?: string
}

interface WeeklyLessonPlanContent {
  theme?: string
  subtheme?: string
  topic?: string
  subtopic?: string
  title?: string
  semester?: number
  weekNumber?: number
  groupContext?: string
  allocation?: string
  timeAllocation?: string
  modelPembelajaran?: string
  month?: string
  grade?: string
  identification?: {
    studentCharacteristics?: string
    essentialMaterials?: string
    practicalMaterials?: string
    valueMaterials?: string
    dpl?: string[]
    kbcValues?: string[]
    pancaCintaValues?: string[]
    [key: string]: any
  }
  learningDesign?: {
    learningOutcomes?: Array<{ code?: string; title?: string; element?: string }>
    cpElements?: string[]
    crossDisciplinaryConcepts?: string
    learningObjectives?: Array<{ code?: string; title?: string }>
    pedagogicalPractices?: {
      mindful?: string
      meaningful?: string
      joyful?: string
      deepLearningPrinciples?: string
      [key: string]: any
    }
    partnerships?: string
    learningEnvironment?: string
    digitalIntegration?: string
    [key: string]: any
  }
  learningExperience?: {
    openingActivities?: string[]
    openingQuestions?: string[]
    dailyCoreActivities?: DailyCoreActivity[]
    closingActivities?: string[]
    [key: string]: any
  }
  assessment?: {
    assessmentTechniques?: string[]
    earlyAssessment?: string[]
    processAssessment?: string[]
    finalAssessment?: string[]
    iktpChecklist?: string[]
    indicators?: Array<{ objectiveCode?: string; indicator?: string }>
    [key: string]: any
  }
  nilaiAgamaBudiPekerti?: string[]
  jatiDiri?: string[]
  literasiSainsTeknologi?: string[]
  rencanaKegiatan?: string[]
  [key: string]: any
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
  readonly workflow?: WorkflowData
  readonly assessments?: LoadedWeeklyAssessments
}

function LoosePartsList({ items }: { readonly items?: string[] }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-xs text-neutral-400 italic">Bahan alam, balok, loose parts daur ulang.</p>
    )
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((lp, idx) => (
        <span
          key={`lp-tag-${lp}-${idx}`}
          className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-700 shadow-sm border border-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-700"
        >
          {lp}
        </span>
      ))}
    </div>
  )
}

function PancaCintaBadgeList({ items }: { readonly items?: string[] }) {
  const values =
    items && items.length > 0 ? items : ['Cinta Allah & Rasul', 'Cinta Diri Sendiri & Sesama']
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v, idx) => (
        <span
          key={`panca-${v}-${idx}`}
          className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {v}
        </span>
      ))}
    </div>
  )
}

function KbcBadgeList({ items }: { readonly items?: string[] }) {
  const values = items && items.length > 0 ? items : ['Kasih Sayang', 'Kemandirian', 'Syukur']
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v, idx) => (
        <span
          key={`kbc-${v}-${idx}`}
          className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {v}
        </span>
      ))}
    </div>
  )
}

function IktpList({
  indicators,
}: {
  readonly indicators?: Array<string | { indicator?: string }>
}) {
  if (!indicators || indicators.length === 0) {
    return (
      <p className="text-xs text-neutral-400 italic">
        Indikator IKTP dirumuskan berdasarkan TP aktif.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {indicators.map((ind, idx) => {
        const text = typeof ind === 'string' ? ind : ind?.indicator || ''
        return (
          <div
            key={`iktp-item-${idx}-${text.slice(0, 15)}`}
            className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60"
          >
            <span className="mt-0.5 rounded-full bg-emerald-600 p-1 text-white shrink-0">
              <CheckCircle2 className="h-3 w-3" />
            </span>
            <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">{text}</p>
          </div>
        )
      })}
    </div>
  )
}

interface TabExperienceProps {
  readonly editing: boolean
  readonly currentContent: WeeklyLessonPlanContent
  readonly data: { content: WeeklyLessonPlanContent }
  readonly setData: (key: 'content', value: WeeklyLessonPlanContent) => void
}

function TabExperienceSection({ editing, currentContent, data, setData }: TabExperienceProps) {
  const dailyActivities: DailyCoreActivity[] =
    currentContent.learningExperience?.dailyCoreActivities || []
  const openingActs: string[] = currentContent.learningExperience?.openingActivities || []
  const closingActs: string[] = currentContent.learningExperience?.closingActivities || []

  return (
    <div className="space-y-6">
      {/* Kegiatan Pembuka & Penutup */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card-kawaii p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
            <Sparkles className="h-4 w-4 text-amber-500" />
            C.1. Kegiatan Pembuka (Awal / Mindful)
          </h3>
          {editing ? (
            <DocumentSectionEditor
              value={openingActs}
              onChange={(val) =>
                setData('content', {
                  ...data.content,
                  learningExperience: {
                    ...data.content?.learningExperience,
                    openingActivities: Array.isArray(val) ? val : [val],
                  },
                })
              }
              placeholder="Masukkan kegiatan pembuka per baris..."
            />
          ) : (
            <div className="mt-3 space-y-3">
              <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                {openingActs.length > 0 ? (
                  openingActs.map((act, actIdx) => (
                    <li key={`open-act-${act}-${actIdx}`} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span>{act}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-neutral-400 italic">
                    SOP Penyambutan, Ikrar, Berdoa, Apersepsi Topik Minggu Ini.
                  </li>
                )}
              </ul>

              {currentContent.learningExperience?.openingQuestions &&
                currentContent.learningExperience.openingQuestions.length > 0 && (
                  <div className="rounded-xl bg-amber-50/60 p-3 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40">
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 block mb-1.5">
                      Pertanyaan Pemantik DPL:
                    </span>
                    <ul className="space-y-1 text-xs text-amber-950 dark:text-amber-200">
                      {currentContent.learningExperience.openingQuestions.map((q, qIdx) => (
                        <li key={`q-item-${q}-${qIdx}`} className="italic">
                          {String.fromCodePoint(97 + qIdx)}) &quot;{q}&quot;
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </div>

        <div className="card-kawaii p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            C.3. Kegiatan Penutup (Refleksi & Berdoa)
          </h3>
          {editing ? (
            <DocumentSectionEditor
              value={closingActs}
              onChange={(val) =>
                setData('content', {
                  ...data.content,
                  learningExperience: {
                    ...data.content?.learningExperience,
                    closingActivities: Array.isArray(val) ? val : [val],
                  },
                })
              }
              placeholder="Masukkan kegiatan penutup per baris..."
            />
          ) : (
            <ul className="mt-3 space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
              {closingActs.length > 0 ? (
                closingActs.map((act, actIdx) => (
                  <li key={`close-act-${act}-${actIdx}`} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span>{act}</span>
                  </li>
                ))
              ) : (
                <li className="text-neutral-400 italic">
                  Recalling pengalaman bermain, apresiasi karya anak, pesan moral, dan berdoa
                  pulang.
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Rencana Main Harian 5 Hari */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          C.2. Rencana Kegiatan Inti Harian (Senin s.d. Jumat)
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {dailyActivities.length > 0 ? (
            dailyActivities.map((dayPlan, idx) => (
              <div key={`day-${dayPlan.day}-${idx}`} className="card-kawaii p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0 whitespace-nowrap rounded-xl border-2 border-black bg-emerald-200 px-3 py-1 text-xs font-black text-emerald-950 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-emerald-300 dark:text-emerald-950 dark:shadow-[2px_2px_0px_#ffffff]">
                      {dayPlan.day}
                    </span>
                    {dayPlan.stage && (
                      <span className="rounded-lg bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {dayPlan.stage}
                      </span>
                    )}
                    {editing ? (
                      <input
                        type="text"
                        value={dayPlan.title}
                        onChange={(e) => {
                          const newActs = [...dailyActivities]
                          newActs[idx] = { ...newActs[idx], title: e.target.value }
                          setData('content', {
                            ...data.content,
                            learningExperience: {
                              ...data.content?.learningExperience,
                              dailyCoreActivities: newActs,
                            },
                          })
                        }}
                        className="rounded border border-neutral-300 px-2 py-1 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                      />
                    ) : (
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                        {dayPlan.title}
                      </h4>
                    )}
                  </div>
                  {dayPlan.steamFocus && (
                    <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-950/40 dark:text-purple-300 self-start sm:self-auto">
                      STEAM: {dayPlan.steamFocus}
                    </span>
                  )}
                </div>

                {/* Render Structured Activities Detail if Available */}
                {Array.isArray(dayPlan.activitiesDetail) && dayPlan.activitiesDetail.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {dayPlan.activitiesDetail.map((detail: any, dIdx: number) => (
                      <div
                        key={`act-detail-${dayPlan.day}-${dIdx}`}
                        className="rounded-xl bg-neutral-50/70 p-3.5 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">
                            {detail.name || `Kegiatan ${dIdx + 1}`}
                          </span>
                          {detail.focus && (
                            <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40">
                              {detail.focus}
                            </span>
                          )}
                        </div>
                        {detail.materials && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-300">
                            <strong className="text-neutral-800 dark:text-neutral-200">
                              Alat & Bahan:
                            </strong>{' '}
                            {detail.materials}
                          </p>
                        )}
                        {detail.instructions && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-300">
                            <strong className="text-neutral-800 dark:text-neutral-200">
                              Cara Bermain / Membuat:
                            </strong>{' '}
                            {detail.instructions}
                          </p>
                        )}
                        {detail.benefits && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 italic">
                            <strong className="text-neutral-800 dark:text-neutral-200 not-italic">
                              Manfaat:
                            </strong>{' '}
                            {detail.benefits}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-2">
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        Ragam Pilihan Kegiatan Main:
                      </span>
                      {editing ? (
                        <DocumentSectionEditor
                          value={dayPlan.activities || []}
                          onChange={(val) => {
                            const newActs = [...dailyActivities]
                            newActs[idx] = {
                              ...newActs[idx],
                              activities: Array.isArray(val) ? val : [val],
                            }
                            setData('content', {
                              ...data.content,
                              learningExperience: {
                                ...data.content?.learningExperience,
                                dailyCoreActivities: newActs,
                              },
                            })
                          }}
                          placeholder="Masukkan kegiatan main..."
                        />
                      ) : (
                        <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                          {dayPlan.activities?.map((act) => (
                            <li
                              key={`act-item-${dayPlan.day}-${act}`}
                              className="flex items-start gap-2"
                            >
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block mb-2">
                        Alat, Bahan & Loose Parts:
                      </span>
                      {editing ? (
                        <DocumentSectionEditor
                          value={dayPlan.looseParts || []}
                          onChange={(val) => {
                            const newActs = [...dailyActivities]
                            newActs[idx] = {
                              ...newActs[idx],
                              looseParts: Array.isArray(val) ? val : [val],
                            }
                            setData('content', {
                              ...data.content,
                              learningExperience: {
                                ...data.content?.learningExperience,
                                dailyCoreActivities: newActs,
                              },
                            })
                          }}
                          placeholder="Alat / loose parts..."
                        />
                      ) : (
                        <LoosePartsList items={dayPlan.looseParts} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-black bg-amber-50 p-8 text-center text-sm font-medium text-neutral-700 dark:border-white dark:bg-amber-950/30 dark:text-neutral-200">
              Belum ada rincian kegiatan harian 5 hari.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TabIdentificationSection({ editing, currentContent, data, setData }: TabExperienceProps) {
  const topic = currentContent.topic || currentContent.theme || ''
  const subtheme = currentContent.subtheme || currentContent.subtopic || ''
  const allocation =
    currentContent.allocation || currentContent.timeAllocation || '5 Hari x 180 Menit (15 JP)'
  const model = currentContent.modelPembelajaran || 'Kolaboratif, STEAM'
  const grade = currentContent.grade || currentContent.groupContext || 'Kelompok B (5-6 Tahun)'

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {/* Informasi Umum & Topik Modul */}
      <div className="card-kawaii p-5 md:col-span-2">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          A.0. Informasi Umum & Tema Pembelajaran
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">
              Tema / Topik Utama
            </span>
            <span className="text-sm font-bold text-neutral-900 dark:text-white">
              {topic || 'Belum diatur'}
            </span>
          </div>

          <div className="rounded-xl bg-purple-50/60 p-3.5 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40">
            <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 block mb-0.5">
              Subtema / Subtopik
            </span>
            <span className="text-sm font-bold text-purple-900 dark:text-purple-200">
              {subtheme || 'Belum diatur'}
            </span>
          </div>

          <div className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">
              Kelompok / Usia
            </span>
            <span className="text-sm font-bold text-neutral-900 dark:text-white">{grade}</span>
          </div>

          <div className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">
              Alokasi Waktu & Model
            </span>
            <span className="text-xs font-bold text-neutral-900 dark:text-white block">
              {allocation}
            </span>
            <span className="text-[11px] text-neutral-600 dark:text-neutral-400">{model}</span>
          </div>
        </div>
      </div>

      {/* Karakteristik Peserta Didik */}
      <div className="card-kawaii p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Karakteristik Peserta Didik
        </h3>
        {editing ? (
          <RichTextEditor
            value={currentContent.identification?.studentCharacteristics || ''}
            onChange={(val) =>
              setData('content', {
                ...data.content,
                identification: {
                  ...data.content?.identification,
                  studentCharacteristics: val,
                },
              })
            }
            placeholder="Karakteristik peserta didik..."
          />
        ) : (
          <div
            className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300"
            dangerouslySetInnerHTML={{
              __html:
                currentContent.identification?.studentCharacteristics ||
                'Anak usia 5-6 tahun dengan rasa ingin tahu tinggi dan senang bereksplorasi sensorik.',
            }}
          />
        )}
      </div>

      {/* Panca Cinta & Nilai KBC */}
      <div className="card-kawaii p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
          <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          Panca Cinta & Nilai KBC RA
        </h3>
        <div className="space-y-3">
          <div>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Fokus Panca Cinta:
            </span>
            {editing ? (
              <DocumentSectionEditor
                value={currentContent.identification?.pancaCintaValues || []}
                onChange={(val) =>
                  setData('content', {
                    ...data.content,
                    identification: {
                      ...data.content?.identification,
                      pancaCintaValues: Array.isArray(val) ? val : [val],
                    },
                  })
                }
                placeholder="Panca cinta values..."
              />
            ) : (
              <PancaCintaBadgeList items={currentContent.identification?.pancaCintaValues} />
            )}
          </div>

          <div>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Nilai Karakter KBC:
            </span>
            {editing ? (
              <DocumentSectionEditor
                value={currentContent.identification?.kbcValues || []}
                onChange={(val) =>
                  setData('content', {
                    ...data.content,
                    identification: {
                      ...data.content?.identification,
                      kbcValues: Array.isArray(val) ? val : [val],
                    },
                  })
                }
                placeholder="Nilai KBC..."
              />
            ) : (
              <KbcBadgeList items={currentContent.identification?.kbcValues} />
            )}
          </div>
        </div>
      </div>

      {/* 3 Jenis Materi Pembelajaran */}
      <div className="card-kawaii space-y-4 p-5 md:col-span-2">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          Materi Pembelajaran Mendalam
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-blue-50/60 p-3.5 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block mb-1">
              1. Materi Esensial (Konsep)
            </span>
            {editing ? (
              <textarea
                value={currentContent.identification?.essentialMaterials || ''}
                onChange={(e) =>
                  setData('content', {
                    ...data.content,
                    identification: {
                      ...data.content?.identification,
                      essentialMaterials: e.target.value,
                    },
                  })
                }
                rows={3}
                className="w-full rounded border border-neutral-300 p-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            ) : (
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {currentContent.identification?.essentialMaterials ||
                  'Konsep dasar yang dipelajari anak secara mendalam.'}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-amber-50/60 p-3.5 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block mb-1">
              2. Materi Aplikatif (Keterampilan)
            </span>
            {editing ? (
              <textarea
                value={currentContent.identification?.practicalMaterials || ''}
                onChange={(e) =>
                  setData('content', {
                    ...data.content,
                    identification: {
                      ...data.content?.identification,
                      practicalMaterials: e.target.value,
                    },
                  })
                }
                rows={3}
                className="w-full rounded border border-neutral-300 p-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            ) : (
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {currentContent.identification?.practicalMaterials ||
                  'Aplikasi nyata dan proyek eksplorasi langsung.'}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-emerald-50/60 p-3.5 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
              3. Materi Nilai (Sikap & Karakter)
            </span>
            {editing ? (
              <textarea
                value={currentContent.identification?.valueMaterials || ''}
                onChange={(e) =>
                  setData('content', {
                    ...data.content,
                    identification: {
                      ...data.content?.identification,
                      valueMaterials: e.target.value,
                    },
                  })
                }
                rows={3}
                className="w-full rounded border border-neutral-300 p-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            ) : (
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {currentContent.identification?.valueMaterials ||
                  'Penanaman akhlak mulia dan adab sehari-hari.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Dimensi Profil Lulusan (DPL) */}
      {currentContent.identification?.dpl && currentContent.identification.dpl.length > 0 && (
        <div className="card-kawaii p-5 md:col-span-2">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
            <Compass className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            Dimensi Profil Lulusan (DPL 1 s.d 8) yang Dikembangkan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {currentContent.identification.dpl.map((d, idx) => (
              <div
                key={`dpl-tag-${d}-${idx}`}
                className="rounded-lg bg-purple-50 p-2 text-xs font-semibold text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40"
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TabDesignSection({ editing, currentContent, data, setData }: TabExperienceProps) {
  return (
    <div className="space-y-5">
      {/* Capaian Pembelajaran & Tujuan */}
      <div className="card-kawaii space-y-4 p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Capaian & Tujuan Pembelajaran (TP) Terpilih
        </h3>

        {currentContent.learningDesign?.learningObjectives &&
        currentContent.learningDesign.learningObjectives.length > 0 ? (
          <div className="space-y-2">
            {currentContent.learningDesign.learningObjectives.map((tp, idx) => {
              const obj = tp as any
              const title = typeof tp === 'string' ? tp : obj?.title || obj?.name || ''
              const code = typeof tp === 'object' && obj?.code ? obj.code : `TP ${idx + 1}`
              return (
                <div
                  key={`tp-item-${code}-${idx}`}
                  className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60"
                >
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 shrink-0">
                    {code}
                  </span>
                  <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                    {title}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-xs text-neutral-500 italic">
            Tujuan Pembelajaran otomatis terhubung dengan modul CP & ATP.
          </p>
        )}
      </div>

      {/* Praktik Pedagogis Deep Learning (Mindful, Meaningful, Joyful) */}
      <div className="card-kawaii space-y-4 p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Praktik Pedagogis Pembelajaran Mendalam (Deep Learning)
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-emerald-50/50 p-3.5 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
              Mindful Learning
            </span>
            {editing ? (
              <textarea
                value={currentContent.learningDesign?.pedagogicalPractices?.mindful || ''}
                onChange={(e) =>
                  setData('content', {
                    ...data.content,
                    learningDesign: {
                      ...data.content?.learningDesign,
                      pedagogicalPractices: {
                        ...data.content?.learningDesign?.pedagogicalPractices,
                        mindful: e.target.value,
                      },
                    },
                  })
                }
                rows={3}
                className="w-full rounded border border-neutral-300 p-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            ) : (
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {currentContent.learningDesign?.pedagogicalPractices?.mindful ||
                  'Fokus, kehadiran penuh, dan kesadaran diri saat beraktivitas.'}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-blue-50/50 p-3.5 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block mb-1">
              Meaningful Learning
            </span>
            {editing ? (
              <textarea
                value={currentContent.learningDesign?.pedagogicalPractices?.meaningful || ''}
                onChange={(e) =>
                  setData('content', {
                    ...data.content,
                    learningDesign: {
                      ...data.content?.learningDesign,
                      pedagogicalPractices: {
                        ...data.content?.learningDesign?.pedagogicalPractices,
                        meaningful: e.target.value,
                      },
                    },
                  })
                }
                rows={3}
                className="w-full rounded border border-neutral-300 p-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            ) : (
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {currentContent.learningDesign?.pedagogicalPractices?.meaningful ||
                  'Bermakna, relevan dengan kehidupan anak dan lingkungan sekitar.'}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-rose-50/50 p-3.5 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
            <span className="text-xs font-bold text-rose-900 dark:text-rose-300 block mb-1">
              Joyful Learning
            </span>
            {editing ? (
              <textarea
                value={currentContent.learningDesign?.pedagogicalPractices?.joyful || ''}
                onChange={(e) =>
                  setData('content', {
                    ...data.content,
                    learningDesign: {
                      ...data.content?.learningDesign,
                      pedagogicalPractices: {
                        ...data.content?.learningDesign?.pedagogicalPractices,
                        joyful: e.target.value,
                      },
                    },
                  })
                }
                rows={3}
                className="w-full rounded border border-neutral-300 p-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            ) : (
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {currentContent.learningDesign?.pedagogicalPractices?.joyful ||
                  'Menyenangkan, penuh antusiasme, bermain sambil belajar.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Kemitraan & Lingkungan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card-kawaii p-5">
          <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-2">
            Kemitraan Pembelajaran (Orang Tua / Masyarakat)
          </h4>
          {editing ? (
            <textarea
              value={currentContent.learningDesign?.partnerships || ''}
              onChange={(e) =>
                setData('content', {
                  ...data.content,
                  learningDesign: {
                    ...data.content?.learningDesign,
                    partnerships: e.target.value,
                  },
                })
              }
              rows={3}
              className="w-full rounded border border-neutral-300 p-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          ) : (
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {currentContent.learningDesign?.partnerships ||
                'Melibatkan orang tua dalam penyediaan loose parts dan penguatan topik di rumah.'}
            </p>
          )}
        </div>

        <div className="card-kawaii p-5">
          <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-2">
            Pemanfaatan Lingkungan & Digital
          </h4>
          {editing ? (
            <textarea
              value={currentContent.learningDesign?.learningEnvironment || ''}
              onChange={(e) =>
                setData('content', {
                  ...data.content,
                  learningDesign: {
                    ...data.content?.learningDesign,
                    learningEnvironment: e.target.value,
                  },
                })
              }
              rows={3}
              className="w-full rounded border border-neutral-300 p-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          ) : (
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {currentContent.learningDesign?.learningEnvironment ||
                'Area luar kelas, taman sekolah, serta media audio/visual ramah anak.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

interface TabAssessmentProps extends TabExperienceProps {
  readonly assessments?: LoadedWeeklyAssessments
}

function AssessmentTriadOverview({
  earlyActs,
  processActs,
  finalActs,
}: {
  readonly earlyActs: string[]
  readonly processActs: string[]
  readonly finalActs: string[]
}) {
  return (
    <div className="card-kawaii space-y-4 p-5">
      <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
        <ClipboardCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        D. Asesmen Pembelajaran (Awal, Proses & Akhir)
      </h3>
      <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed italic">
        Asesmen dirancang untuk mengamati dan mendokumentasikan perkembangan anak secara alami
        melalui kegiatan bermain tanpa membuat anak merasa sedang dievaluasi.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-sky-50/60 p-4 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 space-y-2">
          <span className="text-xs font-bold text-sky-900 dark:text-sky-300 block">
            1. Asesmen Awal (Diagnostik)
          </span>
          <ul className="space-y-1.5 text-xs text-sky-950 dark:text-sky-200">
            {earlyActs.map((item, idx) => (
              <li key={`early-act-${item}-${idx}`} className="flex items-start gap-1.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-amber-50/60 p-4 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 space-y-2">
          <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
            2. Asesmen Proses (Observasi)
          </span>
          <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
            {processActs.map((item, idx) => (
              <li key={`proc-act-${item}-${idx}`} className="flex items-start gap-1.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-purple-50/60 p-4 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-2">
          <span className="text-xs font-bold text-purple-900 dark:text-purple-300 block">
            3. Asesmen Akhir (Refleksi & Karya)
          </span>
          <ul className="space-y-1.5 text-xs text-purple-950 dark:text-purple-200">
            {finalActs.map((item, idx) => (
              <li key={`final-act-${item}-${idx}`} className="flex items-start gap-1.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function AnecdoteAppendixTab({ anecdotes }: { readonly anecdotes?: AnecdoteItem[] }) {
  if (!anecdotes || anecdotes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center dark:border-neutral-800 space-y-2">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Belum ada catatan anekdot terisi untuk minggu ini. Dokumen cetak akan menampilkan format
          kosong siap cetak.
        </p>
        <Link
          href="/paud-assessments/create?type=anecdotal_note"
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
        >
          + Tambah Catatan Anekdot
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-left text-xs">
        <thead className="bg-purple-50 text-purple-900 dark:bg-purple-950/50 dark:text-purple-200 border-b border-neutral-200 dark:border-neutral-800 font-semibold">
          <tr>
            <th className="px-3 py-2.5 w-24">Tanggal</th>
            <th className="px-3 py-2.5 w-36">Nama Anak</th>
            <th className="px-3 py-2.5">Kejadian Teramati</th>
            <th className="px-3 py-2.5">Analisis Capaian</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {anecdotes.map((item) => (
            <tr
              key={`anecdote-row-${item.id || item.studentName}`}
              className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
            >
              <td className="px-3 py-2.5 font-medium text-neutral-600 dark:text-neutral-400 align-top">
                {item.date}
              </td>
              <td className="px-3 py-2.5 font-bold text-neutral-900 dark:text-white align-top">
                {item.studentName}
              </td>
              <td className="px-3 py-2.5 text-neutral-800 dark:text-neutral-200 align-top">
                {item.event}
              </td>
              <td className="px-3 py-2.5 text-neutral-800 dark:text-neutral-200 space-y-1 align-top">
                {item.analysis.split('\n').map((line, lIdx) => {
                  const trimmed = line.trim()
                  if (!trimmed) return null
                  const isHdr =
                    trimmed.endsWith(':') ||
                    /^Nilai Agama|^Jati Diri|^Dasar Literasi|^STEAM/i.test(trimmed)
                  return (
                    <p
                      key={`anecdote-line-${lIdx}`}
                      className={
                        isHdr
                          ? 'font-bold text-purple-900 dark:text-purple-300 mt-1'
                          : 'text-neutral-700 dark:text-neutral-300 text-xs'
                      }
                    >
                      {trimmed}
                    </p>
                  )
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ChecklistAppendixTab({
  checklists,
  studentChecklists,
}: {
  readonly checklists?: ChecklistItem[]
  readonly studentChecklists?: LoadedWeeklyAssessments['studentChecklists']
}) {
  if (studentChecklists && studentChecklists.length > 0) {
    return (
      <div className="space-y-6">
        {studentChecklists.map((group, gIdx) => (
          <div
            key={`student-checklist-group-${group.studentName}-${gIdx}`}
            className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm"
          >
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50 text-purple-900 dark:bg-purple-950/50 dark:text-purple-200 border-b border-neutral-200 dark:border-neutral-800 font-semibold">
                <tr>
                  <th
                    rowSpan={2}
                    className="px-3 py-2 w-10 text-center border-r border-purple-200/50 dark:border-purple-800/50"
                  >
                    No
                  </th>
                  <th
                    rowSpan={2}
                    className="px-3 py-2 border-r border-purple-200/50 dark:border-purple-800/50"
                  >
                    Indikator
                  </th>
                  <th
                    colSpan={2}
                    className="px-3 py-1.5 text-center border-b border-r border-purple-200/50 dark:border-purple-800/50 font-bold text-purple-950 dark:text-purple-100"
                  >
                    {group.studentName}
                  </th>
                  <th rowSpan={2} className="px-3 py-2 w-48">
                    Keterangan / Kejadian Teramati
                  </th>
                </tr>
                <tr>
                  <th className="px-2 py-1 w-20 text-center text-[11px] border-r border-purple-200/50 dark:border-purple-800/50">
                    Sudah Muncul
                  </th>
                  <th className="px-2 py-1 w-20 text-center text-[11px] border-r border-purple-200/50 dark:border-purple-800/50">
                    Belum Muncul
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {group.items.map((item, idx) => (
                  <tr
                    key={`checklist-row-${group.studentName}-${item.no || idx}`}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                  >
                    <td className="px-3 py-2 text-center font-medium text-neutral-500 border-r border-neutral-200 dark:border-neutral-800">
                      {item.no || idx + 1}
                    </td>
                    <td className="px-3 py-2 font-medium text-neutral-900 dark:text-white border-r border-neutral-200 dark:border-neutral-800">
                      {item.indicator}
                    </td>
                    <td className="px-2 py-2 text-center border-r border-neutral-200 dark:border-neutral-800">
                      {item.sudahMuncul ? (
                        <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 text-xs dark:bg-emerald-950 dark:text-emerald-300">
                          ✓
                        </span>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center border-r border-neutral-200 dark:border-neutral-800">
                      {item.belumMuncul ? (
                        <span className="inline-flex items-center justify-center rounded-full bg-rose-100 text-rose-700 font-bold px-2 py-0.5 text-xs dark:bg-rose-950 dark:text-rose-300">
                          ✓
                        </span>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300 text-xs">
                      {item.note || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    )
  }

  if (!checklists || checklists.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 space-y-2">
        <p className="text-xs text-neutral-600 dark:text-neutral-300">
          Menggunakan daftar standar 12 butir IKTP dari RPM. Jika Anda mengisi instrumen ceklis di
          menu <strong>Asesmen PAUD</strong>, ceklis hasil observasi per siswa akan otomatis mengisi
          tabel ini.
        </p>
        <Link
          href="/paud-assessments/create?type=checklist"
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
        >
          + Buat Asesmen Ceklis Kelas
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-left text-xs">
        <thead className="bg-purple-50 text-purple-900 dark:bg-purple-950/50 dark:text-purple-200 border-b border-neutral-200 dark:border-neutral-800 font-semibold">
          <tr>
            <th className="px-3 py-2.5 w-12 text-center">No</th>
            <th className="px-3 py-2.5">Indikator</th>
            <th className="px-3 py-2.5 w-24 text-center">Sudah Muncul</th>
            <th className="px-3 py-2.5 w-24 text-center">Belum Muncul</th>
            <th className="px-3 py-2.5 w-40">Keterangan / Anak</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {checklists.map((item) => (
            <tr
              key={`checklist-row-${item.no || item.indicator}`}
              className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
            >
              <td className="px-3 py-2.5 text-center font-medium text-neutral-500">{item.no}</td>
              <td className="px-3 py-2.5 font-medium text-neutral-900 dark:text-white">
                {item.indicator}
              </td>
              <td className="px-3 py-2.5 text-center">
                {item.sudahMuncul ? (
                  <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 text-xs dark:bg-emerald-950 dark:text-emerald-300">
                    ✓
                  </span>
                ) : (
                  <span className="text-neutral-400">-</span>
                )}
              </td>
              <td className="px-3 py-2.5 text-center">
                {item.belumMuncul ? (
                  <span className="inline-flex items-center justify-center rounded-full bg-rose-100 text-rose-700 font-bold px-2 py-0.5 text-xs dark:bg-rose-950 dark:text-rose-300">
                    ✓
                  </span>
                ) : (
                  <span className="text-neutral-400">-</span>
                )}
              </td>
              <td className="px-3 py-2.5 text-neutral-700 dark:text-neutral-300">
                {item.note || item.studentName || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function WorkSampleAppendixTab({ workSamples }: { readonly workSamples?: WorkSampleItem[] }) {
  if (!workSamples || workSamples.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center dark:border-neutral-800 space-y-2">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Belum ada hasil karya yang didokumentasikan untuk minggu ini. Dokumen cetak akan
          menyediakan area tempel foto karya.
        </p>
        <Link
          href="/paud-assessments/create?type=work_sample"
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
        >
          + Upload Hasil Karya Anak
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {workSamples.map((item) => (
        <div
          key={`work-sample-${item.id}`}
          className="flex flex-col sm:flex-row gap-3 rounded-xl border border-neutral-200 p-3 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-800/40"
        >
          <div className="w-full sm:w-32 h-28 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0 overflow-hidden border border-neutral-300 dark:border-neutral-600">
            {item.storedName ? (
              <img
                src={`/uploads/assessments/${item.id}/${item.storedName}`}
                alt={item.studentName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.currentTarget as HTMLElement).style.display = 'none'
                }}
              />
            ) : (
              <span className="text-[10px] text-neutral-500 italic">[ Foto Karya ]</span>
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h5 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                {item.studentName}
              </h5>
              <span className="text-[10px] text-neutral-500">{item.date}</span>
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-2">
              <strong className="text-neutral-900 dark:text-white">Deskripsi: </strong>
              {item.description}
            </p>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-2">
              <strong className="text-neutral-900 dark:text-white">Analisis: </strong>
              {item.analysis}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function PhotoSeriesAppendixTab({ photoSeries }: { readonly photoSeries?: PhotoSeriesItem[] }) {
  if (!photoSeries || photoSeries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center dark:border-neutral-800 space-y-2">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Belum ada foto berseri untuk minggu ini. Dokumen cetak akan menyediakan format 3 foto
          berurutan.
        </p>
        <Link
          href="/paud-assessments/create?type=photo_series"
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
        >
          + Upload Foto Berseri
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {photoSeries.map((item) => (
        <div
          key={`photo-series-${item.id}`}
          className="rounded-xl border border-neutral-200 p-3.5 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-800/40 space-y-2.5"
        >
          <div className="flex items-center justify-between gap-2">
            <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
              {item.studentName}
            </h5>
            <span className="text-[10px] text-neutral-500">{item.date}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {item.attachments
              .slice(0, 3)
              .map((att: { id: number; storedName?: string }, attIdx: number) => (
                <div
                  key={`att-${att.id}`}
                  className="h-20 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center overflow-hidden border border-neutral-300 dark:border-neutral-600"
                >
                  {att.storedName ? (
                    <img
                      src={`/uploads/assessments/${item.id}/${att.storedName}`}
                      alt={`Foto ${attIdx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <span className="text-[10px] text-neutral-500">Foto {attIdx + 1}</span>
                  )}
                </div>
              ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800">
              <strong className="text-neutral-900 dark:text-white block mb-0.5">
                Judul / Kegiatan:
              </strong>
              <span className="text-neutral-700 dark:text-neutral-300">{item.description}</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800">
              <strong className="text-neutral-900 dark:text-white block mb-0.5">
                Analisis Perkembangan:
              </strong>
              <span className="text-neutral-700 dark:text-neutral-300">{item.analysis}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TabAssessmentSection({
  editing,
  currentContent,
  data,
  setData,
  assessments,
}: TabAssessmentProps) {
  const [activeAppendixTab, setActiveAppendixTab] = useState<
    'anecdote' | 'checklist' | 'work' | 'photo'
  >('anecdote')

  const earlyActs = currentContent.assessment?.earlyAssessment || [
    'Ajak anak bercerita tentang dirinya sambil bermain boneka atau media interaktif',
    'Minta anak mengekspresikan ide awal terkait tema secara bebas tanpa tekanan',
    'Observasi bagaimana anak memperkenalkan diri kepada teman baru di awal kegiatan',
  ]
  const processActs = currentContent.assessment?.processAssessment || [
    'Foto dan video anak saat bermain untuk melihat interaksi sosial dan keterampilan motorik',
    'Buat catatan singkat tentang kata-kata santun yang diucapkan anak secara spontan',
    'Dokumentasikan cara anak menyelesaikan tugas mandiri seperti merapikan mainan',
  ]
  const finalActs = currentContent.assessment?.finalAssessment || [
    'Minta anak mempresentasikan hasil karyanya dengan cara yang menyenangkan',
    'Ajak anak merefleksi dengan pertanyaan "Apa yang paling berharga yang kamu pelajari hari ini?"',
    'Observasi perubahan sikap anak dari awal hingga akhir pembelajaran',
  ]

  const anecdoteCount = assessments?.anecdotes?.length || 0
  const checklistCount = assessments?.checklists?.length || 0
  const workSampleCount = assessments?.workSamples?.length || 0
  const photoSeriesCount = assessments?.photoSeries?.length || 0
  const totalFilled =
    anecdoteCount + (checklistCount > 0 ? 1 : 0) + workSampleCount + photoSeriesCount

  return (
    <div className="space-y-6">
      <AssessmentTriadOverview
        earlyActs={earlyActs}
        processActs={processActs}
        finalActs={finalActs}
      />

      {/* Indikator Ketercapaian Tujuan Pembelajaran (IKTP) */}
      <div className="card-kawaii space-y-4 p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Indikator Ketercapaian Tujuan Pembelajaran (IKTP)
        </h3>

        {editing ? (
          <DocumentSectionEditor
            value={(currentContent.assessment?.indicators || []).map((ind) => ind.indicator || '')}
            onChange={(val) => {
              const list = (Array.isArray(val) ? val : [val]).map((str) => ({
                indicator: str,
              }))
              setData('content', {
                ...data.content,
                assessment: {
                  ...data.content?.assessment,
                  indicators: list,
                },
              })
            }}
            placeholder="Indikator ketercapaian..."
          />
        ) : (
          <IktpList indicators={currentContent.assessment?.indicators} />
        )}
      </div>

      {/* Integrasi Asesmen Otentik (Lampiran 1 - 4) */}
      <div className="card-kawaii space-y-5 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Instrumen & Rekap Hasil Asesmen Otentik Minggu Ini
              </h3>
              <span className="shrink-0 whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                {totalFilled > 0 ? `${totalFilled} Asesmen Terisi` : 'Template Siap Pakai'}
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
              Data asesmen harian di menu <strong>Asesmen PAUD</strong> otomatis terintegrasi dan
              mengisi tabel lampiran RPM saat dicetak (PDF & DOCX).
            </p>
          </div>
          <Link
            href="/paud-assessments"
            className="inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors dark:bg-purple-700 dark:hover:bg-purple-600"
          >
            <span>Input Asesmen PAUD</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4 Tabs Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setActiveAppendixTab('anecdote')}
            className={cn(
              'flex flex-col items-start p-3 rounded-xl border text-left transition-all',
              activeAppendixTab === 'anecdote'
                ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 dark:border-purple-500 shadow-sm'
                : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/70 dark:border-neutral-800 dark:bg-neutral-800/40'
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                Lampiran 1
              </span>
              <span
                className={cn(
                  'shrink-0 whitespace-nowrap text-[10px] font-bold px-1.5 py-0.5 rounded',
                  anecdoteCount > 0
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                )}
              >
                {anecdoteCount} Terisi
              </span>
            </div>
            <span className="text-xs font-bold text-neutral-900 dark:text-white mt-1">
              Catatan Anekdot
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAppendixTab('checklist')}
            className={cn(
              'flex flex-col items-start p-3 rounded-xl border text-left transition-all',
              activeAppendixTab === 'checklist'
                ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 dark:border-purple-500 shadow-sm'
                : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/70 dark:border-neutral-800 dark:bg-neutral-800/40'
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                Lampiran 2
              </span>
              <span
                className={cn(
                  'shrink-0 whitespace-nowrap text-[10px] font-bold px-1.5 py-0.5 rounded',
                  checklistCount > 0
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                )}
              >
                {checklistCount > 0 ? `${checklistCount} Butir` : 'Default'}
              </span>
            </div>
            <span className="text-xs font-bold text-neutral-900 dark:text-white mt-1">
              Ceklis IKTP
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAppendixTab('work')}
            className={cn(
              'flex flex-col items-start p-3 rounded-xl border text-left transition-all',
              activeAppendixTab === 'work'
                ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 dark:border-purple-500 shadow-sm'
                : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/70 dark:border-neutral-800 dark:bg-neutral-800/40'
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                Lampiran 3
              </span>
              <span
                className={cn(
                  'shrink-0 whitespace-nowrap text-[10px] font-bold px-1.5 py-0.5 rounded',
                  workSampleCount > 0
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                )}
              >
                {workSampleCount} Foto
              </span>
            </div>
            <span className="text-xs font-bold text-neutral-900 dark:text-white mt-1">
              Hasil Karya
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAppendixTab('photo')}
            className={cn(
              'flex flex-col items-start p-3 rounded-xl border text-left transition-all',
              activeAppendixTab === 'photo'
                ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 dark:border-purple-500 shadow-sm'
                : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/70 dark:border-neutral-800 dark:bg-neutral-800/40'
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                Lampiran 4
              </span>
              <span
                className={cn(
                  'shrink-0 whitespace-nowrap text-[10px] font-bold px-1.5 py-0.5 rounded',
                  photoSeriesCount > 0
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                )}
              >
                {photoSeriesCount} Seri
              </span>
            </div>
            <span className="text-xs font-bold text-neutral-900 dark:text-white mt-1">
              Foto Berseri
            </span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeAppendixTab === 'anecdote' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Catatan Anekdot Terisi
            </h4>
            <AnecdoteAppendixTab anecdotes={assessments?.anecdotes} />
          </div>
        )}

        {activeAppendixTab === 'checklist' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Ceklis IKTP (Indikator Ketercapaian)
            </h4>
            <ChecklistAppendixTab
              checklists={assessments?.checklists}
              studentChecklists={assessments?.studentChecklists}
            />
          </div>
        )}

        {activeAppendixTab === 'work' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Dokumentasi Hasil Karya Terisi
            </h4>
            <WorkSampleAppendixTab workSamples={assessments?.workSamples} />
          </div>
        )}

        {activeAppendixTab === 'photo' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Dokumentasi Foto Berseri Terisi
            </h4>
            <PhotoSeriesAppendixTab photoSeries={assessments?.photoSeries} />
          </div>
        )}
      </div>
    </div>
  )
}

function TabSummarySection({
  editing,
  weeklyLessonPlan,
  data,
  setData,
}: {
  readonly editing: boolean
  readonly weeklyLessonPlan: WeeklyLessonPlan
  readonly data: { content: WeeklyLessonPlanContent }
  readonly setData: (key: 'content', value: WeeklyLessonPlanContent) => void
}) {
  const content = weeklyLessonPlan.content || {}
  const currentContent = editing ? data.content : content

  return (
    <div className="space-y-6">
      <div className="card-kawaii space-y-3 p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
          E. Refleksi Guru & Umpan Balik
        </h3>
        {editing ? (
          <textarea
            value={currentContent.reflection || ''}
            onChange={(e) =>
              setData('content', {
                ...data.content,
                reflection: e.target.value,
              })
            }
            rows={4}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 text-xs text-neutral-900 focus:border-purple-600 focus:outline-none dark:border-neutral-800 dark:bg-neutral-800/40 dark:text-white"
            placeholder="Catatan refleksi pelaksanaan pembelajaran minggu ini..."
          />
        ) : (
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
            {currentContent.reflection || 'Belum ada catatan refleksi guru.'}
          </p>
        )}
      </div>
    </div>
  )
}

interface RpmHeaderProps {
  readonly weeklyLessonPlan: WeeklyLessonPlan
  readonly theme: string
  readonly subtheme: string
  readonly isPublished: boolean
  readonly editing: boolean
  readonly processing: boolean
  readonly workflow?: WorkflowData
  readonly onTogglePublish: () => void
  readonly onEdit: () => void
  readonly onCancel: () => void
  readonly onSubmit: (e: React.SyntheticEvent) => void
}

type RpmActionMenuProps = Pick<
  RpmHeaderProps,
  | 'weeklyLessonPlan'
  | 'isPublished'
  | 'editing'
  | 'processing'
  | 'workflow'
  | 'onTogglePublish'
  | 'onEdit'
  | 'onCancel'
  | 'onSubmit'
>

function RpmActionMenu({
  weeklyLessonPlan,
  isPublished,
  editing,
  processing,
  workflow,
  onTogglePublish,
  onEdit,
  onCancel,
  onSubmit,
}: RpmActionMenuProps) {
  const [open, setOpen] = useState(false)
  const closeMenu = () => setOpen(false)
  const menuItemClass =
    'flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-neutral-800 transition-colors hover:bg-emerald-50 hover:text-emerald-800 dark:text-neutral-100 dark:hover:bg-emerald-950/40'

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn-kawaii-amber"
      >
        <Sparkles className="h-4 w-4" />
        <span>Aksi &amp; Opsi</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Tutup menu Aksi & Opsi"
            className="fixed inset-0 z-10 cursor-default border-0 bg-transparent p-0"
            onClick={closeMenu}
          />
          <div
            role="menu"
            className="absolute right-0 z-20 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border-2 border-black bg-white p-2 shadow-[6px_6px_0px_#000000] dark:border-white dark:bg-neutral-900 dark:shadow-[6px_6px_0px_#ffffff]"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                closeMenu()
                onTogglePublish()
              }}
              className={menuItemClass}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              {isPublished ? 'Jadikan Draf' : 'Terbitkan'}
            </button>

            <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />

            <DocumentWorkflowActions
              type="rppm"
              id={weeklyLessonPlan.id}
              status={workflow?.status ?? weeklyLessonPlan.status}
              templateKey={workflow?.templateKey}
              onSaved={closeMenu}
              menu
            />

            <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />

            {editing ? (
              <>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    closeMenu()
                    onCancel()
                  }}
                  className={menuItemClass}
                >
                  <X className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                  Batal
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={(event) => {
                    closeMenu()
                    onSubmit(event)
                  }}
                  disabled={processing}
                  className={cn(
                    menuItemClass,
                    'text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  <Save className="h-4 w-4" />
                  {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    closeMenu()
                    onEdit()
                  }}
                  className={menuItemClass}
                >
                  <Pencil className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  Edit RPM
                </button>
                <a
                  href={`/rppm/${weeklyLessonPlan.id}/export/pdf?disposition=inline`}
                  target="_blank"
                  rel="noreferrer"
                  role="menuitem"
                  onClick={closeMenu}
                  className={menuItemClass}
                >
                  <Download className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  PDF
                </a>
                <a
                  href={`/rppm/${weeklyLessonPlan.id}/export`}
                  role="menuitem"
                  onClick={closeMenu}
                  className={cn(
                    menuItemClass,
                    'text-purple-700 hover:bg-purple-50 hover:text-purple-900 dark:text-purple-300 dark:hover:bg-purple-950/50 dark:hover:text-purple-200'
                  )}
                >
                  <Download className="h-4 w-4" />
                  DOCX
                </a>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function RpmHeaderToolbar({
  weeklyLessonPlan,
  theme,
  subtheme,
  isPublished,
  editing,
  processing,
  workflow,
  onTogglePublish,
  onEdit,
  onCancel,
  onSubmit,
}: RpmHeaderProps) {
  return (
    <div className="relative flex flex-col gap-4 overflow-visible rounded-3xl border-2 border-black bg-emerald-600 p-4 shadow-[4px_4px_0px_#000000] dark:border-white dark:bg-emerald-800 dark:shadow-[4px_4px_0px_#ffffff] sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="relative flex min-w-0 items-center gap-3">
        <Link
          href="/rppm"
          className="btn-kawaii-secondary !h-11 !w-11 !shrink-0 !p-2.5"
          aria-label="Kembali ke daftar RPM"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-black bg-amber-300 text-neutral-950 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-amber-400 dark:shadow-[2px_2px_0px_#ffffff] sm:flex">
          <Calendar className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="shrink-0 whitespace-nowrap rounded-full border-2 border-black bg-purple-200 px-2.5 py-1 text-xs font-black text-purple-950 dark:border-white dark:bg-purple-300 dark:text-purple-950">
              RPM KBC RA (Deep Learning)
            </span>
            <span className="text-sm font-medium text-emerald-50">
              {weeklyLessonPlan.schoolClass?.name || 'Kelompok B'}
            </span>
            {weeklyLessonPlan.content?.weekNumber && (
              <span className="shrink-0 whitespace-nowrap rounded-full border border-black bg-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-950 dark:border-white dark:bg-emerald-300 dark:text-emerald-950">
                Minggu {weeklyLessonPlan.content.weekNumber}
              </span>
            )}
            <span
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full border border-black px-2.5 py-1 text-xs font-bold dark:border-white',
                isPublished
                  ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-200 dark:text-emerald-950'
                  : 'bg-white text-neutral-950 dark:bg-neutral-100 dark:text-neutral-950'
              )}
            >
              {isPublished ? 'Terbit' : 'Draf'}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            <h1 className="truncate text-xl font-black text-white sm:text-2xl">{theme}</h1>
            {subtheme ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-white/95 px-2.5 py-1 text-xs font-bold text-purple-950 dark:border-white dark:bg-neutral-100 dark:text-purple-950">
                <span className="font-semibold text-neutral-600">Subtema:</span>
                <span>{subtheme}</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative flex justify-end sm:ml-4">
        <RpmActionMenu
          weeklyLessonPlan={weeklyLessonPlan}
          isPublished={isPublished}
          editing={editing}
          processing={processing}
          workflow={workflow}
          onTogglePublish={onTogglePublish}
          onEdit={onEdit}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}

export default function WeeklyLessonPlanShow({
  weeklyLessonPlan,
  workflow,
  assessments,
}: WeeklyLessonPlanShowProps) {
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'identification' | 'design' | 'experience' | 'assessment' | 'summary'
  >('experience')

  const content = weeklyLessonPlan.content || {}
  const isRpmKbc = Boolean(
    content.identification || content.learningExperience || content.learningDesign
  )

  const { data, setData, put, processing, reset } = useForm<{
    theme: string
    weekStartDate: string
    content: WeeklyLessonPlanContent
  }>({
    theme: weeklyLessonPlan.theme,
    weekStartDate: weeklyLessonPlan.weekStartDate
      ? weeklyLessonPlan.weekStartDate.slice(0, 10)
      : '',
    content: (weeklyLessonPlan.content as WeeklyLessonPlanContent) ?? {},
  })

  const isPublished = weeklyLessonPlan.status === 'published'

  useDocumentAutosave(
    'rppm',
    weeklyLessonPlan.id,
    data.content as Record<string, unknown>,
    isPublished ? 'published' : 'draft',
    editing
  )

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    put(`/rppm/${weeklyLessonPlan.id}`, {
      onSuccess: () => setEditing(false),
    })
  }

  const handleCancel = () => {
    reset()
    setEditing(false)
  }

  const currentContent = editing ? data.content : content
  const theme = editing
    ? data.theme
    : currentContent.topic || currentContent.theme || weeklyLessonPlan.theme
  const subtheme = currentContent.subtheme || currentContent.subtopic || ''

  const handleTogglePublish = () => {
    const nextStatus = isPublished ? 'draft' : 'published'
    put(`/rppm/${weeklyLessonPlan.id}`, {
      // @ts-ignore
      data: { status: nextStatus },
      onSuccess: () => setEditing(false),
    })
  }

  return (
    <DashboardWrapper
      title={weeklyLessonPlan.theme}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Modul Ajar (RPM)', href: '/rppm' },
        { label: weeklyLessonPlan.theme },
      ]}
    >
      <Head title={`${theme} — Modul Ajar RPM`} />

      <div className="space-y-6">
        <RpmHeaderToolbar
          weeklyLessonPlan={weeklyLessonPlan}
          theme={theme}
          subtheme={subtheme}
          isPublished={isPublished}
          editing={editing}
          processing={processing}
          workflow={workflow}
          onTogglePublish={handleTogglePublish}
          onEdit={() => setEditing(true)}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />

        {/* Workflow Meta Banner */}
        <DocumentWorkflowMeta
          status={workflow?.status ?? weeklyLessonPlan.status}
          lastSavedAt={workflow?.lastSavedAt}
          version={workflow?.version}
          templateKey={workflow?.templateKey}
          variant="kawaii"
        />

        {/* 4 Tabs Navigation RPM */}
        {isRpmKbc && (
          <div className="card-kawaii p-2">
            <nav className="flex gap-1 overflow-x-auto" aria-label="Tabs RPM">
              <button
                type="button"
                onClick={() => setActiveTab('experience')}
                className={cn(
                  'flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-xs font-bold transition whitespace-nowrap',
                  activeTab === 'experience'
                    ? 'border-black bg-amber-300 text-neutral-950 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-amber-400 dark:text-neutral-950 dark:shadow-[2px_2px_0px_#ffffff]'
                    : 'border-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                )}
              >
                <Sparkles className="h-4 w-4" />
                Pengalaman Belajar (Inti Harian)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('identification')}
                className={cn(
                  'flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-xs font-bold transition whitespace-nowrap',
                  activeTab === 'identification'
                    ? 'border-black bg-amber-300 text-neutral-950 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-amber-400 dark:text-neutral-950 dark:shadow-[2px_2px_0px_#ffffff]'
                    : 'border-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                )}
              >
                <BookOpen className="h-4 w-4" />
                Identifikasi Pembelajaran
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('design')}
                className={cn(
                  'flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-xs font-bold transition whitespace-nowrap',
                  activeTab === 'design'
                    ? 'border-black bg-amber-300 text-neutral-950 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-amber-400 dark:text-neutral-950 dark:shadow-[2px_2px_0px_#ffffff]'
                    : 'border-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                )}
              >
                <Layers className="h-4 w-4" />
                Desain Pembelajaran (TP & Pedagogis)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('assessment')}
                className={cn(
                  'flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-xs font-bold transition whitespace-nowrap',
                  activeTab === 'assessment'
                    ? 'border-black bg-amber-300 text-neutral-950 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-amber-400 dark:text-neutral-950 dark:shadow-[2px_2px_0px_#ffffff]'
                    : 'border-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                )}
              >
                <ClipboardCheck className="h-4 w-4" />
                Asesmen Pembelajaran & Lampiran
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={cn(
                  'flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-xs font-bold transition whitespace-nowrap',
                  activeTab === 'summary'
                    ? 'border-black bg-emerald-300 text-neutral-950 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-emerald-400 dark:text-neutral-950 dark:shadow-[2px_2px_0px_#ffffff]'
                    : 'border-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                )}
              >
                <FileText className="h-4 w-4" />3 Elemen CP Ringkas
              </button>
            </nav>
          </div>
        )}

        {/* Render Active Tab */}
        {isRpmKbc && activeTab === 'experience' && (
          <TabExperienceSection
            editing={editing}
            currentContent={currentContent}
            data={data}
            setData={setData}
          />
        )}

        {isRpmKbc && activeTab === 'identification' && (
          <TabIdentificationSection
            editing={editing}
            currentContent={currentContent}
            data={data}
            setData={setData}
          />
        )}

        {isRpmKbc && activeTab === 'design' && (
          <TabDesignSection
            editing={editing}
            currentContent={currentContent}
            data={data}
            setData={setData}
          />
        )}

        {isRpmKbc && activeTab === 'assessment' && (
          <TabAssessmentSection
            editing={editing}
            currentContent={currentContent}
            data={data}
            setData={setData}
            assessments={assessments}
          />
        )}

        {(!isRpmKbc || activeTab === 'summary') && (
          <TabSummarySection
            editing={editing}
            weeklyLessonPlan={weeklyLessonPlan}
            data={data}
            setData={setData}
          />
        )}
      </div>
    </DashboardWrapper>
  )
}
