import { Link } from '@inertiajs/react'
import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Zap } from 'lucide-react'
import { cn } from '~/lib/utils'
import { CountUp, ScrollReveal, Stagger, StaggerItem } from '~/components/landing/motion-primitives'
import { formatPackagePrice, type PricingPackage } from '~/components/landing/data'

export function PricingSection({ packages }: Readonly<{ packages: PricingPackage[] }>) {
  return (
    <section
      id="pricing"
      className="py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-black bg-[#FAF7F2] dark:bg-neutral-950"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <ScrollReveal className="text-center space-y-3">
          <span className="badge-kawaii-amber text-xs font-semibold">HARGA TERJANGKAU</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-950 dark:text-white">
            Pilihan Paket Tanpa Komitmen Ribet
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium max-w-xl mx-auto">
            Pilih paket sesuai kebutuhan mengajar Anda. Mulai dari gratis hingga akses lengkap
            sekolah.
          </p>
        </ScrollReveal>

        <Stagger
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          stagger={0.08}
        >
          {packages && packages.length > 0
            ? packages.map((pkg) => {
                const { price, period } = formatPackagePrice(pkg)
                const isPopular = pkg.isHighlighted
                return (
                  <StaggerItem key={pkg.id} className="h-full">
                    <div
                      className={cn(
                        'h-full rounded-3xl border-2 border-black p-6 sm:p-7 flex flex-col justify-between relative transition-all',
                        isPopular
                          ? 'bg-[#047857] text-white shadow-[6px_6px_0px_#000000]'
                          : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-[4px_4px_0px_#000000]'
                      )}
                    >
                      {isPopular && <PopularShine />}
                      {isPopular && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-300 text-neutral-950 border-2 border-black text-center text-xs font-semibold uppercase tracking-wider shadow-[2px_2px_0px_#000000] whitespace-nowrap">
                          Paling Populer
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <h3
                            className={cn(
                              'font-semibold text-xl',
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
                                  : 'text-neutral-700 dark:text-neutral-300'
                              )}
                            >
                              {pkg.description}
                            </p>
                          )}
                        </div>

                        <div className="py-2">
                          <span
                            className={cn(
                              'text-3.5xl font-bold',
                              isPopular ? 'text-white' : 'text-neutral-950 dark:text-white'
                            )}
                          >
                            {pkg.priceMonthly > 0 ? (
                              <>
                                Rp
                                <CountUp to={pkg.priceMonthly} />
                              </>
                            ) : (
                              price
                            )}
                          </span>
                          {period && (
                            <span
                              className={cn(
                                'text-xs font-bold ml-1',
                                isPopular
                                  ? 'text-emerald-200'
                                  : 'text-neutral-700 dark:text-neutral-300'
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
                            'w-full text-center text-xs font-semibold py-3 block rounded-2xl border-2 border-black transition-all shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5',
                            isPopular
                              ? 'bg-amber-300 hover:bg-amber-400 text-neutral-950'
                              : 'bg-white hover:bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                          )}
                        >
                          Pilih Paket Ini
                        </Link>
                      </div>
                    </div>
                  </StaggerItem>
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
                <StaggerItem key={tier.title} className="h-full">
                  <div
                    className={`h-full bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black p-6 flex flex-col justify-between relative transition-all ${
                      tier.highlight
                        ? 'shadow-[6px_6px_0px_#000000] ring-4 ring-emerald-300 dark:ring-emerald-500'
                        : 'shadow-[4px_4px_0px_#000000]'
                    }`}
                  >
                    {tier.highlight && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-300 text-neutral-950 border-2 border-black text-center text-xs font-semibold uppercase tracking-wider shadow-[2px_2px_0px_#000000] whitespace-nowrap">
                        Paling Populer
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg text-neutral-950 dark:text-white">
                          {tier.title}
                        </h3>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-1 font-medium">
                          {tier.desc}
                        </p>
                      </div>

                      <div className="py-2">
                        <span className="text-3xl font-bold text-neutral-950 dark:text-white">
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
                </StaggerItem>
              ))}
        </Stagger>
      </div>
    </section>
  )
}

/** Kilau diagonal yang menyapu kartu paket populer. */
function PopularShine() {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.35rem]"
    >
      <motion.div
        className="absolute -inset-y-4 w-16 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        initial={{ x: '-150%' }}
        animate={{ x: ['-150%', '900%'] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
      />
    </div>
  )
}
