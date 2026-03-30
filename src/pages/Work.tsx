import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { PageBackdropWord } from '../components/PageBackdropWord'
import { Reveal } from '../components/Reveal'
import {
  type PortfolioCategory,
  portfolioIntro,
  portfolioItems,
} from '../data/maixner'

const labels: Record<PortfolioCategory, string> = {
  vše: 'Vše',
  web: 'Web',
  design: 'Design',
  video: 'Video',
}

const categories: PortfolioCategory[] = ['vše', 'web', 'design', 'video']

export function Work() {
  const [filter, setFilter] = useState<PortfolioCategory>('vše')
  const barRef = useRef<HTMLDivElement>(null)
  const [slider, setSlider] = useState({ left: 0, width: 0, ready: false })
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null)

  const visible = useMemo(() => {
    if (filter === 'vše') return portfolioItems
    return portfolioItems.filter((i) => i.category === filter)
  }, [filter])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightbox])

  useLayoutEffect(() => {
    const update = () => {
      const bar = barRef.current
      if (!bar) return
      const idx = categories.indexOf(filter)
      const btn = bar.querySelectorAll<HTMLButtonElement>('button.filter-pill')[idx]
      if (!btn) return
      const br = bar.getBoundingClientRect()
      const r = btn.getBoundingClientRect()
      setSlider({
        left: r.left - br.left,
        width: r.width,
        ready: true,
      })
    }

    update()
    const ro = new ResizeObserver(update)
    if (barRef.current) ro.observe(barRef.current)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [filter])

  return (
    <div className="page-hero">
      <PageBackdropWord word="PRÁCE" />
      <div className="page-hero__inner">
        <Reveal>
          <span className="section-kicker">Co dělám?</span>
          <h1>Nejlepší projekty</h1>
        </Reveal>
        <Reveal delayMs={50}>
          <p className="hero-lead">{portfolioIntro}</p>
        </Reveal>

        <Reveal delayMs={90}>
          <div className="filters-bar" ref={barRef} role="group" aria-label="Filtrovat podle typu">
            <span
              className="filter-slider"
              style={{
                width: slider.width,
                transform: `translateX(${slider.left}px)`,
                opacity: slider.ready ? 1 : 0,
              }}
              aria-hidden
            />
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`filter-pill${filter === c ? ' filter-pill--active' : ''}`}
                onClick={() => setFilter(c)}
                aria-pressed={filter === c}
              >
                {labels[c]}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="work-grid">
          {visible.map((item, index) => {
            const featured = filter === 'vše' && index === 0
            const inner = (
              <>
                <PortfolioTileImage src={item.image} title={item.title} />
                <div className="work-tile__overlay" aria-hidden />
                <div className="work-tile__arrow" aria-hidden>
                  {item.href ? '↗' : '→'}
                </div>
                <div className="work-tile__bottom">
                  <span className="work-tile__badge">{labels[item.category]}</span>
                  <span className="work-tile__title">{item.title}</span>
                </div>
              </>
            )

            return (
              <Reveal key={item.id} delayMs={index * 50}>
                {item.href ? (
                  <a
                    href={item.href}
                    className={`work-tile work-tile--link${featured ? ' work-tile--feature' : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {inner}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={`work-tile work-tile--button${featured ? ' work-tile--feature' : ''}`}
                    onClick={() => setLightbox({ src: item.image, title: item.title })}
                  >
                    {inner}
                  </button>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>

      {lightbox && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={() => setLightbox(null)}
        >
          <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <p className="lightbox__hint">Kliknutím mimo zavřete</p>
            <img src={lightbox.src} alt={lightbox.title} />
          </div>
        </div>
      )}
    </div>
  )
}

function PortfolioTileImage({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="work-tile__fallback">
        <span>{title}</span>
        <small>Přidejte obrázek do public/portfolio/</small>
      </div>
    )
  }

  return (
    <img
      className="work-tile__img"
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
