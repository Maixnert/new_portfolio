import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'

export function NotFound() {
  return (
    <div className="page-hero">
      <div className="page-hero__inner">
        <Reveal>
          <header className="contact-hero">
            <span className="section-kicker">404</span>
            <h1>Stránka nenalezena</h1>
            <p className="contact-hero__lead">
              Tato adresa neexistuje, nebo byla přesunuta. Zkuste úvodní stránku nebo menu výše.
            </p>
            <p style={{ marginTop: '1.5rem' }}>
              <Link to="/" className="btn btn-primary">
                Zpět na úvod <span className="btn-arrow">→</span>
              </Link>
            </p>
          </header>
        </Reveal>
      </div>
    </div>
  )
}
