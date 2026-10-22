import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'

/** Smooth scroll berinersia (Lenis) khusus landing. Mati saat reduced motion. */
export function SmoothScroll() {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return

    const lenis = new Lenis({ anchors: { offset: -88 }, lerp: 0.1 })
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduceMotion])

  return null
}
