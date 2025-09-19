'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface GoogleSignInButtonProps {
  onClick: () => void | Promise<void>
  disabled?: boolean
  loading?: boolean
  variant?: 'light' | 'dark' | 'neutral'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function GoogleSignInButton({
  onClick,
  disabled = false,
  loading = false,
  variant = 'light',
  size = 'large',
  className = '',
}: GoogleSignInButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Google brand colors and specifications
  const variants = {
    light: {
      bg: '#FFFFFF',
      border: '#747775',
      text: '#1F1F1F',
      hoverBg: '#F8F9FA',
    },
    dark: {
      bg: '#131314',
      border: '#8E918F',
      text: '#E3E3E3',
      hoverBg: '#1E1E1F',
    },
    neutral: {
      bg: '#F2F2F2',
      border: 'transparent',
      text: '#1F1F1F',
      hoverBg: '#E8E9EA',
    },
  }

  const sizes = {
    small: {
      height: 'h-10',
      padding: 'px-3',
      fontSize: 'text-sm',
      iconSize: 18,
    },
    medium: {
      height: 'h-11',
      padding: 'px-4',
      fontSize: 'text-sm',
      iconSize: 20,
    },
    large: {
      height: 'h-12',
      padding: 'px-6',
      fontSize: 'text-base',
      iconSize: 24,
    },
  }

  const currentVariant = variants[variant]
  const currentSize = sizes[size]

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`
        relative w-full flex items-center justify-center
        ${currentSize.height} ${currentSize.padding}
        rounded-lg border transition-all duration-200
        font-medium ${currentSize.fontSize}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        backgroundColor: isHovered && !disabled ? currentVariant.hoverBg : currentVariant.bg,
        borderColor: currentVariant.border,
        borderWidth: variant === 'neutral' ? 0 : 1,
        color: currentVariant.text,
      }}
    >
      {loading ? (
        <Loader2
          className="animate-spin"
          style={{
            width: currentSize.iconSize,
            height: currentSize.iconSize,
            marginRight: 8
          }}
        />
      ) : (
        <GoogleIcon size={currentSize.iconSize} />
      )}
      <span className="ml-3">
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </span>
    </motion.button>
  )
}

function GoogleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}