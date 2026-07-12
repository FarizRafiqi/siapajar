import { useEffect, useRef } from 'react'
import { motion, stagger, useAnimate } from 'framer-motion'

interface TextGenerateEffectProps {
  words: string
  className?: string
}

export function TextGenerateEffect({ words, className = '' }: TextGenerateEffectProps) {
  const [scope, animate] = useAnimate()
  const containerRef = useRef<HTMLDivElement>(null)
  const wordsArray = words.split(' ')

  useEffect(() => {
    if (!containerRef.current) return
    animate(
      'span',
      { opacity: 1, filter: 'blur(0px)' },
      { duration: 0.5, delay: stagger(0.15) }
    )
  }, [animate])

  return (
    <div ref={containerRef} className={className}>
      <div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="opacity-0 inline-block"
            style={{ filter: 'blur(10px)' }}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </div>
    </div>
  )
}
