import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'framer-motion'

/** Tracks the user's `prefers-reduced-motion` setting so decorative motion can be skipped. */
// eslint-disable-next-line react-refresh/only-export-components -- shared hook, not a component
export function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}

type MagneticLinkProps = HTMLMotionProps<'a'> & {
  strength?: number
}

/** A link that gently pulls toward the cursor within its own bounds. Disabled under reduced motion. */
export function MagneticLink({ strength = 14, style, ...props }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 320, damping: 22, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 320, damping: 22, mass: 0.4 })
  const reducedMotion = usePrefersReducedMotion()

  const handleMouseMove = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(((event.clientX - rect.left - rect.width / 2) / rect.width) * strength)
    y.set(((event.clientY - rect.top - rect.height / 2) / rect.height) * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, x: springX, y: springY }}
      {...props}
    />
  )
}

/** A quiet, twinkling starfield rendered on canvas. Freezes to a static frame under reduced motion. */
export function StarField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    type Star = { x: number; y: number; r: number; phase: number; speed: number }
    let stars: Star[] = []
    let width = 0
    let height = 0
    let frame = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round((width * height) / 6500)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.35 + 0.12,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const star of stars) {
        const twinkle = 0.45 + Math.sin(frame * star.speed * 0.05 + star.phase) * 0.4
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(214, 236, 255, ${Math.max(twinkle, 0.06)})`
        ctx.fill()
      }
    }

    resize()
    draw()

    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(canvas)

    if (reducedMotion) {
      return () => ro.disconnect()
    }

    let raf = 0
    const loop = () => {
      frame += 1
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [reducedMotion])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
