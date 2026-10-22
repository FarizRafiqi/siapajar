import { Link } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '~/components/landing/motion-primitives'

export function CtaSection() {
  return (
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
  )
}
