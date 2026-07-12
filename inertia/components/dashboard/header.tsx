import { router } from '@inertiajs/react'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

interface HeaderProps {
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
}

export default function Header({ title, breadcrumbs }: Readonly<HeaderProps>) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setDarkMode(isDark)
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

  const handleLogout = () => {
    router.post('/logout')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-6 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      {/* Left: Breadcrumbs + Title */}
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-1 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-emerald-600 dark:hover:text-emerald-400">
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
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h1>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
