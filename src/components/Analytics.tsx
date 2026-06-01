'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import {
  captureAttribution,
  getCurrentAdEventParams,
  getCurrentUrlAdEventParams,
  getAttributionEventParams,
  isAnalyticsPath,
  trackAnalyticsEvent,
} from '@/lib/analytics/attribution'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const isConfigured =
  Boolean(GA_MEASUREMENT_ID) &&
  GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX' &&
  /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID || '')

type Gtag = (...args: unknown[]) => void

function ensureGtag(): Gtag | null {
  if (typeof window === 'undefined') return null

  const analyticsWindow = window as typeof window & {
    dataLayer?: unknown[]
    gtag?: Gtag
  }

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || []
  analyticsWindow.gtag =
    analyticsWindow.gtag ||
    function gtag(...args: unknown[]) {
      analyticsWindow.dataLayer?.push(args)
    }

  return analyticsWindow.gtag
}

function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isConfigured || !isAnalyticsPath(pathname)) {
      return
    }

    captureAttribution()

    const query = searchParams.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname
    const landingAdParams = getCurrentUrlAdEventParams()
    const pageParams = {
      page_path: pagePath,
      ...getAttributionEventParams(),
      ...getCurrentAdEventParams(),
    }

    const gtag = ensureGtag()

    gtag?.('event', 'page_view', {
      send_to: GA_MEASUREMENT_ID,
      ...pageParams,
    })

    trackAdLanding(pagePath, landingAdParams)
  }, [pathname, searchParams])

  return null
}

function trackAdLanding(pagePath: string, adParams: ReturnType<typeof getCurrentUrlAdEventParams>) {
  if (typeof window === 'undefined') return

  if (!adParams.ad_platform) return

  const key = `domani_ad_landing:${pagePath}`
  try {
    if (window.sessionStorage.getItem(key)) return
    window.sessionStorage.setItem(key, '1')
  } catch {
    // Ignore storage failures; analytics should never affect navigation.
  }

  trackAnalyticsEvent('ad_landing', {
    event_category: 'acquisition',
    page_path: pagePath,
  })
}

function installOutboundLinkTracking() {
  if (typeof window === 'undefined') return () => {}

  const handleClick = (event: MouseEvent) => {
    if (!isAnalyticsPath(window.location.pathname)) return

    const target = event.target
    if (!(target instanceof Element)) return

    const link = target.closest('a[href]')
    if (!(link instanceof HTMLAnchorElement)) return
    if (link.dataset.analyticsStoreLink === 'true') return

    const href = link.href
    const rawHref = link.getAttribute('href') || href
    const linkText = link.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120)

    if (rawHref.startsWith('mailto:')) {
      trackAnalyticsEvent('email_link_click', {
        event_category: 'engagement',
        event_label: linkText || 'email',
        link_url: rawHref,
        page_path: `${window.location.pathname}${window.location.search}`,
      })
      return
    }

    if (rawHref.startsWith('tel:')) {
      trackAnalyticsEvent('phone_link_click', {
        event_category: 'engagement',
        event_label: linkText || 'phone',
        link_url: rawHref,
        page_path: `${window.location.pathname}${window.location.search}`,
      })
      return
    }

    try {
      const url = new URL(href)
      if (url.origin === window.location.origin) return

      trackAnalyticsEvent('external_link_click', {
        event_category: 'engagement',
        event_label: linkText || url.hostname,
        link_url: url.href,
        link_domain: url.hostname,
        page_path: `${window.location.pathname}${window.location.search}`,
      })
    } catch {
      // Ignore malformed hrefs.
    }
  }

  document.addEventListener('click', handleClick, { capture: true })

  return () => {
    document.removeEventListener('click', handleClick, { capture: true })
  }
}

export default function Analytics() {
  const pathname = usePathname()
  const shouldLoadAnalytics = isConfigured && isAnalyticsPath(pathname)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!shouldLoadAnalytics) {
      delete (window as typeof window & {
        trackEvent?: typeof trackAnalyticsEvent
      }).trackEvent

      return
    }

    ;(window as typeof window & {
      trackEvent?: typeof trackAnalyticsEvent
    }).trackEvent = trackAnalyticsEvent

    return installOutboundLinkTracking()
  }, [shouldLoadAnalytics])

  if (!shouldLoadAnalytics) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false,
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  )
}
