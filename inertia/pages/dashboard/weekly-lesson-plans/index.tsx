import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import {
  BookOpen,
  Trash2,
  Sparkles,
  CheckCircle2,
  Loader2,
  Eye,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  Plus,
  Filter,
  FileText,
} from 'lucide-react'
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
    topic?: string
    subtopic?: string
    title?: string
    semester?: number
    weekNumber?: number
    groupContext?: string
    identification?: {
      studentCharacteristics?: string
      dpl?: string[]
      kbcValues?: string[]
      [key: string]: any
    }
    [key: string]: any
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

  // Search, Filter, Sort, and Pagination state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSemester, setFilterSemester] = useState<'all' | number>('all')
  const [filterClassId, setFilterClassId] = useState<'all' | number>('all')
  const [sortBy, setSortBy] = useState<'week' | 'theme' | 'date' | 'status'>('week')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Reset to page 1 on search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterSemester, filterClassId, pageSize])

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

  // Filtered & Sorted plans calculation
  const filteredAndSortedPlans = useMemo(() => {
    return weeklyLessonPlans
      .filter((plan) => {
        // Semester filter
        const planSemester = plan.content?.semester
        if (filterSemester !== 'all' && planSemester !== filterSemester) {
          return false
        }

        // Class filter
        if (filterClassId !== 'all' && plan.schoolClass?.id !== filterClassId) {
          return false
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const themeMatch = plan.theme?.toLowerCase().includes(q)
          const topicMatch = (plan.content?.topic || plan.content?.theme)?.toLowerCase().includes(q)
          const subthemeMatch = (plan.content?.subtheme || plan.content?.subtopic)
            ?.toLowerCase()
            .includes(q)
          const classMatch = plan.schoolClass?.name?.toLowerCase().includes(q)
          const kbcMatch = plan.content?.identification?.kbcValues?.some((k: string) =>
            k.toLowerCase().includes(q)
          )
          const weekStr = `minggu ${plan.content?.weekNumber || ''}`.toLowerCase()
          const weekMatch = weekStr.includes(q)

          if (
            !themeMatch &&
            !topicMatch &&
            !subthemeMatch &&
            !classMatch &&
            !kbcMatch &&
            !weekMatch
          ) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        let comparison = 0
        if (sortBy === 'week') {
          const semA = a.content?.semester || 1
          const semB = b.content?.semester || 1
          const weekA = a.content?.weekNumber || 0
          const weekB = b.content?.weekNumber || 0
          comparison = semA !== semB ? semA - semB : weekA - weekB
        } else if (sortBy === 'theme') {
          comparison = (a.theme || '').localeCompare(b.theme || '')
        } else if (sortBy === 'date') {
          comparison = new Date(a.weekStartDate).getTime() - new Date(b.weekStartDate).getTime()
        } else if (sortBy === 'status') {
          comparison = (a.status || '').localeCompare(b.status || '')
        }

        return sortOrder === 'asc' ? comparison : -comparison
      })
  }, [weeklyLessonPlans, searchQuery, filterSemester, filterClassId, sortBy, sortOrder])

  const totalItems = filteredAndSortedPlans.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const paginatedPlans = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize
    return filteredAndSortedPlans.slice(startIdx, startIdx + pageSize)
  }, [filteredAndSortedPlans, currentPage, pageSize])

  const handleSort = (column: 'week' | 'theme' | 'date' | 'status') => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const hasActiveFilters =
    Boolean(searchQuery.trim()) || filterSemester !== 'all' || filterClassId !== 'all'

  const resetFilters = () => {
    setSearchQuery('')
    setFilterSemester('all')
    setFilterClassId('all')
  }

  return (
    <DashboardWrapper
      title="Modul Ajar Mingguan (RPPM)"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Modul Ajar (RPPM)' }]}
    >
      <Head title="Modul Ajar Mingguan (RPPM) — SiapAjar" />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                Daftar Modul Ajar (RPPM)
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {weeklyLessonPlans.length} Modul
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
              Rencana Pelaksanaan Pembelajaran Mingguan (RPPM) dan Modul Ajar Terintegrasi KBC RA
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGenerateModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate AI RPPM</span>
            </button>
            <Link
              href="/rppm/create"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Buat Manual</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tema, subtema, nilai KBC, atau kelas..."
              style={{ paddingLeft: '2.6rem', paddingRight: '2.5rem' }}
              className="w-full rounded-xl border border-neutral-300 bg-white py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <select
                value={filterSemester}
                onChange={(e) =>
                  setFilterSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="rounded-xl border border-neutral-300 bg-white px-2.5 py-2 text-xs font-semibold text-neutral-700 focus:border-emerald-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                <option value="all">Semua Semester</option>
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
              </select>
            </div>

            {classes.length > 0 && (
              <select
                value={filterClassId}
                onChange={(e) =>
                  setFilterClassId(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="rounded-xl border border-neutral-300 bg-white px-2.5 py-2 text-xs font-semibold text-neutral-700 focus:border-emerald-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                <option value="all">Semua Kelompok</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-dashed border-neutral-300 px-2.5 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                title="Reset semua filter"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {weeklyLessonPlans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60">
              <FileText className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">
              Belum Ada Modul Ajar (RPPM)
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-neutral-600 dark:text-neutral-400">
              Mulai dengan men-generate RPPM otomatis dengan AI Kurikulum Merdeka atau buat secara
              manual sesuai kalender pendidikan Anda.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowGenerateModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Generate dengan AI</span>
              </button>
              <Link
                href="/rppm/create"
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Buat Manual</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedPlans.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Tidak ada modul ajar yang cocok dengan filter / pencarian &quot;{searchQuery}
                  &quot;
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50/90 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800/70 dark:text-neutral-300">
                        <th
                          className="px-5 py-3.5 whitespace-nowrap cursor-pointer select-none hover:bg-neutral-100/80 dark:hover:bg-neutral-800 transition"
                          onClick={() => handleSort('week')}
                        >
                          <div className="inline-flex items-center gap-1.5">
                            <span>Minggu / Smt</span>
                            {sortBy === 'week' ? (
                              sortOrder === 'asc' ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowDown className="h-3.5 w-3.5" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
                            )}
                          </div>
                        </th>
                        <th
                          className="px-5 py-3.5 cursor-pointer select-none hover:bg-neutral-100/80 dark:hover:bg-neutral-800 transition"
                          onClick={() => handleSort('theme')}
                        >
                          <div className="inline-flex items-center gap-1.5">
                            <span>Tema & Subtema</span>
                            {sortBy === 'theme' ? (
                              sortOrder === 'asc' ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowDown className="h-3.5 w-3.5" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
                            )}
                          </div>
                        </th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Kelompok</th>
                        <th
                          className="px-5 py-3.5 whitespace-nowrap cursor-pointer select-none hover:bg-neutral-100/80 dark:hover:bg-neutral-800 transition"
                          onClick={() => handleSort('date')}
                        >
                          <div className="inline-flex items-center gap-1.5">
                            <span>Mulai</span>
                            {sortBy === 'date' ? (
                              sortOrder === 'asc' ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowDown className="h-3.5 w-3.5" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
                            )}
                          </div>
                        </th>
                        <th
                          className="px-5 py-3.5 whitespace-nowrap cursor-pointer select-none hover:bg-neutral-100/80 dark:hover:bg-neutral-800 transition"
                          onClick={() => handleSort('status')}
                        >
                          <div className="inline-flex items-center gap-1.5">
                            <span>Status</span>
                            {sortBy === 'status' ? (
                              sortOrder === 'asc' ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowDown className="h-3.5 w-3.5" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
                            )}
                          </div>
                        </th>
                        <th className="px-5 py-3.5 text-right whitespace-nowrap">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                      {paginatedPlans.map((item) => {
                        const weekNum = item.content?.weekNumber
                        const semesterNum = item.content?.semester
                        const topic = item.content?.topic || item.content?.theme || item.theme
                        const subtheme = item.content?.subtheme || item.content?.subtopic
                        const kbcList = item.content?.identification?.kbcValues || []

                        return (
                          <tr
                            key={item.id}
                            className="group transition-colors hover:bg-neutral-50/90 dark:hover:bg-neutral-800/40"
                          >
                            {/* Minggu / Smt */}
                            <td className="px-5 py-4 whitespace-nowrap align-middle">
                              <div className="flex items-center gap-1.5">
                                {weekNum ? (
                                  <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300 whitespace-nowrap">
                                    Minggu {weekNum}
                                  </span>
                                ) : (
                                  <span className="text-xs text-neutral-400">-</span>
                                )}
                                {semesterNum ? (
                                  <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                                    Smt {semesterNum}
                                  </span>
                                ) : null}
                              </div>
                            </td>

                            {/* Tema & Subtema */}
                            <td className="px-5 py-4 align-middle">
                              <div className="flex flex-col gap-0.5">
                                <Link
                                  href={`/rppm/${item.id}`}
                                  className="font-bold text-neutral-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 transition text-sm"
                                >
                                  {topic}
                                </Link>
                                {subtheme ? (
                                  <div className="flex items-center gap-1.5 text-xs mt-0.5">
                                    <span className="font-semibold text-neutral-500 dark:text-neutral-400">
                                      Subtema:
                                    </span>
                                    <span className="font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-200/60 dark:border-purple-800/40">
                                      {subtheme}
                                    </span>
                                  </div>
                                ) : null}
                                {kbcList.length > 0 && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {kbcList.slice(0, 3).map((kbc) => (
                                      <span
                                        key={kbc}
                                        className="rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 whitespace-nowrap"
                                      >
                                        {kbc}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Kelompok / Kelas */}
                            <td className="px-5 py-4 whitespace-nowrap text-neutral-800 dark:text-neutral-200 font-medium align-middle">
                              {item.schoolClass?.name || '-'}
                            </td>

                            {/* Tanggal Mulai */}
                            <td className="px-5 py-4 whitespace-nowrap text-neutral-600 dark:text-neutral-400 text-xs font-medium align-middle">
                              {new Date(item.weekStartDate).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4 whitespace-nowrap align-middle">
                              <span
                                className={cn(
                                  'rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 whitespace-nowrap',
                                  item.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                    : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                                )}
                              >
                                {item.status === 'published' ? 'Terbit' : 'Draf'}
                              </span>
                            </td>

                            {/* Aksi */}
                            <td className="px-5 py-4 whitespace-nowrap text-right align-middle">
                              <div className="inline-flex items-center justify-end gap-2">
                                <Link
                                  href={`/rppm/${item.id}`}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-emerald-400"
                                  title="Lihat Detail RPM"
                                >
                                  <Eye className="h-3.5 w-3.5 text-neutral-500 group-hover:text-emerald-600 dark:text-neutral-400" />
                                  <span>Detail</span>
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => setDeletingPlan(item)}
                                  className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                                  title="Hapus RPM"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-neutral-200 dark:border-neutral-800 px-5 py-3.5 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <div className="flex items-center gap-3">
                    <span>
                      Menampilkan{' '}
                      <strong className="text-neutral-900 dark:text-white">
                        {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                        {Math.min(currentPage * pageSize, totalItems)}
                      </strong>{' '}
                      dari{' '}
                      <strong className="text-neutral-900 dark:text-white">{totalItems}</strong>{' '}
                      Modul Ajar
                    </span>

                    {/* Page Size Selector */}
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="text-neutral-500">Baris per hal:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number.parseInt(e.target.value, 10))}
                        className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-xs font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={18}>18</option>
                        <option value={25}>25</option>
                      </select>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage <= 1}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Sebelumnya</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            'h-7 w-7 rounded-lg text-xs font-bold transition',
                            currentPage === pageNum
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                          )}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage >= totalPages}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      <span>Selanjutnya</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                          Pilih Tema Mingguan (1 s.d 18)
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
                              {p.weekNumber ? `Minggu ${p.weekNumber}: ` : ''}
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
                          Minggu Ke-
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
                    Tanggal Mulai Minggu Ini (Hari Senin)
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
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
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
