import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const FALLBACK_HEX = {
  accent: 0xe8593c,
  accent2: 0xc84fb0,
  accent3: 0x5b4fe8,
} as const

function cssColor(varName: string, fallback: number): THREE.Color {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  try {
    if (raw) return new THREE.Color(raw)
  } catch {
    /* invalid */
  }
  return new THREE.Color(fallback)
}

const gridVert = `
  attribute float alpha;
  varying float vAlpha;
  varying vec2 vXZ;
  void main() {
    vAlpha = alpha;
    vXZ = position.xz;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`

const gridFrag = `
  uniform float uMult;
  uniform float uPresence;
  uniform float uTime;
  uniform float uShimmer;
  uniform vec2 uResolution;
  uniform float uVignetteInner;
  uniform float uVignetteOuter;
  uniform float uDiscRadius;
  uniform float uDiscFeather;
  uniform vec3 uCoral;
  uniform vec3 uRose;
  uniform vec3 uIndigo;
  varying float vAlpha;
  varying vec2 vXZ;

  void main() {
    vec2 p = gl_FragCoord.xy / uResolution.xy;
    vec2 d = min(p, 1.0 - p);
    float edgeDist = min(d.x, d.y);
    float vign = smoothstep(uVignetteInner, uVignetteOuter, edgeDist);

    float rc = length(vXZ);
    float disc = 1.0 - smoothstep(uDiscRadius - uDiscFeather, uDiscRadius + 0.001, rc);
    disc = clamp(disc, 0.0, 1.0);

    vec3 base = vec3(0.961, 0.953, 0.937);
    float rim = 1.0 - vAlpha;
    vec3 rgb = mix(base, uCoral, vAlpha * 0.26);
    rgb = mix(rgb, uRose, rim * 0.22);
    rgb = mix(rgb, uIndigo, rim * 0.12);

    float grain = 0.0;
    if (uShimmer > 0.001) {
      float h = fract(sin(dot(vXZ * 0.63, vec2(127.1, 311.7))) * 43758.5453);
      grain = uShimmer * (sin(uTime * 1.15 + h * 6.28318) * 0.5 + 0.5) * vAlpha;
    }

    float a = uMult * vAlpha * (0.75 + 0.25 * uPresence) * (1.0 + grain * 0.14) * vign * disc;
    gl_FragColor = vec4(rgb, a);
  }
`

type GridBuild = {
  geo: THREE.BufferGeometry
  mat: THREE.ShaderMaterial
  lines: THREE.LineSegments
  pos: Float32Array
  baseXZ: Float32Array
  vx: number
  vy: number
  baseMult: number
}

function buildSquareLineGrid(
  seg: number,
  extent: number,
  discR: number,
  baseMult: number,
  colors: { coral: THREE.Vector3; rose: THREE.Vector3; indigo: THREE.Vector3 },
  shimmer: number,
): GridBuild {
  const discFade0 = discR * 0.2
  const planeW = extent
  const planeH = extent
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
      pushEdge(i * vx + j, i * vx + j + 1)
    }
  }
  for (let j = 0; j < vx; j++) {
    for (let i = 0; i < vy - 1; i++) {
      pushEdge(i * vx + j, (i + 1) * vx + j)
    }
  }

  const gridGeo = new THREE.BufferGeometry()
  gridGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  gridGeo.setAttribute('alpha', new THREE.BufferAttribute(alp, 1))

  const gridMat = new THREE.ShaderMaterial({
    uniforms: {
      uMult: { value: baseMult },
      uPresence: { value: 0 },
      uTime: { value: 0 },
      uShimmer: { value: shimmer },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uVignetteInner: { value: 0.048 },
      uVignetteOuter: { value: 0.15 },
      uDiscRadius: { value: discR },
      uDiscFeather: { value: discR * 0.055 },
      uCoral: { value: colors.coral.clone() },
      uRose: { value: colors.rose.clone() },
      uIndigo: { value: colors.indigo.clone() },
    },
    vertexShader: gridVert,
    fragmentShader: gridFrag,
    transparent: true,
    depthWrite: false,
  })

  const lines = new THREE.LineSegments(gridGeo, gridMat)

  return { geo: gridGeo, mat: gridMat, lines, pos, baseXZ, vx, vy, baseMult }
}

