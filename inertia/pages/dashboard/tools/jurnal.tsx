import { Head } from '@inertiajs/react'
import { useState } from 'react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import GenerationProgressModal from '~/components/dashboard/generation-progress-modal'
import { emitCreditsUpdated } from '~/lib/credits'
import { ClipboardList, Coins, Zap, RotateCw, Copy, Check, Printer } from 'lucide-react'
import { toast } from 'sonner'

interface SchoolClass {
  id: number
  name: string
}

interface Subject {
  id: number
  name: string
}

interface JurnalProps {
  classes: SchoolClass[]
  subjects: Subject[]
}

interface JurnalResponse {
  success: boolean
  message: string
  journal: {
    title: string
    date: string
    schoolClass: string
    subject: string
    topic: string
    coreActivities: string
    studentBehaviorNotes: string
    teacherReflection: string
    followUpAction: string
    formattedDocumentText: string
  }
  remainingCredits: number
}

export default function JurnalExpress({ classes = [], subjects = [] }: Readonly<JurnalProps>) {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || 'Kelas 1A')
  const [selectedSubject, setSelectedSubject] = useState(
    subjects[0]?.name || 'Pendidikan Pancasila'
  )
  const [topic, setTopic] = useState('')
  const [attendanceNotes, setAttendanceNotes] = useState('28 Hadir, 1 Izin, 1 Sakit')
  const [teacherNotes, setTeacherNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<JurnalResponse | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) {
      toast.error('Topik pembelajaran wajib diisi')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/express/jurnal/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          date,
          schoolClass: selectedClass,
          subject: selectedSubject,
          topic,
          attendanceNotes,
          teacherNotes,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Gagal generate jurnal mengajar')
      }

      setResult(data)
      emitCreditsUpdated(data.remainingCredits)
      toast.success('Jurnal harian & refleksi guru berhasil disusun!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.journal.formattedDocumentText)
    setCopied(true)
    toast.success('Teks Jurnal berhasil disalin ke clipboard!')
    setTimeout(() => setCopied(false), 2500)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <DashboardWrapper
      title="Generator Jurnal Mengajar & Refleksi Guru"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Jurnal Harian' }]}
    >
      <Head title="Generator Jurnal Mengajar & Refleksi Guru - SiapAjar" />

      <GenerationProgressModal
        isOpen={isLoading}
        title="Menyusun Jurnal Mengajar"
        steps={[
          'Memvalidasi aktivitas dan catatan kelas',
          'Menyusun rangkaian kegiatan pembelajaran',
          'Merumuskan refleksi dan tindak lanjut guru',
          'Merapikan jurnal agar siap disimpan atau dicetak',
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 bg-indigo-200 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000] rounded-2xl">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-900 dark:text-white">
                Generator Jurnal Harian Mengajar & Refleksi AI
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Dokumentasi kegiatan pembelajaran harian, catatan perkembangan kelas, dan refleksi
                tindak lanjut
              </p>
            </div>
          </div>
          <span className="badge-kawaii-emerald self-start sm:self-auto">
            <Coins className="w-3.5 h-3.5 text-emerald-600" /> Biaya: 1 Kredit
          </span>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-6">
          <h3 className="font-black text-neutral-900 dark:text-white text-base">
            Form Input Aktivitas Kelas Hari Ini
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Tanggal Mengajar *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Kelas / Rombel *
                </label>
                <input
                  type="text"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  placeholder="Contoh: Kelas 1B atau Kelompok B2"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Mata Pelajaran / Tema *
                </label>
                <input
                  type="text"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  placeholder="Contoh: Matematika / Tema Tanaman"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Topik / Materi yang Diajarkan *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Membedakan benda hidup dan tak hidup di sekitar sekolah"
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Kehadiran Siswa
                </label>
                <input
                  type="text"
                  value={attendanceNotes}
                  onChange={(e) => setAttendanceNotes(e.target.value)}
                  placeholder="Contoh: 28 Hadir, 1 Sakit (Budi)"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Catatan Guru / Dinamika Khusus (Opsional)
                </label>
                <input
                  type="text"
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  placeholder="Contoh: Siswa sangat aktif berdiskusi kelompok, waktu kurang 10 menit"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t-2 border-neutral-100 dark:border-neutral-800 flex items-center justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-kawaii-primary w-full sm:w-auto text-xs sm:text-sm"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    Menyusun Jurnal & Refleksi Mengajar...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate Jurnal Mengajar (1 Kredit)
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black p-6 sm:p-8 space-y-6 shadow-[4px_4px_0px_#000000]">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white text-base">
                  Hasil Jurnal Harian Mengajar
                </h4>
                <p className="text-xs text-neutral-500">
                  Format resmi siap cetak untuk portofolio supervisi dan administrasi guru
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-xs font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Tersalin' : 'Copy Teks'}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak / PDF
                </button>
              </div>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-4 border-b border-neutral-200 dark:border-neutral-800 text-[11px]">
                <div>
                  <span className="text-neutral-500 block">Hari / Tanggal:</span>
                  <span className="font-bold">{result.journal.date}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Kelas:</span>
                  <span className="font-bold">{result.journal.schoolClass}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Mata Pelajaran:</span>
                  <span className="font-bold">{result.journal.subject}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Kehadiran:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {attendanceNotes}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                  1. Rangkaian Kegiatan Pembelajaran
                </h5>
                <p className="whitespace-pre-line pl-2">{result.journal.coreActivities}</p>
              </div>

              <div>
                <h5 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                  2. Catatan Perkembangan & Dinamika Siswa
                </h5>
                <p className="whitespace-pre-line pl-2">{result.journal.studentBehaviorNotes}</p>
              </div>

              <div>
                <h5 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                  3. Refleksi Guru Terhadap Pembelajaran
                </h5>
                <p className="whitespace-pre-line pl-2 text-indigo-900 dark:text-indigo-300 italic">
                  &ldquo;{result.journal.teacherReflection}&rdquo;
                </p>
              </div>

              <div>
                <h5 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                  4. Rencana Tindak Lanjut Pertemuan Berikutnya
                </h5>
                <p className="whitespace-pre-line pl-2">{result.journal.followUpAction}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
