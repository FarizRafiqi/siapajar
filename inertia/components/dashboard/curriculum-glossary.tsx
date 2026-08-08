import { BookOpen, ChevronDown, Info } from 'lucide-react'

const TERMS = [
  {
    term: 'CP — Capaian Pembelajaran',
    description: 'Kompetensi yang diharapkan dicapai anak pada akhir Fase Fondasi.',
  },
  {
    term: 'TP — Tujuan Pembelajaran',
    description:
      'Rumusan tujuan yang lebih spesifik dan dapat direncanakan dalam kegiatan belajar.',
  },
  {
    term: 'ATP — Alur Tujuan Pembelajaran',
    description: 'Urutan TP yang membantu guru menyusun perkembangan belajar secara runtut.',
  },
  {
    term: 'IKTP — Indikator Ketercapaian Tujuan Pembelajaran',
    description: 'Perilaku atau bukti yang dapat diamati untuk melihat ketercapaian TP.',
  },
  {
    term: 'RPM — Rencana Pembelajaran Mendalam',
    description:
      'Format rencana pembelajaran modern yang memuat pengalaman belajar berkesadaran, bermakna, dan menggembirakan.',
  },
  {
    term: 'RPPM — Rencana Pelaksanaan Pembelajaran Mingguan',
    description:
      'Format rencana mingguan yang masih dapat digunakan untuk kebutuhan dan arsip sekolah.',
  },
  {
    term: 'RPPH — Rencana Pelaksanaan Pembelajaran Harian',
    description: 'Rincian kegiatan pembelajaran untuk satu hari.',
  },
  {
    term: 'Modul Ajar',
    description:
      'Dokumen perencanaan pembelajaran yang memuat tujuan, aktivitas, asesmen, dan sumber belajar.',
  },
  {
    term: 'PPM — Pengalaman Pembelajaran Mendalam',
    description:
      'Pengalaman nyata anak dalam proses mengalami, memahami, dan merefleksi; PPM menjadi bagian dari dokumen, bukan menu terpisah.',
  },
]

export default function CurriculumGlossary() {
  return (
    <section
      data-tour="curriculum-glossary"
      className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900/70 dark:from-emerald-950/30 dark:to-neutral-900"
      aria-labelledby="curriculum-glossary-title"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            <Info className="h-3.5 w-3.5" /> Panduan istilah
          </p>
          <h3
            id="curriculum-glossary-title"
            className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white"
          >
            Kenali struktur kurikulum SiapAjar
          </h3>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Buka istilah untuk melihat fungsi dan kaitannya dalam perencanaan pembelajaran.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {TERMS.map((item) => (
          <details
            key={item.term}
            className="group rounded-xl border border-emerald-100 bg-white/80 p-3 dark:border-emerald-900/50 dark:bg-neutral-900/70"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-neutral-800 marker:hidden dark:text-neutral-200">
              <span>{item.term}</span>
              <ChevronDown className="h-4 w-4 flex-shrink-0 text-emerald-600 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 border-t border-neutral-100 pt-2 text-xs leading-5 text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
              {item.description}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
