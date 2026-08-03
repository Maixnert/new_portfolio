import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { CaseStudyGalleryItem } from '../data/maixner'

type CaseStudyFilmstripProps = {
  items: CaseStudyGalleryItem[]
  ariaLabel: string
}

type DragState = {
  pointerId: number
  startX: number
  startScroll: number
  captured: boolean
}

const DRAG_THRESHOLD = 8
const LIGHTBOX_SWIPE_THRESHOLD = 56
const SLIDE_MS = 380

export function CaseStudyFilmstrip({ items, ariaLabel }: CaseStudyFilmstripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const didDragRef = useRef(false)
  const ignoreCloseUntilRef = useRef(0)
  const lightboxDragRef = useRef<{
    startX: number
    startY: number
    axis: 'x' | 'y' | null
    active: boolean
  } | null>(null)

  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [lightboxOffset, setLightboxOffset] = useState(0)
  const [lightboxDragging, setLightboxDragging] = useState(false)

  const lightboxOpen = lightboxIndex !== null
  const activeItem = lightboxIndex !== null ? items[lightboxIndex] : null

  const updateNav = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < maxScroll - 4)
  }, [])

  const snapFilmstrip = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const nodes = [...el.querySelectorAll<HTMLElement>('[data-filmstrip-index]')]
    if (nodes.length === 0) return

    let bestLeft = nodes[0].offsetLeft
    let bestDist = Math.abs(bestLeft - el.scrollLeft)

    for (const node of nodes) {
      const dist = Math.abs(node.offsetLeft - el.scrollLeft)
      if (dist < bestDist) {
        bestDist = dist
        bestLeft = node.offsetLeft
      }
    }

    el.scrollTo({ left: bestLeft, behavior: 'smooth' })
  }, [])

  const openLightbox = useCallback(
    (index: number) => {
      if (didDragRef.current) return
      if (index < 0 || index >= items.length) return
      ignoreCloseUntilRef.current = Date.now() + 450
      setLightboxOffset(0)
      setLightboxDragging(false)
      setLightboxIndex(index)
    },
    [items.length],
  )

  const closeLightbox = useCallback(() => {
    if (Date.now() < ignoreCloseUntilRef.current) return
    setLightboxIndex(null)
    setLightboxOffset(0)
    setLightboxDragging(false)
  }, [])

  const showPrev = useCallback(() => {
    setLightboxOffset(0)
    setLightboxDragging(false)
    setLightboxIndex((current) => {
      if (current === null || current <= 0) return current
      return current - 1
    })
  }, [])

  const showNext = useCallback(() => {
    setLightboxOffset(0)
    setLightboxDragging(false)
    setLightboxIndex((current) => {
      if (current === null || current >= items.length - 1) return current
      return current + 1
    })
  }, [items.length])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    updateNav()
    el.addEventListener('scroll', updateNav, { passive: true })
    const observer = new ResizeObserver(updateNav)
    observer.observe(el)

    return () => {
      el.removeEventListener('scroll', updateNav)
      observer.disconnect()
    }
  }, [updateNav, items.length])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const endMouseDrag = (pointerId: number) => {
      const state = dragRef.current
      if (!state || state.pointerId !== pointerId) return
      const wasDragging = state.captured
      if (state.captured) {
        try {
          el.releasePointerCapture(pointerId)
        } catch {
          /* already released */
        }
      }
      dragRef.current = null
      setDragging(false)
      if (wasDragging) snapFilmstrip()
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      didDragRef.current = false
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startScroll: el.scrollLeft,
        captured: false,
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const state = dragRef.current
      if (!state || state.pointerId !== e.pointerId) return
      const dx = e.clientX - state.startX

      if (!state.captured) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return
        didDragRef.current = true
        state.captured = true
        setDragging(true)
        el.setPointerCapture(e.pointerId)
      }

      el.scrollLeft = state.startScroll - dx
    }

    const onPointerUp = (e: PointerEvent) => {
      endMouseDrag(e.pointerId)
    }

    let touchStartX = 0
    let touchStartY = 0
    let touchStartScroll = 0
    let touchAxis: 'x' | 'y' | null = null

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      didDragRef.current = false
      touchStartX = touch.clientX
      touchStartY = touch.clientY
      touchStartScroll = el.scrollLeft
      touchAxis = null
    }

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      const dx = touch.clientX - touchStartX
      const dy = touch.clientY - touchStartY

      if (!touchAxis) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
        touchAxis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y'
      }

      if (touchAxis !== 'x') return
      didDragRef.current = true
      e.preventDefault()
      el.scrollLeft = touchStartScroll - dx
    }

    const activateFromTarget = (target: EventTarget | null) => {
      if (didDragRef.current) return false
      if (!(target instanceof Element)) return false
      const item = target.closest<HTMLElement>('[data-filmstrip-index]')
      if (!item || !el.contains(item)) return false
      const index = Number(item.dataset.filmstripIndex)
      if (Number.isNaN(index)) return false
      openLightbox(index)
      return true
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (touchAxis === 'x' || didDragRef.current) {
        snapFilmstrip()
        return
      }
      if (activateFromTarget(e.target)) {
        e.preventDefault()
      }
    }

    const onActivate = (e: Event) => {
      if (didDragRef.current) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      activateFromTarget(e.target)
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: false })
    el.addEventListener('click', onActivate)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('click', onActivate)
    }
  }, [items.length, openLightbox, snapFilmstrip])

  useEffect(() => {
    if (!lightboxOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }

    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightboxOpen, closeLightbox, showPrev, showNext])

  const scrollByPage = (direction: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.max(el.clientWidth * 0.75, 240)
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  const finishLightboxDrag = (dx: number, width: number) => {
    const index = lightboxIndex ?? 0
    const atStart = index <= 0
    const atEnd = index >= items.length - 1
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduceMotion ? 0 : SLIDE_MS

    const settleTo = (nextIndex: number) => {
      setLightboxDragging(false)
      setLightboxOffset(nextIndex > index ? -width : width)

      window.setTimeout(() => {
        setLightboxDragging(true)
        setLightboxIndex(nextIndex)
        setLightboxOffset(0)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setLightboxDragging(false))
        })
      }, duration)
    }

    if (dx > LIGHTBOX_SWIPE_THRESHOLD && !atStart) {
      settleTo(index - 1)
      return
    }

    if (dx < -LIGHTBOX_SWIPE_THRESHOLD && !atEnd) {
      settleTo(index + 1)
      return
    }

    setLightboxDragging(false)
    setLightboxOffset(0)
  }

  const onLightboxPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    lightboxDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      axis: null,
      active: true,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onLightboxPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = lightboxDragRef.current
    if (!state?.active) return
    const dx = e.clientX - state.startX
    const dy = e.clientY - state.startY

    if (!state.axis) {
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
      state.axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y'
      if (state.axis === 'y') return
      setLightboxDragging(true)
    }

    if (state.axis !== 'x') return
    const index = lightboxIndex ?? 0
    let next = dx
    if ((index <= 0 && dx > 0) || (index >= items.length - 1 && dx < 0)) {
      next = dx * 0.28
    }
    setLightboxOffset(next)
  }

  const onLightboxPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = lightboxDragRef.current
    lightboxDragRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
    if (!state || state.axis !== 'x') {
      setLightboxDragging(false)
      setLightboxOffset(0)
      return
    }
    finishLightboxDrag(e.clientX - state.startX, e.currentTarget.clientWidth)
  }

  if (items.length === 0) return null

  const trackStyle =
    lightboxIndex === null
      ? undefined
      : {
          transform: `translate3d(calc(${-lightboxIndex * 100}% + ${lightboxOffset}px), 0, 0)`,
          transition: lightboxDragging
            ? 'none'
            : `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }

  const lightbox =
    lightboxOpen && activeItem && lightboxIndex !== null
      ? createPortal(
          <div
            className="lightbox case-study__lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.label ?? activeItem.alt}
            onClick={closeLightbox}
          >
            <button
              type="button"
              className="case-study__lightbox-close"
              aria-label="Zavřít"
              onClick={closeLightbox}
            >
              ✕
            </button>

            <button
              type="button"
              className="case-study__filmstrip-arrow case-study__lightbox-arrow case-study__lightbox-arrow--prev"
              aria-label="Předchozí obrazovka"
              disabled={lightboxIndex <= 0}
              onClick={(e) => {
                e.stopPropagation()
                showPrev()
              }}
            >
              ←
            </button>

            <button
              type="button"
              className="case-study__filmstrip-arrow case-study__lightbox-arrow case-study__lightbox-arrow--next"
              aria-label="Další obrazovka"
              disabled={lightboxIndex >= items.length - 1}
              onClick={(e) => {
                e.stopPropagation()
                showNext()
              }}
            >
              →
            </button>

            <div
              className="lightbox__inner case-study__lightbox-inner"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="lightbox__hint">
                {activeItem.label ?? activeItem.alt}
                <span className="case-study__lightbox-count">
                  {lightboxIndex + 1} / {items.length}
                </span>
              </p>

              <div
                className={`case-study__lightbox-viewport${
                  lightboxDragging ? ' case-study__lightbox-viewport--dragging' : ''
                }`}
                onPointerDown={onLightboxPointerDown}
                onPointerMove={onLightboxPointerMove}
                onPointerUp={onLightboxPointerUp}
                onPointerCancel={onLightboxPointerUp}
              >
                <div className="case-study__lightbox-track" style={trackStyle}>
                  {items.map((item) => (
                    <div key={item.src} className="case-study__lightbox-slide">
                      <img
                        src={item.src}
                        alt={item.alt}
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <p className="case-study__lightbox-swipe-hint">
                Přejeďte prstem nebo šipky · kliknutím mimo zavřete
              </p>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <div className="case-study__filmstrip-wrap">
      <div className="case-study__filmstrip-controls">
        <button
          type="button"
          className="case-study__filmstrip-arrow"
          aria-label="Předchozí obrazovky"
          disabled={!canPrev}
          onClick={() => scrollByPage(-1)}
        >
          ←
        </button>
        <button
          type="button"
          className="case-study__filmstrip-arrow"
          aria-label="Další obrazovky"
          disabled={!canNext}
          onClick={() => scrollByPage(1)}
        >
          →
        </button>
      </div>

      <div
        ref={scrollerRef}
        className={`case-study__filmstrip${dragging ? ' case-study__filmstrip--dragging' : ''}`}
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {items.map((item, index) => (
          <button
            key={item.src}
            type="button"
            data-filmstrip-index={index}
            className={`case-study__filmstrip-item${
              item.previewCrop ? ' case-study__filmstrip-item--tall' : ''
            }`}
            aria-label={`Zobrazit ${item.label ?? item.alt} na celou obrazovku`}
          >
            <div className="case-study__filmstrip-frame">
              <img
                src={item.src}
                alt=""
                width={960}
                height={640}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
            {item.label ? (
              <span className="case-study__filmstrip-caption">{item.label}</span>
            ) : null}
          </button>
        ))}
      </div>

      {lightbox}
    </div>
  )
}
