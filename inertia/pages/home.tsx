import { Head } from '@inertiajs/react'
import { Navbar } from '~/components/landing/navbar'
import { HeroSection } from '~/components/landing/hero-section'
import { ToolsSection } from '~/components/landing/tools-section'
import { PricingSection } from '~/components/landing/pricing-section'
import { HowItWorksSection } from '~/components/landing/how-it-works-section'
import { FeaturesSection } from '~/components/landing/features-section'
import { FaqSection } from '~/components/landing/faq-section'
import { CtaSection } from '~/components/landing/cta-section'
import { FooterSection } from '~/components/landing/footer-section'
import type { PricingPackage } from '~/components/landing/data'

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

      <HeroSection />
      <ToolsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection packages={packages} />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </div>
  )
}
