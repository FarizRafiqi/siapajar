import { type ReactNode } from 'react'
import { cn } from '~/lib/utils'

interface AuroraBackgroundProps {
  children: ReactNode
  className?: string
}

export function AuroraBackground({ children, className = '' }: AuroraBackgroundProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Aurora blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(5,150,105,0.15) 50%, transparent 70%)',
            animation: 'aurora-1 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.15) 50%, transparent 70%)',
            animation: 'aurora-2 10s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/4 left-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(52,211,153,0.25) 0%, rgba(16,185,129,0.1) 50%, transparent 70%)',
            animation: 'aurora-3 12s ease-in-out infinite',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
