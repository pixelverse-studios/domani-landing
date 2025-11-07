'use client'

import { useCallback, useEffect, useState } from 'react'
import Script from 'next/script'

type ConsentState = 'loading' | 'granted' | 'denied' | 'prompt'

const STORAGE_KEY = 'domani-sitebehaviour-consent'

export function SiteBehaviourConsentGate() {
  const [consentState, setConsentState] = useState<ConsentState>('loading')

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
      if (stored === 'granted' || stored === 'denied') {
        setConsentState(stored)
      } else {
        setConsentState('prompt')
      }
    } catch {
      setConsentState('prompt')
    }
  }, [])

  const updateConsent = useCallback((value: 'granted' | 'denied') => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // ignore storage errors (e.g., Safari private mode)
    }
    setConsentState(value)
  }, [])

  const renderBanner = consentState === 'prompt'

  return (
    <>
      {consentState === 'granted' && (
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
                  var sbSiteSecret = '59dd84d0-342e-4caa-b723-040c094d92fa';
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
      )}

      {renderBanner && (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white/95 p-5 shadow-2xl backdrop-blur dark:border-gray-700 dark:bg-dark-surface/95">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-gray-900 dark:text-white">Allow experience analytics?</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We use a lightweight SiteBehaviour script to capture anonymized interaction data that helps us improve Domani.
                Enable tracking to share usage insights. You can opt out anytime by clearing site data.
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-wrap gap-3 sm:flex-col sm:items-end">
              <button
                type="button"
                onClick={() => updateConsent('granted')}
                className="rounded-xl bg-gradient-to-r from-primary-600 to-evening-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
              >
                Allow
              </button>
              <button
                type="button"
                onClick={() => updateConsent('denied')}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/50"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
