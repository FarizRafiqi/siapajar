import { Head, Link } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import { motion } from 'framer-motion'
import { LogIn, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react'
import { ThemeToggle } from '~/components/ui/theme-toggle'

export default function Login() {
  return (
    <>
      <Head title="Masuk ke Akun — SiapAjar" />

      <div className="min-h-screen bg-[#fbfbee] dark:bg-neutral-950 flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative">
        {/* Top Right: Theme Toggle */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <ThemeToggle />
        </div>

        {/* Main Content Container */}
        <div className="max-w-5xl w-full mx-auto my-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Deep Emerald Branding Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 h-full bg-[#047857] dark:bg-[#064e3b] rounded-3xl border-2 border-black p-6 sm:p-8 text-white shadow-[6px_6px_0px_#000000] flex flex-col justify-between relative overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Logo & Badge */}
                <div className="space-y-3">
                  <Link href="/" className="inline-flex items-center gap-3">
                    <img
                      src="/images/logo.png"
                      alt="SiapAjar Logo"
                      className="w-10 h-10 object-contain drop-shadow-md rounded-xl bg-white p-1 border-2 border-black shadow-[2px_2px_0px_#000000]"
                    />
                    <span className="text-2xl font-black tracking-tight text-white">SiapAjar</span>
                  </Link>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-300 text-neutral-950 border-2 border-black text-[11px] font-black shadow-[2px_2px_0px_#000000]">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>Platform Guru Kurikulum Merdeka</span>
                  </div>
                </div>

                {/* Hero Headline */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Susun Administrasi Ajar Lebih Cepat & Rapi.
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-2 leading-relaxed">
                    Masuk untuk melanjutkan pembuatan Modul Ajar, RPPM, Bank Soal, LKPD, hingga
                    Narasi Rapor dalam hitungan detik.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl p-3 backdrop-blur-xs">
                    <div className="p-2 rounded-xl bg-amber-300 text-neutral-950 border border-black shrink-0 shadow-[1px_1px_0px_#000000]">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Generator Instan 1-Klik</h4>
                      <p className="text-[11px] text-emerald-200/80">
                        Hemat 5+ jam waktu administrasi guru tiap minggu
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl p-3 backdrop-blur-xs">
                    <div className="p-2 rounded-xl bg-emerald-300 text-neutral-950 border border-black shrink-0 shadow-[1px_1px_0px_#000000]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Standar Kurikulum Merdeka</h4>
                      <p className="text-[11px] text-emerald-200/80">
                        Format rapi, siap pakai, dan bisa langsung di-print
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Guarantee */}
              <div className="relative z-10 pt-6 mt-6 border-t-2 border-emerald-700/60 flex items-center justify-between text-xs font-bold text-emerald-200">
                <span>🛡️ Privasi & Data Terjaga</span>
                <span className="text-amber-300">Siap Cetak & Edit</span>
              </div>
            </motion.div>

            {/* Right Column: Form Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 h-full bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black p-6 sm:p-8 lg:p-10 shadow-[6px_6px_0px_#000000] text-neutral-900 dark:text-white flex flex-col justify-between"
            >
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
                    Masuk ke Akun Anda
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                    Selamat datang kembali! Silakan masukkan email dan password Anda.
                  </p>
                </div>

                <Form route="session.store">
                  {({ processing, errors }) => (
                    <div className="space-y-4">
                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          autoComplete="username"
                          placeholder="nama@email.com"
                          data-invalid={errors.email ? 'true' : undefined}
                          className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-950 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-neutral-900 transition-all font-bold placeholder:text-neutral-400 shadow-xs"
                        />
                        {errors.email && (
                          <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.email}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="password"
                            className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200"
                          >
                            Password
                          </label>
                        </div>
                        <input
                          id="password"
                          type="password"
                          name="password"
                          autoComplete="current-password"
                          placeholder="Masukkan password"
                          data-invalid={errors.password ? 'true' : undefined}
                          className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-950 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-neutral-900 transition-all font-bold placeholder:text-neutral-400 shadow-xs"
                        />
                        {errors.password && (
                          <p className="text-rose-500 text-xs mt-1.5 font-bold">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      {/* Remember Me */}
                      <div className="flex items-center justify-between py-1.5">
                        <label className="inline-flex items-center gap-3 text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            name="remember"
                            className="w-4 h-4 shrink-0 rounded-md border-2 border-black text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 accent-emerald-600 cursor-pointer mr-0.5"
                          />
                          <span className="leading-none select-none pl-1 font-medium text-neutral-800 dark:text-neutral-200">
                            Ingat saya di perangkat ini
                          </span>
                        </label>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={processing}
                        className="btn-kawaii-primary w-full h-12 flex items-center justify-center gap-2 text-sm sm:text-base font-bold disabled:opacity-50 mt-2"
                      >
                        <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                        {processing ? 'Memproses Masuk...' : 'Masuk Sekarang'}
                      </button>
                    </div>
                  )}
                </Form>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-0.5 flex-1 bg-neutral-200 dark:bg-neutral-800" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    ATAU
                  </span>
                  <div className="h-0.5 flex-1 bg-neutral-200 dark:bg-neutral-800" />
                </div>

                {/* Google Fast Login */}
                <a
                  href="/auth/google/redirect"
                  className="flex w-full h-12 items-center justify-center gap-3 rounded-2xl border-2 border-black bg-white dark:bg-neutral-800 px-4 text-sm sm:text-base font-bold text-neutral-950 dark:text-white transition-all hover:bg-neutral-100 dark:hover:bg-neutral-700 shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.07 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1C3.26 21.3 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.29 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.4-2.29v-3.1H1.28A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.28 5.39z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.61l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77z"
                    />
                  </svg>
                  <span>Masuk dengan Google</span>
                </a>
              </div>

              {/* Footer Switch */}
              <p className="text-center text-xs text-neutral-600 dark:text-neutral-400 mt-6 font-medium">
                Belum punya akun SiapAjar?{' '}
                <Link
                  href="/signup"
                  className="text-emerald-700 dark:text-emerald-400 hover:underline font-black inline-flex items-center gap-1"
                >
                  Daftar akun gratis sekarang <ArrowRight className="w-3.5 h-3.5 inline" />
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="text-center text-[11px] text-neutral-500 font-medium py-2">
          © {new Date().getFullYear()} SiapAjar. Platform Administrasi Guru Terpadu Kurikulum
          Merdeka.
        </div>
      </div>
    </>
  )
}
