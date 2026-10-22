import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  BookOpen,
  Layers,
  FileText,
  CheckCircle2,
  Zap,
  Check,
  Printer,
  FileCode,
  LoaderCircle,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '~/lib/utils'

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
        <span className="inline-block w-1 h-4 sm:h-5 bg-emerald-600 dark:bg-emerald-400 ml-1 animate-pulse rounded-xs" />
      )}
    </h4>
  )
}

type PreviewPhase = 'typing' | 'loading' | 'ready'

const AI_LOADING_DURATION_MS = 1800
const AI_LOADING_DURATION_S = 1.7

const previewRevealVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.998,
    clipPath: 'inset(0 0 100% 0 round 1rem)',
    filter: 'blur(1.5px)',
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
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: AI_LOADING_DURATION_S, ease: [0.22, 1, 0.36, 1] }
          }
          style={{ originX: 0 }}
          className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300"
        />
      </div>
    </motion.div>
  )
}

const MOCKUP_TOOLS = [
  { key: 'modul', name: 'Modul Ajar RPPM', icon: BookOpen, tag: 'PAUD / TK B' },
  { key: 'lkpd', name: 'LKPD Siswa', icon: Layers, tag: 'Tematik' },
  { key: 'soal', name: 'Bank Soal HOTS', icon: FileCode, tag: 'Otomatis' },
  { key: 'rapor', name: 'Narasi Rapor AI', icon: FileText, tag: 'Autentik' },
]

export function InteractiveWindowMockup() {
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

    const timer = window.setTimeout(() => setPreviewPhase('ready'), AI_LOADING_DURATION_MS)
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
                    className="relative"
                  >
                    <div className="bg-white dark:bg-neutral-950 p-3.5 rounded-2xl border-2 border-black text-xs space-y-2 text-neutral-700 dark:text-neutral-300 shadow-[2px_2px_0px_#000000]">
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
                    className="relative"
                  >
                    <div className="bg-white dark:bg-neutral-950 p-3 rounded-2xl border-2 border-black text-xs space-y-2 shadow-[2px_2px_0px_#000000]">
                      <p className="font-bold text-neutral-900 dark:text-white">
                        Instruksi Mandiri Siswa:
                      </p>
                      <p className="text-[11px] text-neutral-700 dark:text-neutral-300">
                        1. Hubungkan gambar buah apel dengan angka 5 di sebelah kanan!
                      </p>
                      <p className="text-[11px] text-neutral-700 dark:text-neutral-300">
                        2. Warnai buah jeruk dengan warna oranye yang rapi dan bersih.
                      </p>
                    </div>
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
                    className="relative"
                  >
                    <div className="bg-white dark:bg-neutral-950 p-3 rounded-2xl border-2 border-black text-xs space-y-2 shadow-[2px_2px_0px_#000000]">
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
                    className="relative"
                  >
                    <div className="bg-white dark:bg-neutral-950 p-3.5 rounded-2xl border-2 border-black text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 shadow-[2px_2px_0px_#000000]">
                      &ldquo;Ananda menunjukkan antusiasme tinggi dalam mengenal konsep bilangan dan
                      sangat terampil saat kegiatan eksperimen kelompok. Dalam hal ketelitian
                      pengerjaan mandiri, ananda terus menunjukkan perkembangan yang positif.&rdquo;
                    </div>
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
