import { motion, useReducedMotion } from 'framer-motion'
import { FileOutput, GraduationCap, ShieldCheck, Workflow } from 'lucide-react'
import { ScrollReveal, Stagger, StaggerItem } from '~/components/landing/motion-primitives'

const chain = ['CP', 'TP', 'ATP', 'IKTP', 'Asesmen', 'Narasi Rapor']

const card =
  'h-full rounded-3xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_#000000] dark:bg-neutral-900'

function CurriculumChain() {
  const reduceMotion = useReducedMotion()
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chain.map((node, i) => (
        <motion.div
          key={node}
          className="flex items-center gap-2"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: 0.15 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="whitespace-nowrap rounded-xl border-2 border-black bg-emerald-200 px-3 py-1.5 text-sm font-semibold text-neutral-950">
            {node}
          </span>
          {i < chain.length - 1 && <span className="text-neutral-900 dark:text-white">→</span>}
        </motion.div>
      ))}
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section
      id="fitur"
      className="py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-black bg-white dark:bg-neutral-900"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <ScrollReveal className="text-center space-y-3">
          <span className="badge-kawaii-amber text-xs font-semibold">FITUR UNGGULAN</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-950 dark:text-white">
            Dibuat Khusus untuk Guru Indonesia
          </h2>
        </ScrollReveal>

        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3" stagger={0.1}>
          <StaggerItem className="md:col-span-2">
            <div className={`${card} space-y-4 bg-[#FAF7F2] dark:bg-neutral-800`}>
              <div className="flex items-center gap-3">
                <Workflow className="h-6 w-6 shrink-0 text-emerald-700" />
                <h3 className="text-lg font-semibold text-neutral-950 dark:text-white">
                  Alur Kurikulum Terhubung
                </h3>
              </div>
              <p className="text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-300">
                Mengikuti panduan Kemendikbudristek & BSKAP: dari Capaian Pembelajaran hingga Narasi
                Rapor, setiap dokumen saling terhubung.
              </p>
              <CurriculumChain />
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className={`${card} space-y-3`}>
              <FileOutput className="h-6 w-6 text-amber-600" />
              <h3 className="text-lg font-semibold text-neutral-950 dark:text-white">
                Export Word & PDF
              </h3>
              <p className="text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-300">
                Siap cetak dan siap supervisi dengan format dokumen yang rapi.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className={`${card} space-y-3`}>
              <GraduationCap className="h-6 w-6 text-sky-600" />
              <h3 className="text-lg font-semibold text-neutral-950 dark:text-white">
                Semua Jenjang
              </h3>
              <p className="text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-300">
                PAUD/TK/RA, SD/MI, SMP/MTs, hingga SMA/SMK/MA.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem className="md:col-span-2">
            <div className={`${card} space-y-3`}>
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <h3 className="text-lg font-semibold text-neutral-950 dark:text-white">
                Data Sekolah Aman
              </h3>
              <p className="text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-300">
                Enkripsi standar industri dan server berlokasi di Indonesia. Data sekolah Anda tidak
                dibagikan ke pihak manapun.
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}
