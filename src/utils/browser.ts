/**
 * Browser detection utilities
 */

/**
 * Detect if the current browser is Safari
 */
export const isSafari = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }

  const userAgent = navigator.userAgent.toLowerCase()
  const vendor = navigator.vendor?.toLowerCase() || ''

  // Check for Safari on desktop and mobile
  // Must check for Chrome/Chromium first as they contain 'safari' in UA
  const isChrome = userAgent.includes('chrome') || userAgent.includes('crios')
  const isFirefox = userAgent.includes('firefox')
  const isSafariBrowser = vendor.includes('apple') && userAgent.includes('safari') && !isChrome && !isFirefox

  return isSafariBrowser
}

/**
 * Detect if the current browser is mobile Safari (iOS)
 */
export const isMobileSafari = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }

  const userAgent = navigator.userAgent.toLowerCase()
  const platform = navigator.platform?.toLowerCase() || ''

  // Check for iOS devices
  const isIOS = /iphone|ipad|ipod/.test(userAgent) ||
                (platform.startsWith('mac') && 'ontouchend' in document)

  return isIOS && isSafari()
}

/**
 * Get the optimal timing function for animations
 * Safari sometimes has issues with Date.now(), so we prefer performance.now()
 */
export const getTimestamp = (): number => {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now()
  }
  return Date.now()
}

/**
 * Check if IntersectionObserver is reliably supported
 * Safari has the API but sometimes doesn't trigger properly
 */
export const hasReliableIntersectionObserver = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  // IntersectionObserver exists but may not work reliably in Safari
  const hasAPI = 'IntersectionObserver' in window

  // On Safari, we'll use a fallback approach
  if (isSafari() || isMobileSafari()) {
    return false // Force fallback for Safari
  }

  return hasAPI
}