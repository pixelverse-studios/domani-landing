'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface Citation {
  authors: string
  year: number
  title: string
  journal?: string
  url?: string
}

interface PortalTooltipProps {
  citation: Citation
  children: React.ReactNode
}

export function PortalTooltip({ citation, children }: PortalTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const margin = 8
    const tooltipWidth = 288 // w-72 in tailwind
    const tooltipHeight = 120 // estimated height

    // Default position: above the trigger, centered
    let top = triggerRect.top - tooltipHeight - margin
    let left = triggerRect.left + (triggerRect.width / 2) - (tooltipWidth / 2)

    // Check if tooltip would go off the top of the viewport
    if (top < margin) {
      // Position below instead
      top = triggerRect.bottom + margin
    }

    // Check horizontal boundaries
    const rightEdge = left + tooltipWidth
    const viewportWidth = window.innerWidth

    if (rightEdge > viewportWidth - margin) {
      // Align to right edge
      left = viewportWidth - tooltipWidth - margin
    } else if (left < margin) {
      // Align to left edge
      left = margin
    }

    setPosition({ top, left })
  }, [])

  const handleShow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(true)
    // Small delay to ensure tooltip is rendered before calculating position
    requestAnimationFrame(() => {
      calculatePosition()
    })
  }, [calculatePosition])

  const handleHide = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 100)
  }, [])

  const handleTooltipEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleTooltipLeave = useCallback(() => {
    handleHide()
  }, [handleHide])

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsVisible(!isVisible)
    if (!isVisible) {
      requestAnimationFrame(() => {
        calculatePosition()
      })
    }
  }, [isVisible, calculatePosition])

  useEffect(() => {
    if (isVisible) {
      calculatePosition()
      window.addEventListener('resize', calculatePosition)
      window.addEventListener('scroll', calculatePosition)
      return () => {
        window.removeEventListener('resize', calculatePosition)
        window.removeEventListener('scroll', calculatePosition)
      }
    }
  }, [isVisible, calculatePosition])

  if (!mounted) return <div ref={triggerRef}>{children}</div>

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onClick={handleClick}
        className="inline-block"
      >
        {children}
      </div>

      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 9999,
              }}
              onMouseEnter={handleTooltipEnter}
              onMouseLeave={handleTooltipLeave}
              className="w-72"
            >
              <div className="bg-dark-elevated text-white text-xs rounded-lg shadow-2xl p-3 border border-dark-card">
                <p className="font-semibold mb-1">{citation.title}</p>
                <p className="text-gray-300 mb-1">
                  {citation.authors} ({citation.year})
                </p>
                {citation.journal && (
                  <p className="text-gray-400 italic">{citation.journal}</p>
                )}
                {citation.url && (
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-400 hover:text-blue-300 underline transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Study
                  </a>
                )}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-dark-elevated" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}