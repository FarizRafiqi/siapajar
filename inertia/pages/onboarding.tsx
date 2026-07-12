import { Head, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '~/components/ui/theme-toggle'
import { Sparkles, School, GraduationCap, ArrowRight, ArrowLeft, Check, Compass } from 'lucide-react'
import { cn } from '~/lib/utils'

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const { data, setData, post, processing, errors } = useForm({
    educationLevel: '' as 'tk' | 'sd' | '',
    schoolName: '',
  })

  const handleNext = () => {
    if (step === 1 && !data.educationLevel) return
    if (step === 2 && data.schoolName.trim().length < 2) return
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    post('/onboarding')
  }

  const getIndicatorWidth = (s: number, currentStep: number) => {
    if (s === currentStep) return "w-8 bg-emerald-600 dark:bg-emerald-500"
    if (s < currentStep) return "w-4 bg-emerald-300 dark:bg-emerald-800"
    return "w-2 bg-neutral-200 dark:bg-neutral-800"
  }

  return (
    <>
      <Head title="Selamat Datang — SiapAjar" />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 bg-dot-grid flex items-center justify-center px-4 py-12">
        {/* Top right theme toggle */}
        <div className="fixed top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-xl">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              SiapAjar
            </span>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-wider">
              <span>Langkah {step} dari 3</span>
              <span>•</span>
              <span>Onboarding</span>
            </div>
            {/* Step Indicators */}
            <div className="mt-3 flex justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    getIndicatorWidth(s, step)
                  )}
                />
              ))}
            </div>
          </div>

          {/* Form / Wizard Container */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200/80 dark:border-neutral-800/80 p-8 md:p-10 relative overflow-hidden">
            {/* Glow Decorative Effect */}
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      Pilih Jenjang Instansi Anda
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">
                      Kami akan menyesuaikan format modul ajar, rencana tahunan (protah/promes), dan penilaian sesuai kurikulum educationLevel Anda.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* TK Option */}
                    <button
                      type="button"
                      onClick={() => setData('educationLevel', 'tk')}
                      className={cn(
                        "group relative flex flex-col items-center sm:items-start p-6 rounded-xl border text-center sm:text-left transition-all duration-300",
                        data.educationLevel === 'tk'
                          ? "border-emerald-600 bg-emerald-50/30 dark:border-emerald-500 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20"
                          : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-transparent"
                      )}
                    >
                      <div className={cn(
                        "rounded-lg p-3 mb-4 transition-colors",
                        data.educationLevel === 'tk'
                          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700"
                      )}>
                        <Compass className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-neutral-950 dark:text-white text-base">
                        TK / PAUD
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                        Modul ajar RPPH bermain, pencapaian aspek perkembangan, dan rapor predikat narasi.
                      </p>
                      {data.educationLevel === 'tk' && (
                        <div className="absolute top-4 right-4 rounded-full bg-emerald-600 text-white p-0.5">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </button>

                    {/* SD Option */}
                    <button
                      type="button"
                      onClick={() => setData('educationLevel', 'sd')}
                      className={cn(
                        "group relative flex flex-col items-center sm:items-start p-6 rounded-xl border text-center sm:text-left transition-all duration-300",
                        data.educationLevel === 'sd'
                          ? "border-emerald-600 bg-emerald-50/30 dark:border-emerald-500 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20"
                          : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-transparent"
                      )}
                    >
                      <div className={cn(
                        "rounded-lg p-3 mb-4 transition-colors",
                        data.educationLevel === 'sd'
                          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700"
                      )}>
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-neutral-950 dark:text-white text-base">
                        Sekolah Dasar (SD)
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                        Mata pelajaran Kurikulum Merdeka terstruktur, bank soal/kuis, dan rapor penilaian akademik.
                      </p>
                      {data.educationLevel === 'sd' && (
                        <div className="absolute top-4 right-4 rounded-full bg-emerald-600 text-white p-0.5">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!data.educationLevel}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      Lanjut
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      Nama Instansi / Sekolah Anda
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">
                      Tuliskan nama instansi tempat Anda mengajar untuk ditampilkan pada kop dokumen administrasi Anda.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="schoolName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Nama Sekolah
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <School className="h-5 w-5" />
                      </div>
                      <input
                        id="schoolName"
                        type="text"
                        value={data.schoolName}
                        onChange={(e) => setData('schoolName', e.target.value)}
                        placeholder="contoh: TK Pertiwi Indah / SD Negeri 1 Jakarta"
                        className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white !pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                        autoFocus
                      />
                    </div>
                    {errors.schoolName && (
                      <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>
                    )}
                  </div>

                  <div className="pt-4 flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Kembali
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={data.schoolName.trim().length < 2}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      Lanjut
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-center"
                >
                  <div className="mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-4 w-16 h-16 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 animate-pulse" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      Semua Sudah Siap!
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm max-w-sm mx-auto">
                      Akun Anda telah dikonfigurasi untuk level <strong className="text-emerald-600 dark:text-emerald-400">{data.educationLevel === 'tk' ? 'TK / PAUD' : 'Sekolah Dasar (SD)'}</strong> di <strong>{data.schoolName}</strong>.
                    </p>
                  </div>

                  <div className="pt-4 flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      {processing ? 'Menyimpan...' : 'Mulai Sekarang'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </>
  )
}
