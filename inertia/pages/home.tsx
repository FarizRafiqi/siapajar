import { Head, Link } from '@inertiajs/react'
import { Button } from '@heroui/react/button'
import { Chip } from '@heroui/react/chip'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  Target,
  FileText,
  BarChart3,
  Trophy,
  Link2,
  Shuffle,
  BookOpen,
  Settings,
  Quote,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { TextGenerateEffect } from '~/components/ui/text-generate-effect'
import { SpotlightCard } from '~/components/ui/spotlight-card'
import { InfiniteMovingCards } from '~/components/ui/infinite-moving-cards'
import { AnimatedNumber } from '~/components/ui/animated-number'
import { Accordion } from '~/components/ui/accordion'
import { AuroraBackground } from '~/components/ui/aurora-background'
import { MagicButton } from '~/components/ui/magic-button'
import { TracingBeam } from '~/components/ui/tracing-beam'
import { ThemeToggle } from '~/components/ui/theme-toggle'

const features = [
  {
    icon: ClipboardList,
    title: 'Perencanaan',
    description: 'Prota, Promes, ATP otomatis sesuai Kurikulum Merdeka. Semua saling sinkron dari satu data kelas.',
    gradient: 'from-emerald-500 to-teal-500',
    lightBg: 'from-emerald-50 to-teal-50',
    darkBg: 'from-emerald-900/30 to-teal-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Target,
    title: 'Modul Ajar',
    description: 'Generate RPP/Modul Ajar sesuai Kurikulum Merdeka dengan AI hanya dalam 2 menit.',
    gradient: 'from-blue-500 to-indigo-500',
    lightBg: 'from-blue-50 to-indigo-50',
    darkBg: 'from-blue-900/30 to-indigo-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: FileText,
    title: 'Soal & Penilaian',
    description: 'Buat soal PTS/PAS/PAT lengkap dengan kunci jawaban dan rubrik penilaian otomatis.',
    gradient: 'from-purple-500 to-violet-500',
    lightBg: 'from-purple-50 to-violet-50',
    darkBg: 'from-purple-900/30 to-violet-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: BarChart3,
    title: 'Rapor Narasi',
    description: 'Narasi rapor personal per siswa — AI tulis deskripsi unik untuk setiap anak.',
    gradient: 'from-amber-500 to-orange-500',
    lightBg: 'from-amber-50 to-orange-50',
    darkBg: 'from-amber-900/30 to-orange-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: Trophy,
    title: 'Peringkat & Sertifikat',
    description: 'Ranking siswa otomatis + generate sertifikat prestasi siap cetak dalam satu klik.',
    gradient: 'from-rose-500 to-pink-500',
    lightBg: 'from-rose-50 to-pink-50',
    darkBg: 'from-rose-900/30 to-pink-900/30',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    icon: Link2,
    title: 'Integrasi RPT & Dapodik',
    description: 'Sinkronisasi otomatis ke RPT Digital & Dapodik — tidak perlu input data dua kali lagi.',
    gradient: 'from-cyan-500 to-sky-500',
    lightBg: 'from-cyan-50 to-sky-50',
    darkBg: 'from-cyan-900/30 to-sky-900/30',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
]

const steps = [
  {
    step: '1',
    title: 'Daftar & Isi Data Kelas',
    description: 'Buat akun gratis, masukkan data kelas dan mata pelajaran Anda',
  },
  {
    step: '2',
    title: 'Pilih Dokumen → Generate dengan AI',
    description: 'Pilih dokumen yang dibutuhkan, biarkan AI membuatkan untuk Anda',
  },
  {
    step: '3',
    title: 'Edit, Export, Kirim — selesai!',
    description: 'Sunting jika perlu, export ke PDF/DOCX, kirim ke orang tua via WhatsApp',
  },
]

const pricing = [
  {
    name: 'Free',
    price: 'Gratis',
    period: '',
    features: ['1 kelas', '5 dokumen/bulan', 'Modul Ajar dasar', 'Export PDF'],
    cta: 'Mulai Gratis',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: 'Rp25.000',
    period: '/bulan',
    features: [
      '3 kelas',
      '30 dokumen/bulan',
      'Semua fitur AI',
      'Export PDF & DOCX',
      'Rapor narasi',
    ],
    cta: 'Pilih Basic',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'Rp45.000',
    period: '/bulan',
    features: [
      '10 kelas',
      'Unlimited dokumen',
      'Semua fitur AI',
      'Export PDF & DOCX',
      'Rapor narasi',
      'Peringkat & sertifikat',
      'Integrasi RPT Digital',
      'Priority support',
    ],
    cta: 'Pilih Pro',
    highlighted: true,
  },
  {
    name: 'Sekolah',
    price: 'Rp300.000',
    period: '/bulan',
    features: [
      'Unlimited kelas',
      'Unlimited dokumen',
      'Semua fitur Pro',
      'Dashboard Kepala Sekolah',
      'Multi-guru (10 akun)',
      'Laporan administrasi',
      'Dedicated support',
    ],
    cta: 'Hubungi Kami',
    highlighted: false,
  },
]

const testimonials = [
  {
    name: 'Bu Rina',
    role: 'Guru TK B',
    quote: 'Rapor narasi yang dulu makan waktu 2 minggu, sekarang selesai dalam 2 jam!',
    avatarGradient: 'from-emerald-400 to-teal-500',
    rating: 5,
  },
  {
    name: 'Pak Budi',
    role: 'Wali Kelas 3 SD',
    quote: 'Semua dokumen admin dari Prota sampai rapor ada di satu tempat. Sangat membantu!',
    avatarGradient: 'from-blue-400 to-indigo-500',
    rating: 5,
  },
  {
    name: 'Pak Hendra',
    role: 'Kepala Sekolah SD',
    quote: 'Bisa pantau kelengkapan administrasi semua guru dari dashboard. Luar biasa!',
    avatarGradient: 'from-amber-400 to-orange-500',
    rating: 5,
  },
  {
    name: 'Bu Dewi',
    role: 'Guru Kelas 5 SD',
    quote: 'Soal PTS dengan kunci jawaban selesai dalam 15 menit. Dulu butuh 2 hari!',
    avatarGradient: 'from-rose-400 to-pink-500',
    rating: 5,
  },
  {
    name: 'Pak Andi',
    role: 'Guru SMP Negeri',
    quote: 'Integrasi ke RPT Digital langsung, tidak perlu input ulang. Luar biasa efisien!',
    avatarGradient: 'from-purple-400 to-violet-500',
    rating: 5,
  },
]

const faqs = [
  {
    question: 'Apakah SiapAjar sesuai dengan Kurikulum Merdeka?',
    answer:
      'Ya, SiapAjar dirancang khusus untuk Kurikulum Merdeka dengan istilah CP, ATP, TP, KKTP, dan format modul ajar terbaru.',
  },
  {
    question: 'Bagaimana cara kerja AI di SiapAjar?',
    answer:
      'AI kami dilatih khusus untuk dokumen administrasi guru. Cukup input data kelas dan mapel, AI akan generate dokumen sesuai format Kurikulum Merdeka.',
  },
  {
    question: 'Apakah data saya aman?',
    answer:
      'Ya, kami menggunakan enkripsi SSL dan tidak membagikan data Anda ke pihak ketiga. Data tersimpan di server Indonesia.',
  },
  {
    question: 'Bisa export ke format apa saja?',
    answer:
      'PDF dan DOCX (Microsoft Word). Anda bisa langsung mencetak atau mengirim ke WhatsApp orang tua.',
  },
  {
    question: 'Apakah ada versi trial?',
    answer:
      'Ya, akun gratis tersedia dengan 1 kelas dan 5 dokumen/bulan. Upgrade kapan saja tanpa kartu kredit.',
  },
]

// Decorative Ornaments
interface FloatingOrnamentProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly delay?: number
  readonly duration?: number
  readonly yRange?: number[]
  readonly xRange?: number[]
}

