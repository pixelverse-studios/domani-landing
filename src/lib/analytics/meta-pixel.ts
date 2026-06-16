'use client'

import {
  getAttributionEventParams,
  getCurrentAdEventParams,
  isAnalyticsPath,
  type EventParams,
} from './attribution'

type MetaPixelTrackCommand = 'track' | 'trackCustom'
type MetaPixelWindow = typeof window & {
  fbq?: (
    command: MetaPixelTrackCommand,
    eventName: string,
    parameters?: Record<string, string | number | boolean>
  ) => void
}

export type MetaPixelParams = Record<string, string | number | boolean | undefined>

function sanitizeMetaParams(parameters: MetaPixelParams = {}) {
  return Object.entries(parameters).reduce<Record<string, string | number | boolean>>((cleaned, [key, value]) => {
    if (value === undefined) return cleaned
    cleaned[key] = value
    return cleaned
  }, {})
}

function getSharedMetaParams(parameters: MetaPixelParams = {}) {
  return sanitizeMetaParams({
    ...parameters,
    ...getAttributionEventParams(),
    ...getCurrentAdEventParams(),
  })
}

export function trackMetaPixelEvent(
  command: MetaPixelTrackCommand,
  eventName: string,
  parameters: MetaPixelParams = {}
) {
  if (typeof window === 'undefined') return
  if (!isAnalyticsPath(window.location.pathname)) return

  const fbq = (window as MetaPixelWindow).fbq
  if (!fbq) return

  fbq(command, eventName, getSharedMetaParams(parameters))
}

export function trackMetaPageView(parameters: MetaPixelParams = {}) {
  trackMetaPixelEvent('track', 'PageView', parameters)
}

export function trackMetaLead(parameters: MetaPixelParams = {}) {
  trackMetaPixelEvent('track', 'Lead', {
    lead_source: 'waitlist',
    ...parameters,
  })
}

export function trackMetaDownloadIntent(parameters: MetaPixelParams = {}) {
  trackMetaPixelEvent('trackCustom', 'DownloadIntent', {
    cta_type: 'download',
    ...parameters,
  })
}

export function trackMetaAdLanding(parameters: MetaPixelParams = {}) {
  const pagePath = `${window.location.pathname}${window.location.search}`
  const key = `domani_meta_ad_landing:${pagePath}`

  try {
    if (window.sessionStorage.getItem(key)) return
    window.sessionStorage.setItem(key, '1')
  } catch {
    // Ignore storage failures; tracking should never affect navigation.
  }

  trackMetaPixelEvent('track', 'ViewContent', {
    content_name: 'Paid ad landing',
    content_category: 'paid_media',
    page_path: pagePath,
    ...parameters,
  })
}

export type { EventParams }
