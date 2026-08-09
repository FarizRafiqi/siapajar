import { BookOpen, Search, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface TermItem {
  code: string
  title: string
  description: string
  category: string
}

const GLOSSARY_TERMS: TermItem[] = [
  {
    code: 'CP',
    title: 'Capaian Pembelajaran',
    description: 'Kompetensi pembelajaran yang harus dicapai peserta didik pada akhir setiap fase (misal: akhir Fase Fondasi untuk PAUD/TK). CP merupakan acuan target utama dari pemerintah.',
    category: 'Struktur Utama',
  },
  {
    code: 'TP',
    title: 'Tujuan Pembelajaran',
    description: 'Rumusan tujuan yang lebih spesifik yang diturunkan dari CP. TP menjadi sasaran belajar mingguan/bulanan yang direncanakan guru dalam kegiatan kelas.',
    category: 'Struktur Utama',
  },
  {
    code: 'ATP',
    title: 'Alur Tujuan Pembelajaran',
    description: 'Rangkaian Tujuan Pembelajaran (TP) yang disusun secara logis dan runtut dari awal hingga akhir fase. ATP berfungsi sebagai peta jalan (road map) pengajaran.',
    category: 'Struktur Utama',
  },
  {
    code: 'IKTP',
    title: 'Indikator Ketercapaian Tujuan Pembelajaran',
    description: 'Serangkaian kriteria atau indikator perilaku yang dapat diamati dan diukur oleh guru untuk memastikan apakah peserta didik telah mencapai TP tertentu.',
    category: 'Asesmen & Bukti',
  },
  {
    code: 'RPM',
    title: 'Rencana Pembelajaran Mendalam',
    description: 'Format modul/rencana pembelajaran modern yang memuat pengalaman belajar berkesadaran, bermakna, dan menggembirakan bagi peserta didik.',
    category: 'Dokumen Perencanaan',
  },
  {
    code: 'RPPM',
    title: 'Rencana Pelaksanaan Pembelajaran Mingguan',
    description: 'Dokumen perencanaan kegiatan belajar yang disusun untuk jangka waktu satu minggu, mencakup fokus tema dan sub-tema.',
    category: 'Dokumen Perencanaan',
  },
  {
    code: 'RPPH',
    title: 'Rencana Pelaksanaan Pembelajaran Harian',
    description: 'Rincian langkah-langkah kegiatan belajar mengajar yang akan dilaksanakan guru dalam satu hari kelas.',
    category: 'Dokumen Perencanaan',
  },
  {
    code: 'Modul Ajar',
    title: 'Modul Ajar Kurikulum Merdeka',
    description: 'Dokumen perencanaan pembelajaran lengkap yang mencakup tujuan pembelajaran, langkah kegiatan, media, serta instrumen asesmen.',
    category: 'Dokumen Perencanaan',
  },
  {
    code: 'PPM',
    title: 'Pengalaman Pembelajaran Mendalam',
    description: 'Pengalaman nyata anak dalam proses mengalami, memahami, dan merefleksi materi pelajaran melalui aktivitas interaktif dan kontekstual.',
    category: 'Konsep Pembelajaran',
  },
]

export default function CurriculumGlossary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openTerms, setOpenTerms] = useState<Record<string, boolean>>({
    CP: true,
    TP: true,
    ATP: true,
  })

  const toggleTerm = (code: string) => {
    setOpenTerms((prev) => ({
      ...prev,
      [code]: !prev[code],
    }))
  }

  const filteredTerms = GLOSSARY_TERMS.filter(
    (item) =>
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section
      data-tour="curriculum-glossary"
      className="rounded-2xl border border-neutral-300 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm"
      aria-labelledby="curriculum-glossary-title"
    >
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-5 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h3
              id="curriculum-glossary-title"
              className="text-xl font-bold text-neutral-900 dark:text-white"
            >
              Glosarium Kurikulum
            </h3>
            <p className="mt-0.5 text-sm text-neutral-700 dark:text-neutral-300">
              Kamus rujukan lengkap pengertian istilah CP, TP, ATP, IKTP, dan dokumen perencanaan SiapAjar.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari istilah..."
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-9 pr-3 py-2 text-sm font-medium text-neutral-900 placeholder-neutral-500 focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400"
          />
        </div>
      </div>

      {/* Terms Grid Layout with explicit items-start to fix height stretch bug */}
      <div className="mt-6 grid gap-4 items-start sm:grid-cols-2 lg:grid-cols-3">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item) => {
            const isOpen = openTerms[item.code] ?? false
            return (
              <div
                key={item.code}
                className="rounded-xl border border-neutral-300 bg-neutral-50/60 transition-all dark:border-neutral-800 dark:bg-neutral-800/40 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleTerm(item.code)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-extrabold text-white shrink-0">
                      {item.code}
                    </span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {item.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-300 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-neutral-200 bg-white p-4 text-sm font-medium text-neutral-800 dark:border-neutral-700/80 dark:bg-neutral-900 dark:text-neutral-200 leading-relaxed">
                    <p>{item.description}</p>
                    <span className="mt-3 inline-block rounded bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                      Kategori: {item.category}
                    </span>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
            Tidak ada istilah yang cocok dengan kata kunci "{searchQuery}".
          </div>
        )}
      </div>
    </section>
  )
}
