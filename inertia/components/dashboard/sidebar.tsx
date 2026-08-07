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
  ChevronDown,
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
  Route,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
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

type NavigationItem = {
  name: string
  href: string
  icon: typeof LayoutDashboard
  activeHrefs?: string[]
}

type NavigationEntry =
  | NavigationItem
  | {
      name: string
      items: NavigationItem[]
    }

const guruSdNavigation: NavigationEntry[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'CP, TP & ATP', href: '/curriculum', icon: Route },
  { name: 'Kelas', href: '/classes', icon: Users },
  { name: 'Mata Pelajaran', href: '/subjects', icon: Library },
  {
    name: 'Perencanaan',
    items: [
      { name: 'Modul Ajar', href: '/teaching-modules', icon: BookOpen },
      { name: 'Protah', href: '/annual-plans', icon: Calendar },
      { name: 'Promes', href: '/semester-plans', icon: CalendarDays },
    ],
  },
  {
    name: 'Asesmen & Laporan',
    items: [
      { name: 'Bank Soal', href: '/exams', icon: FileQuestion },
      { name: 'Penilaian', href: '/assessments', icon: ClipboardCheck },
      { name: 'Rapor Perkembangan', href: '/report-cards', icon: Award },
    ],
  },
  {
    name: 'Akun',
    items: [
      {
        name: 'Paket Saya',
        href: '/my-package',
        icon: Package,
        activeHrefs: ['/usage', '/subscriptions'],
      },
    ],
  },
]

const guruTkNavigation: NavigationEntry[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'CP, TP & ATP', href: '/curriculum', icon: Route },
  { name: 'Kelompok', href: '/classes', icon: Users },
  {
    name: 'Perencanaan',
    items: [
      { name: 'RPPM', href: '/rppm', icon: CalendarRange },
      { name: 'RPPH', href: '/rpph', icon: CalendarDays },
      { name: 'Protah', href: '/annual-plans', icon: Calendar },
      { name: 'Promes', href: '/semester-plans', icon: CalendarDays },
    ],
  },
  {
    name: 'Bahan Ajar',
    items: [
      { name: 'LKPD Anak', href: '/lkpd', icon: FileSpreadsheet },
      { name: 'Media Ajar', href: '/media-modules', icon: Presentation },
    ],
  },
  {
    name: 'Asesmen & Laporan',
    items: [
      { name: 'Soal RA/TK', href: '/exams', icon: FileQuestion },
      { name: 'Asesmen PAUD', href: '/paud-assessments', icon: ClipboardList },
      { name: 'Rapor Perkembangan', href: '/report-cards', icon: Award },
    ],
  },
  {
    name: 'Akun',
    items: [
      {
        name: 'Paket Saya',
        href: '/my-package',
        icon: Package,
        activeHrefs: ['/usage', '/subscriptions'],
      },
    ],
  },
]

const adminNavigation: NavigationEntry[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Pengguna & Sekolah',
    items: [
      { name: 'Pengguna', href: '/admin/users', icon: Shield },
      { name: 'Sekolah', href: '/admin/schools', icon: School },
    ],
  },
  { name: 'Paket', href: '/admin/packages', icon: Package },
  { name: 'Hak Fitur Paket', href: '/admin/entitlements', icon: Shield },
  { name: 'Tahun Ajaran', href: '/admin/academic-years', icon: Calendar },
  { name: 'Konfigurasi AI', href: '/admin/ai-settings', icon: Sparkles },
]

const principalNavigation: NavigationEntry[] = [
  { name: 'Dashboard', href: '/principal', icon: LayoutDashboard },
]

function isNavigationItemActive(item: NavigationItem, currentUrl: string) {
  return Boolean(
    (currentUrl.startsWith(item.href) ||
      item.activeHrefs?.some((href) => currentUrl.startsWith(href))) &&
    (item.href === '/dashboard' || item.href === '/principal' ? currentUrl === item.href : true)
  )
}

