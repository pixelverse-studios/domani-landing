import type { NextWebVitalsMetric } from 'next/dist/shared/lib/utils'

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (typeof window === 'undefined') {
    return
  }

  const multiplier = metric.name === 'CLS' ? 1000 : 1
  const roundedValue = Math.round(metric.value * multiplier)

  const gtag = (window as typeof window & { gtag?: (...args: any[]) => void; trackEvent?: (...args: any[]) => void }).gtag
  const trackEvent = (window as typeof window & { trackEvent?: (...args: any[]) => void }).trackEvent

  if (typeof gtag === 'function') {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: roundedValue,
      event_label: metric.id,
      non_interaction: true,
    })
    return
  }

  if (typeof trackEvent === 'function') {
    trackEvent(metric.name, {
      event_category: 'Web Vitals',
      value: roundedValue,
      event_label: metric.id,
      non_interaction: true,
    })
    return
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.info(`[WebVitals] ${metric.name}:`, roundedValue, metric)
  }
}
