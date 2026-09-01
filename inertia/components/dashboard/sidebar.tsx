import { Link, router, usePage } from '@inertiajs/react'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileQuestion,
  Calendar,
  CalendarRange,
  ClipboardList,
  ClipboardCheck,
  Award,
  ChevronDown,
  LogOut,
  Settings,
  Library,
  Shield,
  ShieldAlert,
  Package,
  Coins,
  School,
  X,
  FileSpreadsheet,
  Presentation,
  Route,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
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
  onTopupClick?: () => void
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

const guruSdExpressNavigation: NavigationEntry[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Tool Instan (Express)',
    items: [
      {
        name: 'Modul Ajar',
        href: '/modul-ajar',
        icon: BookOpen,
        activeHrefs: ['/teaching-modules'],
      },
      { name: 'LKPD Siswa', href: '/lkpd', icon: FileSpreadsheet, activeHrefs: ['/lkpds'] },
      { name: 'Bank Soal AI', href: '/soal', icon: FileQuestion, activeHrefs: ['/exams'] },
      {
        name: 'Prota & Promes',
        href: '/prota-promes',
        icon: Calendar,
        activeHrefs: ['/annual-plans', '/semester-plans'],
      },
      { name: 'Rapor Narasi', href: '/rapor', icon: Award, activeHrefs: ['/report-cards'] },
      { name: 'Katrol Nilai Transparan', href: '/katrol', icon: ClipboardCheck },
      { name: 'Jurnal Mengajar', href: '/jurnal', icon: ClipboardList },
      { name: 'Kokurikuler (P5)', href: '/kokurikuler', icon: Presentation },
    ],
  },
  {
    name: 'Akun',
    items: [
      {
        name: 'Paket Saya',
        href: '/my-package',
        icon: Package,
        activeHrefs: ['/billing', '/usage', '/subscriptions'],
      },
    ],
  },
]

const guruTkExpressNavigation: NavigationEntry[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Tool Instan (Express)',
    items: [
      {
        name: 'Modul Ajar (RPPM)',
        href: '/modul-ajar',
        icon: CalendarRange,
        activeHrefs: ['/rppm', '/rpm', '/teaching-modules'],
      },
      { name: 'LKPD Anak PAUD', href: '/lkpd', icon: FileSpreadsheet, activeHrefs: ['/lkpds'] },
      { name: 'Bank Soal Bergambar', href: '/soal', icon: FileQuestion, activeHrefs: ['/exams'] },
      {
        name: 'Prota & Promes',
        href: '/prota-promes',
        icon: Calendar,
        activeHrefs: ['/annual-plans', '/semester-plans'],
      },
      {
        name: 'Rapor Narasi PAUD',
        href: '/rapor',
        icon: Award,
        activeHrefs: ['/report-cards', '/paud/reports'],
      },
      { name: 'Katrol Nilai Transparan', href: '/katrol', icon: ClipboardCheck },
      { name: 'Jurnal Harian PAUD', href: '/jurnal', icon: ClipboardList },
      { name: 'Kokurikuler / P5', href: '/kokurikuler', icon: Presentation },
    ],
  },
  {
    name: 'Akun',
    items: [
      {
        name: 'Paket Saya',
        href: '/my-package',
        icon: Package,
        activeHrefs: ['/billing', '/usage', '/subscriptions'],
      },
    ],
  },
]

