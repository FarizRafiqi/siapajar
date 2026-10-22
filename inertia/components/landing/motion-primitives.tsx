import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { type ReactNode, useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  readonly children: ReactNode
  readonly className?: string
  readonly delay?: number
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16, margin: '0px 0px -40px' }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const

interface WordRevealProps {
  readonly text: string
  readonly className?: string
  readonly delay?: number
  readonly as?: 'h1' | 'h2'
}

/** Headline yang muncul kata per kata (stagger). */
export function WordReveal({ text, className, delay = 0, as = 'h1' }: WordRevealProps) {
  const reduceMotion = useReducedMotion()
  const Tag = motion[as]
  const words = text.split(' ')

  return (
    <Tag
      className={className}
      aria-label={text}
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-1 align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '110%', opacity: 0 }, visible: { y: '0%', opacity: 1 } }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

interface StaggerProps {
  readonly children: ReactNode
  readonly className?: string
  readonly stagger?: number
}

/** Container: anak `StaggerItem` muncul berurutan saat masuk viewport. */
export function Stagger({ children, className, stagger = 0.08 }: StaggerProps) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px' }}
      transition={{ staggerChildren: stagger }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

/** Kartu miring 3D mengikuti kursor. Nonaktif di layar sentuh & reduced motion. */
export function TiltCard({
  children,
  className,
  max = 6,
}: Readonly<{ children: ReactNode; className?: string; max?: number }>) {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), {
    stiffness: 150,
    damping: 18,
  })
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), {
    stiffness: 150,
    damping: 18,
  })

  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width - 0.5)
        y.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/** Elemen tertarik pelan ke arah kursor (tombol CTA). */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: Readonly<{ children: ReactNode; className?: string; strength?: number }>) {
  const reduceMotion = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })

  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/** Bar progres scroll tipis di atas halaman. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 z-[60] h-1 bg-emerald-500"
    />
  )
}

/** Teks/ikon berjalan tak terbatas. */
export function Marquee({
  children,
  className,
  duration = 30,
}: Readonly<{ children: ReactNode; className?: string; duration?: number }>) {
  const reduceMotion = useReducedMotion()
  return (
    <div className={`overflow-hidden ${className ?? ''}`} aria-hidden="true">
      <motion.div
        className="flex w-max gap-10"
        animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        <div className="flex shrink-0 items-center gap-10">{children}</div>
        <div className="flex shrink-0 items-center gap-10">{children}</div>
      </motion.div>
    </div>
  )
}

/** Angka menghitung naik saat terlihat. */
export function CountUp({
  to,
  format = (n: number) => n.toLocaleString('id-ID'),
}: Readonly<{ to: number; format?: (n: number) => string }>) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(reduceMotion ? to : 0)

  useEffect(() => {
    if (!inView || reduceMotion) return
    const controls = animate(0, to, {
      duration: 1.2,
      ease: EASE_OUT,
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, reduceMotion])

  return <span ref={ref}>{format(value)}</span>
}
