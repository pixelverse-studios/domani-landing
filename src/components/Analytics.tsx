'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import {
  captureAttribution,
  getAttributionEventParams,
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
    if (!isConfigured) {
      return
    }

    captureAttribution()

    const gtag = ensureGtag()
    if (!gtag) {
      return
    }

    const query = searchParams.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname

    gtag('event', 'page_view', {
      send_to: GA_MEASUREMENT_ID,
      page_path: pagePath,
      ...getAttributionEventParams(),
    })
  }, [pathname, searchParams])

  return null
}

export default function Analytics() {
  useEffect(() => {
    if (!isConfigured || typeof window === 'undefined') return

    ;(window as typeof window & {
      trackEvent?: typeof trackAnalyticsEvent
    }).trackEvent = trackAnalyticsEvent
  }, [])

  if (!isConfigured) {
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