const guruSdStructuredNavigation: NavigationEntry[] = [
  { name: 'Dashboard', href: '/panel/dashboard', icon: LayoutDashboard },
  {
    name: 'Kurikulum & Data',
    items: [
      {
        name: 'CP, TP & ATP',
        href: '/panel/curriculum',
        icon: Route,
        activeHrefs: ['/curriculum', '/panel/kurikulum'],
      },
      {
        name: 'Kelas & Siswa',
        href: '/panel/classes',
        icon: Users,
        activeHrefs: ['/classes', '/panel/kelas', '/panel/siswa', '/students'],
      },
      {
        name: 'Mata Pelajaran',
        href: '/panel/subjects',
        icon: Library,
        activeHrefs: ['/subjects'],
      },
      {
        name: 'Glosarium Kurikulum',
        href: '/panel/glossary',
        icon: BookOpen,
        activeHrefs: ['/glossary'],
      },
    ],
  },
  {
    name: 'Perencanaan',
    items: [
      {
        name: 'Modul Ajar Terstruktur',
        href: '/panel/teaching-modules',
        icon: BookOpen,
        activeHrefs: ['/teaching-modules'],
      },
      {
        name: 'Program Tahunan',
        href: '/panel/annual-plans',
        icon: Calendar,
        activeHrefs: ['/annual-plans'],
      },
      {
        name: 'Program Semester',
        href: '/panel/semester-plans',
        icon: CalendarRange,
        activeHrefs: ['/semester-plans'],
      },
    ],
  },
  {
    name: 'Bahan Ajar',
    items: [
      { name: 'LKPD & Lembar Aktivitas', href: '/panel/lkpd', icon: FileSpreadsheet },
      {
        name: 'Media Ajar',
        href: '/panel/media-modules',
        icon: Presentation,
        activeHrefs: ['/media-modules'],
      },
    ],
  },
  {
    name: 'Asesmen & Laporan',
    items: [
      { name: 'Bank Soal', href: '/panel/exams', icon: FileQuestion, activeHrefs: ['/exams'] },
      {
        name: 'Penilaian',
        href: '/panel/assessments',
        icon: ClipboardCheck,
        activeHrefs: ['/assessments'],
      },
      {
        name: 'Rapor Perkembangan',
        href: '/panel/report-cards',
        icon: Award,
        activeHrefs: ['/report-cards'],
      },
    ],
  },
  {
    name: 'Refleksi & Projek',
    items: [
      { name: 'Jurnal Mengajar', href: '/panel/jurnal', icon: ClipboardList },
      { name: 'Kokurikuler (P5)', href: '/panel/kokurikuler', icon: Presentation },
      { name: 'Katrol Nilai Transparan', href: '/panel/katrol', icon: ClipboardCheck },
    ],
  },
  {
    name: 'Akun',
    items: [
      {
        name: 'Paket Saya',
        href: '/panel/my-package',
        icon: Package,
        activeHrefs: ['/my-package', '/billing', '/usage', '/subscriptions'],
      },
    ],
  },
]

const guruTkStructuredNavigation: NavigationEntry[] = [
  { name: 'Dashboard', href: '/panel/dashboard', icon: LayoutDashboard },
  {
    name: 'Kurikulum & Data',
    items: [
      {
        name: 'CP, TP & ATP Fase Fondasi',
        href: '/panel/curriculum',
        icon: Route,
        activeHrefs: ['/curriculum'],
      },
      {
        name: 'Kelompok & Siswa',
        href: '/panel/classes',
        icon: Users,
        activeHrefs: ['/classes', '/panel/kelas', '/panel/siswa'],
      },
      {
        name: 'Glosarium Kurikulum',
        href: '/panel/glossary',
        icon: BookOpen,
        activeHrefs: ['/glossary'],
      },
    ],
  },
  {
    name: 'Perencanaan',
    items: [
      {
        name: 'Modul Ajar (RPPM/RPM)',
        href: '/panel/rppm',
        icon: CalendarRange,
        activeHrefs: ['/rppm', '/rpm'],
      },
      { name: 'RPPH', href: '/panel/rpph', icon: Calendar, activeHrefs: ['/rpph'] },
      {
        name: 'Program Tahunan',
        href: '/panel/annual-plans',
        icon: Calendar,
        activeHrefs: ['/annual-plans'],
      },
      {
        name: 'Program Semester',
        href: '/panel/semester-plans',
        icon: CalendarRange,
        activeHrefs: ['/semester-plans'],
      },
    ],
  },
  {
    name: 'Bahan Ajar',
    items: [
      { name: 'LKPD Anak', href: '/panel/lkpd', icon: FileSpreadsheet },
      {
        name: 'Media Ajar & Loose Parts',
        href: '/panel/media-modules',
        icon: Presentation,
        activeHrefs: ['/media-modules'],
      },
    ],
  },
  {
    name: 'Asesmen & Laporan',
    items: [
      {
        name: 'Soal Bergambar',
        href: '/panel/exams',
        icon: FileQuestion,
        activeHrefs: ['/exams'],
      },
      {
        name: 'Asesmen Harian PAUD',
        href: '/panel/paud-assessments',
        icon: ClipboardList,
        activeHrefs: ['/paud-assessments'],
      },
      {
        name: 'Rapor Perkembangan',
        href: '/panel/report-cards',
        icon: Award,
        activeHrefs: ['/report-cards'],
      },
    ],
  },
  {
    name: 'Refleksi & Projek',
    items: [
      { name: 'Jurnal Harian PAUD', href: '/panel/jurnal', icon: ClipboardList },
      { name: 'Kokurikuler / P5', href: '/panel/kokurikuler', icon: Presentation },
      { name: 'Katrol Nilai Transparan', href: '/panel/katrol', icon: ClipboardCheck },
    ],
  },
  {
    name: 'Akun',
    items: [
      {
        name: 'Paket Saya',
        href: '/panel/my-package',
        icon: Package,
        activeHrefs: ['/my-package', '/billing', '/usage', '/subscriptions'],
      },
    ],
  },
]

