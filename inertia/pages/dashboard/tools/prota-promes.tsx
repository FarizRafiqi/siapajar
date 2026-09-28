import { Head, Link, router } from '@inertiajs/react'
import { useState, useMemo, useEffect } from 'react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import GenerationProgressModal from '~/components/dashboard/generation-progress-modal'
import {
  CalendarDays,
  Zap,
  Coins,
  RotateCw,
  Sparkles,
  Clock,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'

interface Subject {
  id: number
  name: string
}

interface SchoolClass {
  id: number
  name: string
  academicYearId?: number
}

interface AcademicYear {
  id: number
  name: string
}

interface Semester {
  id: number
  name: string
  academicYearId: number
  academicYear?: { name: string }
}

interface CurriculumCpItem {
  id: number
  code: string
  element: string
  title: string
  description: string
  phase: string
}

interface AnnualPlanItem {
  id: number
  subject: string
  academicYear?: { name: string }
  content: Record<string, any>
  createdAt: string
}

interface SemesterPlanItem {
  id: number
  subject: string
  semester?: { name: string }
  schoolClass?: { name: string }
  content: Record<string, any>
  createdAt: string
}

interface ProtaPromesProps {
  isTk?: boolean
  educationLevel?: string | null
  institutionType?: string | null
  academicYearId?: number
  semesterId?: number
  userProfile?: {
    fullName?: string
    schoolName?: string
    educationLevel?: string | null
    institutionType?: string | null
    defaultGroupContext?: string | null
  }
  subjects?: Subject[]
  classes?: SchoolClass[]
  academicYears?: AcademicYear[]
  semesters?: Semester[]
  annualPlans?: AnnualPlanItem[]
  semesterPlans?: SemesterPlanItem[]
  cps?: CurriculumCpItem[]
}

const JENJANG_OPTIONS = [
  {
    id: 'PAUD',
    label: 'PAUD / RA',
    fase: 'Fondasi',
    defaultJp: 5,
    defaultClasses: ['Kelompok A (4-5 Th)', 'Kelompok B (5-6 Th)'],
  },
  {
    id: 'SD',
    label: 'SD / MI',
    fase: 'Fase A/B/C',
    defaultJp: 4,
    defaultClasses: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
  },
  {
    id: 'SMP',
    label: 'SMP / MTs',
    fase: 'Fase D',
    defaultJp: 3,
    defaultClasses: ['Kelas VII', 'Kelas VIII', 'Kelas IX'],
  },
  {
    id: 'SMA',
    label: 'SMA / MA',
    fase: 'Fase E/F',
    defaultJp: 3,
    defaultClasses: ['Kelas X', 'Kelas XI', 'Kelas XII'],
  },
  {
    id: 'SMK',
    label: 'SMK / MAK',
    fase: 'Fase E/F',
    defaultJp: 4,
    defaultClasses: ['Kelas X', 'Kelas XI', 'Kelas XII'],
  },
]

const MAPEL_PRESETS: Record<string, string[]> = {
  PAUD: [
    'Tematik Terpadu PAUD/RA',
    'Kurikulum Berbasis Cinta (KBC)',
    'Pendidikan Agama Islam (PAI)',
    'Budi Pekerti & Akhlak',
    'Literasi & STEAM PAUD',
  ],
  SD: [
    'Pendidikan Agama Islam & Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    'Seni Budaya',
    'PJOK',
  ],
  SMP: [
    'Pendidikan Agama Islam & Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Ilmu Pengetahuan Alam (IPA)',
    'Ilmu Pengetahuan Sosial (IPS)',
    'Bahasa Inggris',
    'Informatika',
  ],
  SMA: [
    'Pendidikan Agama Islam',
    'Bahasa Indonesia',
    'Matematika Wajib',
    'Bahasa Inggris',
    'Fisika',
    'Kimia',
    'Biologi',
    'Ekonomi',
    'Sosiologi',
    'Geografi',
  ],
  SMK: [
    'Pendidikan Agama Islam',
    'Bahasa Indonesia',
    'Matematika Kejuruan',
    'Bahasa Inggris',
    'Dasar-dasar Program Keahlian',
    'Projek Kreatif dan Kewirausahaan',
  ],
}

type PlanTabMode = 'prota' | 'promes' | 'all'

function getInitialJenjang(isTk: boolean, educationLevel: string | null): string {
  if (isTk || educationLevel === 'PAUD' || educationLevel === 'TK' || educationLevel === 'RA')
    return 'PAUD'
  if (educationLevel === 'SD' || educationLevel === 'MI') return 'SD'
  if (educationLevel === 'SMP' || educationLevel === 'MTS') return 'SMP'
  if (educationLevel === 'SMA' || educationLevel === 'MA') return 'SMA'
  if (educationLevel === 'SMK' || educationLevel === 'MAK') return 'SMK'
  return 'PAUD'
}

function getGenerationModalTitle(tab: PlanTabMode): string {
  if (tab === 'prota') return 'Menyusun Program Tahunan (PROTA)'
  if (tab === 'promes') return 'Menyusun Program Semester (PROMES)'
  return 'Menyusun PROTA & PROMES Sekaligus'
}

function getFormTitle(tab: PlanTabMode): string {
  if (tab === 'prota') return 'Formulir Program Tahunan (PROTA)'
  if (tab === 'promes') return 'Formulir Program Semester (PROMES)'
  return 'Formulir Paket PROTA & PROMES'
}

function getGenerateButtonLabel(tab: PlanTabMode): string {
  if (tab === 'prota') return 'Generate PROTA Sekarang (1 Kredit)'
  if (tab === 'promes') return 'Generate PROMES Sekarang (1 Kredit)'
  return 'Generate PROTA & PROMES Sekaligus (2 Kredit)'
}

function appendCpText(prev: string, additionalText: string): string {
  if (!prev) return additionalText
  return `${prev}\n\n${additionalText}`
}

export default function ProtaPromesExpress({
  isTk = false,
  educationLevel = null,
  userProfile,
  subjects = [],
  classes = [],
  academicYears = [],
  annualPlans = [],
  semesterPlans = [],
  cps = [],
}: Readonly<ProtaPromesProps>) {
  // Mode Tab: 'prota' | 'promes' | 'all'
  const [activeTab, setActiveTab] = useState<PlanTabMode>('prota')

  // Detect default Jenjang
  const defaultJenjang = useMemo(
    () => getInitialJenjang(isTk, educationLevel),
    [isTk, educationLevel]
  )

  const [jenjang, setJenjang] = useState<string>(defaultJenjang)
  const currentJenjangConfig = useMemo(
    () => JENJANG_OPTIONS.find((j) => j.id === jenjang) || JENJANG_OPTIONS[0],
    [jenjang]
  )

  // Form Fields
  const [subject, setSubject] = useState<string>(
    subjects[0]?.name || MAPEL_PRESETS[defaultJenjang]?.[0] || 'Tematik Terpadu PAUD/RA'
  )
  const [academicYearName, setAcademicYearName] = useState<string>(
    academicYears[0]?.name || '2025/2026'
  )
  const [className, setClassName] = useState<string>(
    classes[0]?.name || currentJenjangConfig.defaultClasses[0] || 'Kelompok B'
  )
  const [semesterName, setSemesterName] = useState<'Semester 1 (Ganjil)' | 'Semester 2 (Genap)'>(
    'Semester 1 (Ganjil)'
  )
  const [startMonth, setStartMonth] = useState<string>('Juli')
  const [schoolName, setSchoolName] = useState<string>(userProfile?.schoolName || '')
  const [teacherName, setTeacherName] = useState<string>(userProfile?.fullName || '')
  const [weeklyJp, setWeeklyJp] = useState<number>(currentJenjangConfig.defaultJp)
  const [effectiveWeeksSem1, setEffectiveWeeksSem1] = useState<number>(18)
  const [effectiveWeeksSem2, setEffectiveWeeksSem2] = useState<number>(18)
  const [effectiveWeeksPromes, setEffectiveWeeksPromes] = useState<number>(18)
  const [curriculumType, setCurriculumType] = useState<string>('Kurikulum Merdeka / KBC')
  const [cpText, setCpText] = useState<string>('')
  const [rawMaterials, setRawMaterials] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  // Update default classes and subjects when jenjang changes
  useEffect(() => {
    const config = JENJANG_OPTIONS.find((j) => j.id === jenjang) || JENJANG_OPTIONS[0]
    setWeeklyJp(config.defaultJp)
    if (!classes.some((c) => c.name === className)) {
      setClassName(config.defaultClasses[0])
    }
    const presets = MAPEL_PRESETS[jenjang] || []
    if (presets.length > 0 && !presets.includes(subject)) {
      setSubject(presets[0])
    }
  }, [jenjang])

  // Update start month when semester changes
  useEffect(() => {
    if (semesterName === 'Semester 1 (Ganjil)') {
      setStartMonth('Juli')
    } else {
      setStartMonth('Januari')
    }
  }, [semesterName])

  // Calculate Total JP
  const totalJpSem1 = useMemo(() => weeklyJp * effectiveWeeksSem1, [weeklyJp, effectiveWeeksSem1])
  const totalJpSem2 = useMemo(() => weeklyJp * effectiveWeeksSem2, [weeklyJp, effectiveWeeksSem2])
  const totalJpPromes = useMemo(
    () => weeklyJp * effectiveWeeksPromes,
    [weeklyJp, effectiveWeeksPromes]
  )

  // Auto-fill CP from database
  const handleFetchCp = () => {
    if (cps.length === 0) {
      toast.info('Menyusun referensi CP standar sesuai mata pelajaran...')
      setCpText(
        `Capaian Pembelajaran (Fase ${currentJenjangConfig.fase}) - ${subject}:\n` +
          `Peserta didik mampu memahami konsep dasar, mempraktikkan kemampuan esensial, dan menunjukkan penguasaan profil pelajar serta kecakapan bernalar secara mandiri dan kolaboratif.`
      )
      return
    }
    // Filter matching CP if possible
    const relevantCps = cps.filter(
      (cp) =>
        cp.phase.toLowerCase().includes(jenjang.toLowerCase()) ||
        cp.element.toLowerCase().includes(subject.toLowerCase()) ||
        cp.title.toLowerCase().includes(subject.toLowerCase())
    )
    const targetCps = relevantCps.length > 0 ? relevantCps : cps.slice(0, 3)
    const formatted = targetCps
      .map((cp) => `[${cp.element || cp.code}] ${cp.title}: ${cp.description}`)
      .join('\n\n')

    setCpText(formatted)
    toast.success('Capaian Pembelajaran (CP) berhasil dimuat secara otomatis!')
  }

  const handleGenerate = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!subject.trim()) {
      toast.error('Mata pelajaran atau tema wajib diisi.')
      return
    }

    setIsGenerating(true)
    const payload = {
      planType: activeTab,
      subject: subject.trim(),
      academicYearName: academicYearName.trim(),
      className: className.trim(),
      educationLevel: jenjang,
      semesterName: activeTab === 'promes' ? semesterName : 'Semester 1',
      startMonth,
      schoolName: schoolName.trim(),
      teacherName: teacherName.trim(),
      weeklyJp,
      effectiveWeeks: activeTab === 'promes' ? effectiveWeeksPromes : effectiveWeeksSem1,
      effectiveWeeksSem2,
      curriculumType,
      cpText: cpText.trim() || undefined,
      rawMaterials: rawMaterials.trim() || undefined,
    }

    router.post('/prota-promes/generate', payload, {
      onFinish: () => setIsGenerating(false),
      onError: (err) => {
        const firstErr = Object.values(err)[0]
        toast.error(typeof firstErr === 'string' ? firstErr : 'Gagal membuat Prota & Promes.')
      },
    })
  }

  const handleCopyText = (planId: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(planId)
    toast.success('Teks berhasil disalin ke clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <DashboardWrapper
      title="Generator Prota & Promes Instan"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Alat Ekspres', href: '/prota-promes' },
        { label: 'Prota & Promes' },
      ]}
    >
      <Head title="Generator Prota & Promes Instan — SiapAjar" />

      <GenerationProgressModal
        isOpen={isGenerating}
        title={getGenerationModalTitle(activeTab)}
        steps={[
          'Menghitung alokasi Jam Pelajaran (JP) dan distribusi pekan efektif',
          'Memetakan Capaian Pembelajaran & Lingkup Materi',
          'Menyusun matriks jadwal mingguan dan tujuan pembelajaran',
          'Merapikan format tabel agar siap di-export ke DOCX dan PDF',
        ]}
      />

      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-amber-300 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000] rounded-2xl shrink-0">
              <CalendarDays className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
                  Generator Prota &amp; Promes
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[11px] font-black shrink-0 whitespace-nowrap">
                  Instan 1-Klik
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium mt-0.5">
                Perencanaan alokasi waktu tahunan &amp; semesteran otomatis sesuai Kurikulum Merdeka
                &amp; KBC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/annual-plans"
              className="px-3.5 py-2 rounded-xl border-2 border-black bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-bold shadow-[2px_2px_0px_#000000] hover:bg-neutral-100 dark:hover:bg-neutral-700 inline-flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Daftar Prota</span>
            </Link>
            <Link
              href="/semester-plans"
              className="px-3.5 py-2 rounded-xl border-2 border-black bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-bold shadow-[2px_2px_0px_#000000] hover:bg-neutral-100 dark:hover:bg-neutral-700 inline-flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Daftar Promes</span>
            </Link>
          </div>
        </div>

        {/* Tab Selector (Kawaii Pop Style) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 bg-neutral-100 dark:bg-neutral-800/80 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000000]">
          <button
            type="button"
            onClick={() => setActiveTab('prota')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-black text-xs sm:text-sm transition-all border-2 ${
              activeTab === 'prota'
                ? 'bg-emerald-400 text-neutral-950 border-black shadow-[2px_2px_0px_#000000]'
                : 'border-transparent text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 hover:bg-white/60 dark:hover:bg-neutral-700/60'
            }`}
          >
            <CalendarDays className="w-4 h-4 shrink-0" />
            <span className="truncate">Program Tahunan (PROTA)</span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] rounded-full bg-white text-black border border-black shrink-0">
              1 Kredit
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('promes')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-black text-xs sm:text-sm transition-all border-2 ${
              activeTab === 'promes'
                ? 'bg-sky-400 text-neutral-950 border-black shadow-[2px_2px_0px_#000000]'
                : 'border-transparent text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 hover:bg-white/60 dark:hover:bg-neutral-700/60'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span className="truncate">Program Semester (PROMES)</span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] rounded-full bg-white text-black border border-black shrink-0">
              1 Kredit
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-black text-xs sm:text-sm transition-all border-2 ${
              activeTab === 'all'
                ? 'bg-amber-300 text-neutral-950 border-black shadow-[2px_2px_0px_#000000]'
                : 'border-transparent text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 hover:bg-white/60 dark:hover:bg-neutral-700/60'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate">PROTA + PROMES</span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] rounded-full bg-white text-black border border-black shrink-0">
              2 Kredit
            </span>
          </button>
        </div>

        {/* Main Workspace: Full-Width Spacious Form Card */}
        <div className="w-full bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-800 pb-4">
            <div>
              <h2 className="font-black text-neutral-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                <span>{getFormTitle(activeTab)}</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                Isi data di bawah ini, lalu klik tombol generate.
              </p>
            </div>

            <span className="badge-kawaii-emerald shrink-0">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />{' '}
              {activeTab === 'all' ? 'Biaya: 2 Kredit' : 'Biaya: 1 Kredit'}
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Jenjang Pill Selector */}
            <div>
              <span className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-2">
                Jenjang Pendidikan *
              </span>
              <div className="flex flex-wrap gap-2">
                {JENJANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setJenjang(opt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      jenjang === opt.id
                        ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-black shadow-[2px_2px_0px_#000000]'
                        : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-black'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid: Mata Pelajaran & Tahun Pelajaran */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="prota-subject-input"
                  className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5"
                >
                  Mata Pelajaran / Tema *
                </label>
                <input
                  id="prota-subject-input"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: Tematik PAUD, PAI, IPAS"
                  className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2.5 text-sm font-bold text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-neutral-900 transition-all shadow-xs"
                  required
                />
                {/* Preset quick picks */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {MAPEL_PRESETS[jenjang]?.slice(0, 3).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSubject(preset)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-emerald-100 hover:text-emerald-900 transition-colors cursor-pointer"
                    >
                      + {preset.length > 20 ? preset.slice(0, 20) + '...' : preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="prota-academic-year-input"
                  className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5"
                >
                  Tahun Pelajaran *
                </label>
                <input
                  id="prota-academic-year-input"
                  type="text"
                  value={academicYearName}
                  onChange={(e) => setAcademicYearName(e.target.value)}
                  placeholder="Contoh: 2025/2026"
                  className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2.5 text-sm font-bold text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-neutral-900 transition-all shadow-xs"
                  required
                />
                <div className="flex gap-1.5 mt-1.5">
                  {['2025/2026', '2026/2027', '2024/2025'].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setAcademicYearName(yr)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid: Kelas & Semester (Jika Promes) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="prota-class-input"
                  className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5"
                >
                  Kelas / Kelompok *
                </label>
                <input
                  id="prota-class-input"
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Contoh: Kelompok B, Kelas 1"
                  className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2.5 text-sm font-bold text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-neutral-900 transition-all shadow-xs"
                  required
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {currentJenjangConfig.defaultClasses.slice(0, 3).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setClassName(cls)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'promes' ? (
                <div>
                  <span className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5">
                    Semester *
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Semester 1 (Ganjil)', 'Semester 2 (Genap)'] as const).map((sem) => (
                      <button
                        key={sem}
                        type="button"
                        onClick={() => setSemesterName(sem)}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border-2 text-center transition-all cursor-pointer ${
                          semesterName === sem
                            ? 'bg-sky-400 text-neutral-950 border-black shadow-[2px_2px_0px_#000000]'
                            : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-black'
                        }`}
                      >
                        {sem.replace(' (Ganjil)', '').replace(' (Genap)', '')}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="prota-start-month-select"
                    className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5"
                  >
                    Bulan Mulai Pembelajaran
                  </label>
                  <select
                    id="prota-start-month-select"
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2.5 text-sm font-bold text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-neutral-900 transition-all shadow-xs"
                  >
                    <option value="Juli">Juli (Awal Tahun Ajaran)</option>
                    <option value="Januari">Januari (Semester 2)</option>
                    <option value="Agustus">Agustus</option>
                  </select>
                </div>
              )}
            </div>

            {/* Grid: Identitas Sekolah & Guru (Opsional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="prota-school-name-input"
                  className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5"
                >
                  Nama Satuan Pendidikan{' '}
                  <span className="text-neutral-400 lowercase font-normal">(opsional)</span>
                </label>
                <input
                  id="prota-school-name-input"
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Contoh: RA / TK Permata Hati"
                  className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-neutral-900 transition-all shadow-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="prota-teacher-name-input"
                  className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5"
                >
                  Nama Guru Pengampu{' '}
                  <span className="text-neutral-400 lowercase font-normal">(opsional)</span>
                </label>
                <input
                  id="prota-teacher-name-input"
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Contoh: Siti Aisyah, S.Pd."
                  className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-neutral-900 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Parameter Alokasi Waktu & Kurikulum */}
            <div className="bg-neutral-50/80 dark:bg-neutral-800/60 p-5 sm:p-6 rounded-3xl border-2 border-black dark:border-neutral-700 shadow-[3px_3px_0px_#000000] space-y-4">
              {/* Header Alokasi */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-300 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-neutral-950 dark:text-white">
                    Alokasi Waktu &amp; Pekan Efektif
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    Distribusi alokasi jam pelajaran (JP) dan kalender akademik sekolah
                  </p>
                </div>
              </div>

              {/* Banner Ringkasan JP */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600 shrink-0" />
                  <span>Total Alokasi Waktu:</span>
                </div>
                <span className="text-xs font-black text-emerald-900 dark:text-emerald-100 bg-white dark:bg-neutral-800 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-xs shrink-0 whitespace-nowrap">
                  {activeTab === 'promes'
                    ? `${totalJpPromes} JP / Semester`
                    : `${totalJpSem1 + totalJpSem2} JP / Tahun (Sem 1: ${totalJpSem1} JP | Sem 2: ${totalJpSem2} JP)`}
                </span>
              </div>

              {/* Kurikulum Selector */}
              <div className="space-y-2">
                <span className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Pedoman Kurikulum
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Kurikulum Merdeka / KBC', label: 'Kurikulum Merdeka / KBC' },
                    { id: 'Kurikulum 2013', label: 'Kurikulum 2013' },
                    { id: 'Kurikulum Berbasis Karakter', label: 'Berbasis Karakter' },
                  ].map((cur) => (
                    <button
                      key={cur.id}
                      type="button"
                      onClick={() => setCurriculumType(cur.id)}
                      className={`text-xs font-bold py-2.5 px-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        curriculumType === cur.id
                          ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-black shadow-[2px_2px_0px_#000000]'
                          : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-black'
                      }`}
                    >
                      {cur.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                <div className="space-y-1">
                  <label
                    htmlFor="prota-weekly-jp-input"
                    className="block text-xs font-bold text-neutral-800 dark:text-neutral-200"
                  >
                    JP / Pekan
                  </label>
                  <input
                    id="prota-weekly-jp-input"
                    type="number"
                    min={1}
                    max={50}
                    value={weeklyJp}
                    onChange={(e) => setWeeklyJp(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-sm font-black text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-600 shadow-xs"
                  />
                  <p className="text-[10px] text-neutral-500 font-medium">Alokasi per rombel</p>
                </div>

                {activeTab === 'promes' ? (
                  <div className="space-y-1 sm:col-span-2">
                    <label
                      htmlFor="prota-effective-weeks-promes-input"
                      className="block text-xs font-bold text-neutral-800 dark:text-neutral-200"
                    >
                      Pekan Efektif Semester
                    </label>
                    <input
                      id="prota-effective-weeks-promes-input"
                      type="number"
                      min={1}
                      max={30}
                      value={effectiveWeeksPromes}
                      onChange={(e) => setEffectiveWeeksPromes(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-sm font-black text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-600 shadow-xs"
                    />
                    <p className="text-[10px] text-neutral-500 font-medium">
                      Minggu aktif pembelajaran
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label
                        htmlFor="prota-effective-weeks-sem1-input"
                        className="block text-xs font-bold text-neutral-800 dark:text-neutral-200"
                      >
                        Pekan Smt 1
                      </label>
                      <input
                        id="prota-effective-weeks-sem1-input"
                        type="number"
                        min={1}
                        max={30}
                        value={effectiveWeeksSem1}
                        onChange={(e) => setEffectiveWeeksSem1(Math.max(1, Number(e.target.value)))}
                        className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-sm font-black text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-600 shadow-xs"
                      />
                      <p className="text-[10px] text-neutral-500 font-medium">Semester Ganjil</p>
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="prota-effective-weeks-sem2-input"
                        className="block text-xs font-bold text-neutral-800 dark:text-neutral-200"
                      >
                        Pekan Smt 2
                      </label>
                      <input
                        id="prota-effective-weeks-sem2-input"
                        type="number"
                        min={1}
                        max={30}
                        value={effectiveWeeksSem2}
                        onChange={(e) => setEffectiveWeeksSem2(Math.max(1, Number(e.target.value)))}
                        className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-sm font-black text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-600 shadow-xs"
                      />
                      <p className="text-[10px] text-neutral-500 font-medium">Semester Genap</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Capaian Pembelajaran (CP) / Referensi */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="prota-cp-textarea"
                  className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200"
                >
                  Capaian Pembelajaran (CP) / Elemen Acuan{' '}
                  <span className="text-[11px] font-normal text-neutral-500 lowercase">
                    (opsional)
                  </span>
                </label>

                {cpText && (
                  <button
                    type="button"
                    onClick={() => setCpText('')}
                    className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                  >
                    Bersihkan CP
                  </button>
                )}
              </div>

              {/* Quick 1-Click CP Action Pill Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleFetchCp}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    Muat CP Resmi {currentJenjangConfig.label} ({currentJenjangConfig.fase})
                  </span>
                </button>

                {jenjang === 'PAUD' && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setCpText((prev) =>
                          appendCpText(
                            prev,
                            '[Nilai Agama dan Budi Pekerti] Anak percaya kepada Tuhan Yang Maha Esa, mulai mengenal dan mempraktikkan ajaran pokok agama, membiasakan perilaku baik, dan menghargai sesama.'
                          )
                        )
                      }
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                    >
                      + Nilai Agama
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCpText((prev) =>
                          appendCpText(
                            prev,
                            '[Jati Diri] Anak mengenali emosi, mandiri, mampu menyesuaikan diri, memiliki rasa percaya diri, dan peduli terhadap lingkungan.'
                          )
                        )
                      }
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                    >
                      + Jati Diri
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCpText((prev) =>
                          appendCpText(
                            prev,
                            '[Dasar-dasar Literasi & STEAM] Anak menunjukkan rasa ingin tahu melalui eksplorasi, gemar berkomunikasi, bernalar kritis, dan berkreasi menggunakan berbagai media/loose parts.'
                          )
                        )
                      }
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                    >
                      + Literasi & STEAM
                    </button>
                  </>
                )}
              </div>

              <textarea
                id="prota-cp-textarea"
                rows={3}
                value={cpText}
                onChange={(e) => setCpText(e.target.value)}
                placeholder="Tuliskan elemen CP / kompetensi acuan, atau klik tombol 'Muat CP Resmi' di atas. Jika dikosongkan, AI akan menyusun CP esensial otomatis berdasarkan jenjang & mapel."
                className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-3.5 text-xs text-neutral-900 dark:text-white font-medium focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-neutral-900 transition-all shadow-xs leading-relaxed"
              />
            </div>

            {/* Catatan / Lingkup Topik Tambahan (Opsional) */}
            <div className="space-y-1.5">
              <label
                htmlFor="prota-raw-materials-input"
                className="block text-xs font-bold text-neutral-700 dark:text-neutral-300"
              >
                Topik / Materi Khusus Sekolah{' '}
                <span className="text-[11px] font-normal text-neutral-500">(Opsional)</span>
              </label>
              <input
                id="prota-raw-materials-input"
                type="text"
                value={rawMaterials}
                onChange={(e) => setRawMaterials(e.target.value)}
                placeholder="Contoh: Tambahkan tema Peringatan Hari Santri, Manasik Haji Cilik, dll."
                className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-neutral-900 transition-all shadow-xs"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="btn-kawaii-primary w-full h-12 flex items-center justify-center gap-2 text-sm sm:text-base font-bold disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-5 h-5 animate-spin" />
                    <span>Sedang Menyusun Matriks...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    <span>{getGenerateButtonLabel(activeTab)}</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-neutral-500 mt-2 font-medium">
                Kredit hanya terpotong jika dokumen berhasil disusun oleh sistem.
              </p>
            </div>
          </form>
        </div>

        {/* Dedicated History Table Section Below Form */}
        <div className="w-full bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-800 pb-4 gap-2">
            <div>
              <h3 className="font-black text-neutral-950 dark:text-white text-base sm:text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-600" />
                <span>Riwayat Dokumen Prota &amp; Promes</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                Daftar dokumen perencanaan tahunan dan semester yang telah Anda buat.
              </p>
            </div>
            <span className="badge-kawaii-neutral self-start sm:self-auto">
              Total {annualPlans.length + semesterPlans.length} Dokumen
            </span>
          </div>

          {annualPlans.length === 0 && semesterPlans.length === 0 ? (
            <div className="text-center py-12 px-4 text-neutral-500 space-y-3">
              <CalendarDays className="w-10 h-10 mx-auto text-neutral-400" />
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                Belum ada dokumen Prota atau Promes yang dibuat
              </p>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Isi formulir di atas dan klik tombol generate untuk membuat dokumen perencanaan
                pembelajaran pertama Anda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border-2 border-neutral-200 dark:border-neutral-700">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-neutral-200 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-800 font-black text-neutral-900 dark:text-neutral-100">
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4 w-28">Tipe</th>
                    <th className="py-3 px-4">Mata Pelajaran / Tema</th>
                    <th className="py-3 px-4">Kelas / Rombel</th>
                    <th className="py-3 px-4">Tahun / Semester</th>
                    <th className="py-3 px-4 text-right w-44">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {annualPlans.map((plan, idx) => (
                    <tr
                      key={`prota-${plan.id}`}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-bold text-neutral-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-black uppercase">
                          PROTA
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                        {plan.subject}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                        {plan.content?.metadata?.className || '-'}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                        {plan.academicYear?.name || 'Tahun Ajaran Aktif'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(
                                plan.id,
                                `${plan.subject} - ${plan.academicYear?.name || 'Prota'}`
                              )
                            }
                            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-200 text-neutral-700 dark:text-white transition-colors cursor-pointer"
                            title="Salin Info"
                          >
                            {copiedId === plan.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <Link
                            href={`/annual-plans/${plan.id}`}
                            className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 text-neutral-700 dark:text-white transition-colors"
                            title="Buka Dokumen Prota"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <a
                            href={`/annual-plans/${plan.id}/export`}
                            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-colors"
                            title="Download DOCX"
                          >
                            <FileText className="w-4 h-4" />
                            <span>DOCX</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {semesterPlans.map((plan, idx) => (
                    <tr
                      key={`promes-${plan.id}`}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-bold text-neutral-500">
                        {annualPlans.length + idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-300 text-[11px] font-black uppercase">
                          PROMES
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                        {plan.subject}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                        {plan.schoolClass?.name || '-'}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                        {plan.semester?.name || 'Semester 1'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(
                                plan.id + 100000,
                                `${plan.subject} - ${plan.schoolClass?.name || ''} (${plan.semester?.name || 'Promes'})`
                              )
                            }
                            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-200 text-neutral-700 dark:text-white transition-colors cursor-pointer"
                            title="Salin Info"
                          >
                            {copiedId === plan.id + 100000 ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <Link
                            href={`/semester-plans/${plan.id}`}
                            className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 text-neutral-700 dark:text-white transition-colors"
                            title="Buka Dokumen Promes"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <a
                            href={`/semester-plans/${plan.id}/export`}
                            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 hover:bg-sky-100 text-xs font-bold transition-colors"
                            title="Download DOCX"
                          >
                            <FileText className="w-4 h-4" />
                            <span>DOCX</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardWrapper>
  )
}
