'use client'

type EventParams = Record<string, string | number | boolean | undefined>
type Gtag = (command: 'event', eventName: string, parameters?: EventParams) => void
type AnalyticsWindow = typeof window & {
  dataLayer?: unknown[]
  gtag?: Gtag
}

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
const EXCLUDED_ANALYTICS_PATH_PREFIXES = ['/admin', '/dashboard', '/auth', '/oauth-redirect']

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
  const gbraid = getSearchParam(searchParams, 'gbraid')
  const wbraid = getSearchParam(searchParams, 'wbraid')
  const fbclid = getSearchParam(searchParams, 'fbclid')
  const ttclid = getSearchParam(searchParams, 'ttclid')
  const msclkid = getSearchParam(searchParams, 'msclkid')
  const linkedInClickId = getSearchParam(searchParams, 'li_fat_id')
  const utmSource = getSearchParam(searchParams, 'utm_source')
  const utmMedium = getSearchParam(searchParams, 'utm_medium')
  const campaign = getSearchParam(searchParams, 'utm_campaign')
  const content = getSearchParam(searchParams, 'utm_content')
  const term = getSearchParam(searchParams, 'utm_term')
  const adId = getSearchParam(searchParams, 'utm_id')
  const clickId = gclid || gbraid || wbraid || fbclid || ttclid || msclkid || linkedInClickId
  const hasExplicitCampaignSignal = Boolean(
    utmSource || utmMedium || campaign || content || term || adId || clickId
  )
  const source =
    utmSource ||
    (gclid || gbraid || wbraid ? 'google' : undefined) ||
    (fbclid ? 'meta' : undefined) ||
    (ttclid ? 'tiktok' : undefined) ||
    (msclkid ? 'microsoft' : undefined) ||
    (linkedInClickId ? 'linkedin' : undefined) ||
    referrer ||
    'direct'
  const medium =
    utmMedium ||
    (gclid || gbraid || wbraid || fbclid || ttclid || msclkid || linkedInClickId ? 'paid' : undefined) ||
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

function isPaidOrCampaignTouch(touch: AttributionTouch): boolean {
  return Boolean(touch.hasExplicitCampaignSignal || ['paid', 'paid_social', 'paid_search', 'cpc', 'ppc'].includes(touch.medium))
}

function getAdPlatform(touch: AttributionTouch): string {
  const source = touch.source.toLowerCase()

  if (source.includes('google') || touch.clickId?.startsWith('C')) return 'google'
  if (source.includes('meta') || source.includes('facebook') || source.includes('instagram')) return 'meta'
  if (source.includes('tiktok')) return 'tiktok'
  if (source.includes('linkedin')) return 'linkedin'

  return source
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

export function getCurrentAdEventParams(): EventParams {
  if (typeof window === 'undefined') return {}

  const attribution = getStoredAttribution() || captureAttribution()
  if (!attribution || !isPaidOrCampaignTouch(attribution.current)) return {}

  return {
    ad_platform: getAdPlatform(attribution.current),
    ad_source: attribution.current.source,
    ad_medium: attribution.current.medium,
    ad_campaign: attribution.current.campaign,
    ad_content: attribution.current.content,
    ad_term: attribution.current.term,
    ad_id: attribution.current.adId,
    ad_click_id: attribution.current.clickId,
  }
}

export function isAnalyticsPath(pathname: string): boolean {
  return !EXCLUDED_ANALYTICS_PATH_PREFIXES.some((prefix) => (
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  ))
}

export function trackAnalyticsEvent(eventName: string, parameters: EventParams = {}) {
  if (typeof window === 'undefined') return

  if (!isAnalyticsPath(window.location.pathname)) return

  const analyticsWindow = window as AnalyticsWindow

  const eventParams = {
    ...parameters,
    ...getAttributionEventParams(),
    ...getCurrentAdEventParams(),
  }

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || []
  analyticsWindow.gtag =
    analyticsWindow.gtag ||
    function gtag(...args: unknown[]) {
      analyticsWindow.dataLayer?.push(args)
    }

  analyticsWindow.gtag('event', eventName, eventParams)
}
