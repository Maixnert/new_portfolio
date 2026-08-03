import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CONSENT_STORAGE_KEY,
  loadGoogleAnalytics,
  readConsent,
  writeConsent,
} from '../lib/consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const existing = readConsent()
    if (!existing) {
      setVisible(true)
      return
    }
    if (existing.analytics) {
      loadGoogleAnalytics()
    }
  }, [])

  function acceptAnalytics() {
    writeConsent(true)
    loadGoogleAnalytics()
    setVisible(false)
  }

  function rejectAnalytics() {
    writeConsent(false)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-banner-title" aria-live="polite">
      <div className="cookie-banner__inner">
        <div className="cookie-banner__copy">
          <h2 id="cookie-banner-title" className="cookie-banner__title">
            Cookies a soukromí
          </h2>
          <p className="cookie-banner__text">
            Používáme nezbytné cookies pro běh webu. Analytické cookies (Google Analytics) spouštíme
            jen se vaším souhlasem — pomáhají nám zlepšovat web. Podrobnosti najdete v{' '}
            <Link to="/ochrana-udaju">Zásadách ochrany osobních údajů</Link>.
          </p>
        </div>
        <div className="cookie-banner__actions">
          <button type="button" className="btn btn-ghost cookie-banner__btn" onClick={rejectAnalytics}>
            Jen nezbytné
          </button>
          <button type="button" className="btn btn-primary cookie-banner__btn" onClick={acceptAnalytics}>
            Souhlasím s analytikou
          </button>
        </div>
      </div>
    </div>
  )
}

/** Re-open preferences from footer */
export function openCookieSettings(): void {
  localStorage.removeItem(CONSENT_STORAGE_KEY)
  window.location.reload()
}
