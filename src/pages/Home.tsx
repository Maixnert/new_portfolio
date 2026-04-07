import { Suspense, lazy, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { Timeline } from '../components/Timeline'
import { hero, homeSections, homeServices } from '../data/maixner'

function HeroOrbFallback() {
  return <div className="hero-orb hero-orb--placeholder" aria-hidden />
}

const HeroSpacetimeGrid = lazy(async () => {
  try {
    const mod = await import('../components/HeroSpacetimeGrid')
    return { default: mod.HeroSpacetimeGrid }
  } catch (err) {
    console.error('HeroSpacetimeGrid failed to load', err)
    return { default: HeroOrbFallback }
  }
})

export function Home() {
  const heroSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = heroSectionRef.current
    if (!el) return

    const onScroll = () => {
      const y = window.scrollY * 0.12
      el.style.setProperty('--hero-parallax', `${Math.min(y, 72)}px`)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <section className="hero-home" ref={heroSectionRef}>
        <div className="hero-home__bg" aria-hidden />
        <div className="hero-home__layout">
          <div className="hero-home__stack">
            <Suspense fallback={<div className="hero-orb hero-orb--placeholder" aria-hidden />}>
              <HeroSpacetimeGrid />
            </Suspense>
            <div className="hero-home__intro">
              <h1 className="hero-name hero-name--stagger">
                {hero.words.map((w, i) => (
                  <span
                    key={i}
                    className="hero-word"
                    style={{ '--hero-word-delay': `${w.delay}ms` } as React.CSSProperties}
                  >
                    {w.text}
                  </span>
                ))}
              </h1>
            </div>
          </div>
          <div className="hero-home__rest">
            {hero.subhead.trim() ? <p className="hero-subhead">{hero.subhead}</p> : null}
            <p className="hero-lead">{hero.body}</p>
            <div className="btn-row">
              <Link to="/prace" className="btn btn-primary">
                {hero.ctaPrimary} <span className="btn-arrow">→</span>
              </Link>
              <Link to="/kontakt" className="btn btn-ghost">
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
        <div className="scroll-hint">
          <span>Další sekce</span>
          <div className="scroll-hint__track" aria-hidden>
            <span className="scroll-hint__dot" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="co-delam">
        <Reveal>
          <span className="section-kicker">{homeSections.servicesKicker}</span>
          <h2 id="co-delam" className="section-title">
            {homeSections.servicesTitle}
          </h2>
        </Reveal>
        <div className="grid-cards">
          {homeServices.map((s, i) => (
            <Reveal key={s.title} delayMs={i * 80}>
              <article className="card-glass">
                <span className={`tag-pill tag-pill--${s.badge}`}>{s.tag}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delayMs={80}>
          <div className="btn-row">
            <Link to="/sluzby" className="btn btn-ghost">
              {homeSections.servicesCta}
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="section" aria-labelledby="spoluprace">
        <Reveal>
          <span className="section-kicker">{homeSections.processKicker}</span>
          <h2 id="spoluprace" className="section-title">
            {homeSections.processTitle}
          </h2>
        </Reveal>
        <Reveal delayMs={60}>
          <Timeline />
        </Reveal>
      </section>
    </>
  )
}
