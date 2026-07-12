import { type ReactNode, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '~/lib/utils'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
}

export function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isDark, setIsDark] = useState(false)

  function handleMouseEnter() {
    setIsHovered(true)
    setIsDark(document.documentElement.classList.contains('dark'))
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const spotlightColor = isDark
    ? 'rgba(16,185,129,0.12)'
    : 'rgba(16,185,129,0.08)'

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-6 shadow-md transition-all hover:shadow-xl dark:hover:shadow-emerald-900/20 dark:hover:border-emerald-800/50',
        className
      )}
      style={{
        background: isHovered
          ? `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`
          : undefined,
      }}
    >
      {children}
    </motion.div>
  )
}
