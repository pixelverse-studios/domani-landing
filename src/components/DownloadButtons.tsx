'use client'

import { motion } from 'framer-motion'
import {
  APP_STORE_CONFIG,
  getAppStoreUrl,
  getPlayStoreUrl,
  isIosAvailable,
  isAndroidAvailable,
} from '@/lib/config/appStores'

interface DownloadButtonsProps {
  className?: string
  showSubtext?: boolean
  size?: 'default' | 'large'
  align?: 'start' | 'center'
}

export default function DownloadButtons({
  className = '',
  showSubtext = true,
  size = 'default',
  align = 'center'
}: DownloadButtonsProps) {
  const buttonHeight = size === 'large' ? 'h-14' : 'h-12'
  const iconSize = size === 'large' ? 'w-8 h-8' : 'w-7 h-7'
  const textSize = size === 'large' ? 'text-base' : 'text-sm'
  const subtextSize = size === 'large' ? 'text-xs' : 'text-[10px]'

  const handleClick = (store: 'ios' | 'android') => {
    // Track click event
    if (typeof window !== 'undefined' && (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', 'download_button_click', {
        event_category: 'engagement',
        event_label: store,
      })
    }
  }

  const appStoreUrl = getAppStoreUrl()
  const playStoreUrl = getPlayStoreUrl()
  const iosAvailable = isIosAvailable()
  const androidAvailable = isAndroidAvailable()

  return (
    <div className={`flex flex-col ${align === 'center' ? 'items-center' : 'items-start'} ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* App Store / TestFlight Button - Apple TestFlight Blue */}
        <motion.a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick('ios')}
          {...(!iosAvailable && { 'aria-disabled': true })}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            ${buttonHeight} px-5 flex items-center gap-3
            bg-[#0D96F6] text-white rounded-xl
            hover:bg-[#0A7DD4] transition-colors duration-200
            shadow-lg hover:shadow-xl
          `}
          aria-label="Join Beta on TestFlight"
        >
          {/* Apple Logo */}
          <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <div className="flex flex-col items-start">
            <span className={`${textSize} font-semibold leading-none`}>Join Beta</span>
            <span className={`${subtextSize} opacity-90 leading-tight`}>on TestFlight</span>
          </div>
        </motion.a>

        {/* Play Store Button - Google Play Green */}
        <motion.a
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick('android')}
          {...(!androidAvailable && { 'aria-disabled': true })}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            ${buttonHeight} px-5 flex items-center gap-3
            bg-[#01875F] text-white rounded-xl
            hover:bg-[#016F4E] transition-colors duration-200
            shadow-lg hover:shadow-xl
          `}
          aria-label="Early Access on Google Play"
        >
          {/* Google Play Logo */}
          <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
          </svg>
          <div className="flex flex-col items-start">
            <span className={`${textSize} font-semibold leading-none`}>Early Access</span>
            <span className={`${subtextSize} opacity-90 leading-tight`}>on Google Play</span>
          </div>
        </motion.a>
      </div>

      {showSubtext && (
        <p className="mt-3 text-xs text-gray-500">
          Public beta. Limited access.
        </p>
      )}
    </div>
  )
}
