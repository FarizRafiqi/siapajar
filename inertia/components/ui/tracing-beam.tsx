import { type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface TracingBeamProps {
  children: ReactNode
  className?: string
}

export function TracingBeam({ children, className = '' }: Readonly<TracingBeamProps>) {
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 0.8], ['0%', '100%'])
  const y2 = useTransform(scrollYProgress, [0, 0.8], ['0%', '80%'])

  return (
    <div className={`relative ${className}`}>
      {/* Vertical beam */}
      <div className="absolute left-8 top-0 bottom-0 w-px">
        {/* Background line */}
        <div className="h-full w-full bg-gray-200 dark:bg-gray-700/50" />
        {/* Animated gradient */}
        <motion.div
          className="absolute top-0 left-0 w-full"
          style={{ y: y1, height: '30%' }}
        >
          <div className="w-full h-full bg-gradient-to-b from-emerald-500 to-transparent rounded-full" />
        </motion.div>
      </div>

      {/* Glowing dot */}
      <motion.div
        className="absolute left-[29px] w-3 h-3 z-10"
        style={{ top: y2 }}
      >
        <div className="w-full h-full rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 dark:shadow-emerald-400/40" />
      </motion.div>

      {/* Content */}
      <div className="pl-16">{children}</div>
    </div>
  )
}