function renderNavigationItem(
  item: NavigationItem,
  currentUrl: string,
  collapsed: boolean,
  onMobileClose?: () => void
): ReactElement {
  const isActive = isNavigationItemActive(item, currentUrl)
  return (
    <Link
      key={item.name}
      href={item.href}
      onClick={onMobileClose}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-100'
          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/80 dark:hover:text-white'
      )}
      title={collapsed ? item.name : undefined}
    >
      <item.icon
        className={cn(
          'h-5 w-5 flex-shrink-0',
          isActive
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-neutral-500 dark:text-neutral-400'
        )}
      />
      <span className={cn(collapsed && 'md:hidden')}>{item.name}</span>
    </Link>
  )
}

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
  let navigation: NavigationEntry[] = guruSdNavigation
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
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return { Akun: true }
    try {
      return {
        Akun: true,
        ...JSON.parse(window.localStorage.getItem('siapajar:sidebar-groups') ?? '{}'),
      }
    } catch {
      return { Akun: true }
    }
  })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigationRef = useRef<HTMLElement>(null)

  const activeGroupNames = useMemo(
    () =>
      navigation
        .filter(
          (entry): entry is Extract<NavigationEntry, { items: NavigationItem[] }> =>
            'items' in entry
        )
        .filter((entry) => entry.items.some((item) => isNavigationItemActive(item, currentUrl)))
        .map((entry) => entry.name),
    [navigation, currentUrl]
  )

  useEffect(() => {
    if (activeGroupNames.length === 0) return
    setCollapsedGroups((previous) => {
      const next = { ...previous }
      for (const groupName of activeGroupNames) next[groupName] = false
      return next
    })
  }, [activeGroupNames])

  useEffect(() => {
    window.localStorage.setItem('siapajar:sidebar-groups', JSON.stringify(collapsedGroups))
  }, [collapsedGroups])

  useEffect(() => {
    const navigationElement = navigationRef.current
    if (!navigationElement) return

    const savedScrollTop = window.sessionStorage.getItem('siapajar:sidebar-scroll-top')
    if (savedScrollTop === null) return

    const restoreScroll = () => {
      navigationElement.scrollTop = Number(savedScrollTop)
    }
    const frame = window.requestAnimationFrame(restoreScroll)
    return () => window.cancelAnimationFrame(frame)
  }, [currentUrl, collapsedGroups])

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
        data-tour="sidebar"
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
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span
              className={cn(
                'text-lg font-semibold text-neutral-900 dark:text-white',
                collapsed && 'md:hidden'
              )}
            >
              SiapAjar
            </span>
          </Link>
          <div className={cn('flex items-center', collapsed && 'md:w-full md:justify-center')}>
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
          ref={navigationRef}
          onScroll={(event) => {
            window.sessionStorage.setItem(
              'siapajar:sidebar-scroll-top',
              String(event.currentTarget.scrollTop)
            )
          }}
          className="space-y-1 overflow-y-auto px-3 py-4"
          style={{ height: 'calc(100% - 4rem - 4.5rem)' }}
        >
          {navigation.map((entry) => {
            if ('items' in entry) {
              const groupIsActive = entry.items.some((item) =>
                isNavigationItemActive(item, currentUrl)
              )
              const groupIsOpen = !collapsedGroups[entry.name]
              return (
                <div key={entry.name} className="pt-3 first:pt-0">
                  <button
                    type="button"
                    aria-expanded={groupIsOpen}
                    aria-controls={`sidebar-group-${entry.name.replace(/\W+/g, '-').toLowerCase()}`}
                    onClick={() =>
                      setCollapsedGroups((previous) => ({
                        ...previous,
                        [entry.name]: groupIsOpen,
                      }))
                    }
                    className={cn(
                      'mb-1 flex w-full cursor-pointer items-center justify-between rounded px-3 py-1 text-left text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:bg-neutral-100 dark:text-neutral-500 dark:hover:bg-neutral-900',
                      collapsed && 'md:hidden',
                      groupIsActive && 'text-emerald-600 dark:text-emerald-400'
                    )}
                  >
                    {entry.name}
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform',
                        !groupIsOpen && '-rotate-90'
                      )}
                    />
                  </button>
                  <div
                    id={`sidebar-group-${entry.name.replace(/\W+/g, '-').toLowerCase()}`}
                    className={cn('space-y-1', !groupIsOpen && 'hidden')}
                  >
                    {entry.items.map((item) =>
                      renderNavigationItem(item, currentUrl, collapsed, onMobileClose)
                    )}
                  </div>
                </div>
              )
            }
            return renderNavigationItem(entry, currentUrl, collapsed, onMobileClose)
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 p-3 dark:border-neutral-800">
          <div className="relative" ref={dropdownRef} data-tour="profile-menu">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={cn(
                'flex w-full cursor-pointer items-center gap-3 rounded-lg p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800',
                collapsed && 'md:justify-center'
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
              <div className={cn('flex-1 overflow-hidden text-left', collapsed && 'md:hidden')}>
                <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {user.fullName}
                </p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {roleLabels[user.role] || user.role}
                </p>
              </div>
              <ChevronRight
                className={cn(
                  'h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform',
                  collapsed && 'md:hidden',
                  dropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Dropdown position (bottom-full on mobile, left-full on desktop) */}
            {dropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900 md:bottom-0 md:left-full md:mb-0 md:ml-2 md:w-48">
                <Link
                  href="/settings"
                  onClick={() => {
                    setDropdownOpen(false)
                    onMobileClose?.()
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Settings className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
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
