import { Head, Link, usePage } from '@inertiajs/react'
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion'
import {
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
  LoaderCircle,
  Heart,
  Camera,
  MessageCircle,
  Music2,
} from 'lucide-react'
import { type ReactNode, useState, useEffect, useRef } from 'react'
import { ThemeToggle } from '~/components/ui/theme-toggle'
import { cn } from '~/lib/utils'

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
  return { price: `Rp${pkg.priceMonthly.toLocaleString('id-ID')}`, period: '' }
}

const expressTools = [
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
            <img
              src="/images/logo.png"
              alt="SiapAjar Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
                SiapAjar
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#tools"
              className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 transition-colors"
            >
              Generator AI
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
                <Link href="/signup" className="btn-kawaii-primary text-xs font-black py-2.5 px-5">
                  Daftar Gratis
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
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
              Generator AI
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
                    Daftar Gratis (3 Kredit)
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

interface TypewriterHeadingProps {
  readonly text: string
  readonly onComplete?: () => void
}

function TypewriterHeading({ text, onComplete }: TypewriterHeadingProps) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const reduceMotion = useReducedMotion()
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    setDisplayText('')
    setIsTyping(!reduceMotion)

    if (reduceMotion) {
      setDisplayText(text)
      return
    }

    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
        onCompleteRef.current?.()
      }
    }, 32)

    return () => clearInterval(interval)
  }, [text, reduceMotion])

  return (
    <h4 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white min-h-[1.75rem] flex items-center flex-wrap">
      <span>{displayText}</span>
      {isTyping && (
        <span className="inline-block w-2 h-4 sm:h-5 bg-emerald-600 dark:bg-emerald-400 ml-1 animate-pulse rounded-xs" />
      )}
    </h4>
  )
}

type PreviewPhase = 'typing' | 'loading' | 'ready'

const previewRevealVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.995,
    clipPath: 'inset(0 0 100% 0 round 1rem)',
    filter: 'blur(2px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    clipPath: 'inset(0 0 0% 0 round 1rem)',
    filter: 'blur(0px)',
  },
}

function AiLoadingState() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border-2 border-emerald-700/40 bg-emerald-50 p-3 dark:border-emerald-400/30 dark:bg-emerald-950/40"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-200">
        <LoaderCircle
          className={`h-4 w-4 shrink-0 ${reduceMotion ? '' : 'animate-spin'}`}
          aria-hidden="true"
        />
        <span>AI sedang menyusun</span>
        <span className="ml-auto flex gap-0.5" aria-hidden="true">
          <span
            className={`h-1 w-1 rounded-full bg-emerald-600 ${reduceMotion ? '' : 'animate-pulse [animation-delay:0ms]'}`}
          />
          <span
            className={`h-1 w-1 rounded-full bg-emerald-600 ${reduceMotion ? '' : 'animate-pulse [animation-delay:150ms]'}`}
          />
          <span
            className={`h-1 w-1 rounded-full bg-emerald-600 ${reduceMotion ? '' : 'animate-pulse [animation-delay:300ms]'}`}
          />
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full border border-emerald-700/30 bg-white/80 dark:border-emerald-300/30 dark:bg-emerald-950/70">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300"
        />
      </div>
    </motion.div>
  )
}

interface ScrollRevealProps {
  readonly children: ReactNode
  readonly className?: string
  readonly delay?: number
}

function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16, margin: '0px 0px -40px' }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}

const MOCKUP_TOOLS = [
  { key: 'modul', name: 'Modul Ajar RPPM', icon: BookOpen, tag: 'PAUD / TK B' },
  { key: 'lkpd', name: 'LKPD Siswa', icon: Layers, tag: 'Tematik' },
  { key: 'soal', name: 'Bank Soal HOTS', icon: FileCode, tag: 'Otomatis' },
  { key: 'rapor', name: 'Narasi Rapor AI', icon: FileText, tag: 'Autentik' },
]

