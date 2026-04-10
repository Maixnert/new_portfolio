import { Reveal } from '../components/Reveal'
import { about } from '../data/maixner'

export function About() {
  return (
    <div className="page-hero">
      <div className="page-hero__inner">
        <div className="about-page">
          <Reveal>
            <header className="about-hero">
              <span className="section-kicker">{about.kicker}</span>
              <h1>{about.title}</h1>
              {about.lead ? <p className="about-hero__lead">{about.lead}</p> : null}
            </header>
          </Reveal>

          <Reveal delayMs={60}>
            <section className="about-metrics" aria-label="V číslech">
              <div className="about-metrics__grid">
                {about.cards.map((c) => (
                  <article key={c.title} className="about-metric card-glass">
                    <span className="about-metric__label">{c.title}</span>
                    {c.lines.map((line) => (
                      <p key={line} className="about-metric__value">
                        {line}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={100}>
            <div className="about-split">
              <section className="about-split__story" aria-labelledby="about-story-heading">
                <h2 id="about-story-heading" className="about-split__heading">
                  Jak přistupujeme k projektům
                </h2>
                <div className="about-prose about-prose--story">
                  <p>{about.body}</p>
                  {about.bodySecondary ? <p>{about.bodySecondary}</p> : null}
                </div>
              </section>
              {about.values.length > 0 ? (
                <aside className="about-split__aside" aria-label="Naše principy">
                  <h2 className="about-split__heading about-split__heading--aside">Principy</h2>
                  <ul className="about-principles">
                    {about.values.map((value) => (
                      <li key={value} className="about-principles__item">
                        <span className="about-principles__mark" aria-hidden />
                        <span className="about-principles__text">{value}</span>
                      </li>
                    ))}
                  </ul>
                </aside>
              ) : null}
            </div>
          </Reveal>

        
        </div>
      </div>
    </div>
  )
}
