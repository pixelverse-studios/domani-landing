'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { trackAnalyticsEvent } from '@/lib/analytics/attribution'

export default function WebVitals() {
  useReportWebVitals((metric) => {
    const multiplier = metric.name === 'CLS' ? 1000 : 1
    const roundedValue = Math.round(metric.value * multiplier)

    trackAnalyticsEvent('web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.name,
      metric_id: metric.id,
      metric_name: metric.name,
      value: roundedValue,
      non_interaction: true,
    })
  })

  return null
}
