import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { CalendarDays, Sparkles, RotateCw, Clock, Layers, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

interface Subject {
  id: number
  name: string
}

interface SchoolClass {
  id: number
  name: string
}

interface ProtaPromesProps {
  isTk: boolean
  subjects: Subject[]
  classes: SchoolClass[]
  hasGenerated: boolean
}

export default function ProtaPromesExpress({
  isTk,
  subjects = [],
  classes = [],
}: Readonly<ProtaPromesProps>) {
  const [academicYear, setAcademicYear] = useState('2025/2026')
  const [semester, setSemester] = useState<'1' | '2'>('1')
  const [selectedSubject, setSelectedSubject] = useState(
    subjects[0]?.name || 'Pendidikan Pancasila'
  )
  const [classId, setClassId] = useState(classes[0] ? String(classes[0].id) : '')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    router.post(
      '/prota-promes/generate',
      {
        academicYear,
        semester: Number(semester),
        subject: selectedSubject,
        classId: classId ? Number(classId) : undefined,
        isTk,
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

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="p-3.5 bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-2xl">
            <CalendarDays className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Generator Program Tahunan (Prota) & Program Semester (Promes)
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Distribusi alokasi Jam Pelajaran (JP), pemetaan minggu efektif, dan jadwal materi
              mingguan
            </p>
          </div>
        </div>

        {/* Generator Form */}
        <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                Parameter Kalender Akademik & Distribusi Materi
              </h3>
              <p className="text-xs text-neutral-500">
                Pilih tahun ajaran dan semester untuk menyusun matriks jadwal secara otomatis
              </p>
            </div>
            <span className="badge-kawaii-emerald">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Biaya: 1 Kredit
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Tahun Ajaran *
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white"
                >
                  <option value="2024/2025">2024/2025</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="2026/2027">2026/2027</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Semester *
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as '1' | '2')}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white"
                >
                  <option value="1">Semester 1 (Ganjil - Juli s/d Desember)</option>
                  <option value="2">Semester 2 (Genap - Januari s/d Juni)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Pilih Kelas / Kelompok *
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white"
                  required
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {!isTk && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Mata Pelajaran *
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="p-4 bg-blue-50 dark:bg-neutral-800/60 rounded-2xl border border-blue-100 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 space-y-2">
              <p className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                Fitur Unggulan Prota & Promes AI:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Otomatis menghitung pekan efektif dan pekan libur nasional</li>
                <li>
                  Distribusi Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) merata per
                  minggu
                </li>
                <li>Jadwal asesmen sumatif & cadangan jam pelajaran</li>
                <li>Format tabel landscape standar supervisi pengawas</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <Link
                href="/prota-promes"
                className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 flex items-center gap-1"
              >
                Lihat Matriks Lengkap <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                type="submit"
                disabled={isGenerating}
                className="btn-kawaii-primary w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    Menyusun Matriks Prota Promes...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Prota & Promes (1 Kredit)
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
