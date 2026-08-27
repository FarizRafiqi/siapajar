import { Link, usePage } from '@inertiajs/react'
import { CircleHelp, Menu, Moon, Sun, Sparkles, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface HeaderProps {
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
  onMenuClick?: () => void
  showTour?: boolean
  onTourClick?: () => void
  creditsBalance?: number
}

export default function Header({
  title,
  breadcrumbs,
  onMenuClick,
  showTour,
  onTourClick,
  creditsBalance,
}: Readonly<HeaderProps>) {
  const [darkMode, setDarkMode] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )
  const [helpOpen, setHelpOpen] = useState(false)
  const helpRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) setHelpOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-neutral-200 bg-white/80 px-4 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80 sm:px-6">
      {/* Left: Menu button (mobile) + Breadcrumbs + Title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mb-1 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-1">
                  {index > 0 && <span>/</span>}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-neutral-900 dark:text-white">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {title && (
            <h1 className="truncate text-lg font-semibold text-neutral-900 dark:text-white">
              {title}
            </h1>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Saldo Kredit Kawaii Badge */}
        {creditsBalance !== undefined && (
          <Link
            href="/billing"
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border-2 border-emerald-500/20 text-emerald-900 dark:text-emerald-200 transition-all text-xs font-bold shrink-0 shadow-xs active:translate-y-0.5"
            title="Klik untuk top-up kredit"
          >
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="font-extrabold">{creditsBalance}</span>
            <span className="hidden xs:inline text-neutral-600 dark:text-neutral-300 font-medium">
              Kredit
            </span>
            <span className="ml-1 flex items-center justify-center h-4 w-4 rounded-full bg-emerald-600 text-white dark:bg-emerald-500">
              <Plus className="h-3 w-3" />
            </span>
          </Link>
        )}

        <div ref={helpRef} className="relative">
          <button
            type="button"
            onClick={() => setHelpOpen((previous) => !previous)}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
            aria-label="Buka menu bantuan"
            aria-expanded={helpOpen}
          >
            <CircleHelp className="h-5 w-5" />
            <span className="hidden sm:inline">Bantuan</span>
          </button>
          {helpOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
              {showTour && (
                <button
                  type="button"
                  onClick={() => {
                    setHelpOpen(false)
                    onTourClick?.()
                  }}
                  className="flex w-full cursor-pointer items-center px-4 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Lihat tutorial
                </button>
              )}
              <Link
                href="/glossary"
                onClick={() => setHelpOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Glosarium
              </Link>
            </div>
          )}
        </div>
        <button
          onClick={toggleDarkMode}
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  )
}