function FloatingOrnament({
  children,
  className = '',
  delay = 0,
  duration = 6,
  yRange = [0, -15, 0],
  xRange = [0, 10, 0]
}: FloatingOrnamentProps) {
  return (
    <motion.div
      animate={{
        y: yRange,
        x: xRange,
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay: delay,
      }}
      className={`absolute pointer-events-none opacity-20 dark:opacity-10 z-0 ${className}`}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  )
}

const BookOrnament = () => (
  <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

const PencilOrnament = () => (
  <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
)

const LightbulbOrnament = () => (
  <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .4 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="10" y1="22" x2="14" y2="22" />
  </svg>
)

const SparkleOrnament = () => (
  <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M8.757 15.243l-2.121 2.121m0-10.607l2.121 2.121m6.364 6.364l2.121 2.121" />
  </svg>
)

const CapOrnament = () => (
  <svg className="w-10 h-10 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
)

// Floating Navbar
function FloatingNav() {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (current) => {
    const diff = current - (scrollY.getPrevious() ?? 0)
    setScrolled(current > 50)
    if (current < 50) {
      setVisible(true)
      return
    }
    setVisible(diff < 0)
  })

  const navLinks = [
    { href: '#features', label: 'Fitur' },
    { href: '#pricing', label: 'Harga' },
    { href: '#faq', label: 'FAQ' },
  ]

  return (
    <motion.nav
      animate={{ y: visible ? 0 : -100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-sm border-b border-gray-100 dark:border-gray-800'
          : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">SA</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              SiapAjar
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden md:flex items-center gap-6"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" className="bg-emerald-600 text-white hover:bg-emerald-700">Mulai Gratis</Button>
            </Link>
          </motion.div>

          {/* Mobile: Theme + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-3 flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full">Login</Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full bg-emerald-600 text-white hover:bg-emerald-700">Mulai Gratis</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default function Home() {
  return (
    <>
      <Head title="SiapAjar — Siap Mengajar, Siap Administrasi">
        <meta
          name="description"
          content="Platform all-in-one administrasi guru Kurikulum Merdeka. Buat Prota, Modul Ajar, Soal, Rapor — semua otomatis dari satu tempat."
        />
      </Head>

      <FloatingNav />

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-gray-950 dark:to-gray-900 bg-dot-grid-lg relative overflow-hidden">
        {/* Background glowing blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-400/20 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-400/10 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Ornaments */}
        <FloatingOrnament className="top-12 left-10" delay={0}>
          <BookOrnament />
        </FloatingOrnament>
        <FloatingOrnament className="bottom-16 left-1/4" delay={1.5} duration={5} yRange={[0, 12, 0]}>
          <PencilOrnament />
        </FloatingOrnament>
        <FloatingOrnament className="top-24 right-1/3" delay={0.8} duration={7}>
          <LightbulbOrnament />
        </FloatingOrnament>
        <FloatingOrnament className="bottom-24 right-10" delay={2} duration={5.5}>
          <CapOrnament />
        </FloatingOrnament>
        <FloatingOrnament className="top-1/2 left-[5%]" delay={2.5} duration={4}>
          <SparkleOrnament />
        </FloatingOrnament>

        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
          <div className="md:col-span-7 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Chip color="accent" variant="soft" className="mb-4">
                Platform #1 untuk Guru Indonesia
              </Chip>
            </motion.div>

            <TextGenerateEffect
              words="Satu Platform, Semua Administrasi"
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl"
            >
              Buat Prota, Modul Ajar, Soal, Rapor — semua otomatis dari satu tempat.
              Hemat waktu hingga 80%.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-start"
            >
              <Link href="/signup">
                <MagicButton>Mulai Gratis &rarr;</MagicButton>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 min-h-12 bg-white/80 dark:bg-gray-800/60 dark:border-gray-600 dark:text-gray-200 backdrop-blur-sm">
                Lihat Demo
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="text-sm text-gray-500 dark:text-gray-400 mt-4 flex items-center gap-4 flex-wrap"
            >
              <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Gratis untuk 1 kelas</span>
              <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Tanpa kartu kredit</span>
              <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Setup 2 menit</span>
            </motion.p>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
              className="relative w-full max-w-md"
            >
              {/* Backglow panel */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-3xl blur-2xl opacity-30 dark:opacity-20 animate-pulse" />
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-3xl p-4 shadow-2xl"
              >
                <img
                  src="/images/hero_illustration.png"
                  alt="SiapAjar AI Teacher Assistant"
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar (Social Proof) */}
      <section className="py-8 px-4 bg-white dark:bg-gray-900/80 dark:backdrop-blur border-y border-gray-100 dark:border-gray-800/60">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center"
          >
            {[
              { value: 10000, suffix: '+', label: 'Guru Aktif', decimals: 0 },
              { value: 500000, suffix: '+', label: 'Dokumen Dibuat', decimals: 0 },
              { value: 80, suffix: '%', label: 'Hemat Waktu Admin', decimals: 0 },
              { value: 4.9, suffix: '★', label: 'Rating Pengguna', decimals: 1 },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                  <AnimatedNumber
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-950 bg-dot-grid relative overflow-hidden">
        {/* Decorative Ornaments */}
        <FloatingOrnament className="top-16 left-[8%]" delay={0.5} duration={6.5}>
          <SparkleOrnament />
        </FloatingOrnament>
        <FloatingOrnament className="bottom-12 right-[12%]" delay={1.2} duration={5.8}>
          <BookOrnament />
        </FloatingOrnament>
        <FloatingOrnament className="top-1/3 right-[5%]" delay={2} duration={7.2}>
          <PencilOrnament />
        </FloatingOrnament>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Chip color="danger" variant="soft" className="mb-4">
              Masalah Nyata
            </Chip>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Guru Menghabiskan{' '}
              <AnimatedNumber value={40} suffix="–" className="text-red-500" />
              <AnimatedNumber value={60} suffix="% " className="text-red-500" />
              Waktu untuk Administrasi
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Bukan fokus mengajar atau berinovasi. Tetapi terjebak menulis dokumen yang sama
              berulang-ulang secara manual setiap semester.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Left: Stressed teacher illustration */}
            <div className="md:col-span-5 flex justify-center order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-sm"
              >
                <div className="absolute -inset-1 bg-red-500/10 rounded-3xl blur-2xl pointer-events-none" />
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-4 shadow-xl">
                  <img
                    src="/images/problem_illustration.png"
                    alt="Guru stress karena administrasi manual"
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                  <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3 italic">
                    Administrasi konvensional yang menyita waktu & tenaga
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Explanatory problem cards */}
            <div className="md:col-span-7 space-y-6 order-1 md:order-2">
              <div className="grid sm:grid-cols-1 gap-6">
                {[
                  { icon: Shuffle, title: 'Fragmentasi Tools', desc: 'Modul ajar di platform A, soal di platform B, rapor di aplikasi desktop C. Tidak saling terintegrasi.' },
                  { icon: BookOpen, title: 'Kurva Belajar KM yang Tinggi', desc: 'Istilah CP, ATP, TP, KKTP masih baru dan membingungkan bagi banyak guru.' },
                  { icon: Settings, title: 'Tidak Ada Otomatisasi', desc: 'Prota, Promes, ATP disusun manual dari nol dengan copy-paste berulang kali setiap tahun.' },
                ].map((problem, idx) => (
                  <motion.div
                    key={problem.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                  >
                    <SpotlightCard className="h-full">
                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-950/50 rounded-xl flex items-center justify-center">
                          <problem.icon className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{problem.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{problem.desc}</p>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-center mt-12"
          >
            <Chip color="accent" variant="primary" size="lg" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
              SiapAjar selesaikan semua kerumitan ini dalam satu platform
            </Chip>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-16 px-4 bg-white dark:bg-gray-950 bg-dot-grid">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Chip color="success" variant="soft" className="mb-4">
              Fitur Utama
            </Chip>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Dari perencanaan hingga rapor, semua tersedia dalam satu platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <SpotlightCard className="h-full">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.lightBg} dark:${feature.darkBg} flex items-center justify-center shadow-sm`}>
                      <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-slate-950 bg-dot-grid">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Chip color="warning" variant="soft" className="mb-4">
              Cara Kerja
            </Chip>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              3 Langkah Sederhana
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Mulai dari nol hingga dokumen jadi dalam hitungan menit
            </p>
          </motion.div>

          <TracingBeam>
            <div className="space-y-12">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.5 }}
                >
                  <SpotlightCard>
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </TracingBeam>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950 bg-dot-grid">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Chip color="default" variant="soft" className="mb-4">
              Testimoni
            </Chip>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Apa Kata Guru?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Dipercaya oleh ribuan guru di seluruh Indonesia
            </p>
          </motion.div>

          <InfiniteMovingCards
            items={testimonials.map((t) => ({
              content: (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <Quote className="w-8 h-8 text-emerald-200 dark:text-emerald-800" />
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <span key={`star-${String(i)}`} className="text-amber-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic mb-5 flex-1 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${t.avatarGradient} text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm`}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ),
            }))}
            speed="slow"
            className="py-4"
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-4 bg-gray-50 dark:bg-slate-950 bg-dot-grid">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Chip color="success" variant="soft" className="mb-4">
              Harga
            </Chip>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pilih Paket yang Tepat
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Mulai gratis, upgrade kapan saja</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricing.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <div
                  className={`relative rounded-2xl overflow-hidden h-full flex flex-col ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-2xl shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="flex items-center justify-center gap-1.5 py-2.5 text-emerald-100 text-sm font-semibold bg-emerald-700/50">
                      <span>🔥</span>
                      <span>Terpopuler</span>
                    </div>
                  )}
                  <div className="p-6 text-center flex flex-col flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${
                      plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>{plan.name}</h3>
                    <div className="mb-5">
                      <span className={`text-4xl font-black ${
                        plan.highlighted ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>{plan.price}</span>
                      {plan.period && (
                        <span className={plan.highlighted ? 'text-emerald-200' : 'text-gray-500 dark:text-gray-400'}>
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <ul className="text-left space-y-2.5 mb-6 flex-1">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className={`flex items-center gap-2 text-sm ${
                            plan.highlighted ? 'text-emerald-100' : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <span className={`font-bold text-base flex-shrink-0 ${
                            plan.highlighted ? 'text-emerald-300' : 'text-emerald-500'
                          }`}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup">
                      <Button
                        variant={plan.highlighted ? 'primary' : 'outline'}
                        className={`w-full font-bold ${
                          plan.highlighted
                            ? 'bg-white text-emerald-700 hover:bg-emerald-50 border-0'
                            : ''
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-4 bg-white dark:bg-gray-950 bg-dot-grid">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Chip color="default" variant="secondary" className="mb-4">
              FAQ
            </Chip>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pertanyaan Umum
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Accordion items={faqs} />
          </motion.div>
        </div>
      </section>

      {/* CTA Final with Aurora Background */}
      <AuroraBackground className="py-20 px-4 bg-emerald-600 dark:bg-emerald-800">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Mulai Gratis Sekarang
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-emerald-100 mb-8 text-lg"
          >
            Tidak perlu kartu kredit. Mulai buat dokumen admin dalam 2 menit.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link href="/signup">
              <Button variant="primary" size="lg" className="text-lg px-10 font-bold bg-white text-emerald-700 hover:bg-emerald-50">
                Mulai Gratis &rarr;
              </Button>
            </Link>
          </motion.div>
        </div>
      </AuroraBackground>

      {/* Footer */}
      <footer className="py-14 px-4 bg-gray-900 dark:bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-10 mb-10">
            {/* Brand Column */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-black text-sm">SA</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  SiapAjar
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4">Platform all-in-one administrasi guru Kurikulum Merdeka. Satu data, semua dokumen sinkron otomatis.</p>
              <p className="text-xs text-gray-500">Made with ❤️ for Guru Indonesia</p>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-2">
              <h4 className="font-bold text-white mb-4">Produk</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Fitur</a></li>
                <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Harga</a></li>
                <li><a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-bold text-white mb-4">Perusahaan</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/coming-soon" className="hover:text-emerald-400 transition-colors">Tentang Kami</a></li>
                <li><a href="/coming-soon" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="/coming-soon" className="hover:text-emerald-400 transition-colors">Karir</a></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/coming-soon" className="hover:text-emerald-400 transition-colors">Kebijakan Privasi</a></li>
                <li><a href="/coming-soon" className="hover:text-emerald-400 transition-colors">Syarat &amp; Ketentuan</a></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-bold text-white mb-4">Ikuti Kami</h4>
              <div className="flex flex-col gap-3">
                {/* Instagram */}
                <a href="/coming-soon" className="flex items-center gap-2 text-sm hover:text-emerald-400 transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-emerald-900/40 flex items-center justify-center transition-colors flex-shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </span>
                  <span>Instagram</span>
                </a>
                {/* WhatsApp */}
                <a href="/coming-soon" className="flex items-center gap-2 text-sm hover:text-emerald-400 transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-emerald-900/40 flex items-center justify-center transition-colors flex-shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </span>
                  <span>WhatsApp</span>
                </a>
                {/* TikTok */}
                <a href="/coming-soon" className="flex items-center gap-2 text-sm hover:text-emerald-400 transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-emerald-900/40 flex items-center justify-center transition-colors flex-shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </span>
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-500">© 2026 SiapAjar. All rights reserved.</p>
            <p className="text-xs text-gray-600">Platform Administrasi Guru #1 di Indonesia 🇮🇩</p>
          </div>
        </div>
      </footer>
    </>
  )
}
