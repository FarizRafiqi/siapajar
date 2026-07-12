import { type ReactNode } from 'react'
import { cn } from '~/lib/utils'

interface InfiniteMovingCardsProps {
  items: { content: ReactNode }[]
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  className?: string
}

export function InfiniteMovingCards({
  items,
  direction = 'left',
  speed = 'slow',
  className = '',
}: InfiniteMovingCardsProps) {
  const duration = speed === 'fast' ? '20s' : speed === 'normal' ? '40s' : '80s'
  const animationDirection = direction === 'left' ? 'normal' : 'reverse'

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10" />

      <div
        className="flex gap-6 w-max"
        style={{
          animation: `scroll ${duration} linear infinite`,
          animationDirection,
        }}
      >
        {[...items, ...items].map((item, idx) => (
          <div key={idx} className="flex-shrink-0 w-[380px]">
            {item.content}
          </div>
        ))}
      </div>
    </div>
  )
}
