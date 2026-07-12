import { useEffect, useRef, useState } from 'react'
import { useInView, motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface AnimatedNumberProps {
  readonly value: number
  readonly suffix?: string
  readonly className?: string
  readonly decimals?: number
}

export function AnimatedNumber({ value, suffix = '', className = '', decimals = 0 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) =>
    decimals > 0 ? Number.parseFloat(latest.toFixed(decimals)) : Math.round(latest)
  )
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration: 1.5,
        ease: 'easeOut',
      })
      return () => controls.stop()
    }
  }, [isInView, value, motionValue])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplayValue(v))
    return () => unsubscribe()
  }, [rounded])

  const formattedValue =
    decimals > 0
      ? displayValue.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : displayValue.toLocaleString('id-ID')

  return (
    <motion.span ref={ref} className={className}>
      {formattedValue}{suffix}
    </motion.span>
  )
}
