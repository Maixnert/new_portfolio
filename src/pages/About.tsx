import { Link } from 'react-router-dom'
import { PageBackdropWord } from '../components/PageBackdropWord'
import { Reveal } from '../components/Reveal'
import { about, assetPaths, site } from '../data/maixner'
import { useState } from 'react'

export function About() {
  const [photoOk, setPhotoOk] = useState(true)

  return (
    <div className="page-hero">
      <PageBackdropWord word="O MNĚ" />
      <div className="page-hero__inner">
        <Reveal>
          <span className="section-kicker">{about.kicker}</span>
          <h1>{about.title}</h1>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="about-grid about-grid--maixner">
            <div className="about-photo about-photo--real">
              {photoOk ? (
                <img
                  src={assetPaths.profile}
                  alt={site.name}
                  loading="lazy"
                  decoding="async"
                  onError={() => setPhotoOk(false)}
                />
              ) : (
                <span className="about-photo__missing">Vložte Profile.jpg do public/portfolio/</span>
              )}
            </div>
            <div>
              <div className="about-cards-row">
                {about.cards.map((c) => (
                  <article key={c.title} className="about-stat-card">
                    <h3>{c.title}</h3>
                    {c.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </article>
                ))}
              </div>
              <div className="about-prose about-prose--tight">
                <p>{about.body}</p>
              </div>
              <Link to="/kontakt" className="btn btn-primary about-cta">
                {about.cta}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
