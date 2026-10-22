import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { ScrollReveal } from '~/components/landing/motion-primitives'
import { faqs } from '~/components/landing/data'

function FaqItem({ q, a }: Readonly<{ q: string; a: string }>) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000000] overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full p-5 text-left font-semibold text-sm sm:text-base text-neutral-900 dark:text-white flex items-center justify-between gap-4"
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
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 text-sm text-neutral-700 dark:text-neutral-300 font-medium border-t-2 border-neutral-100 dark:border-neutral-800 leading-relaxed">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FaqSection() {
  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <ScrollReveal className="text-center space-y-3">
          <span className="badge-kawaii-blue text-xs font-semibold">TANYA JAWAB</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-950 dark:text-white">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
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
  )
}
