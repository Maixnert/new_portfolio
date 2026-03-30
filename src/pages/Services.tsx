import { useState } from 'react'
import { PageBackdropWord } from '../components/PageBackdropWord'
import { Reveal } from '../components/Reveal'
import { servicesPage } from '../data/maixner'

export function Services() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="page-hero">
      <PageBackdropWord word="SLUŽBY" />
      <div className="page-hero__inner">
        <Reveal>
          <span className="section-kicker">{servicesPage.kicker}</span>
          <h1>{servicesPage.title}</h1>
        </Reveal>
        <Reveal delayMs={50}>
          <p className="hero-lead">{servicesPage.intro}</p>
        </Reveal>

        <div className="service-list">
          {servicesPage.rows.map((row, i) => {
            const isOpen = open === i
            return (
              <div key={row.num} className={`service-row${isOpen ? ' service-row--open' : ''}`}>
                <span className="service-row__bg-num" aria-hidden>
                  {row.num}
                </span>
                <button
                  type="button"
                  className="service-row__trigger"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`svc-panel-${i}`}
                >
                  <span className="service-row__left">
                    <span className="service-row__num">{row.num}</span>
                    <span className="service-row__name">{row.name}</span>
                  </span>
                  <span className="service-row__arrow" aria-hidden>
                    →
                  </span>
                </button>
                <div className="service-row__panel" id={`svc-panel-${i}`} role="region" aria-hidden={!isOpen}>
                  <div className="service-row__body">
                    <p>{row.body}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
