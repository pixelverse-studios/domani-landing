'use client'

import Script from 'next/script'

const SITE_SECRET = '59dd84d0-342e-4caa-b723-040c094d92fa'

export function SiteBehaviourConsentGate() {
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
