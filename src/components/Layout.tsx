import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { CustomCursor } from './CustomCursor'
import { SiteMeta } from './SiteMeta'
import { assetPaths, footerTagline, site } from '../data/maixner'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? ' active' : ''}`

export function Layout() {
  const { pathname } = useLocation()
  const [compact, setCompact] = useState(false)
  const [logoOk, setLogoOk] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavMq, setMobileNavMq] = useState(false)

  const [frosted, setFrosted] = useState(false)

  const navInert = mobileNavMq && !menuOpen

  const closeMenu = () => setMenuOpen(false)
  const toggleMenu = () => setMenuOpen((o) => !o)

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

  useEffect(() => {
    queueMicrotask(() => setMenuOpen(false))
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 719px)')
    const apply = () => setMobileNavMq(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (mobileNavMq || !menuOpen) return
    queueMicrotask(() => setMenuOpen(false))
  }, [mobileNavMq, menuOpen])

  return (
    <div className="site-shell">
      <SiteMeta />
      <a href="#main" className="skip-link">
        Přeskočit na obsah
      </a>
      <div className="site-grain" aria-hidden />
      <div className="site-noise" aria-hidden />
      <header
        className={`site-header${compact ? ' site-header--compact' : ''}${frosted ? ' site-header--frost' : ''}${menuOpen ? ' site-header--menu-open' : ''}`}
      >
        <div
          className="nav-backdrop"
          aria-hidden
          onClick={closeMenu}
          data-open={menuOpen ? 'true' : 'false'}
        />
        <div className="layout-inner site-header__row">
          <NavLink to="/" className="brand-mark" end onClick={closeMenu}>
            {logoOk ? (
              <img
                src={assetPaths.logo}
                alt={site.name}
                className="brand-mark__img"
                decoding="async"
                onError={() => setLogoOk(false)}
              />
            ) : (
              <span className="logo logo--text">{site.name}</span>
            )}
          </NavLink>
          <div className="site-header__tray">
            <button
              type="button"
              className={`nav-toggle${menuOpen ? ' nav-toggle--open' : ''}`}
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
              aria-label={menuOpen ? 'Zavřít menu' : 'Otevřít menu'}
              onClick={toggleMenu}
            >
              <span className="nav-toggle__bars" aria-hidden>
                <span className="nav-toggle__bar" />
                <span className="nav-toggle__bar" />
                <span className="nav-toggle__bar" />
              </span>
              <span className="nav-toggle__close" aria-hidden>
                ×
              </span>
            </button>
            <nav
              id="primary-navigation"
              className={`nav${menuOpen ? ' nav--open' : ''}`}
              aria-label="Hlavní navigace"
              inert={navInert ? true : undefined}
            >
              <NavLink to="/" className={navLinkClass} end onClick={closeMenu}>
                Úvod
              </NavLink>
              <NavLink to="/prace" className={navLinkClass} onClick={closeMenu}>
                Projekty
              </NavLink>
              <NavLink to="/sluzby" className={navLinkClass} onClick={closeMenu}>
                Služby
              </NavLink>
              <NavLink to="/o-mne" className={navLinkClass} onClick={closeMenu}>
                O mně
              </NavLink>
              <NavLink
                to="/kontakt"
                className={({ isActive }) => `nav-cta${isActive ? ' active' : ''}`}
                onClick={closeMenu}
              >
                Kontakt
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      <main id="main" className="site-main" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div
          className={`layout-inner site-footer__inner site-footer__inner--massflow${
            site.showFooterSocial ? '' : ' site-footer__inner--solo'
          }`}
        >
          <div className="site-footer__block">
            <p className="site-footer__name">{site.name}</p>
            <p className="site-footer__tagline">{footerTagline}</p>
            <p className="site-footer__meta">Provozovatel: {site.legalName}</p>
            <p className="site-footer__meta">
              IČO: {site.ico} · {site.address}
            </p>
            <p className="site-footer__meta">
              &copy; {new Date().getFullYear()} {site.name}
            </p>
          </div>
          {site.showFooterSocial ? (
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
          ) : null}
        </div>
      </footer>
      <CustomCursor />
    </div>
  )
}
