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
  const shouldNoIndex = Boolean(meta.noIndex)
  const organizationId = `${siteOrigin}/#organization`
  const websiteId = `${siteOrigin}/#website`

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: site.name,
    url: siteOrigin,
    logo: `${siteOrigin}/portfolio/Logo_white@3x.png`,
    email: site.email,
    sameAs: [site.linkedin, site.facebook, site.instagram, site.dribbble],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    url: siteOrigin,
    name: site.name,
    description: site.description,
    inLanguage: 'cs-CZ',
    publisher: {
      '@id': organizationId,
    },
  }

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={site.keywords} />
      <meta name="robots" content={shouldNoIndex ? 'noindex, follow' : 'index, follow'} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="cs_CZ" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={`${site.name} — digitální marketing, web a design`} />
      <meta property="og:image:width" content="1920" />
      <meta property="og:image:height" content="1080" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:url" content={canonical} />

      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
    </Helmet>
  )
}