function InteractiveWindowMockup() {
  const [activeTool, setActiveTool] = useState<'modul' | 'lkpd' | 'soal' | 'rapor'>('modul')
  const [previewPhase, setPreviewPhase] = useState<PreviewPhase>('typing')
  const [previewForTool, setPreviewForTool] = useState(activeTool)
  const reduceMotion = useReducedMotion()

  const tools = MOCKUP_TOOLS

  useEffect(() => {
    setPreviewForTool(activeTool)
    setPreviewPhase(reduceMotion ? 'ready' : 'typing')
  }, [activeTool, reduceMotion])

  useEffect(() => {
    if (previewPhase !== 'loading') return

    const timer = window.setTimeout(() => setPreviewPhase('ready'), 1300)
    return () => window.clearTimeout(timer)
  }, [previewPhase])

  const handleTypingComplete = () => {
    if (!reduceMotion) setPreviewPhase('loading')
  }
  const isPreviewReady = previewForTool === activeTool && previewPhase === 'ready'

  // Auto-loop typewriter preview every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTool((prev) => {
        const nextIndex = (MOCKUP_TOOLS.findIndex((t) => t.key === prev) + 1) % MOCKUP_TOOLS.length
        return MOCKUP_TOOLS[nextIndex].key as 'modul' | 'lkpd' | 'soal' | 'rapor'
      })
    }, 7000)

    return () => clearInterval(timer)
  }, [])

  const toolPathMap: Record<string, string> = {
    modul: 'modul-ajar',
    lkpd: 'lkpd',
    soal: 'soal',
    rapor: 'rapor',
  }
  const activeToolPath = toolPathMap[activeTool] ?? 'modul-ajar'

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Decorative floating badges */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-6 -right-2 sm:-right-4 z-20 badge-kawaii-amber shadow-[3px_3px_0px_#000000] text-xs px-3.5 py-1.5 font-black flex items-center gap-1.5"
      >
        <Zap className="w-4 h-4 text-amber-700" /> Selesai dalam 45 Detik!
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-5 -left-2 sm:-left-4 z-20 badge-kawaii-emerald shadow-[3px_3px_0px_#000000] text-xs px-3.5 py-1.5 font-black flex items-center gap-1.5"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Standar BSKAP & Kemenag
      </motion.div>

      {/* Main Window Frame */}
      <div className="rounded-3xl border-2 border-black bg-white dark:bg-neutral-900 shadow-[8px_8px_0px_#000000] overflow-hidden">
        {/* Window Titlebar */}
        <div className="bg-[#047857] dark:bg-[#064e3b] border-b-2 border-black px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-400 border border-black inline-block" />
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-black inline-block" />
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-black inline-block" />
          </div>

          <div className="flex-1 max-w-xs bg-emerald-950/60 border border-emerald-700/60 rounded-xl px-3 py-1 text-[11px] font-mono text-emerald-200 truncate text-center">
            {`app.siapajar.id/${activeToolPath}`}
          </div>

          <div className="text-[10px] font-black text-neutral-950 px-2 py-0.5 bg-amber-300 rounded border border-black">
            DASHBOARD GURU
          </div>
        </div>

        {/* Dashboard Grid Layout (Left Mini Sidebar + Main Content) */}
        <div className="grid grid-cols-12 min-h-[360px]">
          {/* Mini Sidebar on Left */}
          <div className="col-span-4 sm:col-span-3 border-r-2 border-black bg-[#047857] dark:bg-[#064e3b] p-2.5 sm:p-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-200/90 px-2 py-1">
                Alat Cepat
              </p>
              {tools.map((t) => {
                const Icon = t.icon
                const isSelected = activeTool === t.key
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTool(t.key as any)}
                    className={cn(
                      'w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer',
                      isSelected
                        ? 'bg-amber-300 font-black text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000]'
                        : 'font-semibold text-emerald-100/90 hover:bg-emerald-600 hover:text-white'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0',
                        isSelected ? 'text-neutral-950' : 'text-emerald-300'
                      )}
                    />
                    <span className="truncate hidden sm:inline">{t.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Bottom Credits in Sidebar */}
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-center">
              <span className="text-[10px] font-black text-amber-300 block">3 Kredit Aktif</span>
              <span className="text-[9px] text-emerald-200 font-medium">Siap Digunakan</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-8 sm:col-span-9 p-4 sm:p-6 bg-[#FAF7F2] dark:bg-neutral-900 text-left flex flex-col justify-between overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTool === 'modul' && (
                <motion.div
                  key="modul"
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="badge-kawaii-emerald text-[11px] font-black">
                      Fase Fondasi • TK B (5-6 Tahun) • 1 Pekan
                    </span>
                    <span className="badge-kawaii-amber text-[10px] font-black">
                      ✓ Selesai Terarsip
                    </span>
                  </div>
                  <TypewriterHeading
                    text="MODUL AJAR: Tanaman Sayur Ciptaan Allah"
                    onComplete={handleTypingComplete}
                  />
                  <AnimatePresence mode="wait" initial={false}>
                    {previewPhase === 'loading' && <AiLoadingState key="ai-loading-modul" />}
                  </AnimatePresence>
                  <motion.div
                    initial={reduceMotion ? false : 'hidden'}
                    animate={isPreviewReady ? 'visible' : 'hidden'}
                    variants={previewRevealVariants}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.72, delay: 0.04, ease: [0.22, 1, 0.36, 1] }
                    }
                    aria-hidden={!isPreviewReady}
                    className="bg-white dark:bg-neutral-950 p-3.5 rounded-2xl border-2 border-black text-xs space-y-2 text-neutral-700 dark:text-neutral-300 shadow-[2px_2px_0px_#000000]"
                  >
                    <p className="font-bold text-neutral-900 dark:text-white flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong>Tujuan Pembelajaran:</strong> Anak terbiasa bersyukur atas ragam
                        sayuran, mengenal warna dan tekstur wortel & bayam, serta mampu berkreasi
                        cap sayur.
                      </span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-300">
                        <span className="font-black text-[10px] text-emerald-800 dark:text-emerald-300 block uppercase">
                          Kegiatan Inti
                        </span>
                        <span className="text-[11px] font-medium">
                          Eksplorasi Mencuci & Mengupas Wortel
                        </span>
                      </div>
                      <div className="p-2 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-300">
                        <span className="font-black text-[10px] text-amber-800 dark:text-amber-300 block uppercase">
                          Asesmen Formatif
                        </span>
                        <span className="text-[11px] font-medium">
                          Catatan Anekdot & Rubrik Ceklis
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTool === 'lkpd' && (
                <motion.div
                  key="lkpd"
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="badge-kawaii-purple text-[11px] font-black">
                      LKPD Tematik • Mode Siap Cetak
                    </span>
                    <span className="badge-kawaii-amber text-[10px] font-black">
                      Format Standar A4
                    </span>
                  </div>
                  <TypewriterHeading
                    text="LKPD: Menghitung & Mengelompokkan Buah"
                    onComplete={handleTypingComplete}
                  />
                  <AnimatePresence mode="wait" initial={false}>
                    {previewPhase === 'loading' && <AiLoadingState key="ai-loading-lkpd" />}
                  </AnimatePresence>
                  <motion.div
                    initial={reduceMotion ? false : 'hidden'}
                    animate={isPreviewReady ? 'visible' : 'hidden'}
                    variants={previewRevealVariants}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.72, delay: 0.04, ease: [0.22, 1, 0.36, 1] }
                    }
                    aria-hidden={!isPreviewReady}
                    className="bg-white dark:bg-neutral-950 p-3 rounded-2xl border-2 border-black text-xs space-y-2 shadow-[2px_2px_0px_#000000]"
                  >
                    <p className="font-bold text-neutral-900 dark:text-white">
                      Instruksi Mandiri Siswa:
                    </p>
                    <p className="text-[11px] text-neutral-700 dark:text-neutral-300">
                      1. Hubungkan gambar buah apel dengan angka 5 di sebelah kanan!
                    </p>
                    <p className="text-[11px] text-neutral-700 dark:text-neutral-300">
                      2. Warnai buah jeruk dengan warna oranye yang rapi dan bersih.
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {activeTool === 'soal' && (
                <motion.div
                  key="soal"
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="badge-kawaii-blue text-[11px] font-black">
                      Sumatif Tengah Semester • 10 Butir HOTS
                    </span>
                    <span className="badge-kawaii-emerald text-[10px] font-black">
                      Kunci & Rubrik Siap
                    </span>
                  </div>
                  <TypewriterHeading
                    text="EVALUASI: Matematika & Pengukuran"
                    onComplete={handleTypingComplete}
                  />
                  <AnimatePresence mode="wait" initial={false}>
                    {previewPhase === 'loading' && <AiLoadingState key="ai-loading-soal" />}
                  </AnimatePresence>
                  <motion.div
                    initial={reduceMotion ? false : 'hidden'}
                    animate={isPreviewReady ? 'visible' : 'hidden'}
                    variants={previewRevealVariants}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.72, delay: 0.04, ease: [0.22, 1, 0.36, 1] }
                    }
                    aria-hidden={!isPreviewReady}
                    className="bg-white dark:bg-neutral-950 p-3 rounded-2xl border-2 border-black text-xs space-y-2 shadow-[2px_2px_0px_#000000]"
                  >
                    <p className="font-bold text-neutral-900 dark:text-white">
                      1. Panjang pita merah 2,5 meter dan pita biru 175 cm. Jumlah panjang kedua
                      pita adalah...
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <span className="p-1.5 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200">
                        A. 325 cm
                      </span>
                      <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 rounded-lg border border-emerald-500 font-bold text-emerald-800 dark:text-emerald-300">
                        B. 425 cm (Kunci: B)
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTool === 'rapor' && (
                <motion.div
                  key="rapor"
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="badge-kawaii-rose text-[11px] font-black">
                      Narasi Rapor Otomatis • Semester 1
                    </span>
                    <span className="badge-kawaii-amber text-[10px] font-black">
                      Bahasa Positif
                    </span>
                  </div>
                  <TypewriterHeading
                    text="RAPOR: Deskripsi Capaian Pembelajaran Siswa"
                    onComplete={handleTypingComplete}
                  />
                  <AnimatePresence mode="wait" initial={false}>
                    {previewPhase === 'loading' && <AiLoadingState key="ai-loading-rapor" />}
                  </AnimatePresence>
                  <motion.div
                    initial={reduceMotion ? false : 'hidden'}
                    animate={isPreviewReady ? 'visible' : 'hidden'}
                    variants={previewRevealVariants}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.72, delay: 0.04, ease: [0.22, 1, 0.36, 1] }
                    }
                    aria-hidden={!isPreviewReady}
                    className="bg-white dark:bg-neutral-950 p-3.5 rounded-2xl border-2 border-black text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 shadow-[2px_2px_0px_#000000]"
                  >
                    &ldquo;Ananda menunjukkan antusiasme tinggi dalam mengenal konsep bilangan dan
                    sangat terampil saat kegiatan eksperimen kelompok. Dalam hal ketelitian
                    pengerjaan mandiri, ananda terus menunjukkan perkembangan yang positif.&rdquo;
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Action Row inside Mockup */}
            <div className="pt-2 mt-4 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 text-[11px]">
              <span className="text-neutral-500 font-bold">✓ Siap salin & cetak Word/PDF</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-300 text-neutral-950 border-2 border-black font-black text-[11px] flex items-center gap-1 shadow-[1px_1px_0px_#000000]">
                  <Printer className="w-3.5 h-3.5" /> Download .DOCX
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FaqItem({ q, a }: Readonly<{ q: string; a: string }>) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000000] overflow-hidden transition-all">
      <button
        type="button"
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
      <section className="min-h-screen flex items-center pt-24 pb-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
          {/* Left Column: Headline, Subtitle, CTAs & Badges */}
          <div className="lg:col-span-6 xl:col-span-6 text-center lg:text-left space-y-6">
            {/* Top Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-200 text-neutral-950 border-2 border-black shadow-[3px_3px_0px_#000000] text-xs sm:text-sm font-black"
            >
              <Zap className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Platform Administrasi Guru AI • Bonus 3 Kredit</span>
            </motion.div>

            {/* Main Hero Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl xl:text-5.5xl font-black tracking-tight text-neutral-950 dark:text-white leading-[1.15]"
            >
              Modul Ajar & Administrasi Guru Lengkap dalam 3 Menit!
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Susun Modul Ajar, Soal Evaluasi HOTS, LKPD, Jurnal Harian, Prota-Promes, dan Narasi
              Rapor Kurikulum Merdeka secara otomatis. Tanpa ribet, siap print & supervisi.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <Link
                href="/signup"
                className="btn-kawaii-primary text-sm sm:text-base py-3.5 px-7 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span>Mulai Buat Gratis Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#tools"
                className="btn-kawaii-secondary text-sm sm:text-base py-3.5 px-6 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <BookOpen className="w-4 h-4" />
                <span>Eksplorasi Fitur</span>
              </a>
            </motion.div>

            {/* Trust Value Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 pt-2"
            >
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 font-black shrink-0" /> Gratis 3 Kredit
                untuk Guru Baru
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 font-black shrink-0" /> Sesuai Standar
                BSKAP
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 font-black shrink-0" /> Export Word & PDF
              </span>
            </motion.div>
          </div>

          {/* Right Column: Interactive Kawaii Window Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-6 xl:col-span-6 flex justify-center"
          >
            <InteractiveWindowMockup />
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section
        id="tools"
        className="py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-black bg-white dark:bg-neutral-900"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <ScrollReveal className="text-center space-y-3">
            <span className="badge-kawaii-emerald text-xs font-black">ALAT PRAKTIS</span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white">
              Semua Kebutuhan Guru Dalam Satu Tempat
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium max-w-xl mx-auto">
              Hemat waktu berharga Anda hingga 90% dan fokuskan energi pada interaksi mendalam
              bersama peserta didik.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expressTools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <ScrollReveal key={tool.title} delay={index * 0.06} className="h-full">
                  <div className="h-full bg-[#FAF7F2] dark:bg-neutral-950 rounded-3xl border-2 border-black p-6 flex flex-col justify-between shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] hover:-translate-y-1 transition-all relative">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]',
                            tool.color
                          )}
                        >
                          <Icon className="w-6 h-6 shrink-0" />
                        </div>
                        {tool.tag && (
                          <span
                            className={cn(
                              'px-2.5 py-0.5 rounded-full border-2 border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]',
                              tool.tagColor
                            )}
                          >
                            {tool.tag}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="font-black text-lg text-neutral-950 dark:text-white">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                          {tool.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Link
                        href={tool.href}
                        className="text-xs font-black text-neutral-950 dark:text-white inline-flex items-center gap-1.5 hover:gap-2.5 transition-all group hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        <span>Coba Generator</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-black bg-[#FAF7F2] dark:bg-neutral-950"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <ScrollReveal className="text-center space-y-3">
            <span className="badge-kawaii-amber text-xs font-black">HARGA TERJANGKAU</span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white">
              Pilihan Paket Tanpa Komitmen Ribet
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium max-w-xl mx-auto">
              Pilih paket sesuai kebutuhan mengajar Anda. Mulai dari gratis hingga akses lengkap
              sekolah.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {packages && packages.length > 0
              ? packages.map((pkg, index) => {
                  const { price, period } = formatPackagePrice(pkg)
                  const isPopular = pkg.isHighlighted
                  return (
                    <ScrollReveal key={pkg.id} delay={index * 0.08} className="h-full">
                      <div
                        className={cn(
                          'h-full rounded-3xl border-2 border-black p-6 sm:p-7 flex flex-col justify-between relative transition-all',
                          isPopular
                            ? 'bg-[#047857] text-white shadow-[6px_6px_0px_#000000]'
                            : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-[4px_4px_0px_#000000]'
                        )}
                      >
                        {isPopular && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-300 text-neutral-950 border-2 border-black text-center text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] whitespace-nowrap">
                            Paling Populer
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <h3
                              className={cn(
                                'font-black text-xl',
                                isPopular ? 'text-white' : 'text-neutral-950 dark:text-white'
                              )}
                            >
                              {pkg.displayName}
                            </h3>
                            {pkg.description && (
                              <p
                                className={cn(
                                  'text-xs mt-1 font-medium',
                                  isPopular
                                    ? 'text-emerald-200/90'
                                    : 'text-neutral-500 dark:text-neutral-400'
                                )}
                              >
                                {pkg.description}
                              </p>
                            )}
                          </div>

                          <div className="py-2">
                            <span
                              className={cn(
                                'text-3.5xl font-black',
                                isPopular ? 'text-white' : 'text-neutral-950 dark:text-white'
                              )}
                            >
                              {price}
                            </span>
                            {period && (
                              <span
                                className={cn(
                                  'text-xs font-bold ml-1',
                                  isPopular ? 'text-emerald-200' : 'text-neutral-500'
                                )}
                              >
                                {period}
                              </span>
                            )}
                          </div>

                          <div
                            className={cn(
                              'space-y-2.5 pt-3 border-t-2 text-xs font-medium',
                              isPopular
                                ? 'border-emerald-700/60 text-emerald-100'
                                : 'border-neutral-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                            )}
                          >
                            {pkg.features.map((feat) => (
                              <div key={feat} className="flex items-center gap-2">
                                <CheckCircle2
                                  className={cn(
                                    'w-4 h-4 shrink-0',
                                    isPopular ? 'text-amber-300' : 'text-emerald-600'
                                  )}
                                />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-6">
                          <Link
                            href="/signup"
                            className={cn(
                              'w-full text-center text-xs font-black py-3 block rounded-2xl border-2 border-black transition-all shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5',
                              isPopular
                                ? 'bg-amber-300 hover:bg-amber-400 text-neutral-950'
                                : 'bg-white hover:bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                            )}
                          >
                            Pilih Paket Ini
                          </Link>
                        </div>
                      </div>
                    </ScrollReveal>
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
                ].map((tier, index) => (
                  <ScrollReveal key={tier.title} delay={index * 0.08} className="h-full">
                    <div
                      className={`h-full bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black p-6 flex flex-col justify-between relative transition-all ${
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
                          Pilih Paket Ini
                        </Link>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-10">
          <ScrollReveal className="text-center space-y-3">
            <span className="badge-kawaii-blue text-xs font-black">TANYA JAWAB</span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium">
              Semua informasi yang perlu Anda ketahui sebelum menggunakan SiapAjar.
            </p>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={faq.q} delay={index * 0.06}>
                <FaqItem q={faq.q} a={faq.a} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-amber-300 dark:bg-emerald-950 border-t-2 border-black">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black shadow-[6px_6px_0px_#000000] p-8 sm:p-12 text-center space-y-6">
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
                <span>Daftar Sekarang (Gratis 3 Kredit)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src="/images/logo.png" alt="SiapAjar Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-black tracking-tight text-white">SiapAjar</span>
            </div>
            <p className="text-xs text-neutral-400 font-medium max-w-sm leading-relaxed">
              Platform generator dokumen pembelajaran dan administrasi guru otomatis berbasis
              Kurikulum Merdeka. Dibuat dengan dedikasi untuk memajukan pendidikan Indonesia.
            </p>
            <p className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" aria-hidden="true" />
              <span>Made with love for Guru Indonesia</span>
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-emerald-400">
              Generator AI
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <Link href="/modul-ajar" className="hover:text-white transition-colors">
                  Modul Ajar & RPP
                </Link>
              </li>
              <li>
                <Link href="/soal" className="hover:text-white transition-colors">
                  Soal & Evaluasi HOTS
                </Link>
              </li>
              <li>
                <Link href="/lkpd" className="hover:text-white transition-colors">
                  Lembar LKPD Tematik
                </Link>
              </li>
              <li>
                <Link href="/katrol" className="hover:text-white transition-colors">
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

          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-emerald-400">
              Ikuti Kami
            </h4>
            <div className="flex flex-col gap-3 text-xs text-neutral-400 font-medium">
              <a
                href="/coming-soon"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors group"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 transition-colors group-hover:bg-emerald-900/40">
                  <Camera className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>Instagram</span>
              </a>
              <a
                href="/coming-soon"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors group"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 transition-colors group-hover:bg-emerald-900/40">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>WhatsApp</span>
              </a>
              <a
                href="/coming-soon"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors group"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 transition-colors group-hover:bg-emerald-900/40">
                  <Music2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>TikTok</span>
              </a>
            </div>
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
