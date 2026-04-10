import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import {
  getPageMeta,
  site,
  siteOrigin,
  socialShareImagePath,
} from '../data/maixner'

function normalizePath(pathname: string) {
  if (pathname !== '/' && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

export function SiteMeta() {
  const { pathname } = useLocation()
  const path = normalizePath(pathname)
  const meta = getPageMeta(path)
  const canonical = `${siteOrigin}${path === '/' ? '' : path}`
  const imageUrl = `${siteOrigin}${socialShareImagePath}`

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={site.keywords} />
      {meta.noIndex ? <meta name="robots" content="noindex, follow" /> : null}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="cs_CZ" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  )
}