type SidebarMode = 'express' | 'structured'

const SIDEBAR_MODE_STORAGE_KEY = 'siapajar:sidebar-mode'

const STRUCTURED_PATH_PREFIXES = [
  '/curriculum',
  '/classes',
  '/subjects',
  '/teaching-modules',
  '/annual-plans',
  '/semester-plans',
  '/rppm',
  '/rpph',
  '/media-modules',
  '/exams',
  '/assessments',
  '/paud-assessments',
  '/report-cards',
  '/glossary',
]

const EXPRESS_PATH_PREFIXES = [
  '/modul-ajar',
  '/lkpd',
  '/soal',
  '/prota-promes',
  '/rapor',
  '/katrol',
  '/jurnal',
  '/kokurikuler',
]

// Detail dokumen dapat dibuka dari mode Express maupun Panel Lengkap.
// Pertahankan mode terakhir untuk route bersama agar sidebar tidak berubah
// hanya karena URL detail memakai route kanonis lama.
const CONTEXTUAL_DETAIL_PATH_PREFIXES = [
  '/teaching-modules/',
  '/rppm/',
  '/rpph/',
  '/lkpd/',
  '/exams/',
  '/annual-plans/',
  '/semester-plans/',
  '/media-modules/',
  '/paud-assessments/',
  '/assessments/',
  '/report-cards/',
]

function matchesPathPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

function getRouteMode(currentUrl: string): SidebarMode | null {
  const pathname = currentUrl.split('?')[0]

  if (matchesPathPrefix(pathname, '/panel')) return 'structured'
  if (CONTEXTUAL_DETAIL_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null
  }
  if (STRUCTURED_PATH_PREFIXES.some((prefix) => matchesPathPrefix(pathname, prefix))) {
    return 'structured'
  }
  if (pathname === '/dashboard') return 'express'
  if (EXPRESS_PATH_PREFIXES.some((prefix) => matchesPathPrefix(pathname, prefix))) {
    return 'express'
  }

  return null
}

function persistSidebarMode(mode: SidebarMode) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(SIDEBAR_MODE_STORAGE_KEY, mode)
  } catch {
    // ignore storage failures
  }
}

const SIDEBAR_DESKTOP_MEDIA_QUERY = '(min-width: 768px)'
const SIDEBAR_TOOLTIP_VIEWPORT_GUTTER = 12
const SIDEBAR_TOOLTIP_GAP = 10
const SIDEBAR_TOOLTIP_FALLBACK_WIDTH = 220
const SIDEBAR_TOOLTIP_FALLBACK_HEIGHT = 32

