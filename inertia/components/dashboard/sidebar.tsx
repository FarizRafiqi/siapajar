import { Link, router, usePage } from '@inertiajs/react'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileQuestion,
  Calendar,
  CalendarDays,
  CalendarRange,
  ClipboardList,
  ClipboardCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Library,
  Shield,
  Package,
  Sparkles,
  School,
  X,
  FileSpreadsheet,
  Presentation,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils'

interface User {
  id: number
  fullName: string
  email: string
  initials: string
  role: string
  educationLevel: 'tk' | 'sd' | null
  avatarUrl: string | null
}

interface SidebarProps {
  user: User
  collapsed?: boolean
  onToggle?: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const guruSdNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Kelas', href: '/classes', icon: Users },
  { name: 'Mata Pelajaran', href: '/subjects', icon: Library },
  { name: 'Modul Ajar', href: '/teaching-modules', icon: BookOpen },
  { name: 'Bank Soal', href: '/exams', icon: FileQuestion },
  { name: 'Penilaian', href: '/assessments', icon: ClipboardCheck },
  { name: 'Rapor & Peringkat', href: '/report-cards', icon: Award },
  { name: 'Protah', href: '/annual-plans', icon: Calendar },
  { name: 'Promes', href: '/semester-plans', icon: CalendarDays },
]

const guruTkNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Kelompok', href: '/classes', icon: Users },
  { name: 'RPPM', href: '/rppm', icon: CalendarRange },
  { name: 'RPPH', href: '/rpph', icon: CalendarDays },
  { name: 'LKPD Anak', href: '/lkpd', icon: FileSpreadsheet },
  { name: 'Media Ajar', href: '/media-modules', icon: Presentation },
  { name: 'Soal RA/TK', href: '/exams', icon: FileQuestion },
  { name: 'Asesmen PAUD', href: '/paud-assessments', icon: ClipboardList },
  { name: 'Rapor & Peringkat', href: '/report-cards', icon: Award },
  { name: 'Protah', href: '/annual-plans', icon: Calendar },
  { name: 'Promes', href: '/semester-plans', icon: CalendarDays },
]

const adminNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Manage Users', href: '/admin/users', icon: Shield },
  { name: 'Manage Packages', href: '/admin/packages', icon: Package },
  { name: 'Sekolah', href: '/admin/schools', icon: School },
  { name: 'Tahun Ajaran', href: '/admin/academic-years', icon: Calendar },
  { name: 'Konfigurasi AI', href: '/admin/ai-settings', icon: Sparkles },
]

const principalNavigation = [
  { name: 'Dashboard', href: '/principal', icon: LayoutDashboard },
]

export default function Sidebar({
  user,
  collapsed = false,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: Readonly<SidebarProps>) {
  const page = usePage()
  const currentUrl = page.url
  const isAdmin = user.role === 'admin'
  let navigation = guruSdNavigation
  if (isAdmin) {
    navigation = adminNavigation
  } else if (user.role === 'kepala_sekolah') {
    navigation = principalNavigation
  } else if (user.educationLevel === 'tk') {
    navigation = guruTkNavigation
  }

  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    kepala_sekolah: 'Kepala Sekolah',
    guru: 'Guru',
  }

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Backdrop (mobile only, shown while drawer is open) */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 border-r border-neutral-200 bg-white transition-transform duration-300 dark:border-neutral-800 dark:bg-neutral-950',
          'md:transition-all',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
          collapsed ? 'md:w-[68px]' : 'md:w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                SiapAjar
              </span>
            </Link>
          )}
          <div className={cn('flex items-center', collapsed && 'w-full justify-center')}>
            {/* Desktop collapse toggle */}
            <button
              onClick={onToggle}
              className="hidden rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 md:block"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
            {/* Mobile close button */}
            <button
              onClick={onMobileClose}
              className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="space-y-1 overflow-y-auto px-3 py-4"
          style={{ height: 'calc(100% - 4rem - 4.5rem)' }}
        >
          {navigation.map((item) => {
            const isActive =
              currentUrl.startsWith(item.href) &&
              (item.href === '/dashboard' ? currentUrl === '/dashboard' : true)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0',
                    isActive ? 'text-emerald-600 dark:text-emerald-400' : ''
                  )}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 p-3 dark:border-neutral-800">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={cn(
                'flex w-full cursor-pointer items-center gap-3 rounded-lg p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800',
                collapsed && 'justify-center'
              )}
              title={collapsed ? user.fullName : undefined}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName ?? 'Avatar'}
                  className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                  {user.initials}
                </div>
              )}
              {!collapsed && (
                <div className="flex-1 overflow-hidden text-left">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                    {user.fullName}
                  </p>
                  <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                    {roleLabels[user.role] || user.role}
                  </p>
                </div>
              )}
              <ChevronRight
                className={cn(
                  'h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform',
                  collapsed && 'hidden',
                  dropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Right-side dropdown */}
            {dropdownOpen && (
              <div className="absolute bottom-0 left-full ml-2 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                <Link
                  href="/settings"
                  onClick={() => {
                    setDropdownOpen(false)
                    onMobileClose?.()
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  <Settings className="h-4 w-4" />
                  Pengaturan
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false)
                    router.post('/logout')
                  }}
                  className="flex w-full items-center gap-2 border-t border-neutral-100 px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:border-neutral-800 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
