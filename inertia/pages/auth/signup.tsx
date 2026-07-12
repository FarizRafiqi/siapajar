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
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
                    <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
              Masuk
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}
