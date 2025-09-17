/**
 * Scrolls to an element with accessibility support
 * Respects user's reduced motion preference
 * @param elementId - The ID of the element to scroll to
 * @param options - Optional configuration for scroll behavior
 */
export function scrollToElement(
  elementId: string,
  options?: {
    offset?: number
    focusAfterScroll?: boolean
    onComplete?: () => void
  }
) {
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    const element = document.getElementById(elementId)
    if (!element) {
      console.warn(`Element with id "${elementId}" not found`)
      return
    }

    const { offset = 80, focusAfterScroll = false, onComplete } = options || {}

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Calculate scroll position with offset for fixed header
    // Using consistent calculation method
    const elementRect = element.getBoundingClientRect()
    const absoluteElementTop = elementRect.top + window.scrollY
    const targetScrollPosition = Math.max(0, absoluteElementTop - offset)

    if (prefersReducedMotion) {
      // Instant scroll for users who prefer reduced motion
      window.scrollTo({
        top: targetScrollPosition,
        behavior: 'auto'
      })

      if (focusAfterScroll) {
        // Small delay to ensure scroll has completed
        setTimeout(() => element.focus(), 50)
      }

      onComplete?.()
    } else {
      // Smooth scroll for users who accept motion
      // Using a try-catch to handle any browser compatibility issues
      try {
        window.scrollTo({
          top: targetScrollPosition,
          behavior: 'smooth'
        })

        // Focus element after scroll completes
        if (focusAfterScroll || onComplete) {
          // Calculate scroll duration based on distance
          const currentPosition = window.scrollY
          const scrollDistance = Math.abs(currentPosition - targetScrollPosition)
          const duration = Math.min(Math.max(scrollDistance / 2, 500), 1200)

          setTimeout(() => {
            if (focusAfterScroll && element) {
              element.focus()
            }
            onComplete?.()
          }, duration)
        }
      } catch (error) {
        // Fallback for browsers that don't support smooth scroll
        window.scrollTo(0, targetScrollPosition)
        if (focusAfterScroll) {
          setTimeout(() => element.focus(), 50)
        }
        onComplete?.()
      }
    }
  })
}

/**
 * Alternative scroll method using scrollIntoView
 * More reliable for complex layouts
 */
export function scrollToElementAlternative(
  elementId: string,
  options?: {
    offset?: number
    focusAfterScroll?: boolean
    onComplete?: () => void
  }
) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.warn(`Element with id "${elementId}" not found`)
    return
  }

  const { offset = 100, focusAfterScroll = false, onComplete } = options || {}

  // Add temporary scroll-margin to handle offset
  const originalScrollMargin = element.style.scrollMarginTop
  element.style.scrollMarginTop = `${offset}px`

  // Use scrollIntoView which is more reliable
  element.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
    inline: 'nearest'
  })

  // Restore original scroll margin and handle callbacks
  setTimeout(() => {
    element.style.scrollMarginTop = originalScrollMargin

    if (focusAfterScroll) {
      element.focus()
    }

    onComplete?.()
  }, 800)
}

/**
 * Scrolls to the email signup form
 * Specifically designed for the waitlist email input
 */
export function scrollToEmailSignup() {
  // Try the alternative method first as it's more reliable
  // If you still experience issues, switch back to scrollToElement
  scrollToElementAlternative('inline-email', {
    offset: 100, // Account for fixed header
    focusAfterScroll: true,
    onComplete: () => {
      // Track the scroll action for analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'scroll_to_signup', {
          event_category: 'engagement',
          event_label: 'cta_scroll_to_email'
        })
      }
    }
  })
}