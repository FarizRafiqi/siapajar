import {
  BookOpen,
  FileSpreadsheet,
  Layers,
  FileText,
  Calculator,
  ClipboardList,
  Compass,
  FileCode,
} from 'lucide-react'

export interface PricingPackage {
  id: number
  name: string
  displayName: string
  description: string | null
  priceMonthly: number
  priceYearly: number | null
  features: string[]
  isHighlighted: boolean
  ctaLabel: string | null
}

export function formatPackagePrice(pkg: PricingPackage) {
  if (pkg.priceMonthly === 0) {
    return { price: 'Gratis', period: '' }
  }
  return { price: `Rp${pkg.priceMonthly.toLocaleString('id-ID')}`, period: '' }
}

export const expressTools = [
  {
    title: 'Modul Ajar & RPP',
    desc: 'Susun modul ajar lengkap Kurikulum Merdeka dengan TP, ATP, asesmen & refleksi dalam 2 menit.',
    icon: BookOpen,
    color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400',
    tag: 'Paling Populer',
    tagColor: 'bg-amber-300 text-neutral-950',
    href: '/modul-ajar',
  },
  {
    title: 'Soal & Evaluasi',
    desc: 'Generate bank soal PG, isian, dan uraian HOTS lengkap dengan kunci jawaban & kisi-kisi.',
    icon: FileCode,
    color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400',
    tag: 'Bank Soal',
    tagColor: 'bg-blue-200 text-neutral-950',
    href: '/soal',
  },
  {
    title: 'LKPD Interaktif',
    desc: 'Lembar Kerja Peserta Didik tematik dengan aktivitas berjenjang siap cetak dalam hitungan detik.',
    icon: Layers,
    color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400',
    tag: 'Siap Cetak',
    tagColor: 'bg-purple-200 text-neutral-950',
    href: '/lkpd',
  },
  {
    title: 'Katrol Nilai Smart',
    desc: 'Normalisasi dan katrol nilai ulangan/ujian secara matematis proporsional dengan narasi justifikasi.',
    icon: Calculator,
    color: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400',
    tag: 'Formula Akurat',
    tagColor: 'bg-cyan-200 text-neutral-950',
    href: '/katrol',
  },
  {
    title: 'Prota & Promes',
    desc: 'Matriks Program Tahunan & Semester otomatis menghitung pekan efektif dan alur distribusi CP.',
    icon: FileSpreadsheet,
    color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400',
    tag: 'Format Resmi',
    tagColor: 'bg-emerald-200 text-neutral-950',
    href: '/prota-promes',
  },
  {
    title: 'Narasi Rapor AI',
    desc: 'Tulis deskripsi rapor autentik otomatis untuk seluruh siswa berdasarkan capaian tertinggi & terendah.',
    icon: FileText,
    color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400',
    tag: 'Otomatis Kelas',
    tagColor: 'bg-rose-200 text-neutral-950',
    href: '/rapor',
  },
  {
    title: 'Jurnal Harian Guru',
    desc: 'Catatan mengajar dan refleksi harian kelas sesuai jadwal untuk kelengkapan administrasi supervisi.',
    icon: ClipboardList,
    color: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400',
    tag: 'Refleksi Harian',
    tagColor: 'bg-amber-200 text-neutral-950',
    href: '/jurnal',
  },
  {
    title: 'Modul Projek P5',
    desc: 'Modul projek kokurikuler dengan 6 dimensi Profil Pelajar Pancasila dan alur tahapan aksi.',
    icon: Compass,
    color: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400',
    tag: 'Kurikulum Merdeka',
    tagColor: 'bg-lime-200 text-neutral-950',
    href: '/kokurikuler',
  },
]

export const faqs = [
  {
    q: 'Apakah dokumen yang dihasilkan sesuai dengan Kurikulum Merdeka?',
    a: 'Ya! Seluruh generator di SiapAjar dirancang mengikuti panduan pembelajaran dan asesmen terbaru dari Kemendikbudristek & BSKAP (CP, TP, ATP, IKTP, hingga Asesmen Diagnostik/Formatif/Sumatif).',
  },
  {
    q: 'Apakah guru baru mendapatkan kredit gratis?',
    a: 'Tentu saja. Setiap pengguna yang baru mendaftar langsung mendapatkan bonus kredit gratis untuk mencoba seluruh generator tanpa syarat kartu kredit.',
  },
  {
    q: 'Bagaimana cara menggunakan dokumen yang sudah digenerate?',
    a: 'Setiap hasil dokumen dilengkapi tombol Salin Teks Format Rapi untuk ditempel ke Microsoft Word / Google Docs, serta tombol Cetak Langsung / Simpan PDF.',
  },
  {
    q: 'Bisa digunakan untuk semua jenjang sekolah?',
    a: 'Bisa. SiapAjar mendukung jenjang PAUD/TK/RA, SD/MI (Fase A, B, C), SMP/MTs (Fase D), hingga SMA/SMK/MA.',
  },
  {
    q: 'Apakah data sekolah dan siswa saya aman?',
    a: 'Sangat aman. Kami menggunakan enkripsi standar industri dan server berlokasi di Indonesia. Data sekolah Anda tidak akan pernah dibagikan ke pihak manapun.',
  },
]
