import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { CustomCursor } from './CustomCursor'
import { assetPaths, footerTagline, site } from '../data/maixner'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? ' active' : ''}`

export function Layout() {
  const [compact, setCompact] = useState(false)
  const [logoOk, setLogoOk] = useState(true)

  const [frosted, setFrosted] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setCompact(y > 48)
      setFrosted(y > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="site-shell">
      <CustomCursor />
      <a href="#main" className="skip-link">
        Přeskočit na obsah
      </a>
      <div className="site-grain" aria-hidden />
      <div className="site-noise" aria-hidden />
      <header
        className={`site-header${compact ? ' site-header--compact' : ''}${frosted ? ' site-header--frost' : ''}`}
      >
        <div className="layout-inner site-header__row">
          <NavLink to="/" className="brand-mark" end>
            {logoOk ? (
              <img
                src={assetPaths.logo}
                alt={site.name}
                className="brand-mark__img"
                height={36}
                onError={() => setLogoOk(false)}
              />
            ) : (
              <span className="logo logo--text">{site.name}</span>
            )}
          </NavLink>
          <nav className="nav" aria-label="Hlavní navigace">
            <NavLink to="/" className={navLinkClass} end>
              Úvod
            </NavLink>
            <NavLink to="/prace" className={navLinkClass}>
              Projekty
            </NavLink>
            <NavLink to="/sluzby" className={navLinkClass}>
              Služby
            </NavLink>
            <NavLink to="/o-mne" className={navLinkClass}>
              O mně
            </NavLink>
            <NavLink
              to="/kontakt"
              className={({ isActive }) => `nav-cta${isActive ? ' active' : ''}`}
            >
              Kontakt
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main" className="site-main layout-inner" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="layout-inner site-footer__inner site-footer__inner--maixner">
          <div className="site-footer__block">
            <p className="site-footer__name">{site.name}</p>
            <p className="site-footer__tagline">{footerTagline}</p>
            <p className="site-footer__meta">
              IČO: {site.ico} · {site.address}
            </p>
            <p className="site-footer__meta">&copy; {site.name}</p>
          </div>
          <div className="footer-social" aria-label="Sociální sítě">
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <span className="footer-social__sep" aria-hidden>
              ·
            </span>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <span className="footer-social__sep" aria-hidden>
              ·
            </span>
            <a href={site.dribbble} target="_blank" rel="noopener noreferrer">
              Dribbble
            </a>
            <span className="footer-social__sep" aria-hidden>
              ·
            </span>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
