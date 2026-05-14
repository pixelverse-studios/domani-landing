'use client'

type EventParams = Record<string, string | number | boolean | undefined>

interface AttributionTouch {
  source: string
  medium: string
  campaign?: string
  content?: string
  term?: string
  adId?: string
  clickId?: string
  referrer?: string
  landingPage: string
  capturedAt: string
  hasExplicitCampaignSignal: boolean
}

interface StoredAttribution {
  first: AttributionTouch
  current: AttributionTouch
}

const STORAGE_KEY = 'domani_attribution'

function getSearchParam(searchParams: URLSearchParams, key: string): string | undefined {
  const value = searchParams.get(key)
  return value?.trim() || undefined
}

function getReferrerHost(): string | undefined {
  if (!document.referrer) return undefined

  try {
    const referrer = new URL(document.referrer)
    if (referrer.hostname === window.location.hostname) return undefined
    return referrer.hostname
  } catch {
    return undefined
  }
}

function getStoredAttribution(): StoredAttribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredAttribution) : null
  } catch {
    return null
  }
}

function storeAttribution(attribution: StoredAttribution) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // Ignore storage failures; tracking should never affect the page.
  }
}

function buildTouch(): AttributionTouch {
  const searchParams = new URLSearchParams(window.location.search)
  const referrer = getReferrerHost()
  const gclid = getSearchParam(searchParams, 'gclid')
  const fbclid = getSearchParam(searchParams, 'fbclid')
  const ttclid = getSearchParam(searchParams, 'ttclid')
  const linkedInClickId = getSearchParam(searchParams, 'li_fat_id')
  const utmSource = getSearchParam(searchParams, 'utm_source')
  const utmMedium = getSearchParam(searchParams, 'utm_medium')
  const campaign = getSearchParam(searchParams, 'utm_campaign')
  const content = getSearchParam(searchParams, 'utm_content')
  const term = getSearchParam(searchParams, 'utm_term')
  const adId = getSearchParam(searchParams, 'utm_id')
  const clickId = gclid || fbclid || ttclid || linkedInClickId
  const hasExplicitCampaignSignal = Boolean(
    utmSource || utmMedium || campaign || content || term || adId || clickId
  )
  const source =
    utmSource ||
    (gclid ? 'google' : undefined) ||
    (fbclid ? 'meta' : undefined) ||
    (ttclid ? 'tiktok' : undefined) ||
    (linkedInClickId ? 'linkedin' : undefined) ||
    referrer ||
    'direct'
  const medium =
    utmMedium ||
    (gclid || fbclid || ttclid || linkedInClickId ? 'paid' : undefined) ||
    (referrer ? 'referral' : 'direct')

  return {
    source,
    medium,
    campaign,
    content,
    term,
    adId,
    clickId,
    referrer,
    landingPage: `${window.location.pathname}${window.location.search}`,
    capturedAt: new Date().toISOString(),
    hasExplicitCampaignSignal,
  }
}

function hasCampaignSignal(touch: AttributionTouch): boolean {
  // After the first touch, only explicit campaign/click data should replace current attribution.
  // Referrer-only internal navigation can otherwise erase UTM campaign details before conversion.
  return touch.hasExplicitCampaignSignal
}

function flattenTouch(prefix: 'first' | 'current', touch: AttributionTouch): EventParams {
  return {
    [`${prefix}_source`]: touch.source,
    [`${prefix}_medium`]: touch.medium,
    [`${prefix}_campaign`]: touch.campaign,
    [`${prefix}_content`]: touch.content,
    [`${prefix}_term`]: touch.term,
    [`${prefix}_ad_id`]: touch.adId,
    [`${prefix}_click_id`]: touch.clickId,
    [`${prefix}_referrer`]: touch.referrer,
    [`${prefix}_landing_page`]: touch.landingPage,
  }
}

export function captureAttribution(): StoredAttribution | null {
  if (typeof window === 'undefined') return null

  const touch = buildTouch()
  const stored = getStoredAttribution()

  if (!stored) {
    const attribution = { first: touch, current: touch }
    storeAttribution(attribution)
    return attribution
  }

  if (!hasCampaignSignal(touch)) {
    return stored
  }

  const attribution = { first: stored.first, current: touch }
  storeAttribution(attribution)
  return attribution
}

export function getAttributionEventParams(): EventParams {
  if (typeof window === 'undefined') return {}

  const attribution = getStoredAttribution() || captureAttribution()
  if (!attribution) return {}

  return {
    ...flattenTouch('first', attribution.first),
    ...flattenTouch('current', attribution.current),
  }
}

export function trackAnalyticsEvent(eventName: string, parameters: EventParams = {}) {
  if (typeof window === 'undefined') return

  const gtag = (window as typeof window & {
    gtag?: (command: 'event', eventName: string, parameters?: EventParams) => void
  }).gtag

  if (typeof gtag !== 'function') return

  gtag('event', eventName, {
    ...parameters,
    ...getAttributionEventParams(),
  })
}