function updateGridDeform(
  geo: THREE.BufferGeometry,
  pos: Float32Array,
  baseXZ: Float32Array,
  vx: number,
  vy: number,
  gx: number,
  gz: number,
  yBase: number,
  presence: number,
  wellK: number,
  dipCap: number,
  motionScale: number,
  gravityR0: number,
  planeW: number,
) {
  let w = 0
  for (let i = 0; i < vy; i++) {
    for (let j = 0; j < vx - 1; j++) {
      for (const v of [i * vx + j, i * vx + j + 1]) {
        const x = baseXZ[v * 2]
        const z = baseXZ[v * 2 + 1]
        const dx = x - gx
        const dz = z - gz
        const dist2 = dx * dx + dz * dz + gravityR0 * gravityR0
        let y = yBase + (-(wellK * presence * motionScale) / dist2) * (planeW * 0.18)
        y = Math.max(y, yBase - dipCap)
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
        let y = yBase + (-(wellK * presence * motionScale) / dist2) * (planeW * 0.18)
        y = Math.max(y, yBase - dipCap)
        pos[w * 3] = x
        pos[w * 3 + 1] = y
        pos[w * 3 + 2] = z
        w++
      }
    }
  }
  const attr = geo.getAttribute('position') as THREE.BufferAttribute
  attr.needsUpdate = true
}

