export const GA_MEASUREMENT_ID = 'G-JWG4TWR0T9'

export const CONSENT_STORAGE_KEY = 'massflow-cookie-consent-v1'

export type ConsentState = {
  /** Analytics / measurement cookies (Google Analytics) */
  analytics: boolean
  updatedAt: string
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentState
    if (typeof parsed.analytics !== 'boolean') return null
    return parsed
  } catch {
    return null
  }
}

export function writeConsent(analytics: boolean): ConsentState {
  const state: ConsentState = {
    analytics,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state))
  return state
}

export function loadGoogleAnalytics(): void {
  if (typeof window === 'undefined') return
  if (document.getElementById('ga-gtag')) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })

  const script = document.createElement('script')
  script.id = 'ga-gtag'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)
}
