'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface SocialProofProps {
  count: number
}

export default function SocialProof({ count }: SocialProofProps) {
  const avatars = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
    { id: 4, name: 'User 4' },
    { id: 5, name: 'User 5' },
  ]

  return (
    <div className="flex items-center gap-4">
      {/* Avatar Stack */}
      <div className="flex -space-x-3">
        {avatars.map((avatar, index) => (
          <motion.div
            key={avatar.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-evening-400 border-2 border-white dark:border-dark-elevated flex items-center justify-center text-white font-semibold text-sm"
              style={{ zIndex: 5 - index }}
            >
              {avatar.name.charAt(0)}
            </div>
          </motion.div>
        ))}
        
        {/* Additional Users Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-0"
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-dark-card border-2 border-white dark:border-dark-elevated flex items-center justify-center">
            <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold">+{count - 5}</span>
          </div>
        </motion.div>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm font-semibold text-gray-900 dark:text-white"
        >
          Join {count.toLocaleString()}+ early adopters
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-gray-500 dark:text-gray-400"
        >
          Growing daily
        </motion.p>
      </div>

      {/* Live Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-1 ml-auto"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs text-gray-500">Live</span>
      </motion.div>
    </div>
  )
}