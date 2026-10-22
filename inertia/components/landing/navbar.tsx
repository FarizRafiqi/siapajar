import { Link, usePage } from '@inertiajs/react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ScrollProgress } from '~/components/landing/motion-primitives'
import { ThemeToggle } from '~/components/ui/theme-toggle'

export function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = usePage().props as any

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 30)
  })

  return (
    <>
      <ScrollProgress />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b-2 border-black shadow-[0_4px_0px_#000000]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/images/logo.png"
                alt="SiapAjar Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
                  SiapAjar
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#tools"
                className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-emerald-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                Generator AI
              </a>
              <a
                href="#cara-kerja"
                className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-emerald-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                Cara Kerja
              </a>
              <a
                href="#pricing"
                className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-emerald-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                Harga
              </a>
              <a
                href="#faq"
                className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-emerald-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                FAQ
              </a>
              <ThemeToggle />

              {user ? (
                <Link
                  href="/dashboard"
                  className="btn-kawaii-primary text-xs font-black py-2.5 px-5"
                >
                  Buka Dashboard &rarr;
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-xs font-black text-neutral-800 dark:text-neutral-200 hover:text-emerald-600 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-kawaii-primary text-xs font-black py-2.5 px-5"
                  >
                    Daftar Gratis
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2.5 bg-white dark:bg-neutral-800 border-2 border-black shadow-[2px_2px_0px_#000000] rounded-xl text-neutral-900 dark:text-white"
                aria-label="Toggle Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-white dark:bg-neutral-900 border-b-2 border-black shadow-[0_4px_0px_#000000] px-4 py-6 space-y-3"
            >
              <a
                href="#tools"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-black text-neutral-800 dark:text-neutral-200 hover:text-emerald-600"
              >
                Generator AI
              </a>
              <a
                href="#cara-kerja"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-black text-neutral-800 dark:text-neutral-200 hover:text-emerald-600"
              >
                Cara Kerja
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-black text-neutral-800 dark:text-neutral-200 hover:text-emerald-600"
              >
                Harga & Top Up
              </a>
              <a
                href="#faq"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-black text-neutral-800 dark:text-neutral-200 hover:text-emerald-600"
              >
                FAQ
              </a>
              <div className="pt-3 border-t-2 border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="btn-kawaii-primary text-center text-xs py-3"
                  >
                    Buka Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="btn-kawaii-secondary text-center text-xs py-2.5"
                    >
                      Masuk ke Akun
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="btn-kawaii-primary text-center text-xs py-3"
                    >
                      Daftar Gratis (3 Kredit)
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
