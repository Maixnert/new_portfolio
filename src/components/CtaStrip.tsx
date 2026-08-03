import { Link } from 'react-router-dom'
import { ctas } from '../data/maixner'

type CtaStripProps = {
  kicker?: string
  text?: string
  primaryTo?: string
  primaryLabel?: string
  secondaryTo?: string
  secondaryLabel?: string
}

export function CtaStrip({
  kicker = ctas.stripKicker,
  text = ctas.stripLead,
  primaryTo = '/kontakt',
  primaryLabel = ctas.primary,
  secondaryTo,
  secondaryLabel,
}: CtaStripProps) {
  return (
    <div className="about-cta-strip">
      <div className="about-cta-strip__copy">
        <span className="about-cta-strip__label">{kicker}</span>
        <p className="about-cta-strip__text">{text}</p>
      </div>
      <div className="about-cta-strip__actions btn-row">
        <Link to={primaryTo} className="btn btn-primary">
          {primaryLabel} <span className="btn-arrow">→</span>
        </Link>
        {secondaryTo && secondaryLabel ? (
          <Link to={secondaryTo} className="btn btn-ghost">
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
