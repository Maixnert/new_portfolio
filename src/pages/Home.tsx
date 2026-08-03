import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CtaStrip } from '../components/CtaStrip'
import { Reveal } from '../components/Reveal'
import { Timeline } from '../components/Timeline'
import { ctas, caseStudies, hero, homeSections, homeServices } from '../data/maixner'

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

function usePreferHeroThree() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setEnabled(!mqMotion.matches)
    apply()
    mqMotion.addEventListener('change', apply)
    return () => mqMotion.removeEventListener('change', apply)
  }, [])

  return enabled
}

export function Home() {
  const heroSectionRef = useRef<HTMLElement>(null)
  const showThree = usePreferHeroThree()

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
      <div className="home-page">
      <section className="hero-home" ref={heroSectionRef}>
        <div className="hero-home__bg" aria-hidden />
        <div className="hero-home__layout">
          <div className="hero-home__stack">
            {showThree ? (
              <Suspense fallback={<HeroOrbFallback />}>
                <HeroSpacetimeGrid />
              </Suspense>
            ) : (
              <HeroOrbFallback />
            )}
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
            <p className="hero-touch-hint">Potáhněte prstem</p>
          </div>
          <div className="hero-home__rest">
            {hero.subhead.trim() ? <p className="hero-subhead">{hero.subhead}</p> : null}
            <p className="hero-lead">{hero.body}</p>
            <div className="btn-row">
              <Link to="/kontakt" className="btn btn-primary">
                {hero.ctaPrimary} <span className="btn-arrow">→</span>
              </Link>
              <Link to="/prace" className="btn btn-ghost">
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--defer" aria-labelledby="co-delam">
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
            <Link to="/kontakt" className="btn btn-primary">
              {ctas.consult} <span className="btn-arrow">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="section section--defer" aria-labelledby="case-studies">
        <Reveal>
          <span className="section-kicker">{homeSections.casesKicker}</span>
          <h2 id="case-studies" className="section-title">
            {homeSections.casesTitle}
          </h2>
        </Reveal>
        <div className="home-cases">
          {caseStudies.map((study, i) => {
            const highlight = study.results?.[0]
            return (
              <Reveal key={study.slug} delayMs={i * 80}>
                <Link to={`/prace/${study.slug}`} className="home-case">
                  <img
                    className="home-case__img"
                    src={study.coverImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={960}
                    height={640}
                  />
                  <div className="home-case__overlay" aria-hidden />
                  <div className="home-case__arrow" aria-hidden>
                    →
                  </div>
                  <div className="home-case__bottom">
                    <span className="home-case__client">{study.client}</span>
                    <span className="home-case__title">{study.title}</span>
                    {highlight ? (
                      <span className="home-case__stat">
                        <span className="home-case__stat-label">{highlight.label}</span>
                        <span className="home-case__stat-value">{highlight.value}</span>
                      </span>
                    ) : null}
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
        <Reveal delayMs={100}>
          <div className="btn-row">
            <Link to="/prace" className="btn btn-ghost">
              {homeSections.casesCta}
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="section section--defer" aria-labelledby="spoluprace">
        <Reveal>
          <span className="section-kicker">{homeSections.processKicker}</span>
          <h2 id="spoluprace" className="section-title">
            {homeSections.processTitle}
          </h2>
        </Reveal>
        <Reveal delayMs={60}>
          <Timeline />
        </Reveal>
        <Reveal delayMs={100}>
          <div className="section-cta">
            <CtaStrip kicker={ctas.homeCloseKicker} text={ctas.homeCloseLead} />
          </div>
        </Reveal>
      </section>
      </div>
    </>
  )
}
