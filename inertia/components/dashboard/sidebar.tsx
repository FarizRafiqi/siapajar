import { Link, usePage } from '@inertiajs/react'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileQuestion,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Settings,
  Library,
  Shield,
  Package,
} from 'lucide-react'
import { cn } from '~/lib/utils'

interface User {
  id: number
  fullName: string
  email: string
  initials: string
  role: string
}

interface SidebarProps {
  user: User
  collapsed?: boolean
  onToggle?: () => void
}

const guruNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Kelas', href: '/classes', icon: Users },
  { name: 'Mata Pelajaran', href: '/subjects', icon: Library },
  { name: 'Modul Ajar', href: '/teaching-modules', icon: BookOpen },
  { name: 'Bank Soal', href: '/exams', icon: FileQuestion },
  { name: 'Protah', href: '/annual-plans', icon: Calendar },
  { name: 'Promes', href: '/semester-plans', icon: CalendarDays },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
]

const adminNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Manage Users', href: '/admin/users', icon: Shield },
  { name: 'Manage Packages', href: '/admin/packages', icon: Package },
  { name: 'Tahun Ajaran', href: '/admin/academic-years', icon: Calendar },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
]

export default function Sidebar({ user, collapsed = false, onToggle }: Readonly<SidebarProps>) {
  const page = usePage()
  const currentUrl = page.url
  const isAdmin = user.role === 'admin'
  const navigation = isAdmin ? adminNavigation : guruNavigation

  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    kepala_sekolah: 'Kepala Sekolah',
    guru: 'Guru',
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-neutral-200 bg-white transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-950',
        collapsed ? 'w-[68px]' : 'w-64'
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
        <button
          onClick={onToggle}
          className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = currentUrl.startsWith(item.href) && (item.href === '/dashboard' ? currentUrl === '/dashboard' : true)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-emerald-600 dark:text-emerald-400' : '')} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 p-3 dark:border-neutral-800">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
            {user.initials}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                {user.fullName}
              </p>
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {roleLabels[user.role] || user.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
