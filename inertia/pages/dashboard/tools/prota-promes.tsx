import { Head, Link, router } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import GenerationProgressModal from '~/components/dashboard/generation-progress-modal'
import { CalendarDays, Zap, Coins, RotateCw, ArrowRight } from 'lucide-react'
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

interface ProtaPromesProps {
  isTk?: boolean
  educationLevel?: string | null
  institutionType?: string | null
  subjects: Subject[]
  classes: SchoolClass[]
  academicYears?: AcademicYear[]
  semesters?: Semester[]
  hasGenerated?: boolean
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

export default function ProtaPromesExpress({
  isTk = false,
  subjects = [],
  classes = [],
  academicYears = [],
  semesters = [],
}: Readonly<ProtaPromesProps>) {
  const [academicYearId, setAcademicYearId] = useState<number>(academicYears[0]?.id || 0)
  const [semesterId, setSemesterId] = useState<number>(semesters[0]?.id || 0)
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || '')
  const [classId, setClassId] = useState(classes[0] ? String(classes[0].id) : '')
  const [isGenerating, setIsGenerating] = useState(false)

  const availableSemesters = useMemo(
    () => semesters.filter((item) => !academicYearId || item.academicYearId === academicYearId),
    [academicYearId, semesters]
  )
  const availableClasses = useMemo(
    () =>
      classes.filter(
        (item) => !academicYearId || !item.academicYearId || item.academicYearId === academicYearId
      ),
    [academicYearId, classes]
  )

  useEffect(() => {
    if (!availableSemesters.some((item) => item.id === semesterId)) {
      setSemesterId(availableSemesters[0]?.id || 0)
    }
  }, [availableSemesters, semesterId])

  useEffect(() => {
    if (!availableClasses.some((item) => String(item.id) === classId)) {
      setClassId(availableClasses[0] ? String(availableClasses[0].id) : '')
    }
  }, [availableClasses, classId])

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!academicYearId || !semesterId || !classId || (!isTk && !selectedSubject)) {
      toast.error('Lengkapi tahun ajaran, semester, kelas, dan mata pelajaran terlebih dahulu')
      return
    }
    setIsGenerating(true)
    router.post(
      '/prota-promes/generate',
      {
        academicYearId,
        semesterId,
        subject: selectedSubject || 'Tematik PAUD',
        classId: classId ? Number(classId) : undefined,
      },
      {
        onFinish: () => setIsGenerating(false),
        onError: () => toast.error('Gagal generate Prota & Promes'),
      }
    )
  }

  return (
    <DashboardWrapper
      title="Generator Prota & Promes Otomatis"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Prota & Promes' }]}
    >
      <Head title="Generator Prota & Promes Otomatis - SiapAjar" />

      <GenerationProgressModal
        isOpen={isGenerating}
        title="Menyusun Prota & Promes"
        steps={[
          'Memvalidasi tahun ajaran, semester, dan kelas',
          'Memetakan capaian pembelajaran dan tujuan pembelajaran',
          'Mendistribusikan materi ke minggu efektif',
          'Merapikan matriks Prota dan Promes agar siap diedit',
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000]">
          <div className="p-3.5 bg-blue-200 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000] rounded-2xl">
            <CalendarDays className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-neutral-900 dark:text-white">
              Generator Program Tahunan (Prota) & Program Semester (Promes)
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Distribusi alokasi Jam Pelajaran (JP), pemetaan minggu efektif, dan jadwal materi
              mingguan
            </p>
          </div>
        </div>

        {/* Generator Form */}
        <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-800 pb-4">
            <div>
              <h3 className="font-black text-neutral-900 dark:text-white text-base">
                Parameter Kalender Akademik & Distribusi Materi
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                Pilih tahun ajaran dan semester untuk menyusun matriks jadwal secara otomatis
              </p>
            </div>
            <span className="badge-kawaii-emerald">
              <Coins className="w-3.5 h-3.5 text-emerald-600" /> Biaya: 2 Kredit
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Tahun Ajaran *
                </label>
                <select
                  value={academicYearId}
                  onChange={(e) => setAcademicYearId(Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {academicYears.length === 0 && (
                    <option value={0}>Belum ada tahun ajaran aktif</option>
                  )}
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Semester *
                </label>
                <select
                  value={semesterId}
                  onChange={(e) => setSemesterId(Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {availableSemesters.length === 0 && (
                    <option value={0}>Belum ada semester aktif</option>
                  )}
                  {availableSemesters.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} {item.academicYear?.name ? `(${item.academicYear.name})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Pilih Kelas / Kelompok *
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  {availableClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {!isTk && (
                <div>
                  <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200 mb-1.5">
                    Mata Pelajaran *
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    {subjects.length === 0 && (
                      <option value="" disabled>
                        Belum ada mata pelajaran
                      </option>
                    )}
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-1.5 text-emerald-950 dark:text-emerald-200">
              <p className="font-bold">Struktur Dokumen yang Disusun:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-neutral-700 dark:text-neutral-300">
                <li>Program Tahunan (Prota) dengan pemetaan alokasi jam & minggu efektif</li>
                <li>Program Semester (Promes) dengan matriks distribusi materi per pekan</li>
                <li>Sinkron dengan Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP)</li>
              </ul>
            </div>

            <div className="pt-4 border-t-2 border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <Link
                href="/prota-promes"
                className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 flex items-center gap-1"
              >
                Lihat Matriks Lengkap <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                type="submit"
                disabled={isGenerating}
                className="btn-kawaii-primary w-full sm:w-auto text-xs sm:text-sm"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    Menyusun Matriks Prota Promes...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate Prota & Promes (2 Kredit)
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardWrapper>
  )
}
