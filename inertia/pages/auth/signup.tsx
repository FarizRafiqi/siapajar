import { Head, Link } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import { ThemeToggle } from '~/components/ui/theme-toggle'

export default function Signup() {
  return (
    <>
      <Head title="Daftar — SiapAjar" />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 bg-dot-grid flex items-center justify-center px-4 py-12">
        {/* Top right: theme toggle */}
        <div className="fixed top-4 right-4">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                SiapAjar
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
              Buat Akun Gratis
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Mulai kelola administrasi dalam 2 menit.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <Form route="new_account.store">
              {({ processing, errors }) => (
                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder="Nama lengkap Anda"
                      data-invalid={errors.fullName ? 'true' : undefined}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="nama@guru.sch.id"
                      data-invalid={errors.email ? 'true' : undefined}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      placeholder="Minimal 8 karakter"
                      data-invalid={errors.password ? 'true' : undefined}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="passwordConfirmation"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Konfirmasi Password
                    </label>
                    <input
                      id="passwordConfirmation"
                      type="password"
                      name="passwordConfirmation"
                      autoComplete="new-password"
                      placeholder="Ulangi password"
                      data-invalid={errors.passwordConfirmation ? 'true' : undefined}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    />
                    {errors.passwordConfirmation && (
                      <p className="text-red-500 text-sm mt-1">{errors.passwordConfirmation}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    {processing ? 'Mendaftar...' : 'Daftar Gratis'}
                  </button>
                </div>
              )}
            </Form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">ATAU</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>

            <a
              href="/auth/google/redirect"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
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
              Daftar dengan Google
            </a>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              Masuk
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}
