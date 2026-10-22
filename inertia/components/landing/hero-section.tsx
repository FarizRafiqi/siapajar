import { Link } from '@inertiajs/react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { BookOpen, ArrowRight, Zap, Check } from 'lucide-react'
import { Magnetic, TiltCard, WordReveal } from '~/components/landing/motion-primitives'
import { InteractiveWindowMockup } from '~/components/landing/window-mockup'

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center pt-24 pb-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <HeroBackdrop />
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
          <WordReveal
            text="Modul Ajar & Administrasi Guru Lengkap dalam 3 Menit!"
            delay={0.1}
            className="text-3xl sm:text-4xl md:text-5xl xl:text-5.5xl font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.15]"
          />

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
            <Magnetic className="w-full sm:w-auto">
              <Link
                href="/signup"
                className="btn-kawaii-primary text-sm sm:text-base py-3.5 px-7 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span>Mulai Buat Gratis Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Magnetic>
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
          <TiltCard className="flex w-full justify-center">
            <InteractiveWindowMockup />
          </TiltCard>
        </motion.div>
      </div>
    </section>
  )
}

/** Dekorasi latar: titik-titik + blob emerald/amber yang melayang pelan + parallax scroll. */
function HeroBackdrop() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const slow = useTransform(scrollY, [0, 600], [0, 80])
  const fast = useTransform(scrollY, [0, 600], [0, -60])
  const drift = (dur: number) =>
    reduceMotion
      ? undefined
      : {
          x: [0, 24, -16, 0],
          y: [0, -20, 14, 0],
          transition: { duration: dur, repeat: Infinity, ease: 'easeInOut' as const },
        }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.12] dark:opacity-[0.08] [background-image:radial-gradient(#000_1.2px,transparent_1.2px)] dark:[background-image:radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <motion.div style={{ y: slow }} className="absolute -top-24 -left-24">
        <motion.div
          animate={drift(18)}
          className="h-72 w-72 rounded-full bg-emerald-300/50 blur-3xl dark:bg-emerald-600/25"
        />
      </motion.div>
      <motion.div style={{ y: fast }} className="absolute top-1/3 -right-24">
        <motion.div
          animate={drift(22)}
          className="h-80 w-80 rounded-full bg-amber-300/50 blur-3xl dark:bg-amber-500/20"
        />
      </motion.div>
    </div>
  )
}
