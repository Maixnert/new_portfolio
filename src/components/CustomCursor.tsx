import { useEffect, useMemo, useRef } from 'react'

function useCursorEnabled() {
  return useMemo(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(pointer: coarse)').matches) return false
    if (window.matchMedia('(max-width: 768px)').matches) return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return true
  }, [])
}

export function CustomCursor() {
  const enabled = useCursorEnabled()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    document.body.classList.add('has-custom-cursor')

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let tx = 0
    let ty = 0
    let dx = 0
    let dy = 0
    let rx = 0
    let ry = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }

    const tick = () => {
      dx += (tx - dx) * 0.45
      dy += (ty - dy) * 0.45
      rx += (tx - rx) * 0.12
      ry += (ty - ry) * 0.12

      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  )
}
