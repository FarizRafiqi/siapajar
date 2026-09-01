import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import { toast, Toaster } from 'sonner'
import Sidebar from '~/components/dashboard/sidebar'
import Header from '~/components/dashboard/header'
import DashboardTour, { type DashboardTourName } from '~/components/dashboard/dashboard-tour'
import TopupModal from '~/components/dashboard/topup-modal'
import { cn } from '~/lib/utils'
import { CREDITS_UPDATED_EVENT } from '~/lib/credits'

interface User {
  id: number
  fullName: string
  email: string
  initials: string
  role: string
  educationLevel: 'tk' | 'sd' | null
  avatarUrl: string | null
  creditsBalance?: number
}

interface DashboardLayoutProps {
  children: ReactNode
  user: User
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
}

export default function DashboardLayout({
  children,
  user,
  title,
  breadcrumbs,
}: Readonly<DashboardLayoutProps>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  const [topupOpen, setTopupOpen] = useState(false)
  const [displayCredits, setDisplayCredits] = useState(user.creditsBalance)

  const openTopup = useCallback(() => setTopupOpen(true), [])
  const closeTopup = useCallback(() => setTopupOpen(false), [])

  useEffect(() => {
    const handleOpenTopup = () => setTopupOpen(true)
    window.addEventListener('open-topup-modal', handleOpenTopup)
    return () => window.removeEventListener('open-topup-modal', handleOpenTopup)
  }, [])

  useEffect(() => {
    setDisplayCredits(user.creditsBalance)
  }, [user.creditsBalance])

  useEffect(() => {
    const handleCreditsUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ creditsBalance?: unknown }>).detail
      if (typeof detail?.creditsBalance === 'number') {
        setDisplayCredits(detail.creditsBalance)
      }
    }

    window.addEventListener(CREDITS_UPDATED_EVENT, handleCreditsUpdated)
    return () => window.removeEventListener(CREDITS_UPDATED_EVENT, handleCreditsUpdated)
  }, [])

  const { flash } = usePage().props as {
    flash?: { success?: string; error?: string }
  }
  const page = usePage()
  const isGuru = user.role === 'guru'
  const isAdmin = user.role === 'admin'
  const tourName: DashboardTourName | null =
    isGuru && page.url === '/dashboard'
      ? 'dashboard'
      : isGuru && page.url.startsWith('/curriculum')
        ? 'curriculum'
        : isGuru && page.url.startsWith('/paud-assessments')
          ? 'paud-assessment'
          : null
  const isTourAvailable = tourName !== null
  const startTour = useCallback(() => setTourOpen(true), [])
  const finishTour = useCallback(() => setTourOpen(false), [])

  useEffect(() => {
    if (flash?.success) toast.success(flash.success)
    if (flash?.error) toast.error(flash.error)
  }, [flash])

  return (
    <div className="dashboard-shell min-h-screen bg-[#F4F4F5] dark:bg-[#121214] text-neutral-900 dark:text-neutral-100">
      {/* Sidebar */}
      <div className="print:hidden">
        <Sidebar
          user={user}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
          onTopupClick={openTopup}
        />
      </div>

      {/* Main content */}
      <div
        className={cn(
          'transition-all duration-300 print:ml-0 print:p-0',
          sidebarCollapsed ? 'md:ml-[68px]' : 'md:ml-64'
        )}
      >
        <div className="print:hidden">
          <Header
            title={title}
            breadcrumbs={breadcrumbs}
            onMenuClick={() => setMobileMenuOpen(true)}
            showTour={isTourAvailable}
            onTourClick={startTour}
            creditsBalance={isAdmin ? undefined : displayCredits}
            onTopupClick={openTopup}
            showTopup={!isAdmin}
            showHelp={!isAdmin}
          />
        </div>
        <main className="p-4 sm:p-6 print:p-0 print:m-0">{children}</main>
      </div>

      <Toaster position="top-right" closeButton />
      <TopupModal isOpen={topupOpen} onClose={closeTopup} currentCredits={displayCredits} />
      {tourName && (
        <DashboardTour
          active={tourOpen}
          autoStart
          educationLevel={user.educationLevel}
          tourName={tourName}
          onAutoStart={startTour}
          onFinish={finishTour}
        />
      )}
    </div>
  )
}
