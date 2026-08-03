import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CtaStrip } from '../components/CtaStrip'
import { Reveal } from '../components/Reveal'
import { caseStudyUi, ctas, getCaseStudy } from '../data/maixner'

export function CaseStudy() {
  const { slug = '' } = useParams<{ slug: string }>()
  const study = getCaseStudy(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!study) {
    return <Navigate to="/prace" replace />
  }

  return (
    <div className="page-hero">
      <div className="page-hero__inner">
        <article className="case-study">
          <Reveal>
            <header className="case-study__hero">
              <Link to="/prace" className="case-study__back">
                ← {caseStudyUi.back}
              </Link>
              <span className="section-kicker">{study.kicker}</span>
              <p className="case-study__client">{study.client}</p>
              <h1>{study.title}</h1>
              <p className="case-study__lead">{study.lead}</p>

              <dl className="case-study__meta">
                {study.meta.map((item) => (
                  <div key={item.label} className="case-study__meta-item">
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>

              {study.liveUrl ? (
                <div className="case-study__actions btn-row">
                  <a
                    href={study.liveUrl}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {caseStudyUi.liveProject}
                    {study.liveLabel ? ` · ${study.liveLabel}` : ''}{' '}
                    <span className="btn-arrow">↗</span>
                  </a>
                </div>
              ) : null}
            </header>
          </Reveal>

          <Reveal delayMs={60}>
            <figure className="case-study__cover">
              <img
                src={study.coverImage}
                alt={study.coverAlt}
                width={1120}
                height={700}
                decoding="async"
              />
            </figure>
          </Reveal>

          {study.sections.map((section, index) => (
            <Reveal key={section.id} delayMs={80 + index * 40}>
              <section
                className={`case-study__section${
                  section.image && index % 2 === 1 ? ' case-study__section--flip' : ''
                }`}
                aria-labelledby={`cs-${section.id}`}
              >
                <div className="case-study__section-copy">
                  <h2 id={`cs-${section.id}`}>{section.heading}</h2>
                  {section.body.map((paragraph, pIdx) => (
                    <p key={`${section.id}-${pIdx}`}>{paragraph}</p>
                  ))}
                </div>
                {section.image ? (
                  <figure className="case-study__section-media">
                    <img
                      src={section.image}
                      alt={section.imageAlt ?? ''}
                      loading="lazy"
                      decoding="async"
                      width={960}
                      height={640}
                    />
                  </figure>
                ) : null}
              </section>
            </Reveal>
          ))}

          {study.results && study.results.length > 0 ? (
            <Reveal delayMs={100}>
              <section className="case-study__results" aria-labelledby="cs-results">
                <h2 id="cs-results">{caseStudyUi.resultsHeading}</h2>
                <div className="case-study__results-grid">
                  {study.results.map((item) => (
                    <article key={item.label} className="case-study__result">
                      <span className="case-study__result-label">{item.label}</span>
                      <p className="case-study__result-value">{item.value}</p>
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>
          ) : null}

          {study.gallery && study.gallery.length > 0 ? (
            <Reveal delayMs={110}>
              <section className="case-study__gallery" aria-labelledby="cs-gallery">
                <h2 id="cs-gallery">{caseStudyUi.galleryHeading}</h2>
                <div
                  className={`case-study__gallery-grid${
                    study.gallery.length === 1 ? ' case-study__gallery-grid--single' : ''
                  }`}
                >
                  {study.gallery.map((item) => (
                    <figure key={item.src} className="case-study__gallery-item">
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                        width={960}
                        height={640}
                      />
                    </figure>
                  ))}
                </div>
              </section>
            </Reveal>
          ) : null}

          <Reveal delayMs={120}>
            <div className="section-cta">
              <CtaStrip text={caseStudyUi.ctaText} primaryLabel={ctas.primary} />
            </div>
          </Reveal>
        </article>
      </div>
    </div>
  )
}
