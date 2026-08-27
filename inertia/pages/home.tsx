import { Head, Link, usePage } from '@inertiajs/react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  Layers,
  FileText,
  CheckCircle2,
  ArrowRight,
  Calculator,
  ClipboardList,
  Compass,
  Zap,
  Check,
  Menu,
  X,
  ChevronDown,
  Printer,
  FileCode,
} from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '~/components/ui/theme-toggle'
import { sanitizeRichText } from '~/lib/rich-text'

interface PricingPackage {
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

function formatPackagePrice(pkg: PricingPackage) {
  if (pkg.priceMonthly === 0) {
    return { price: 'Gratis', period: '' }
  }
  return { price: `Rp${pkg.priceMonthly.toLocaleString('id-ID')}`, period: '/bulan' }
}

const expressTools = [
  {
    title: 'Modul Ajar & RPP',
    desc: 'Susun modul ajar lengkap Kurikulum Merdeka dengan TP, ATP, asesmen & refleksi dalam 2 menit.',
    icon: BookOpen,
    color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400',
    tag: 'Paling Populer',
    tagColor: 'bg-amber-300 text-neutral-950',
    href: '/app/express/modul-ajar',
  },
  {
    title: 'Soal & Evaluasi',
    desc: 'Generate bank soal PG, isian, dan uraian HOTS lengkap dengan kunci jawaban & kisi-kisi.',
    icon: FileCode,
    color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400',
    tag: 'Bank Soal',
    tagColor: 'bg-blue-200 text-neutral-950',
    href: '/app/express/soal',
  },
  {
    title: 'LKPD Interaktif',
    desc: 'Lembar Kerja Peserta Didik tematik dengan aktivitas berjenjang siap cetak dalam hitungan detik.',
    icon: Layers,
    color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400',
    tag: 'Siap Cetak',
    tagColor: 'bg-purple-200 text-neutral-950',
    href: '/app/express/lkpd',
  },
  {
    title: 'Katrol Nilai Smart',
    desc: 'Normalisasi dan katrol nilai ulangan/ujian secara matematis proporsional dengan narasi justifikasi.',
    icon: Calculator,
    color: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400',
    tag: 'Formula Akurat',
    tagColor: 'bg-cyan-200 text-neutral-950',
    href: '/app/express/katrol',
  },
  {
    title: 'Prota & Promes',
    desc: 'Matriks Program Tahunan & Semester otomatis menghitung pekan efektif dan alur distribusi CP.',
    icon: FileSpreadsheet,
    color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400',
    tag: 'Format Resmi',
    tagColor: 'bg-emerald-200 text-neutral-950',
    href: '/app/express/prota-promes',
  },
  {
    title: 'Narasi Rapor AI',
    desc: 'Tulis deskripsi rapor autentik otomatis untuk seluruh siswa berdasarkan capaian tertinggi & terendah.',
    icon: FileText,
    color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400',
    tag: 'Otomatis Kelas',
    tagColor: 'bg-rose-200 text-neutral-950',
    href: '/app/express/rapor',
  },
  {
    title: 'Jurnal Harian Guru',
    desc: 'Catatan mengajar dan refleksi harian kelas sesuai jadwal untuk kelengkapan administrasi supervisi.',
    icon: ClipboardList,
    color: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400',
    tag: 'Refleksi Harian',
    tagColor: 'bg-amber-200 text-neutral-950',
    href: '/app/express/jurnal',
  },
  {
    title: 'Modul Projek P5',
    desc: 'Modul projek kokurikuler dengan 6 dimensi Profil Pelajar Pancasila dan alur tahapan aksi.',
    icon: Compass,
    color: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400',
    tag: 'Kurikulum Merdeka',
    tagColor: 'bg-lime-200 text-neutral-950',
    href: '/app/express/kokurikuler',
  },
]

const steps = [
  {
    num: '01',
    title: 'Pilih Generator yang Anda Butuhkan',
    desc: 'Pilih dari 8 generator administrasi: Modul Ajar, Soal Evaluasi, LKPD, Jurnal, Prota-Promes, atau Rapor.',
    color: 'bg-amber-300 text-neutral-950',
  },
  {
    num: '02',
    title: 'Isi Parameter Ringkas',
    desc: 'Cukup masukkan jenjang kelas, tema / topik materi pokok, dan preferensi alokasi waktu.',
    color: 'bg-emerald-300 text-neutral-950',
  },
  {
    num: '03',
    title: 'AI Buatkan Dokumen Siap Pakai',
    desc: 'Dalam 45 detik, dokumen lengkap terstruktur standar BSKAP langsung siap disalin, diedit, atau dicetak.',
    color: 'bg-cyan-300 text-neutral-950',
  },
]

const faqs = [
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

function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = usePage().props as any

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 30)
  })

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b-2 border-black shadow-[0_4px_0px_#000000]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-300 border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center font-black text-neutral-950 text-xl group-hover:-rotate-6 transition-transform">
              <Sparkles className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <span className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-1.5">
                SiapAjar
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 border border-black font-black">
                  AI
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#tools"
              className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 transition-colors"
            >
              8 Generator AI
            </a>
            <a
              href="#cara-kerja"
              className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 transition-colors"
            >
              Cara Kerja
            </a>
            <a
              href="#pricing"
              className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 transition-colors"
            >
              Harga
            </a>
            <a
              href="#faq"
              className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 transition-colors"
            >
              FAQ
            </a>
            <ThemeToggle />

            {user ? (
              <Link href="/dashboard" className="btn-kawaii-primary text-xs font-black py-2.5 px-5">
                Buka Dashboard &rarr;
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-black text-neutral-800 dark:text-neutral-200 hover:text-emerald-600 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/signup"
                  className="btn-kawaii-primary text-xs font-black py-2.5 px-5 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Daftar Gratis
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 bg-white dark:bg-neutral-800 border-2 border-black shadow-[2px_2px_0px_#000000] rounded-xl text-neutral-900 dark:text-white"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white dark:bg-neutral-900 border-b-2 border-black shadow-[0_4px_0px_#000000] px-4 py-6 space-y-3"
          >
            <a
              href="#tools"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-black text-neutral-800 dark:text-neutral-200 hover:text-emerald-600"
            >
              8 Generator AI
            </a>
            <a
              href="#cara-kerja"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-black text-neutral-800 dark:text-neutral-200 hover:text-emerald-600"
            >
              Cara Kerja
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-black text-neutral-800 dark:text-neutral-200 hover:text-emerald-600"
            >
              Harga & Top Up
            </a>
            <a
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-black text-neutral-800 dark:text-neutral-200 hover:text-emerald-600"
            >
              FAQ
            </a>
            <div className="pt-3 border-t-2 border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="btn-kawaii-primary text-center text-xs py-3"
                >
                  Buka Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-kawaii-secondary text-center text-xs py-2.5"
                  >
                    Masuk ke Akun
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="btn-kawaii-primary text-center text-xs py-3"
                  >
                    Daftar Gratis (Dapat 3 Kredit)
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function InteractiveWindowMockup() {
  const [activeTab, setActiveTab] = useState<'modul' | 'soal' | 'lkpd' | 'rapor'>('modul')

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Decorative floating badges */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-6 -right-2 sm:-right-6 z-20 badge-kawaii-amber shadow-[3px_3px_0px_#000000] text-xs px-3.5 py-1.5 font-black flex items-center gap-1.5"
      >
        <Zap className="w-4 h-4 text-amber-700" /> Selesai dalam 45 Detik!
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-5 -left-2 sm:-left-6 z-20 badge-kawaii-emerald shadow-[3px_3px_0px_#000000] text-xs px-3.5 py-1.5 font-black flex items-center gap-1.5"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Sesuai Standar BSKAP
      </motion.div>

      {/* Main Window */}
      <div className="rounded-3xl border-2 border-black bg-white dark:bg-neutral-900 shadow-[8px_8px_0px_#000000] overflow-hidden">
        {/* Window Titlebar */}
        <div className="bg-emerald-300 dark:bg-neutral-800 border-b-2 border-black px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-400 border border-black inline-block" />
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-black inline-block" />
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-black inline-block" />
          </div>

          <div className="flex-1 max-w-xs bg-white dark:bg-neutral-950 border border-black rounded-lg px-3 py-1 text-[11px] font-mono text-neutral-600 dark:text-neutral-300 truncate text-center">
            siapajar.id/app/express/{activeTab}-ajar
          </div>

          <div className="text-[10px] font-black text-neutral-900 dark:text-neutral-200 px-2 py-0.5 bg-white/70 dark:bg-neutral-700 rounded border border-black">
            LIVE PREVIEW
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center border-b-2 border-black bg-neutral-50 dark:bg-neutral-950 overflow-x-auto px-2 pt-2 gap-1.5 scrollbar-none">
          {[
            { key: 'modul', label: 'Modul Ajar', icon: BookOpen },
            { key: 'soal', label: 'Soal Evaluasi', icon: FileCode },
            { key: 'lkpd', label: 'Lembar LKPD', icon: Layers },
            { key: 'rapor', label: 'Narasi Rapor', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-2 rounded-t-xl text-xs font-black flex items-center gap-1.5 border-t-2 border-x-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-white dark:bg-neutral-900 border-black text-neutral-950 dark:text-white -mb-[2px] shadow-[2px_-2px_0px_#000000]'
                    : 'bg-transparent border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Window Content */}
        <div className="p-4 sm:p-6 space-y-4 text-left">
          {activeTab === 'modul' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="badge-kawaii-blue text-[11px] font-black">
                  Fase D • Kelas 7 SMP • 2 JP (80 Menit)
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Siap Cetak
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                MODUL AJAR: Tata Surya & Gravitasi Bumi
              </h4>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs space-y-2 text-neutral-700 dark:text-neutral-300">
                <p className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>Tujuan Pembelajaran:</strong> Peserta didik mampu menganalisis
                  karakteristik planet serta pengaruh gaya gravitasi bumi.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="p-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <span className="font-bold text-[10px] text-neutral-500 block uppercase">
                      Kegiatan Inti
                    </span>
                    <span className="text-[11px]">Eksperimen Mini Massa & Kecepatan Jatuh</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <span className="font-bold text-[10px] text-neutral-500 block uppercase">
                      Asesmen Formatif
                    </span>
                    <span className="text-[11px]">Rubrik Observasi Diskusi Kelompok</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'soal' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="badge-kawaii-amber text-[11px] font-black">
                  Sumatif Tengah Semester • 10 Butir HOTS
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Kunci Jawaban Lengkap
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                Bank Soal: Matematika - Pecahan & Desimal
              </h4>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs space-y-2">
                <p className="font-bold text-neutral-900 dark:text-white">
                  1. Ibu membeli 2½ kg gula pasir dan 1,75 kg tepung terigu...
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="p-1.5 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    A. 4,25 kg
                  </span>
                  <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 rounded-lg border border-emerald-500 font-bold text-emerald-800 dark:text-emerald-300">
                    B. 4,25 kg (Kunci: B)
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lkpd' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="badge-kawaii-purple text-[11px] font-black">
                  LKPD Tematik • PAUD / TK B (5-6 Tahun)
                </span>
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                  Format Siap Print
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                LKPD: Tanaman Sayur Ciptaan Allah
              </h4>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs space-y-1.5 text-neutral-700 dark:text-neutral-300">
                <p className="font-bold text-neutral-900 dark:text-white">Aktivitas Mandiri:</p>
                <p className="text-[11px]">
                  1. Hubungkan gambar sayuran dengan jumlah angka yang sesuai di sebelah kanan!
                </p>
                <p className="text-[11px]">
                  2. Warnai wortel dengan warna oranye dan daun dengan warna hijau rapi!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'rapor' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="badge-kawaii-rose text-[11px] font-black">
                  Narasi Rapor Otomatis • Semester 1
                </span>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                  Bahasa Apresiatif
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                Narasi Capaian Pembelajaran Siswa
              </h4>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                &ldquo;Ananda menunjukkan antusiasme tinggi dalam mengenal konsep bilangan dan
                sangat terampil saat kegiatan eksperimen kelompok. Dalam hal ketelitian pengerjaan
                mandiri, ananda terus menunjukkan perkembangan yang positif.&rdquo;
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="pt-2 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 text-[11px]">
            <span className="text-neutral-500 font-medium">✓ Hasil siap salin ke Word & Excel</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-200 text-neutral-950 border border-black font-bold text-[10px] flex items-center gap-1">
                <Printer className="w-3 h-3" /> Cetak PDF
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000000] overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 text-left font-black text-sm sm:text-base text-neutral-900 dark:text-white flex items-center justify-between gap-4"
      >
        <span>{q}</span>
        <div
          className={`p-1.5 rounded-lg border-2 border-black bg-emerald-200 text-neutral-950 transition-transform ${
            open ? 'rotate-180 bg-amber-300' : ''
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium border-t-2 border-neutral-100 dark:border-neutral-800 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  )
}

interface HomeProps {
  readonly packages: PricingPackage[]
}

export default function Home({ packages }: HomeProps) {
  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-neutral-950 text-neutral-900 dark:text-white antialiased font-sans selection:bg-emerald-300 selection:text-neutral-950">
      <Head title="SiapAjar — Generator Modul Ajar & Administrasi Guru AI Terlengkap">
        <meta
          name="description"
          content="Generator Modul Ajar, Soal Evaluasi, LKPD, Prota-Promes, Jurnal Mengajar, dan Narasi Rapor Kurikulum Merdeka otomatis dalam 3 menit. Coba gratis sekarang!"
        />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          {/* Top Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-200 text-neutral-950 border-2 border-black shadow-[3px_3px_0px_#000000] text-xs sm:text-sm font-black"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Platform Administrasi Guru AI Terlengkap • Bonus 3 Kredit Gratis</span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 dark:text-white max-w-4xl mx-auto leading-[1.15]"
          >
            Modul Ajar & Administrasi Guru Lengkap dalam{' '}
            <span className="relative inline-block px-2 text-emerald-950 dark:text-emerald-950">
              <span className="absolute inset-0 bg-emerald-300 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] -rotate-1 -z-10" />
              3 Menit!
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Susun Modul Ajar, Soal Evaluasi HOTS, LKPD, Jurnal Harian, Prota-Promes, dan Narasi
            Rapor Kurikulum Merdeka secara otomatis. Tanpa ribet, siap print & supervisi.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/signup"
              className="btn-kawaii-primary text-sm sm:text-base py-3.5 px-8 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Sparkles className="w-5 h-5 text-emerald-950" />
              Mulai Buat Gratis Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#tools"
              className="btn-kawaii-secondary text-sm sm:text-base py-3.5 px-6 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <BookOpen className="w-4 h-4" />
              Lihat 8 Generator AI
            </a>
          </motion.div>

          {/* Trust Value Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 pt-2"
          >
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 font-black" /> Gratis 3 Kredit untuk Guru
              Baru
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 font-black" /> Sesuai Standar Kurikulum
              Merdeka
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 font-black" /> Export Word & Cetak PDF
            </span>
          </motion.div>

          {/* Interactive Window Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="pt-8"
          >
            <InteractiveWindowMockup />
          </motion.div>
        </div>
      </section>

      {/* 8 Express Tools Grid Section */}
      <section
        id="tools"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-100/70 dark:bg-neutral-900/50 border-y-2 border-black"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="badge-kawaii-emerald text-xs font-black">
              8 GENERATOR DALAM 1 PLATFORM
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white">
              Semua Kebutuhan Guru Ada di SiapAjar
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto font-medium">
              Dirancang khusus untuk menghemat waktu guru dari beban administrasi yang
              berulang-ulang setiap semester.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expressTools.map((tool) => {
              const Icon = tool.icon
              return (
                <div
                  key={tool.title}
                  className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] hover:-translate-y-1 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-3 rounded-2xl border-2 border-black ${tool.color} shadow-[2px_2px_0px_#000000]`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full border border-black ${tool.tagColor}`}
                      >
                        {tool.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-base text-neutral-950 dark:text-white group-hover:text-emerald-600 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed font-medium">
                        {tool.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t-2 border-neutral-100 dark:border-neutral-800">
                    <Link
                      href={tool.href}
                      className="text-xs font-black text-neutral-900 dark:text-white group-hover:text-emerald-600 flex items-center justify-between"
                    >
                      <span>Coba Generator</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Cara Kerja 3 Langkah */}
      <section id="cara-kerja" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="badge-kawaii-amber text-xs font-black">CARA KERJA CEPAT</span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white">
              Cukup 3 Langkah Sederhana
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto font-medium">
              Tidak perlu keahlian prompt engineering yang rumit. Cukup pilih dan isi formulir ramah
              guru.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="bg-white dark:bg-neutral-900 p-6 sm:p-7 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-4 relative"
              >
                <div
                  className={`w-12 h-12 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center font-black text-lg ${s.color}`}
                >
                  {s.num}
                </div>
                <h3 className="font-black text-base sm:text-lg text-neutral-950 dark:text-white">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Kredit Section */}
      <section
        id="pricing"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-50 dark:bg-neutral-900/60 border-t-2 border-black"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="badge-kawaii-emerald text-xs font-black">PILIHAN PAKET & HARGA</span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white">
              Top Up Kredit Fleksibel & Transparan
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto font-medium">
              Bayar hanya untuk dokumen yang Anda buat. Tanpa langganan bulanan yang menjebak.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages && packages.length > 0
              ? packages.map((pkg) => {
                  const { price, period } = formatPackagePrice(pkg)
                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black p-6 flex flex-col justify-between relative transition-all ${
                        pkg.isHighlighted
                          ? 'shadow-[6px_6px_0px_#000000] ring-4 ring-emerald-300 dark:ring-emerald-500'
                          : 'shadow-[4px_4px_0px_#000000]'
                      }`}
                    >
                      {pkg.isHighlighted && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-300 text-neutral-950 border-2 border-black text-center text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] whitespace-nowrap">
                          Paling Populer
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-black text-lg text-neutral-950 dark:text-white">
                            {pkg.displayName}
                          </h3>
                          {pkg.description && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                              {pkg.description}
                            </p>
                          )}
                        </div>

                        <div className="py-2">
                          <span className="text-3xl font-black text-neutral-950 dark:text-white">
                            {price}
                          </span>
                          {period && (
                            <span className="text-xs text-neutral-500 font-bold ml-1">
                              {period}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 pt-2 border-t-2 border-neutral-100 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          {pkg.features.map((feat) => (
                            <div key={feat} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6">
                        <Link
                          href="/signup"
                          className={`w-full text-center text-xs py-3 block ${
                            pkg.isHighlighted ? 'btn-kawaii-primary' : 'btn-kawaii-secondary'
                          }`}
                        >
                          {pkg.ctaLabel || 'Pilih Paket Ini'}
                        </Link>
                      </div>
                    </div>
                  )
                })
              : // Default Pricing Cards Fallback
                [
                  {
                    title: 'Starter Gratis',
                    price: 'Rp0',
                    desc: 'Untuk mencoba seluruh generator',
                    credits: '3 Kredit Gratis',
                    features: ['Akses 8 Generator AI', 'Export Teks & Print', 'Tanpa Kartu Kredit'],
                    highlight: false,
                  },
                  {
                    title: 'Paket Hemat Guru',
                    price: 'Rp19.000',
                    desc: 'Untuk kebutuhan 1-2 minggu mengajar',
                    credits: '10 Kredit AI',
                    features: [
                      'Akses Semua Fitur',
                      'Modul Ajar & Soal HOTS',
                      'Export Word & PDF',
                      'Masa Aktif Selamanya',
                    ],
                    highlight: false,
                  },
                  {
                    title: 'Paket Semesteran',
                    price: 'Rp49.000',
                    desc: 'Pilihan favorit guru se-Indonesia',
                    credits: '30 Kredit AI',
                    features: [
                      'Akses Semua Fitur',
                      'Generator Narasi Rapor',
                      'Katrol Nilai Smart',
                      'Prioritas Dukungan WA',
                    ],
                    highlight: true,
                  },
                  {
                    title: 'Paket Sekolah',
                    price: 'Rp99.000',
                    desc: 'Untuk guru aktif & administrasi penuh',
                    credits: '75 Kredit AI',
                    features: [
                      'Akses Semua Fitur',
                      'Kredit Bisa Dibagi',
                      'Bebas Generate Kapan Saja',
                      'Prioritas Kecepatan Server',
                    ],
                    highlight: false,
                  },
                ].map((tier) => (
                  <div
                    key={tier.title}
                    className={`bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black p-6 flex flex-col justify-between relative transition-all ${
                      tier.highlight
                        ? 'shadow-[6px_6px_0px_#000000] ring-4 ring-emerald-300 dark:ring-emerald-500'
                        : 'shadow-[4px_4px_0px_#000000]'
                    }`}
                  >
                    {tier.highlight && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-300 text-neutral-950 border-2 border-black text-center text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] whitespace-nowrap">
                        Paling Populer
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-black text-lg text-neutral-950 dark:text-white">
                          {tier.title}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                          {tier.desc}
                        </p>
                      </div>

                      <div className="py-2">
                        <span className="text-3xl font-black text-neutral-950 dark:text-white">
                          {tier.price}
                        </span>
                      </div>

                      <div className="space-y-2 pt-2 border-t-2 border-neutral-100 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" /> {tier.credits}
                        </div>
                        {tier.features.map((feat) => (
                          <div key={feat} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6">
                      <Link
                        href="/signup"
                        className={`w-full text-center text-xs py-3 block ${
                          tier.highlight ? 'btn-kawaii-primary' : 'btn-kawaii-secondary'
                        }`}
                      >
                        Pilih Paket
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="badge-kawaii-blue text-xs font-black">TANYA JAWAB</span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium">
              Semua informasi yang perlu Anda ketahui sebelum menggunakan SiapAjar.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-amber-300 dark:bg-emerald-950 border-t-2 border-black">
        <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black shadow-[6px_6px_0px_#000000] p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex p-3 bg-emerald-200 text-neutral-950 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000000]">
            <Sparkles className="w-8 h-8 text-emerald-950" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white max-w-xl mx-auto leading-tight">
            Siap Menghemat Waktu Administrasi Anda Hari Ini?
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-lg mx-auto font-medium">
            Bergabunglah dengan ribuan guru di seluruh Indonesia yang telah menyelesaikan dokumen
            modul ajar dan evaluasi lebih cepat dan mudah.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="btn-kawaii-primary text-sm sm:text-base py-3.5 px-8 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" />
              Daftar Sekarang (Gratis 3 Kredit)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-300 border-2 border-white shadow-[2px_2px_0px_#ffffff] flex items-center justify-center font-black text-neutral-950 text-base">
                <Sparkles className="w-4 h-4 text-emerald-950" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">SiapAjar AI</span>
            </div>
            <p className="text-xs text-neutral-400 font-medium max-w-sm leading-relaxed">
              Platform generator dokumen pembelajaran dan administrasi guru otomatis berbasis
              Kurikulum Merdeka. Dibuat dengan dedikasi untuk memajukan pendidikan Indonesia.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-emerald-400">
              Generator AI
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <Link href="/app/express/modul-ajar" className="hover:text-white transition-colors">
                  Modul Ajar & RPP
                </Link>
              </li>
              <li>
                <Link href="/app/express/soal" className="hover:text-white transition-colors">
                  Soal & Evaluasi HOTS
                </Link>
              </li>
              <li>
                <Link href="/app/express/lkpd" className="hover:text-white transition-colors">
                  Lembar LKPD Tematik
                </Link>
              </li>
              <li>
                <Link href="/app/express/katrol" className="hover:text-white transition-colors">
                  Katrol Nilai Smart
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-emerald-400">
              Navigasi
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Masuk ke Akun
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Daftar Akun Baru
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-medium">
          <p>© {new Date().getFullYear()} SiapAjar. Hak Cipta Dilindungi.</p>
          <p>Membantu guru Indonesia lebih siap mengajar dan siap administrasi 🇮🇩</p>
        </div>
      </footer>
    </div>
  )
}
