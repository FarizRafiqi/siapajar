import { m, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Download, MousePointerClick, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import { Stagger, StaggerItem, ScrollReveal } from '~/components/landing/motion-primitives'

const steps = [
  {
    no: '01',
    title: 'Pilih Kelas & Topik',
    desc: 'Pilih jenis dokumen, jenjang, kelas, dan tema pembelajaran yang ingin Anda susun.',
    icon: MousePointerClick,
    color: 'bg-emerald-200',
  },
  {
    no: '02',
    title: 'AI Menyusun Dokumen',
    desc: 'AI menyusun dokumen lengkap mengikuti Kurikulum Merdeka dalam hitungan menit.',
    icon: Sparkles,
    color: 'bg-amber-200',
  },
  {
    no: '03',
    title: 'Export PDF / DOCX',
    desc: 'Unduh sebagai PDF atau Word, lalu cetak dan gunakan untuk supervisi.',
    icon: Download,
    color: 'bg-sky-200',
  },
]

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 24 })
  const line = reduceMotion ? 1 : progress

  return (
    <section
      id="cara-kerja"
      className="py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-black bg-[#FAF7F2] dark:bg-neutral-950"
    >
      <div className="max-w-6xl mx-auto space-y-14">
        <ScrollReveal className="text-center space-y-3">
          <span className="badge-kawaii-emerald text-xs font-semibold">CARA KERJA</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-950 dark:text-white">
            Tiga Langkah Menuju Dokumen Siap Pakai
          </h2>
        </ScrollReveal>

        <div ref={ref} className="relative">
          {/* Garis penghubung: horizontal (md+) / vertikal (mobile), tergambar saat scroll */}
          <div
            aria-hidden="true"
            className="absolute left-7 top-7 bottom-7 w-1 rounded-full bg-neutral-200 dark:bg-neutral-800 md:left-[16.66%] md:right-[16.66%] md:bottom-auto md:h-1 md:w-auto"
          >
            <m.div
              style={{ scaleY: line, transformOrigin: 'top' }}
              className="h-full w-full rounded-full bg-emerald-500 md:hidden"
            />
            <m.div
              style={{ scaleX: line, transformOrigin: 'left' }}
              className="hidden h-full w-full rounded-full bg-emerald-500 md:block"
            />
          </div>

          <Stagger
            className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8"
            stagger={0.15}
          >
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <StaggerItem
                  key={step.no}
                  className="flex gap-5 md:flex-col md:items-center md:text-center"
                >
                  <div
                    className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000000] ${step.color}`}
                  >
                    <Icon className="h-6 w-6 text-neutral-950" />
                  </div>
                  <div className="space-y-2 md:pt-4">
                    <span className="inline-block whitespace-nowrap rounded-full border-2 border-black bg-white px-2.5 py-0.5 text-xs font-semibold text-neutral-900 dark:bg-neutral-900 dark:text-white">
                      Langkah {step.no}
                    </span>
                    <h3 className="text-lg font-semibold text-neutral-950 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {step.desc}
                    </p>
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
