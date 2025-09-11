'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AppPreviewProps {
  children: ReactNode
  title?: string
  subtitle?: string
  device?: 'mobile' | 'desktop'
  className?: string
  showStatusBar?: boolean
  showHomeIndicator?: boolean
}

export function AppPreview({
  children,
  title,
  subtitle,
  device = 'mobile',
  className,
  showStatusBar = true,
  showHomeIndicator = true,
}: AppPreviewProps) {
  const isMobile = device === 'mobile'

  return (
    <div className={cn('relative', className)}>
      {title && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <motion.div
        className={cn(
          'relative mx-auto',
          isMobile ? 'max-w-[375px]' : 'max-w-[1200px]'
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Device Frame */}
        <div
          className={cn(
            'relative bg-gray-900 rounded-[2.5rem] shadow-2xl',
            isMobile ? 'p-3' : 'p-4'
          )}
        >
          {/* Screen */}
          <div
            className={cn(
              'relative bg-white dark:bg-dark-surface overflow-hidden',
              isMobile ? 'rounded-[2rem]' : 'rounded-xl'
            )}
          >
            {/* Status Bar (Mobile only) */}
            {isMobile && showStatusBar && (
              <div className="absolute top-0 left-0 right-0 h-11 bg-white dark:bg-dark-surface z-10 flex items-center justify-between px-6">
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  9:41
                </span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 17h20v2H2v-2zm1.15-4.05L4 11.47l.85 1.48 1.3-.75-.85-1.48H7v-1.5H5.3l.85-1.48L4.85 7 4 8.47 3.15 7l-1.3.75.85 1.48H1v1.5h1.7l-.85 1.48 1.3.75zm6.7-.75l1.48.85 1.48-.85-.85-1.48H14v-1.5h-2.05l.85-1.48-1.48-.85L10 8.47 8.68 7l-1.48.85.85 1.48H6v1.5h2.05l-.85 1.48zm8 0l1.48.85 1.48-.85-.85-1.48H22v-1.5h-2.05l.85-1.48-1.48-.85L18 8.47 16.68 7l-1.48.85.85 1.48H14v1.5h2.05l-.85 1.48z"/>
                  </svg>
                  <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 7l1-1v14l-1-1V7zm3 0l1-1v14l-1-1V7zm3 0l1-1v14l-1-1V7zm3 0l1-1v14l-1-1V7zm3 0l1-1v14l-1-1V7z"/>
                  </svg>
                  <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6v10h2.5v-5.5h3v-1h-3V7h4v-1H4zm7 0v10h1v-4h1.5c1.5 0 2.5-1 2.5-3s-1-3-2.5-3H11zm1 1h1.5c1 0 1.5.5 1.5 2s-.5 2-1.5 2H12V7zm5.5 0c-1 0-1.5.5-1.5 1.5V10h1v2h-1v4h1v-3h1v-1h-1v-2c0-.5.5-.5.5-.5h.5v-1h-.5c-.5 0-1 0-1 .5z"/>
                  </svg>
                </div>
              </div>
            )}

            {/* Content */}
            <div className={cn(isMobile && showStatusBar && 'pt-11')}>
              {children}
            </div>

            {/* Home Indicator (Mobile only) */}
            {isMobile && showHomeIndicator && (
              <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-center pb-2">
                <div className="w-32 h-1 bg-gray-900 dark:bg-white rounded-full opacity-30" />
              </div>
            )}
          </div>

          {/* Notch (Mobile only) */}
          {isMobile && (
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl" />
          )}
        </div>

        {/* Shadow and Reflection */}
        <div
          className={cn(
            'absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent',
            'opacity-50'
          )}
        />
      </motion.div>
    </div>
  )
}