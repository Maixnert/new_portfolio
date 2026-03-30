import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { timelineSteps } from '../data/maixner'

function motionReduced() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Timeline() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(() => motionReduced())

  useEffect(() => {
    if (visible) return

    const el = rootRef.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true)
        })
      },
      { threshold: 0.12 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [visible])

  return (
    <div className={`timeline${visible ? ' timeline--visible' : ''}`} ref={rootRef}>
      <div className="timeline__rail" aria-hidden>
        <div className="timeline__rail-clip">
          <svg className="timeline__svg" preserveAspectRatio="none" viewBox="0 0 4 300">
            <line className="timeline__line" x1="2" y1="0" x2="2" y2="300" />
          </svg>
        </div>
      </div>
      <ol className="timeline__steps">
        {timelineSteps.map((s, i) => (
          <li
            key={s.n}
            className="timeline__step"
            style={{ '--step-delay': `${120 + i * 140}ms` } as CSSProperties}
          >
            <span className="timeline__num" aria-hidden>
              {s.n}
            </span>
            <div className="timeline__content">
              <span className="timeline__watermark">{s.n}</span>
              <h3 className="timeline__step-title">{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
