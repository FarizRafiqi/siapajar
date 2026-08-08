import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Printer, FileText, Heart, Sparkles, CheckCircle2, Download } from 'lucide-react'

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface LkpdContent {
  title?: string
  tujuanPembelajaran?: string[]
  petunjukBelajar?: string
  stimulusCerita?: string
  aktivitasMotorik?: string[]
  aktivitasKognitifBahasa?: string[]
  aktivitasSeniMewarnai?: string[]
  refleksiEmosi?: string[]
}

interface Lkpd {
  id: number
  title: string
  theme: string
  subtheme: string | null
  ageGroup: string
  institutionType: string
  content: LkpdContent
  status: 'draft' | 'published'
  createdAt: string
  schoolClass: SchoolClass
}

interface LkpdShowProps {
  readonly lkpd: Lkpd
}

export default function LkpdShow({ lkpd }: LkpdShowProps) {
  const content = lkpd.content || {}

  const handlePrint = () => {
    window.print()
  }

  return (
    <DashboardWrapper
      title={lkpd.title}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'LKPD Anak', href: '/lkpd' },
        { label: lkpd.title },
      ]}
    >
      <Head title={lkpd.title} />

      <div className="space-y-6">
        {/* Header Control */}
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
            <Link
              href="/lkpd"
              className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {lkpd.title}
                </h2>
                <span className="rounded-full bg-purple-100 px-3 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  {lkpd.ageGroup}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {lkpd.institutionType}
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                Kelompok {lkpd.schoolClass.name} • Tema: {lkpd.theme}{' '}
                {lkpd.subtheme ? `(${lkpd.subtheme})` : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={`/lkpd/${lkpd.id}/export/pdf?disposition=inline`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Download className="h-4 w-4" /> PDF
            </a>
            <a
              href={`/lkpd/${lkpd.id}/export`}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              DOCX
            </a>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Printer className="h-4 w-4" />
              Cetak / Simpan PDF
            </button>
          </div>
        </div>

        {/* Printable LKPD Sheet (Formulir Aktivitas Anak) */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 print:max-w-none print:border-none print:p-0 print:shadow-none">
          {/* Header Lembar Aktivitas */}
          <div className="border-b-2 border-dashed border-neutral-300 pb-6 text-center dark:border-neutral-700">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              LEMBAR AKTIVITAS PESERTA DIDIK
            </h1>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {lkpd.institutionType === 'RA'
                ? 'RAUDHATUL ATHFAL (RA)'
                : 'TAMAN KANAK-KANAK (TK / PAUD)'}
            </p>

            {/* Grid Identitas Siswa */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-4 text-left text-sm dark:bg-neutral-800/50">
              <div>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Nama Siswa:
                </span>
                <div className="mt-1 h-7 border-b border-dotted border-neutral-400" />
              </div>
              <div>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Hari / Tanggal:
                </span>
                <div className="mt-1 h-7 border-b border-dotted border-neutral-400" />
              </div>
              <div>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Kelompok / Usia:
                </span>
                <p className="text-neutral-900 dark:text-white">
                  {lkpd.schoolClass.name} ({lkpd.ageGroup})
                </p>
              </div>
              <div>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Tema / Sub-Tema:
                </span>
                <p className="text-neutral-900 dark:text-white">
                  {lkpd.theme} {lkpd.subtheme ? `/ ${lkpd.subtheme}` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Tujuan & Petunjuk */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
              <h3 className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" /> Tujuan Pembelajaran
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                {(content.tujuanPembelajaran ?? []).map((tp, idx) => (
                  <li key={`tp-${idx}-${tp.slice(0, 10)}`}>{tp}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
              <h3 className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300">
                <FileText className="h-4 w-4" /> Petunjuk Belajar
              </h3>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {content.petunjukBelajar ||
                  'Bimbinglah anak dengan penuh kasih sayang dalam menyelesaikan kegiatan di bawah ini.'}
              </p>
            </div>
          </div>

          {/* Stimulus Cerita / Pengantar */}
          {content.stimulusCerita && (
            <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50/50 p-4 text-sm dark:border-purple-900/30 dark:bg-purple-900/10">
              <h3 className="flex items-center gap-2 font-bold text-purple-800 dark:text-purple-300">
                <Sparkles className="h-4 w-4" /> Ayo Dengarkan Cerita Ini!
              </h3>
              <p className="mt-2 italic text-neutral-800 dark:text-neutral-200 leading-relaxed">
                &quot;{content.stimulusCerita}&quot;
              </p>
            </div>
          )}

          {/* Bagian Aktivitas Anak */}
          <div className="mt-8 space-y-8">
            {/* Aktivitas 1: Motorik Halus & Menebalkan */}
            {content.aktivitasMotorik && content.aktivitasMotorik.length > 0 && (
              <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
                <h3 className="font-bold text-neutral-900 dark:text-white">
                  Kegiatan 1: Motorik Halus & Menebalkan
                </h3>
                <div className="mt-3 space-y-3">
                  {content.aktivitasMotorik.map((act, idx) => (
                    <div
                      key={`act1-${idx}-${act.slice(0, 10)}`}
                      className="rounded-lg bg-neutral-50 p-3 text-sm dark:bg-neutral-800/40"
                    >
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {idx + 1}. {act}
                      </p>
                      <div className="mt-3 h-12 rounded border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs italic">
                        [ Area Menebalkan / Menarik Garis ]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aktivitas 2: Kognitif & Bahasa (Mencocokkan / Melingkari) */}
            {content.aktivitasKognitifBahasa && content.aktivitasKognitifBahasa.length > 0 && (
              <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
                <h3 className="font-bold text-neutral-900 dark:text-white">
                  Kegiatan 2: Kognitif & Bahasa
                </h3>
                <div className="mt-3 space-y-3">
                  {content.aktivitasKognitifBahasa.map((act, idx) => (
                    <div
                      key={`act2-${idx}-${act.slice(0, 10)}`}
                      className="rounded-lg bg-neutral-50 p-3 text-sm dark:bg-neutral-800/40"
                    >
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {idx + 1}. {act}
                      </p>
                      <div className="mt-3 h-12 rounded border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs italic">
                        [ Area Jawab / Melingkari / Mencocokkan ]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aktivitas 3: Seni & Mewarnai */}
            {content.aktivitasSeniMewarnai && content.aktivitasSeniMewarnai.length > 0 && (
              <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
                <h3 className="font-bold text-neutral-900 dark:text-white">
                  Kegiatan 3: Seni & Kreativitas Mewarnai
                </h3>
                <div className="mt-3 space-y-3">
                  {content.aktivitasSeniMewarnai.map((act, idx) => (
                    <div
                      key={`act3-${idx}-${act.slice(0, 10)}`}
                      className="rounded-lg bg-neutral-50 p-3 text-sm dark:bg-neutral-800/40"
                    >
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {idx + 1}. {act}
                      </p>
                      <div className="mt-3 h-40 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs italic bg-white dark:bg-neutral-900">
                        [ Gambar untuk Diwarnai / Dikreativitaskan Anak ]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Refleksi Emosi & Umpan Balik Guru */}
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50/40 p-5 dark:border-amber-900/30 dark:bg-amber-900/10">
              <h3 className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                <Heart className="h-4 w-4 text-red-500" /> Refleksi Perasaan Anak Hari Ini
              </h3>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                Lingkarilah emotikon yang menggambarkan perasaanmu setelah belajar:
              </p>
              <div className="mt-4 flex items-center justify-center gap-8 text-3xl">
                <span
                  className="cursor-pointer hover:scale-125 transition-transform"
                  title="Sangat Senang"
                >
                  😀
                </span>
                <span
                  className="cursor-pointer hover:scale-125 transition-transform"
                  title="Senang"
                >
                  😊
                </span>
                <span className="cursor-pointer hover:scale-125 transition-transform" title="Biasa">
                  😐
                </span>
                <span className="cursor-pointer hover:scale-125 transition-transform" title="Sedih">
                  😢
                </span>
              </div>

              {/* Area Paraf & Catatan Guru */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-amber-200 pt-4 text-center text-xs dark:border-amber-800">
                <div>
                  <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Paraf Guru:
                  </p>
                  <div className="mt-8 mx-auto w-32 border-b border-neutral-400" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Paraf Orang Tua:
                  </p>
                  <div className="mt-8 mx-auto w-32 border-b border-neutral-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  )
}
