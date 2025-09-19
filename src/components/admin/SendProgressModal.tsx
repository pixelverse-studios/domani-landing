'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Loader2, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SendProgressModalProps {
  isOpen: boolean
  onClose: () => void
  campaignName: string
  totalRecipients: number
  progress?: {
    sent: number
    failed: number
    total: number
    errors?: string[]
  }
  isComplete?: boolean
  onComplete?: () => void
}

export function SendProgressModal({
  isOpen,
  onClose,
  campaignName,
  totalRecipients,
  progress,
  isComplete = false,
  onComplete
}: SendProgressModalProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  useEffect(() => {
    if (isComplete && onComplete) {
      // Auto-close after 3 seconds when complete
      const timer = setTimeout(() => {
        onComplete()
        onClose()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [isComplete, onComplete, onClose])
  
  if (!isOpen) return null
  
  const sent = progress?.sent || 0
  const failed = progress?.failed || 0
  const total = progress?.total || totalRecipients
  const processed = sent + failed
  const percentComplete = total > 0 ? Math.round((processed / total) * 100) : 0
  const successRate = processed > 0 ? Math.round((sent / processed) * 100) : 0
  
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {isComplete ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
                {isComplete ? 'Campaign Sent' : 'Sending Campaign'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {campaignName}
              </p>
            </div>
            {isComplete && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Progress Content */}
          <div className="p-6 space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {processed} of {total} ({percentComplete}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    isComplete ? 'bg-green-500' : 'bg-primary'
                  )}
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {sent.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Sent
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {failed.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Failed
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full mx-auto mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {successRate}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Success Rate
                </div>
              </div>
            </div>
            
            {/* Status Message */}
            <div className="text-center">
              {!isComplete ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending emails to recipients...
                </div>
              ) : failed > 0 ? (
                <div className="text-sm">
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    Campaign completed with {sent} successful sends
                  </p>
                  {failed > 0 && (
                    <p className="text-red-600 dark:text-red-400 mt-1">
                      {failed} emails failed to send
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-sm">
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    ✅ All emails sent successfully!
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Campaign completed at {new Date().toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
            
            {/* Error Details (if any) */}
            {failed > 0 && progress?.errors && progress.errors.length > 0 && (
              <div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                >
                  {showDetails ? 'Hide' : 'Show'} Error Details ({progress.errors.length})
                </button>
                
                {showDetails && (
                  <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm">
                    <ul className="space-y-1 text-red-700 dark:text-red-400 max-h-20 overflow-y-auto">
                      {progress.errors.slice(0, 5).map((error, index) => (
                        <li key={index} className="text-xs">• {error}</li>
                      ))}
                      {progress.errors.length > 5 && (
                        <li className="text-xs font-medium">
                          ... and {progress.errors.length - 5} more errors
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Completion Actions */}
            {isComplete && (
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose()
                    // Navigate to campaign details page
                    window.location.href = `/admin/campaigns`
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 font-medium transition-colors"
                >
                  View Campaigns
                </button>
              </div>
            )}
          </div>
          
          {/* Auto-close notice */}
          {isComplete && (
            <div className="px-6 pb-4">
              <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                This dialog will close automatically in a few seconds
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}