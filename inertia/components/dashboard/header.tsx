import { Menu, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
  onMenuClick?: () => void
}

export default function Header({ title, breadcrumbs, onMenuClick }: Readonly<HeaderProps>) {
  const [darkMode, setDarkMode] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

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
