'use client'

import { useEffect } from 'react'
import { useABTest } from '@/hooks/useABTest'

export function HeroCopyLayer() {
  const variant = useABTest()

  useEffect(() => {
    if (!variant || variant.variant === 'A') return

    const headlineEl = document.querySelector<HTMLElement>('[data-hero-copy="headline"]')
    if (headlineEl) {
      headlineEl.textContent = variant.headline
    }

    const subheadlineEl = document.querySelector<HTMLElement>('[data-hero-copy="subheadline"]')
    if (subheadlineEl) {
      subheadlineEl.textContent = variant.subheadline
    }
  }, [variant])

  return null
}
