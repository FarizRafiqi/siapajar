import { type ReactNode, useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '~/lib/utils'

interface MagicButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function MagicButton({ children, className = '', onClick }: MagicButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const rafRef = useRef<number>(0)

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn('relative group', className)}
      style={{ willChange: 'transform' }}
    >
      {/* Static gradient border — no blur, no animation, GPU-layer */}
      <div
        className={cn(
          'absolute -inset-[2px] rounded-xl transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: 'conic-gradient(from 0deg, #059669, #10b981, #34d399, #059669)',
          willChange: 'opacity',
          transform: 'translateZ(0)',
          contain: 'paint',
        }}
      />
      {/* Button content — min-h-12 matches HeroUI Button size="lg" */}
      <div className="relative bg-emerald-600 text-white rounded-xl px-8 py-3 min-h-12 flex items-center justify-center font-bold text-lg">
        {children}
      </div>
    </motion.button>
  )
}
