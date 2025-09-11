'use client'

import { useState, useEffect } from 'react'
import { getABTestVariant, ABTestVariant } from '@/lib/ab-testing'

export function useABTest() {
  const [variant, setVariant] = useState<ABTestVariant | null>(null)

  useEffect(() => {
    setVariant(getABTestVariant())
  }, [])

  return variant
}