import { useEffect, useRef } from 'react'

/**
 * Lightweight mobile stand-in for the Three.js gravity field:
 * line grid warped toward finger/touch — same metaphor, no WebGL/Three.js.
 */
export function HeroGravityFieldLite() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let running = true
    let w = 1
    let h = 1
    let dpr = 1
    let lastT = 0

    let tx = 0
    let ty = 0.08
    let sx = 0
    let sy = 0.08
    let presence = 0.45
    let targetPresence = 0.55
    let time = 0

    const cols = 18
    const rows = 14

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const setFromClient = (clientX: number, clientY: number, active: boolean) => {
      const rect = wrap.getBoundingClientRect()
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((clientY - rect.top) / rect.height) * 2 - 1
      tx = Math.max(-1, Math.min(1, nx))
      ty = Math.max(-1, Math.min(1, ny))
      targetPresence = active ? 1 : 0.55
    }

    const onPointerMove = (e: PointerEvent) => {
      setFromClient(e.clientX, e.clientY, true)
    }
    const onPointerDown = (e: PointerEvent) => {
      wrap.setPointerCapture?.(e.pointerId)
      setFromClient(e.clientX, e.clientY, true)
    }
    const onPointerUp = () => {
      targetPresence = 0.55
    }

    const project = (gx: number, gy: number) => {
      const dx = gx - sx
      const dy = gy - sy
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.001
      const pull = (0.22 * presence) / (dist * dist + 0.12)
      const dip = Math.min(pull, 0.42)
      const px = gx - dx * dip
      const py = gy - dy * dip
      const cx = w * 0.52
      const cy = h * 0.44
      const rx = w * 0.42
      const ry = h * 0.38
      return {
        x: cx + px * rx,
        y: cy + py * ry,
        a: Math.max(0, 1 - Math.hypot(px, py) * 0.92),
      }
    }

    const frame = (t: number) => {
      if (!running) return
      const now = t / 1000
      const dt = lastT ? Math.min(0.05, now - lastT) : 0.016
      lastT = now
      time += dt

      const lerp = reduceMotion ? 1 : Math.min(1, dt * 6)
      sx += (tx - sx) * lerp
      sy += (ty - sy) * lerp
      presence += (targetPresence - presence) * Math.min(1, dt * 4)

      ctx.clearRect(0, 0, w, h)

      const breath = reduceMotion ? 1 : 1 + Math.sin(time * 0.9) * 0.03
      const wellR = 18 + presence * 28 * breath
      const well = project(sx, sy)

      const glow = ctx.createRadialGradient(well.x, well.y, 0, well.x, well.y, wellR * 3.2)
      glow.addColorStop(0, `rgba(232, 89, 60, ${0.22 * presence})`)
      glow.addColorStop(0.45, `rgba(200, 79, 176, ${0.1 * presence})`)
      glow.addColorStop(1, 'rgba(232, 89, 60, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(well.x, well.y, wellR * 3.2, 0, Math.PI * 2)
      ctx.fill()

      ctx.lineWidth = 1
      ctx.lineCap = 'round'

      for (let j = 0; j <= rows; j++) {
        const gy = (j / rows) * 2 - 1
        ctx.beginPath()
        for (let i = 0; i <= cols; i++) {
          const gx = (i / cols) * 2 - 1
          const p = project(gx, gy)
          if (i === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.strokeStyle = `rgba(245, 243, 239, ${0.12 + presence * 0.16})`
        ctx.stroke()
      }

      for (let i = 0; i <= cols; i++) {
        const gx = (i / cols) * 2 - 1
        ctx.beginPath()
        for (let j = 0; j <= rows; j++) {
          const gy = (j / rows) * 2 - 1
          const p = project(gx, gy)
          if (j === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.strokeStyle = `rgba(245, 243, 239, ${0.1 + presence * 0.14})`
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.fillStyle = `rgba(232, 89, 60, ${0.55 + presence * 0.35})`
      ctx.shadowColor = 'rgba(232, 89, 60, 0.55)'
      ctx.shadowBlur = 18 * presence
      ctx.arc(well.x, well.y, 5 + presence * 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      raf = requestAnimationFrame(frame)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    wrap.addEventListener('pointermove', onPointerMove, { passive: true })
    wrap.addEventListener('pointerdown', onPointerDown, { passive: true })
    wrap.addEventListener('pointerup', onPointerUp, { passive: true })
    wrap.addEventListener('pointercancel', onPointerUp, { passive: true })
    wrap.addEventListener('pointerleave', onPointerUp, { passive: true })

    raf = requestAnimationFrame(frame)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      wrap.removeEventListener('pointermove', onPointerMove)
      wrap.removeEventListener('pointerdown', onPointerDown)
      wrap.removeEventListener('pointerup', onPointerUp)
      wrap.removeEventListener('pointercancel', onPointerUp)
      wrap.removeEventListener('pointerleave', onPointerUp)
    }
  }, [])

  return (
    <div className="hero-orb hero-orb--interactive hero-orb--lite" ref={wrapRef} aria-hidden>
      <canvas className="hero-orb__canvas hero-orb__canvas--lite" ref={canvasRef} />
      <div className="hero-orb__glow" />
    </div>
  )
}
