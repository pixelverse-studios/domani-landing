'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import {
  captureAttribution,
  getCurrentUrlAdEventParams,
  isAnalyticsPath,
} from '@/lib/analytics/attribution'
import { trackMetaAdLanding, trackMetaPageView } from '@/lib/analytics/meta-pixel'

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const isConfigured =
  Boolean(META_PIXEL_ID) &&
  META_PIXEL_ID !== '000000000000000' &&
  /^\d+$/.test(META_PIXEL_ID || '')

function MetaPageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isConfigured || !isAnalyticsPath(pathname)) return

    captureAttribution()

    const query = searchParams.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname
    const landingAdParams = getCurrentUrlAdEventParams()

    trackMetaPageView({
      page_path: pagePath,
    })

    if (landingAdParams.ad_platform) {
      trackMetaAdLanding(landingAdParams)
    }
  }, [pathname, searchParams])

  return null
}

export default function MetaPixel() {
  const pathname = usePathname()
  const [isPixelReady, setIsPixelReady] = useState(false)
  const shouldLoadMetaPixel = isConfigured && isAnalyticsPath(pathname)

  if (!shouldLoadMetaPixel) {
    return null
  }

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive" onReady={() => setIsPixelReady(true)}>
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
        `}
      </Script>
      {isPixelReady && (
        <Suspense fallback={null}>
          <MetaPageViewTracker />
        </Suspense>
      )}
    </>
  )
}