function SidebarNavigationTooltip({
  label,
  collapsed,
  children,
}: Readonly<{
  label: string
  collapsed: boolean
  children: ReactElement
}>) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [isDesktopViewport, setIsDesktopViewport] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia(SIDEBAR_DESKTOP_MEDIA_QUERY).matches
  )
  const tooltipEnabled = collapsed && isDesktopViewport

  const updatePosition = useCallback(() => {
    if (!tooltipEnabled || !triggerRef.current || typeof window === 'undefined') return

    const rect = triggerRef.current.getBoundingClientRect()
    const tooltipWidth = tooltipRef.current?.offsetWidth ?? SIDEBAR_TOOLTIP_FALLBACK_WIDTH
    const tooltipHeight = tooltipRef.current?.offsetHeight ?? SIDEBAR_TOOLTIP_FALLBACK_HEIGHT
    const maxLeft = Math.max(
      SIDEBAR_TOOLTIP_VIEWPORT_GUTTER,
      window.innerWidth - tooltipWidth - SIDEBAR_TOOLTIP_VIEWPORT_GUTTER
    )
    const minTop = SIDEBAR_TOOLTIP_VIEWPORT_GUTTER + tooltipHeight / 2
    const maxTop = Math.max(
      minTop,
      window.innerHeight - SIDEBAR_TOOLTIP_VIEWPORT_GUTTER - tooltipHeight / 2
    )
    const nextPosition = {
      top: Math.min(maxTop, Math.max(minTop, rect.top + rect.height / 2)),
      left: Math.min(
        maxLeft,
        Math.max(SIDEBAR_TOOLTIP_VIEWPORT_GUTTER, rect.right + SIDEBAR_TOOLTIP_GAP)
      ),
    }

    setPosition((currentPosition) =>
      currentPosition?.top === nextPosition.top && currentPosition.left === nextPosition.left
        ? currentPosition
        : nextPosition
    )
  }, [tooltipEnabled])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia(SIDEBAR_DESKTOP_MEDIA_QUERY)
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsDesktopViewport(event.matches)
    }

    setIsDesktopViewport(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleViewportChange)

    return () => mediaQuery.removeEventListener('change', handleViewportChange)
  }, [])

  useEffect(() => {
    if (!tooltipEnabled) {
      setPosition(null)
      return
    }

    if (!position) return

    // Recalculate once the portaled tooltip has its actual rendered dimensions.
    updatePosition()
  }, [position, tooltipEnabled, updatePosition])

  useEffect(() => {
    if (!tooltipEnabled) return

    const reposition = () => updatePosition()
    const closeOnScroll = () => setPosition(null)
    window.addEventListener('resize', reposition)
    document.addEventListener('scroll', closeOnScroll, true)

    return () => {
      window.removeEventListener('resize', reposition)
      document.removeEventListener('scroll', closeOnScroll, true)
    }
  }, [tooltipEnabled, updatePosition])

  return (
    <div
      ref={triggerRef}
      className="relative w-full"
      onMouseEnter={updatePosition}
      onMouseLeave={() => setPosition(null)}
      onFocus={updatePosition}
      onBlur={() => setPosition(null)}
    >
      {children}
      {tooltipEnabled && position && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={tooltipRef}
              role="tooltip"
              className="pointer-events-none fixed z-[100] max-w-[calc(100vw-1.5rem)] -translate-y-1/2 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-white/20 bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[2px_2px_0px_#000000]"
              style={{ top: position.top, left: position.left }}
            >
              {label}
            </div>,
            document.body
          )
        : null}
    </div>
  )
}