/** Perspective gravity grid + brand-gradient sphere; pointer over hero activates well + planet. */
export function HeroSpacetimeGrid() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const saveData = window.matchMedia('(prefers-reduced-data: reduce)').matches

    const colAccent = cssColor('--accent', FALLBACK_HEX.accent)
    const colAccent2 = cssColor('--accent-2', FALLBACK_HEX.accent2)
    const colAccent3 = cssColor('--accent-3', FALLBACK_HEX.accent3)

    const vecCoral = colAccent.clone().convertSRGBToLinear()
    const vecRose = colAccent2.clone().convertSRGBToLinear()
    const vecIndigo = colAccent3.clone().convertSRGBToLinear()
    const palette = {
      coral: new THREE.Vector3(vecCoral.r, vecCoral.g, vecCoral.b),
      rose: new THREE.Vector3(vecRose.r, vecRose.g, vecRose.b),
      indigo: new THREE.Vector3(vecIndigo.r, vecIndigo.g, vecIndigo.b),
    }

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

    const planetGlow = new THREE.PointLight(colAccent, reduced ? 0.14 : 0.22, 18, 2)
    planetGlow.decay = 2
    const accentGlow = new THREE.PointLight(colAccent2, reduced ? 0.1 : 0.16, 22, 2)
    accentGlow.decay = 2
    accentGlow.color.copy(colAccent2)
    accentGlow.position.set(1.4, 2.2, 2.6)
    scene.add(amb, dir, planetGlow, accentGlow)

    const seg = reduced ? 36 : 52
    const extent = 9.2
    const discR = (Math.min(extent, extent) * 0.5) * 0.97
    const planeW = extent

    const shimmerMain = reduced ? 0 : 0.085
    const multMain = reduced ? 0.085 : 0.12
    const grid1 = buildSquareLineGrid(seg, extent, discR, multMain, palette, shimmerMain)
    scene.add(grid1.lines)

    const enableSecondLayer = !reduced && !saveData
    const seg2 = Math.max(14, Math.floor(seg / 2))
    const mult2 = multMain * 0.42
    const shimmer2 = reduced || saveData ? 0 : 0.05
    const grid2 = enableSecondLayer
      ? buildSquareLineGrid(seg2, extent, discR, mult2, palette, shimmer2)
      : null
    const grid2Group = new THREE.Group()
    grid2Group.rotation.y = THREE.MathUtils.degToRad(7)
    grid2Group.position.y = -0.055
    if (grid2) {
      grid2Group.add(grid2.lines)
      scene.add(grid2Group)
    }

    const sphereGeom = new THREE.SphereGeometry(0.19, 32, 24)
    const emissiveBlend = colAccent2.clone().lerp(colAccent, 0.45)
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: colAccent,
      emissive: emissiveBlend,
      emissiveIntensity: reduced ? 0.14 : 0.18,
      metalness: 0.12,
      roughness: 0.38,
      clearcoat: 0.92,
      clearcoatRoughness: 0.12,
      iridescence: reduced ? 0.08 : 0.32,
      iridescenceIOR: 1.55,
      iridescenceThicknessRange: [80, 380],
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
    const gravVel = new THREE.Vector3(0, 0, 0)

    let pointerInside = false
    let presence = 0
    const wellK = reduced ? 0.55 : coarsePointer ? 1.2 : 1.05
    const dipCap = reduced ? 0.45 : 1.05
    const motionScale = reduced ? 0.32 : coarsePointer ? 0.88 : 1

    const springStiff = reduced ? 38 : coarsePointer ? 62 : 48
    const springDamp = reduced ? 11.5 : coarsePointer ? 15 : 13

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
    let runTime = 0

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
      grid1.mat.uniforms.uResolution.value.copy(drawingSize)
      if (grid2) grid2.mat.uniforms.uResolution.value.copy(drawingSize)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.1)
      runTime += dt

      const pLerp = reduced ? 2.5 : coarsePointer ? 6.5 : 5
      presence += ((pointerInside ? 1 : 0) - presence) * Math.min(1, dt * pLerp)
      grid1.mat.uniforms.uPresence.value = presence
      if (grid2) grid2.mat.uniforms.uPresence.value = presence

      const err = new THREE.Vector3().subVectors(gravTarget, gravSmooth)
      const accel = err.multiplyScalar(springStiff).sub(gravVel.clone().multiplyScalar(springDamp))
      gravVel.addScaledVector(accel, dt)
      gravSmooth.addScaledVector(gravVel, dt)

      const idleAmp = reduced ? 0 : 0.05
      const idleBreath = reduced ? 1 : 1 + idleAmp * Math.sin(runTime * 0.85)
      grid1.mat.uniforms.uMult.value = grid1.baseMult * idleBreath
      grid1.mat.uniforms.uTime.value = runTime
      if (grid2) {
        grid2.mat.uniforms.uMult.value = grid2.baseMult * (0.92 + 0.08 * Math.sin(runTime * 0.62 + 0.4))
        grid2.mat.uniforms.uTime.value = runTime
      }

      updateGridDeform(grid1.geo, grid1.pos, grid1.baseXZ, grid1.vx, grid1.vy, gravSmooth.x, gravSmooth.z, 0, presence, wellK, dipCap, motionScale, gravityR0, planeW)

      if (grid2) {
        const c = Math.cos(-grid2Group.rotation.y)
        const s = Math.sin(-grid2Group.rotation.y)
        const lx = gravSmooth.x * c - gravSmooth.z * s
        const lz = gravSmooth.x * s + gravSmooth.z * c
        updateGridDeform(
          grid2.geo,
          grid2.pos,
          grid2.baseXZ,
          grid2.vx,
          grid2.vy,
          lx,
          lz,
          grid2Group.position.y,
          presence,
          wellK,
          dipCap,
          motionScale,
          gravityR0,
          planeW,
        )
      }

      const cx = gravSmooth.x
      const cz = gravSmooth.z
      const dist2c = gravityR0 * gravityR0
      const dipCenter = (-(wellK * presence * motionScale) / dist2c) * (planeW * 0.18)
      const yCenter = Math.max(dipCenter, -dipCap)
      planet.position.set(cx, yCenter + 0.19 * presence, cz)
      planet.scale.setScalar(0.92 * presence)
      planet.visible = presence > 0.02

      planetGlow.position.copy(planet.position)
      planetGlow.color.copy(colAccent)
      planetGlow.intensity = (reduced ? 0.1 : 0.16) + presence * (reduced ? 0.18 : 0.32)
      sphereMat.emissiveIntensity = (reduced ? 0.12 : 0.15) + presence * (reduced ? 0.12 : 0.24)

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
      grid1.geo.dispose()
      grid1.mat.dispose()
      if (grid2) {
        grid2.geo.dispose()
        grid2.mat.dispose()
      }
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
