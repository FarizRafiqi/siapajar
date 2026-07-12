import { ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import DashboardLayout from '~/layouts/dashboard'

interface User {
  id: number
  fullName: string
  email: string
  initials: string
  role: string
}

interface PageProps {
  user: User
}

interface DashboardWrapperProps {
  children: ReactNode
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
}

export default function DashboardWrapper({ children, title, breadcrumbs }: Readonly<DashboardWrapperProps>) {
  const { user } = usePage().props as PageProps

  return (
    <DashboardLayout user={user} title={title} breadcrumbs={breadcrumbs}>
      {children}
    </DashboardLayout>
  )
}
