import { Head } from '@inertiajs/react'
import { useState } from 'react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Compass, Coins, Zap, RotateCw, Copy, Check, Printer } from 'lucide-react'
import { cn } from '~/lib/utils'
import { toast } from 'sonner'

interface KokurikulerProps {
  isTk: boolean
}

interface KokurikulerResponse {
  success: boolean
  message: string
  projectModule: {
    title: string
    theme: string
    phase: string
    targetDuration: string
    dimensions: string[]
    projectSummary: string
    stages: {
      introduction: string
      contextualization: string
      action: string
      reflection: string
      followUp: string
    }
    assessmentRubric: string
    formattedDocumentText: string
  }
  remainingCredits: number
}

const P5_THEMES = [
  'Kearifan Lokal',
  'Gaya Hidup Berkelanjutan',
  'Bhinneka Tunggal Ika',
  'Bangunlah Jiwa dan Raganya',
  'Rekayasa dan Teknologi',
  'Kewirausahaan',
  'Suara Demokrasi',
  'Aku Sayang Bumi (Fase Fondasi)',
  'Aku Cinta Indonesia (Fase Fondasi)',
  'Kita Semua Bersaudara (Fase Fondasi)',
  'Imajinasi dan Kreativitasku (Fase Fondasi)',
]

export default function KokurikulerExpress({ isTk }: Readonly<KokurikulerProps>) {
  const [theme, setTheme] = useState(
    isTk ? 'Aku Sayang Bumi (Fase Fondasi)' : 'Gaya Hidup Berkelanjutan'
  )
  const [projectTitle, setProjectTitle] = useState('')
  const [phase, setPhase] = useState(isTk ? 'Fondasi' : 'A')
  const [targetDuration, setTargetDuration] = useState('2-3 Pekan (30 JP)')
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([
    'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
    'Gotong Royong',
    'Kreatif',
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<KokurikulerResponse | null>(null)
  const [copied, setCopied] = useState(false)

  const toggleDimension = (dim: string) => {
    if (selectedDimensions.includes(dim)) {
      if (selectedDimensions.length === 1) {
        toast.error('Pilih minimal 1 dimensi Profil Pelajar Pancasila')
        return
      }
      setSelectedDimensions(selectedDimensions.filter((d) => d !== dim))
    } else {
      setSelectedDimensions([...selectedDimensions, dim])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectTitle.trim()) {
      toast.error('Judul projek kokurikuler wajib diisi')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/express/kokurikuler/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          theme,
          projectTitle,
          phase,
          targetDuration,
          dimensions: selectedDimensions,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menyusun modul kokurikuler')
      }

      setResult(data)
      toast.success('Modul Kokurikuler P5 / P2RA berhasil disusun!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.projectModule.formattedDocumentText)
    setCopied(true)
    toast.success('Modul projek berhasil disalin ke clipboard!')
    setTimeout(() => setCopied(false), 2500)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <DashboardWrapper
      title="Generator Modul Kokurikuler & P5"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Modul Kokurikuler' }]}
    >
      <Head title="Generator Modul Kokurikuler & P5 - SiapAjar" />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 bg-teal-200 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000] rounded-2xl">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-900 dark:text-white">
                Generator Modul Kokurikuler & P5 AI
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Panduan projek kokurikuler lengkap dengan alur tahapan aksi, dimensi profil, dan
                rubrik asesmen
              </p>
            </div>
          </div>
          <span className="badge-kawaii-emerald self-start sm:self-auto">
            <Coins className="w-3.5 h-3.5 text-emerald-600" /> Biaya: 1 Kredit
          </span>
        </div>

        {/* Form Box */}
        <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-6">
          <h3 className="font-black text-neutral-900 dark:text-white text-base">
            Parameter Tema & Dimensi Profil Projek
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Tema Utama Projek *
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {P5_THEMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Fase Kurikulum *
                </label>
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Fondasi">Fase Fondasi (PAUD / TK / RA)</option>
                  <option value="A">Fase A (Kelas 1 - 2 SD)</option>
                  <option value="B">Fase B (Kelas 3 - 4 SD)</option>
                  <option value="C">Fase C (Kelas 5 - 6 SD)</option>
                  <option value="D">Fase D (Kelas 7 - 9 SMP)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Judul Projek Kokurikuler *
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Contoh: Apotek Hidup Sekolahku / Daur Ulang Plastik Menjadi Pot Bunga"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Alokasi Waktu / Durasi
                </label>
                <input
                  type="text"
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(e.target.value)}
                  placeholder="Contoh: 2 Pekan (24 JP) atau Sistem Blok 1 Pekan"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200">
                  Fokus Dimensi Profil Pelajar Pancasila (P5)
                </label>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                  Pilih satu atau beberapa dimensi karakter utama untuk modul projek ini
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
                  'Berkebinekaan Global',
                  'Gotong Royong',
                  'Mandiri',
                  'Bernalar Kritis',
                  'Kreatif',
                ].map((dim) => {
                  const isChecked = selectedDimensions.includes(dim)
                  return (
                    <button
                      key={dim}
                      type="button"
                      onClick={() => toggleDimension(dim)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left cursor-pointer text-xs select-none',
                        isChecked
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-black dark:border-white shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff] text-neutral-950 dark:text-white font-extrabold -translate-y-0.5'
                          : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium'
                      )}
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all',
                          isChecked
                            ? 'bg-emerald-500 border-black dark:border-white text-white shadow-[1px_1px_0px_#000000] dark:shadow-[1px_1px_0px_#ffffff]'
                            : 'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800'
                        )}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="leading-snug">{dim}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pt-3 border-t-2 border-neutral-100 dark:border-neutral-800 flex items-center justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-kawaii-primary w-full sm:w-auto text-xs sm:text-sm"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    Menyusun Alur & Rubrik Modul Projek...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate Modul Projek (1 Kredit)
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
                  Modul Projek Kokurikuler Dihasilkan
                </h4>
                <p className="text-xs text-neutral-500">
                  {result.projectModule.title} ({result.projectModule.theme})
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
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak / PDF
                </button>
              </div>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
              <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-neutral-900 border border-teal-100 dark:border-neutral-700">
                <h5 className="font-bold text-teal-950 dark:text-teal-300 mb-1">
                  Gambaran Umum & Relevansi Projek:
                </h5>
                <p>{result.projectModule.projectSummary}</p>
              </div>

              <div>
                <h5 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                  Alur Aktivitas Projek (5 Tahapan Merdeka):
                </h5>
                <div className="space-y-3 pl-2">
                  <div className="border-l-2 border-teal-500 pl-3">
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      Tahap 1: Pengenalan (Eksplorasi Isu)
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      {result.projectModule.stages.introduction}
                    </p>
                  </div>
                  <div className="border-l-2 border-teal-500 pl-3">
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      Tahap 2: Kontekstualisasi (Riset Lapangan)
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      {result.projectModule.stages.contextualization}
                    </p>
                  </div>
                  <div className="border-l-2 border-teal-500 pl-3">
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      Tahap 3: Aksi Nyata & Pembuatan Karya
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      {result.projectModule.stages.action}
                    </p>
                  </div>
                  <div className="border-l-2 border-teal-500 pl-3">
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      Tahap 4: Refleksi & Evaluasi Pengalaman
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      {result.projectModule.stages.reflection}
                    </p>
                  </div>
                  <div className="border-l-2 border-teal-500 pl-3">
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      Tahap 5: Tindak Lanjut & Pameran Hasil Karya (Gelar Karya)
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      {result.projectModule.stages.followUp}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <h5 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                  Rubrik Penilaian & Asesmen Projek:
                </h5>
                <p className="whitespace-pre-line pl-2 text-neutral-700 dark:text-neutral-300">
                  {result.projectModule.assessmentRubric}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
