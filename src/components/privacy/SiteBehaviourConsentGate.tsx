'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { isAnalyticsPath } from '@/lib/analytics/attribution'

const SITE_SECRET = '59dd84d0-342e-4caa-b723-040c094d92fa'
type SiteBehaviourWindow = typeof window & {
  __siteBehaviourLoaded?: boolean
  sitebehaviourTrackingSecret?: string
}

export function SiteBehaviourConsentGate() {
  const pathname = usePathname()
  const shouldLoadSiteBehaviour = isAnalyticsPath(pathname)

  useEffect(() => {
    if (shouldLoadSiteBehaviour) return

    const siteBehaviourWindow = window as SiteBehaviourWindow

    if (siteBehaviourWindow.__siteBehaviourLoaded) {
      window.location.replace(window.location.href)
      return
    }

    document.getElementById('site-behaviour-script-v2')?.remove()

    delete siteBehaviourWindow.__siteBehaviourLoaded
    delete siteBehaviourWindow.sitebehaviourTrackingSecret
  }, [shouldLoadSiteBehaviour])

  if (!shouldLoadSiteBehaviour) {
    return null
  }

  return (
    <Script
      id="sitebehaviour-tracking"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (window.__siteBehaviourLoaded) return;
            window.__siteBehaviourLoaded = true;
            try {
              if (window.location && window.location.search && window.location.search.indexOf('capture-sitebehaviour-heatmap') !== -1) {
                sessionStorage.setItem('capture-sitebehaviour-heatmap', '_');
              }
              var sbSiteSecret = '${SITE_SECRET}';
              window.sitebehaviourTrackingSecret = sbSiteSecret;
              var scriptElement = document.createElement('script');
              scriptElement.defer = true;
              scriptElement.id = 'site-behaviour-script-v2';
              scriptElement.src = 'https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=' + sbSiteSecret;
              document.head.appendChild(scriptElement);
            } catch (e) {
              console.error('SiteBehaviour load failed', e);
            }
          })();
        `,
      }}
    />
  )
}