const adminNavigation: NavigationEntry[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Pengguna & Sekolah',
    items: [
      { name: 'Pengguna', href: '/admin/users', icon: Shield },
      { name: 'Sekolah', href: '/admin/schools', icon: School },
    ],
  },
  {
    name: 'Keamanan & Risiko',
    items: [{ name: 'Review Anti-Fraud', href: '/admin/fraud-cases', icon: ShieldAlert }],
  },
  {
    name: 'Langganan & Akses',
    items: [
      { name: 'Paket', href: '/admin/packages', icon: Package },
      { name: 'Hak Fitur Paket', href: '/admin/entitlements', icon: Shield },
    ],
  },
  {
    name: 'Konfigurasi Sistem',
    items: [
      { name: 'Tahun Ajaran', href: '/admin/academic-years', icon: Calendar },
      { name: 'Preset Kurikulum', href: '/admin/curriculum-presets', icon: Library },
      { name: 'Konfigurasi AI', href: '/admin/ai-settings', icon: Coins },
    ],
  },
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
  onMobileClose?: () => void,
  onTopupClick?: () => void,
  onModeChange?: (href: string) => void
): ReactElement {
  const isActive = isNavigationItemActive(item, currentUrl)
  const isBilling = item.href === '/billing'

  if (isBilling) {
    return (
      <SidebarNavigationTooltip key={item.name} label={item.name} collapsed={collapsed}>
        <button
          type="button"
          aria-label={collapsed ? item.name : undefined}
          onClick={() => {
            onMobileClose?.()
            if (onTopupClick) {
              onTopupClick()
            } else {
              window.dispatchEvent(new CustomEvent('open-topup-modal'))
            }
          }}
          className={cn(
            'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all',
            'border border-emerald-500/30 bg-emerald-700/50 text-amber-300 shadow-xs hover:bg-emerald-600/70 hover:text-amber-200'
          )}
        >
          <item.icon className="h-5 w-5 flex-shrink-0 text-amber-300" />
          <span className={cn(collapsed && 'md:hidden')}>{item.name}</span>
        </button>
      </SidebarNavigationTooltip>
    )
  }

  return (
    <SidebarNavigationTooltip key={item.name} label={item.name} collapsed={collapsed}>
      <Link
        href={item.href}
        aria-label={collapsed ? item.name : undefined}
        onClick={() => {
          onModeChange?.(item.href)
          onMobileClose?.()
        }}
        className={cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
          isActive
            ? 'border-2 border-black bg-amber-300 font-black text-neutral-950 shadow-[2px_2px_0px_#000000]'
            : 'font-medium text-white hover:bg-emerald-700/60 hover:text-white'
        )}
      >
        <item.icon
          className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-neutral-950' : 'text-white')}
        />
        <span className={cn(collapsed && 'md:hidden')}>{item.name}</span>
      </Link>
    </SidebarNavigationTooltip>
  )
}

