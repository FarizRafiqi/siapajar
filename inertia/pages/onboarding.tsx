import { Head, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '~/components/ui/theme-toggle'
import {
  Sparkles,
  School,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
} from 'lucide-react'
import { cn } from '~/lib/utils'

interface OnboardingProps {
  readonly role: string
}

export default function Onboarding({ role }: OnboardingProps) {
  const isKepalaSekolah = role === 'kepala_sekolah'
  const totalSteps = isKepalaSekolah ? 2 : 3
  const schoolStep = isKepalaSekolah ? 1 : 2
  const confirmStep = isKepalaSekolah ? 2 : 3

  const [step, setStep] = useState(1)
  const { data, setData, post, processing, errors, transform } = useForm({
    educationLevel: '' as 'tk' | 'sd' | '',
    institutionType: 'tk' as 'tk' | 'ra',
    curriculumVersion: 'Kurikulum Merdeka',
    defaultGroupContext: 'b' as 'a' | 'b',
    schoolName: '',
  })

  const handleNext = () => {
    if (!isKepalaSekolah && step === 1 && !data.educationLevel) return
    if (step === schoolStep && data.schoolName.trim().length < 2) return
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    transform((formData) => (isKepalaSekolah ? { schoolName: formData.schoolName } : formData))
    post('/onboarding')
  }

  const getIndicatorWidth = (s: number, currentStep: number) => {
    if (s === currentStep) return 'w-8 bg-emerald-600 dark:bg-emerald-500'
    if (s < currentStep) return 'w-4 bg-emerald-300 dark:bg-emerald-800'
    return 'w-2 bg-neutral-200 dark:bg-neutral-800'
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
            <div className="inline-flex items-center gap-2.5">
              <img
                src="/images/logo.png"
                alt="SiapAjar Logo"
                className="w-10 h-10 object-contain drop-shadow-sm"
              />
              <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent tracking-tight">
                SiapAjar
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-wider">
              <span>
                Langkah {step} dari {totalSteps}
              </span>
              <span>•</span>
              <span>Onboarding</span>
            </div>
            {/* Step Indicators */}
            <div className="mt-3 flex justify-center gap-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    getIndicatorWidth(s, step)
                  )}
                />
              ))}
            </div>
          </div>

          {/* Form / Wizard Container */}
          <form
            onSubmit={handleSubmit}
            className="card-kawaii bg-white dark:bg-neutral-900 p-8 md:p-10 relative overflow-hidden"
          >
            {/* Glow Decorative Effect */}
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {!isKepalaSekolah && step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
                      Pilih Jenjang Instansi Anda
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-300 mt-2 text-xs leading-relaxed font-medium">
                      Kami akan menyesuaikan format modul ajar, rencana tahunan (prota/promes), dan
                      penilaian sesuai kurikulum jenjang Anda.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* TK Option */}
                    <button
                      type="button"
                      onClick={() => setData('educationLevel', 'tk')}
                      className={cn(
                        'group relative flex flex-col items-center sm:items-start p-6 rounded-3xl border-2 text-center sm:text-left transition-all duration-300 active:scale-[0.98]',
                        data.educationLevel === 'tk'
                          ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-400 dark:bg-emerald-950/30 shadow-kawaii-sticker ring-2 ring-emerald-500/20'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-transparent'
                      )}
                    >
                      <div
                        className={cn(
                          'rounded-2xl p-3.5 mb-4 transition-all duration-200 group-hover:scale-110',
                          data.educationLevel === 'tk'
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700'
                        )}
                      >
                        <Compass className="h-6 w-6" />
                      </div>
                      <h3 className="font-extrabold text-neutral-950 dark:text-white text-base">
                        TK / PAUD
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed font-medium">
                        Modul ajar RPPH/RPPM bermain, pencapaian aspek perkembangan, dan rapor
                        predikat narasi.
                      </p>
                      {data.educationLevel === 'tk' && (
                        <div className="absolute top-4 right-4 rounded-full bg-emerald-600 text-white p-1 shadow-xs">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>

                    {/* SD Option */}
                    <button
                      type="button"
                      onClick={() => setData('educationLevel', 'sd')}
                      className={cn(
                        'group relative flex flex-col items-center sm:items-start p-6 rounded-3xl border-2 text-center sm:text-left transition-all duration-300 active:scale-[0.98]',
                        data.educationLevel === 'sd'
                          ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-400 dark:bg-emerald-950/30 shadow-kawaii-sticker ring-2 ring-emerald-500/20'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-transparent'
                      )}
                    >
                      <div
                        className={cn(
                          'rounded-2xl p-3.5 mb-4 transition-all duration-200 group-hover:scale-110',
                          data.educationLevel === 'sd'
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700'
                        )}
                      >
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <h3 className="font-extrabold text-neutral-950 dark:text-white text-base">
                        Sekolah Dasar (SD)
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed font-medium">
                        Mata pelajaran Kurikulum Merdeka terstruktur, bank soal/kuis, dan rapor
                        penilaian akademik.
                      </p>
                      {data.educationLevel === 'sd' && (
                        <div className="absolute top-4 right-4 rounded-full bg-emerald-600 text-white p-1 shadow-xs">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  </div>

                  {data.educationLevel === 'tk' && (
                    <div className="grid gap-4 sm:grid-cols-2 pt-2">
                      <div>
                        <label
                          htmlFor="institutionType"
                          className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1"
                        >
                          Profil Lembaga
                        </label>
                        <select
                          id="institutionType"
                          value={data.institutionType}
                          onChange={(e) =>
                            setData('institutionType', e.target.value as 'tk' | 'ra')
                          }
                          className="w-full rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
                        >
                          <option value="tk">TK (Taman Kanak-Kanak)</option>
                          <option value="ra">RA (Raudhatul Athfal - Kemenag)</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="defaultGroupContext"
                          className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1"
                        >
                          Kelompok Awal
                        </label>
                        <select
                          id="defaultGroupContext"
                          value={data.defaultGroupContext}
                          onChange={(e) =>
                            setData('defaultGroupContext', e.target.value as 'a' | 'b')
                          }
                          className="w-full rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
                        >
                          <option value="a">Kelompok A (Usia 4-5 Tahun)</option>
                          <option value="b">Kelompok B (Usia 5-6 Tahun)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!data.educationLevel}
                      className="btn-kawaii-primary px-6 py-3 text-xs flex items-center gap-2 disabled:opacity-50"
                    >
                      Lanjut ke Langkah Berikutnya
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === schoolStep && (
                <motion.div
                  key="step-school"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
                      Nama Instansi / Sekolah Anda
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-300 mt-2 text-xs leading-relaxed font-medium">
                      Tuliskan nama instansi tempat Anda {isKepalaSekolah ? 'bertugas' : 'mengajar'}
                      . Jika nama sekolah sudah pernah didaftarkan guru lain, akun Anda akan
                      otomatis terhubung ke sekolah yang sama.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="schoolName"
                      className="block text-xs font-bold text-neutral-800 dark:text-neutral-200"
                    >
                      Nama Sekolah / Satuan PAUD
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <School className="h-5 w-5" />
                      </div>
                      <input
                        id="schoolName"
                        type="text"
                        value={data.schoolName}
                        onChange={(e) => setData('schoolName', e.target.value)}
                        placeholder="contoh: TK Pertiwi Indah / SD Negeri 1 Jakarta"
                        className="w-full rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white !pl-11 pr-4 py-3 text-xs font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                        autoFocus
                      />
                    </div>
                    {errors.schoolName && (
                      <p className="text-rose-500 text-xs mt-1 font-bold">{errors.schoolName}</p>
                    )}
                  </div>

                  <div
                    className={cn(
                      'pt-4 flex gap-3',
                      isKepalaSekolah ? 'justify-end' : 'justify-between'
                    )}
                  >
                    {!isKepalaSekolah && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-2 rounded-2xl border-2 border-neutral-200 px-5 py-3 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={data.schoolName.trim().length < 2}
                      className="btn-kawaii-primary px-6 py-3 text-xs flex items-center gap-2 disabled:opacity-50"
                    >
                      Lanjut
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === confirmStep && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-center"
                >
                  <div className="mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 p-5 w-20 h-20 flex items-center justify-center shadow-kawaii-sticker">
                    <Sparkles className="h-9 w-9 animate-pulse" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
                      Semua Sudah Siap!
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-300 mt-2 text-xs max-w-sm mx-auto leading-relaxed font-medium">
                      {isKepalaSekolah ? (
                        <>
                          Akun Anda telah terhubung sebagai Kepala Sekolah di{' '}
                          <strong className="text-neutral-900 dark:text-white font-extrabold">
                            {data.schoolName}
                          </strong>
                          .
                        </>
                      ) : (
                        <>
                          Akun Anda telah dikonfigurasi untuk level{' '}
                          <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                            {data.educationLevel === 'tk' ? 'TK / PAUD' : 'Sekolah Dasar (SD)'}
                          </strong>{' '}
                          di{' '}
                          <strong className="text-neutral-900 dark:text-white font-extrabold">
                            {data.schoolName}
                          </strong>
                          .
                        </>
                      )}
                    </p>
                  </div>

                  <div className="pt-4 flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 rounded-2xl border-2 border-neutral-200 px-5 py-3 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="btn-kawaii-primary flex-1 py-3 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {processing ? 'Menyimpan Konfigurasi...' : 'Mulai Masuk ke Dashboard'}
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
