import { ReactNode, useState } from 'react'
import Sidebar from '~/components/dashboard/sidebar'
import Header from '~/components/dashboard/header'
import { cn } from '~/lib/utils'

interface User {
  id: number
  fullName: string
  email: string
  initials: string
  role: string
}

interface DashboardLayoutProps {
  children: ReactNode
  user: User
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
}

export default function DashboardLayout({ children, user, title, breadcrumbs }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <Sidebar
        user={user}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <div className={cn('transition-all duration-300', sidebarCollapsed ? 'ml-[68px]' : 'ml-64')}>
        <Header title={title} breadcrumbs={breadcrumbs} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