export default function Sidebar({
  user,
  collapsed = false,
  onToggle,
  mobileOpen = false,
  onMobileClose,
  onTopupClick,
}: Readonly<SidebarProps>) {
  const page = usePage()
  const currentUrl = page.url
  const isAdmin = user.role === 'admin'
  const isPrincipal = user.role === 'kepala_sekolah'
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(() => {
    const routeMode = getRouteMode(currentUrl)
    if (routeMode) return routeMode

    if (typeof window !== 'undefined') {
      try {
        const storedMode = window.localStorage.getItem(SIDEBAR_MODE_STORAGE_KEY)
        if (storedMode === 'express' || storedMode === 'structured') return storedMode
      } catch {
        // ignore storage failures
      }
    }

    return 'express'
  })
  const isStructuredMode = sidebarMode === 'structured'
  let navigation: NavigationEntry[] = isStructuredMode
    ? user.educationLevel === 'tk'
      ? guruTkStructuredNavigation
      : guruSdStructuredNavigation
    : guruSdExpressNavigation
  if (isAdmin) {
    navigation = adminNavigation
  } else if (isPrincipal) {
    navigation = principalNavigation
  } else if (user.educationLevel === 'tk' && !isStructuredMode) {
    navigation = guruTkExpressNavigation
  }

  const changeSidebarMode = (mode: SidebarMode) => {
    setSidebarMode(mode)
    persistSidebarMode(mode)
  }

  const handleNavigationMode = (href: string) => {
    const routeMode = getRouteMode(href)
    if (routeMode) changeSidebarMode(routeMode)
  }

  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    kepala_sekolah: 'Kepala Sekolah',
    guru: 'Guru',
  }

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)
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
      let changed = false
      const next = { ...previous }
      for (const groupName of activeGroupNames) {
        if (next[groupName]) {
          next[groupName] = false
          changed = true
        }
      }
      return changed ? next : previous
    })
  }, [activeGroupNames])

  useEffect(() => {
    const routeMode = getRouteMode(currentUrl)
    if (routeMode) {
      setSidebarMode(routeMode)
    }
  }, [currentUrl])

  useEffect(() => {
    persistSidebarMode(sidebarMode)
  }, [sidebarMode])

  useEffect(() => {
    try {
      window.localStorage.setItem('siapajar:sidebar-groups', JSON.stringify(collapsedGroups))
    } catch {
      // ignore
    }
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        data-tour="sidebar"
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 border-r-2 border-black/30 bg-[#047857] text-white transition-transform duration-300 dark:border-black dark:bg-[#064e3b]',
          'md:transition-all',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
          collapsed ? 'md:w-[68px]' : 'md:w-64'
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex h-16 items-center border-b border-emerald-800/80 dark:border-emerald-950/80',
            collapsed ? 'justify-center px-0' : 'justify-between pl-4 pr-2'
          )}
        >
          {collapsed ? (
            /* Collapsed state: logo berubah menjadi tombol expand saat di-hover */
            <>
              <button
                type="button"
                onClick={() => {
                  setLogoHovered(false)
                  onToggle?.()
                }}
                onMouseEnter={() => setLogoHovered(true)}
                onMouseLeave={() => setLogoHovered(false)}
                className="group relative hidden h-10 w-10 items-center justify-center rounded-xl p-1 transition-colors hover:bg-emerald-700/60 md:flex"
                title="Buka sidebar"
              >
                <img
                  src="/images/logo.png"
                  alt="SiapAjar Logo"
                  className={cn(
                    'absolute h-8 w-8 object-contain drop-shadow-sm transition-all duration-200',
                    logoHovered ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
                  )}
                />
                <PanelLeftOpen
                  className={cn(
                    'h-6 w-6 text-white transition-all duration-200',
                    logoHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                  )}
                />
              </button>
              {/* Mobile close button (hanya muncul di mobile) */}
              <button
                type="button"
                onClick={onMobileClose}
                className="flex items-center justify-center rounded-lg p-2 text-white hover:bg-emerald-700/60 hover:text-white transition-colors md:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            /* Expanded state: tombol collapse berada di sisi kanan logo */
            <>
              <Link href="/dashboard" className="hidden min-w-0 items-center gap-2.5 md:flex">
                <img
                  src="/images/logo.png"
                  alt="SiapAjar Logo"
                  className="h-8 w-8 flex-shrink-0 object-contain drop-shadow-sm"
                />
                <span className="text-lg font-black tracking-tight text-white">SiapAjar</span>
              </Link>
              <button
                type="button"
                onClick={onToggle}
                className="hidden rounded-lg p-2 text-white transition-colors hover:bg-emerald-700/60 md:flex"
                title="Tutup sidebar"
                aria-label="Tutup sidebar"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
              {/* Logo untuk mobile (non-clickable untuk collapse, pakai Link) */}
              <Link href="/dashboard" className="flex items-center gap-2.5 md:hidden">
                <img
                  src="/images/logo.png"
                  alt="SiapAjar Logo"
                  className="h-8 w-8 object-contain drop-shadow-sm"
                />
                <span className="text-lg font-black tracking-tight text-white">SiapAjar</span>
              </Link>
              {/* Mobile close button */}
              <button
                type="button"
                onClick={onMobileClose}
                className="rounded-lg p-1.5 text-white hover:bg-emerald-800 hover:text-white md:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          )}
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
          className={cn(
            'space-y-1 overflow-x-hidden overflow-y-auto px-3 py-4 custom-scrollbar',
            collapsed && 'sidebar-navigation-collapsed'
          )}
          style={{ height: 'calc(100% - 4rem - 4.5rem)' }}
        >
          {!isAdmin && !isPrincipal && (
            <SidebarNavigationTooltip
              label={isStructuredMode ? 'Kembali ke Tool Instan' : 'Buka Panel Lengkap'}
              collapsed={collapsed}
            >
              <Link
                href={isStructuredMode ? '/dashboard' : '/panel/dashboard'}
                onClick={() => {
                  changeSidebarMode(isStructuredMode ? 'express' : 'structured')
                  onMobileClose?.()
                }}
                className={cn(
                  'mb-3 flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-black transition-all',
                  isStructuredMode
                    ? 'border-black bg-amber-300 text-neutral-950 shadow-[2px_2px_0px_#000000] hover:bg-amber-200'
                    : 'border-emerald-300/60 bg-emerald-900/35 text-white hover:border-white hover:bg-emerald-700/70'
                )}
                aria-label={isStructuredMode ? 'Kembali ke Tool Instan' : 'Buka Panel Lengkap'}
              >
                {isStructuredMode ? (
                  <BookOpen className="h-5 w-5 flex-shrink-0 text-neutral-950" />
                ) : (
                  <Route className="h-5 w-5 flex-shrink-0 text-amber-300" />
                )}
                <span className={cn(collapsed && 'md:hidden')}>
                  {isStructuredMode ? 'Kembali ke Tool Instan' : 'Buka Panel Lengkap'}
                </span>
              </Link>
            </SidebarNavigationTooltip>
          )}
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
                      'mb-1 flex w-full cursor-pointer items-center justify-between rounded px-3 py-1 text-left text-[10px] font-black uppercase tracking-wider text-white hover:bg-emerald-800/40 hover:text-white',
                      collapsed && 'md:hidden',
                      groupIsActive && 'text-amber-300'
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
                      renderNavigationItem(
                        item,
                        currentUrl,
                        collapsed,
                        onMobileClose,
                        onTopupClick,
                        handleNavigationMode
                      )
                    )}
                  </div>
                </div>
              )
            }
            return renderNavigationItem(
              entry,
              currentUrl,
              collapsed,
              onMobileClose,
              onTopupClick,
              handleNavigationMode
            )
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-emerald-800/80 bg-emerald-950/60 p-3 dark:border-emerald-950/80">
          <div className="relative" ref={dropdownRef} data-tour="profile-menu">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={cn(
                'flex w-full cursor-pointer items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-emerald-900/60',
                collapsed && 'md:justify-center'
              )}
              title={collapsed ? user.fullName : undefined}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName ?? 'Avatar'}
                  className="h-9 w-9 flex-shrink-0 rounded-full object-cover border border-emerald-400/40"
                />
              ) : (
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-neutral-950 border border-emerald-300">
                  {user.initials}
                </div>
              )}
              <div className={cn('flex-1 overflow-hidden text-left', collapsed && 'md:hidden')}>
                <p className="truncate text-sm font-bold text-white">{user.fullName}</p>
                <p className="truncate text-xs font-medium text-white">
                  {roleLabels[user.role] || user.role}
                </p>
              </div>
              <ChevronRight
                className={cn(
                  'h-4 w-4 flex-shrink-0 text-white transition-transform',
                  collapsed && 'md:hidden',
                  dropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Dropdown position (bottom-full on mobile, left-full on desktop) */}
            {dropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_#000000] dark:border-neutral-700 dark:bg-neutral-900 md:bottom-0 md:left-full md:mb-0 md:ml-2 md:w-48">
                <Link
                  href="/settings"
                  onClick={() => {
                    setDropdownOpen(false)
                    onMobileClose?.()
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Settings className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                  Pengaturan
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false)
                    router.post('/logout')
                  }}
                  className="flex w-full items-center gap-2 border-t border-neutral-100 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-neutral-800 dark:text-red-400 dark:hover:bg-red-950"
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
