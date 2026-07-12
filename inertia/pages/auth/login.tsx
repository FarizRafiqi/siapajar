import { Head, Link } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { ThemeToggle } from '~/components/ui/theme-toggle'

export default function Login() {
  return (
    <>
      <Head title="Login — SiapAjar" />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 bg-dot-grid flex items-center justify-center px-4">
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
              Masuk ke Akun Anda
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Selamat datang kembali! Silakan masukkan detail Anda.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <Form route="session.store">
              {({ processing, errors }) => (
                <div className="space-y-5">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="username"
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
                      autoComplete="current-password"
                      placeholder="Masukkan password"
                      data-invalid={errors.password ? 'true' : undefined}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between py-1">
                    <label
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontWeight: 'normal' }}
                      className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        name="remember"
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>Ingat saya</span>
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    {processing ? 'Masuk...' : 'Masuk'}
                  </button>
                </div>
              )}
            </Form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Belum punya akun?{' '}
            <Link href="/signup" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
              Daftar gratis
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}
