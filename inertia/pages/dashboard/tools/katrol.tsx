import { Head } from '@inertiajs/react'
import { useState } from 'react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import {
  TrendingUp,
  Sparkles,
  RotateCw,
  Copy,
  Check,
  FileSpreadsheet,
  HelpCircle,
  Calculator,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'

interface KatrolResultRow {
  name: string
  rawScore: number
  adjustedScore: number
  status: 'Lulus' | 'Remedial'
}

interface KatrolResponse {
  success: boolean
  message: string
  statistics: {
    rawAverage: number
    adjustedAverage: number
    highestRaw: number
    highestAdjusted: number
    lowestRaw: number
    lowestAdjusted: number
    passCount: number
    totalStudents: number
  }
  results: KatrolResultRow[]
  supervisionJustification: string
  remainingCredits: number
}

export default function KatrolExpress() {
  const [method, setMethod] = useState<'linear' | 'sqrt' | 'average' | 'constant'>('linear')
  const [targetMin, setTargetMin] = useState(75)
  const [targetMax, setTargetMax] = useState(95)
  const [passingGrade, setPassingGrade] = useState(75)
  const [rawInput, setRawInput] = useState(
    'Ahmad Fauzi: 45\nBudi Santoso: 62\nCitra Lestari: 88\nDewi Sartika: 54\nEko Prasetyo: 71\nFani Rahma: 92\nGilang Ramadhan: 40\nHani Permata: 78'
  )
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<KatrolResponse | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rawInput.trim()) {
      toast.error('Masukkan data nilai siswa')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/express/katrol/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          rawInput,
          method,
          targetMin,
          targetMax,
          passingGrade,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Gagal memproses perhitungan katrol nilai')
      }

      setResult(data)
      toast.success('Nilai berhasil dikatrol secara adil!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!result) return
    const text = result.results
      .map((r) => `${r.name}\t${r.rawScore}\t${r.adjustedScore}\t${r.status}`)
      .join('\n')
    const header = 'Nama Siswa\tNilai Mentah\tNilai Katrol\tStatus\n'
    navigator.clipboard.writeText(header + text)
    setCopied(true)
    toast.success('Disalin ke clipboard! Siap di-paste ke Microsoft Excel')
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <DashboardWrapper
      title="Kalkulator & Katrol Nilai Siswa (AI)"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Katrol Nilai' }]}
    >
      <Head title="Kalkulator Katrol Nilai Siswa Adil - SiapAjar" />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 rounded-2xl">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Kalkulator Normalisasi & Katrol Nilai Siswa
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Formula matematis proporsional yang adil dilengkapi narasi justifikasi akademik
                untuk supervisi
              </p>
            </div>
          </div>
          <span className="badge-kawaii-emerald self-start sm:self-auto">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Biaya: 1 Kredit
          </span>
        </div>

        {/* Input & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 shadow-sm space-y-5">
            <h3 className="font-bold text-neutral-900 dark:text-white text-base flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-600" />
              Pengaturan Formula & Target Nilai
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Metode Katrol Nilai *
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white"
                  >
                    <option value="linear">Linear Min-Max (Sangat Direkomendasikan)</option>
                    <option value="sqrt">Root Curve Normalization (√X × 10)</option>
                    <option value="average">Shift Target Rata-rata Kelas</option>
                    <option value="constant">Penambahan Poin Seragam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    KKM / Batas Kelulusan (KKTP) *
                  </label>
                  <input
                    type="number"
                    value={passingGrade}
                    onChange={(e) => setPassingGrade(Number(e.target.value))}
                    min={50}
                    max={100}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              {method === 'linear' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Target Nilai Terendah Baru
                    </label>
                    <input
                      type="number"
                      value={targetMin}
                      onChange={(e) => setTargetMin(Number(e.target.value))}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Target Nilai Tertinggi Baru
                    </label>
                    <input
                      type="number"
                      value={targetMax}
                      onChange={(e) => setTargetMax(Number(e.target.value))}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Daftar Nama & Nilai Mentah Siswa *
                </label>
                <textarea
                  rows={7}
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="Format satu siswa per baris: Nama: Nilai (atau cukup angka baris per baris)"
                  className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 p-3.5 text-xs font-mono text-neutral-900 dark:text-white"
                  required
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  💡 Tips: Anda bisa langsung copy-paste kolom nama dan nilai dari Microsoft Excel.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-kawaii-primary w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      Menghitung Katrol Nilai & Menulis Justifikasi...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Hitung & Generate Justifikasi (1 Kredit)
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Guide Card */}
          <div className="bg-cyan-50/60 dark:bg-neutral-900 p-6 rounded-3xl border-2 border-cyan-500/20 dark:border-neutral-800 space-y-4 text-xs text-neutral-700 dark:text-neutral-300">
            <h4 className="font-bold text-sm text-cyan-950 dark:text-cyan-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              Kenapa Katrol Nilai SiapAjar Aman?
            </h4>
            <ul className="space-y-2 list-disc pl-4">
              <li>
                <strong>Urutan Peringkat Tetap:</strong> Siswa nilai tertinggi tetap mendapat nilai
                tertinggi.
              </li>
              <li>
                <strong>Proporsional:</strong> Peningkatan nilai menggunakan interpolasi matematis
                terbukti.
              </li>
              <li>
                <strong>Justifikasi Resmi:</strong> Disediakan narasi akademis pertimbangan tingkat
                kesukaran soal dan ketuntasan klasikal.
              </li>
            </ul>
            <div className="p-3.5 bg-white dark:bg-neutral-800 rounded-2xl border border-cyan-200 dark:border-neutral-700 text-xs">
              📊 <strong>Integrasi Excel:</strong> Hasil dapat disalin langsung ke Excel tanpa
              merusak format kolom.
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <span className="text-[11px] text-neutral-500 block">Rata-rata Mentah</span>
                <span className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                  {result.statistics.rawAverage}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block font-semibold">
                  Rata-rata Katrol Baru
                </span>
                <span className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                  {result.statistics.adjustedAverage}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <span className="text-[11px] text-neutral-500 block">Rentang Nilai Mentah</span>
                <span className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                  {result.statistics.lowestRaw} - {result.statistics.highestRaw}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800">
                <span className="text-[11px] text-cyan-700 dark:text-cyan-300 block font-semibold">
                  Rentang Nilai Baru
                </span>
                <span className="text-base font-bold text-cyan-800 dark:text-cyan-200">
                  {result.statistics.lowestAdjusted} - {result.statistics.highestAdjusted}
                </span>
              </div>
            </div>

            {/* Justification Box */}
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-neutral-800 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 uppercase">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Narasi Justifikasi Akademik (Supervisi / Rapat Pleno)
              </h4>
              <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed italic whitespace-pre-line">
                &ldquo;{result.supervisionJustification}&rdquo;
              </p>
            </div>

            {/* Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Tabel Hasil Penyesuaian Nilai ({result.results.length} Siswa)
                </h4>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Tersalin!' : 'Copy Tabel untuk Excel'}
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold uppercase border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="py-2.5 px-4">No</th>
                      <th className="py-2.5 px-4">Nama Siswa</th>
                      <th className="py-2.5 px-4">Nilai Mentah</th>
                      <th className="py-2.5 px-4">Nilai Katrol</th>
                      <th className="py-2.5 px-4">Kenaikan (+Δ)</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {result.results.map((row, idx) => {
                      const delta = row.adjustedScore - row.rawScore
                      return (
                        <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                          <td className="py-2.5 px-4 text-neutral-500">{idx + 1}</td>
                          <td className="py-2.5 px-4 font-semibold text-neutral-900 dark:text-white">
                            {row.name}
                          </td>
                          <td className="py-2.5 px-4 text-neutral-600 dark:text-neutral-400 font-mono">
                            {row.rawScore}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                            {row.adjustedScore}
                          </td>
                          <td className="py-2.5 px-4 text-cyan-600 dark:text-cyan-400 font-semibold font-mono">
                            +{delta}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
