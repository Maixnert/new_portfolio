import { useEffect, useRef } from 'react'
import paper from 'paper'

/** Liquid blob with Paper.js spring-like deformation. */
export function HeroOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scope = new paper.PaperScope()
    scope.setup(canvas)

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let mouse = new scope.Point(scope.view.size.width * 0.5, scope.view.size.height * 0.5)
    let mouseVelocity = new scope.Point(0, 0)

    const makeBlob = () => {
      const center = scope.view.center
      const baseRadius = Math.min(scope.view.size.width, scope.view.size.height) * 0.200
      const points = 42
      const blob = new scope.Path()

      for (let i = 0; i < points; i++) {
        const t = (i / points) * Math.PI * 2
        const lobeA = Math.sin(t * 3 + 0.35) * 0.2
        const lobeB = Math.sin(t * 7 - 0.8) * 0.11
        const lobeC = Math.sin(t * 11 + 1.25) * 0.07
        const radius = baseRadius * (1 + lobeA + lobeB + lobeC)
        const point = center.add(new scope.Point({ length: radius, angle: (t * 180) / Math.PI }))
        blob.add(point)
      }

      blob.closed = true
      blob.smooth({ type: 'continuous' })
      blob.fillColor = new scope.Color(1, 0.45, 0.33, 0.72)
      blob.shadowColor = new scope.Color(1, 0.34, 0.33, 0.4)
      blob.shadowBlur = 36
      blob.blendMode = 'screen'
      return blob
    }

    const makeDrops = () => {
      const center = scope.view.center
      const spread = Math.min(scope.view.size.width, scope.view.size.height) * 0.44
      const count = 7
      const drops: paper.Path[] = []
      const placed: Array<{ pos: paper.Point; radius: number }> = []
      const mainRadius = Math.min(scope.view.size.width, scope.view.size.height) * 0.165
      const minSize = Math.min(scope.view.size.width, scope.view.size.height) * 0.012
      const maxSize = Math.min(scope.view.size.width, scope.view.size.height) * 0.021
      const minGap = Math.min(scope.view.size.width, scope.view.size.height) * 0.018

      let seed = 1779033703
      const rand = () => {
        seed ^= seed << 13
        seed ^= seed >> 17
        seed ^= seed << 5
        return ((seed >>> 0) % 100000) / 100000
      }

      const makeIrregularDrop = (pos: paper.Point, radius: number) => {
        const p = new scope.Path()
        const points = 10
        const wobble = 0.09
        for (let j = 0; j < points; j++) {
          const t = (j / points) * Math.PI * 2
          const r = radius * (1 + (rand() - 0.5) * wobble)
          p.add(pos.add(new scope.Point({ length: r, angle: (t * 180) / Math.PI })))
        }
        p.closed = true
        p.smooth({ type: 'continuous' })
        p.fillColor = new scope.Color(1, 0.45, 0.33, 0.36)
        p.shadowColor = new scope.Color(1, 0.34, 0.33, 0.12)
        p.shadowBlur = 10
        p.blendMode = 'normal'
        return p
      }

      for (let i = 0; i < count; i++) {
        let placedDrop = false
        for (let attempts = 0; attempts < 120 && !placedDrop; attempts++) {
          const radius = minSize + rand() * (maxSize - minSize)
          const angle = rand() * Math.PI * 2
          const distance = spread * (0.78 + rand() * 0.32)
          const pos = center.add(
            new scope.Point({
              length: distance,
              angle: (angle * 180) / Math.PI,
            }),
          )

          const distFromMain = pos.getDistance(center)
          if (distFromMain < mainRadius + radius + minGap) continue

          const intersectsExisting = placed.some(
            (d) => pos.getDistance(d.pos) < d.radius + radius + minGap,
          )
          if (intersectsExisting) continue

          const drop = makeIrregularDrop(pos, radius)
          drops.push(drop)
          placed.push({ pos, radius })
          placedDrop = true
        }
      }

      return drops
    }

    let blob = makeBlob()
    let drops = makeDrops()
    let blobGroup = new scope.Group([blob, ...drops])
    let baseOffsets = blob.segments.map((seg) => seg.point.subtract(scope.view.center))
    let velocities = blob.segments.map(() => new scope.Point(0, 0))
    let dropHomes = drops.map((d) => d.position.subtract(scope.view.center))
    let dropVelocities = drops.map(() => new scope.Point(0, 0))

    const applyDrawingTransform = () => {
      const center = scope.view.center
      blobGroup.matrix.reset()
      blobGroup.translate(new scope.Point(18, 10))
      blobGroup.scale(1.2, center)
    }

    applyDrawingTransform()

    const resetGeometry = () => {
      blobGroup.remove()
      blob = makeBlob()
      drops = makeDrops()
      blobGroup = new scope.Group([blob, ...drops])
      baseOffsets = blob.segments.map((seg) => seg.point.subtract(scope.view.center))
      velocities = blob.segments.map(() => new scope.Point(0, 0))
      dropHomes = drops.map((d) => d.position.subtract(scope.view.center))
      dropVelocities = drops.map(() => new scope.Point(0, 0))
      applyDrawingTransform()
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const next = new scope.Point(event.clientX - rect.left, event.clientY - rect.top)
      mouseVelocity = next.subtract(mouse)
      mouse = next
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    if (!prefersReduced) {
      scope.view.onFrame = () => {
        const center = scope.view.center
        const influenceRadius = Math.min(scope.view.size.width, scope.view.size.height) * 0.55
        const speedFactor = Math.min(mouseVelocity.length / 24, 1.5)

        blob.segments.forEach((seg, i) => {
          const home = center.add(baseOffsets[i])
          const toHome = home.subtract(seg.point)
          velocities[i] = velocities[i].add(toHome.multiply(0.075))

          const fromMouse = seg.point.subtract(mouse)
          const dist = fromMouse.length
          if (dist < influenceRadius && dist > 0.001) {
            const falloff = 1 - dist / influenceRadius
            const pressure = falloff * falloff * (1 + speedFactor)
            const push = fromMouse.normalize().multiply(pressure * 2.2)
            const drag = mouseVelocity.multiply(0.018 * falloff)
            velocities[i] = velocities[i].add(push).add(drag)
          }

          velocities[i] = velocities[i].multiply(0.87)
          seg.point = seg.point.add(velocities[i])
        })

        drops.forEach((drop, i) => {
          const home = center.add(dropHomes[i])
          const toHome = home.subtract(drop.position)
          dropVelocities[i] = dropVelocities[i].add(toHome.multiply(0.06))

          const fromMouse = drop.position.subtract(mouse)
          const dist = fromMouse.length
          if (dist < influenceRadius * 1.1 && dist > 0.001) {
            const falloff = 1 - dist / (influenceRadius * 1.1)
            const pressure = falloff * falloff * (1 + speedFactor * 0.9)
            const push = fromMouse.normalize().multiply(pressure * 1.25)
            const drag = mouseVelocity.multiply(0.012 * falloff)
            dropVelocities[i] = dropVelocities[i].add(push).add(drag)
          }

          dropVelocities[i] = dropVelocities[i].multiply(0.9)
          drop.position = drop.position.add(dropVelocities[i])
        })

        blob.smooth({ type: 'continuous' })
        mouseVelocity = mouseVelocity.multiply(0.86)
      }
    }

    scope.view.onResize = () => resetGeometry()

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      scope.view.onFrame = null
      scope.view.onResize = null
      scope.project.clear()
    }
  }, [])

  return (
    <div className="hero-orb" aria-hidden>
      <canvas ref={canvasRef} className="hero-orb__canvas" />
      <div className="hero-orb__glow" />
    </div>
  )
}
