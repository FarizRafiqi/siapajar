import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import { toast, Toaster } from 'sonner'
import Sidebar from '~/components/dashboard/sidebar'
import Header from '~/components/dashboard/header'
import DashboardTour from '~/components/dashboard/dashboard-tour'
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

  const { flash } = usePage().props as {
    flash?: { success?: string; error?: string }
  }
  const page = usePage()
  const isGuruDashboard = user.role === 'guru' && page.url === '/dashboard'
  const startTour = useCallback(() => setTourOpen(true), [])
  const finishTour = useCallback(() => setTourOpen(false), [])

  useEffect(() => {
    if (flash?.success) toast.success(flash.success)
    if (flash?.error) toast.error(flash.error)
  }, [flash])

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <Sidebar
        user={user}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'md:ml-[68px]' : 'md:ml-64'
        )}
      >
        <Header
          title={title}
          breadcrumbs={breadcrumbs}
          onMenuClick={() => setMobileMenuOpen(true)}
          showTour={isGuruDashboard}
          onTourClick={startTour}
        />
        <main className="p-4 sm:p-6">{children}</main>
      </div>

      <Toaster position="top-right" closeButton />
      {isGuruDashboard && (
        <DashboardTour
          active={tourOpen}
          autoStart
          educationLevel={user.educationLevel}
          onAutoStart={startTour}
          onFinish={finishTour}
        />
      )}
    </div>
  )
}
