import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* Match :root --accent / --accent-2 / --text in index.css */
const ACCENT = 0xe8593c
const ACCENT2 = 0xc84fb0

/** Perspective gravity grid + brand-gradient sphere; pointer over hero activates well + planet. */
export function HeroSpacetimeGrid() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch (err) {
      console.warn('WebGL init failed, hero visual skipped', err)
      return
    }

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    const camDir = new THREE.Vector3(4.6, 3.35, 5.2).normalize()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    renderer.domElement.classList.add('hero-orb__canvas', 'hero-orb__canvas--three')
    container.appendChild(renderer.domElement)

    const amb = new THREE.AmbientLight(0xfff8f5, reduced ? 0.5 : 0.38)
    const dir = new THREE.DirectionalLight(0xfff5f0, reduced ? 0.55 : 0.88)
    dir.position.set(2.8, 5, 3.2)
    /* Brand-colored fills so the grid reads warmer (matches site hero glow) */
    const planetGlow = new THREE.PointLight(ACCENT, reduced ? 0.14 : 0.22, 18, 2)
    planetGlow.decay = 2
    const accentGlow = new THREE.PointLight(ACCENT2, reduced ? 0.1 : 0.16, 22, 2)
    accentGlow.decay = 2
    accentGlow.position.set(1.4, 2.2, 2.6)
    scene.add(amb, dir, planetGlow, accentGlow)

    const seg = reduced ? 36 : 52
    /* Square lattice bounds; visible grid is clipped to an inscribed disc */
    const extent = 9.2
    const planeW = extent
    const planeH = extent
    const discR = (Math.min(planeW, planeH) * 0.5) * 0.97
    const discFade0 = discR * 0.2

    const vx = seg + 1
    const vy = seg + 1
    const vertCount = vx * vy

    const baseXZ = new Float32Array(vertCount * 2)
    const alpha0 = new Float32Array(vertCount)

    let vi = 0
    for (let i = 0; i < vy; i++) {
      for (let j = 0; j < vx; j++) {
        const x = (j / seg - 0.5) * planeW
        const z = (i / seg - 0.5) * planeH
        baseXZ[vi * 2] = x
        baseXZ[vi * 2 + 1] = z
        const r = Math.sqrt(x * x + z * z)
        /* Circular falloff for line color (brand rim at edge of disc) */
        alpha0[vi] = 1 - THREE.MathUtils.smoothstep(r, discFade0, discR * 0.94)
        vi++
      }
    }

    const horizLines = vy * (vx - 1)
    const vertLines = (vy - 1) * vx
    const pairCount = horizLines + vertLines
    const pos = new Float32Array(pairCount * 2 * 3)
    const alp = new Float32Array(pairCount * 2)

    let write = 0
    const pushEdge = (a: number, b: number) => {
      const ax = baseXZ[a * 2]
      const az = baseXZ[a * 2 + 1]
      const bx = baseXZ[b * 2]
      const bz = baseXZ[b * 2 + 1]
      pos[write * 3] = ax
      pos[write * 3 + 1] = 0
      pos[write * 3 + 2] = az
      alp[write] = (alpha0[a] + alpha0[b]) * 0.5
      write++
      pos[write * 3] = bx
      pos[write * 3 + 1] = 0
      pos[write * 3 + 2] = bz
      alp[write] = (alpha0[a] + alpha0[b]) * 0.5
      write++
    }

    for (let i = 0; i < vy; i++) {
      for (let j = 0; j < vx - 1; j++) {
        const a = i * vx + j
        const b = i * vx + j + 1
        pushEdge(a, b)
      }
    }
    for (let j = 0; j < vx; j++) {
      for (let i = 0; i < vy - 1; i++) {
        const a = i * vx + j
        const b = (i + 1) * vx + j
        pushEdge(a, b)
      }
    }

    const gridGeo = new THREE.BufferGeometry()
    gridGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    gridGeo.setAttribute('alpha', new THREE.BufferAttribute(alp, 1))

    const gridMat = new THREE.ShaderMaterial({
      uniforms: {
        uMult: { value: reduced ? 0.085 : 0.12 },
        uPresence: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uVignetteInner: { value: 0.028 },
        uVignetteOuter: { value: 0.11 },
        uDiscRadius: { value: discR },
        uDiscFeather: { value: discR * 0.055 },
      },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        varying vec2 vXZ;
        void main() {
          vAlpha = alpha;
          vXZ = position.xz;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform float uMult;
        uniform float uPresence;
        uniform vec2 uResolution;
        uniform float uVignetteInner;
        uniform float uVignetteOuter;
        uniform float uDiscRadius;
        uniform float uDiscFeather;
        varying float vAlpha;
        varying vec2 vXZ;
        void main() {
          vec2 p = gl_FragCoord.xy / uResolution.xy;
          vec2 d = min(p, 1.0 - p);
          float edgeDist = min(d.x, d.y);
          float vign = smoothstep(uVignetteInner, uVignetteOuter, edgeDist);

          float rc = length(vXZ);
          float disc = 1.0 - smoothstep(uDiscRadius - uDiscFeather, uDiscRadius + 0.001, rc);

          /* #f5f3ef base, coral + magenta rim like --gradient-cta */
          vec3 base = vec3(0.961, 0.953, 0.937);
          vec3 coral = vec3(0.910, 0.349, 0.235);
          vec3 rose = vec3(0.784, 0.310, 0.690);
          float rim = 1.0 - vAlpha;
          vec3 rgb = mix(base, coral, vAlpha * 0.26);
          rgb = mix(rgb, rose, rim * 0.28);

          float a = uMult * vAlpha * (0.75 + 0.25 * uPresence) * vign * disc;
          gl_FragColor = vec4(rgb, a);
        }
      `,
      transparent: true,
      depthWrite: false,
    })

    const gridLines = new THREE.LineSegments(gridGeo, gridMat)
    scene.add(gridLines)

    const sphereGeom = new THREE.SphereGeometry(0.19, 32, 24)
    const emissiveBlend = new THREE.Color(ACCENT2).lerp(new THREE.Color(ACCENT), 0.45)
    const sphereMat = new THREE.MeshStandardMaterial({
      color: ACCENT,
      emissive: emissiveBlend,
      emissiveIntensity: reduced ? 0.16 : 0.22,
      metalness: 0.28,
      roughness: 0.4,
    })
    const planet = new THREE.Mesh(sphereGeom, sphereMat)
    planet.scale.setScalar(0)
    planet.visible = false
    scene.add(planet)

    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const hit = new THREE.Vector3()
    const gravTarget = new THREE.Vector3(0, 0, 0)
    const gravSmooth = new THREE.Vector3(0, 0, 0)

    let pointerInside = false
    let presence = 0
    const wellK = reduced ? 0.55 : coarsePointer ? 1.2 : 1.05
    const dipCap = reduced ? 0.45 : 1.05
    const motionScale = reduced ? 0.32 : coarsePointer ? 0.88 : 1

    const onMove = (e: PointerEvent) => {
      const cw = container.clientWidth
      const ch = Math.max(container.clientHeight, 1)
      const rect = container.getBoundingClientRect()
      ndc.x = ((e.clientX - rect.left) / cw) * 2 - 1
      ndc.y = -((e.clientY - rect.top) / ch) * 2 + 1
      raycaster.setFromCamera(ndc, camera)
      if (raycaster.ray.intersectPlane(plane, hit)) {
        gravTarget.set(hit.x, 0, hit.z)
        const glen = Math.hypot(gravTarget.x, gravTarget.z)
        const cap = discR * 0.96
        if (glen > cap && glen > 1e-6) {
          gravTarget.multiplyScalar(cap / glen)
        }
      }
    }

    const onEnter = () => {
      pointerInside = true
    }
    const onLeave = () => {
      pointerInside = false
    }

    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerenter', onEnter)
    container.addEventListener('pointerleave', onLeave)

    const gravityR0 = 0.42
    let raf = 0
    const clock = new THREE.Clock()

    const drawingSize = new THREE.Vector2()

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / Math.max(h, 1)
      const vFovRad = (camera.fov * Math.PI) / 180
      const margin = 1.06
      const distV = (discR * margin) / Math.tan(vFovRad / 2)
      const distH = (discR * margin) / (Math.tan(vFovRad / 2) * Math.max(camera.aspect, 0.001))
      const camDist = Math.max(distV, distH)
      camera.position.copy(camDir.clone().multiplyScalar(camDist))
      camera.lookAt(0, 0, 0)
      if (!reduced) {
        camera.rotateZ(THREE.MathUtils.degToRad(-2.5))
      }
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.getDrawingBufferSize(drawingSize)
      gridMat.uniforms.uResolution.value.copy(drawingSize)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()

    const updateGrid = () => {
      const gx = gravSmooth.x
      const gz = gravSmooth.z
      let w = 0
      for (let i = 0; i < vy; i++) {
        for (let j = 0; j < vx - 1; j++) {
          for (const v of [i * vx + j, i * vx + j + 1]) {
            const x = baseXZ[v * 2]
            const z = baseXZ[v * 2 + 1]
            const dx = x - gx
            const dz = z - gz
            const dist2 = dx * dx + dz * dz + gravityR0 * gravityR0
            let y = (-(wellK * presence * motionScale) / dist2) * (planeW * 0.18)
            y = Math.max(y, -dipCap)
            pos[w * 3] = x
            pos[w * 3 + 1] = y
            pos[w * 3 + 2] = z
            w++
          }
        }
      }
      for (let j = 0; j < vx; j++) {
        for (let i = 0; i < vy - 1; i++) {
          for (const v of [i * vx + j, (i + 1) * vx + j]) {
            const x = baseXZ[v * 2]
            const z = baseXZ[v * 2 + 1]
            const dx = x - gx
            const dz = z - gz
            const dist2 = dx * dx + dz * dz + gravityR0 * gravityR0
            let y = (-(wellK * presence * motionScale) / dist2) * (planeW * 0.18)
            y = Math.max(y, -dipCap)
            pos[w * 3] = x
            pos[w * 3 + 1] = y
            pos[w * 3 + 2] = z
            w++
          }
        }
      }
      const attr = gridGeo.getAttribute('position') as THREE.BufferAttribute
      attr.needsUpdate = true
    }

    const tick = () => {
      const dt = clock.getDelta()
      const pLerp = reduced ? 2.5 : coarsePointer ? 6.5 : 5
      presence += ((pointerInside ? 1 : 0) - presence) * Math.min(1, dt * pLerp)
      gridMat.uniforms.uPresence.value = presence

      const gravLerp = reduced ? 0.08 : coarsePointer ? 0.2 : 0.12
      gravSmooth.lerp(gravTarget, gravLerp)
      updateGrid()

      const cx = gravSmooth.x
      const cz = gravSmooth.z
      const dist2c = gravityR0 * gravityR0
      const dipCenter = (-(wellK * presence * motionScale) / dist2c) * (planeW * 0.18)
      const yCenter = Math.max(dipCenter, -dipCap)
      planet.position.set(cx, yCenter + 0.19 * presence, cz)
      planet.scale.setScalar(0.92 * presence)
      planet.visible = presence > 0.02

      planetGlow.position.copy(planet.position)
      planetGlow.intensity = (reduced ? 0.1 : 0.16) + presence * (reduced ? 0.18 : 0.32)
      sphereMat.emissiveIntensity = (reduced ? 0.14 : 0.18) + presence * (reduced ? 0.14 : 0.26)

      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerenter', onEnter)
      container.removeEventListener('pointerleave', onLeave)
      const canvas = renderer.domElement
      if (canvas.parentNode === container) {
        container.removeChild(canvas)
      }
      renderer.dispose()
      gridGeo.dispose()
      gridMat.dispose()
      sphereGeom.dispose()
      sphereMat.dispose()
    }
  }, [])

  return (
    <div className="hero-orb hero-orb--interactive" ref={containerRef} aria-hidden>
      {/* canvas injected here */}
    </div>
  )
}
