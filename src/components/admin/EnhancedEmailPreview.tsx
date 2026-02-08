'use client'

import { useState, useEffect } from 'react'
import { Monitor, Smartphone, Eye, EyeOff, RefreshCw, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EnhancedEmailPreviewProps {
  campaignId?: string
  htmlContent: string
  textContent?: string
  subject: string
  recipientEmail?: string
  variables?: Record<string, string>
  className?: string
}

interface PreviewData {
  subject: string
  html: string
  text: string
  recipient: {
    email: string
    firstName?: string
    lastName?: string
  }
}

export function EnhancedEmailPreview({
  campaignId,
  htmlContent,
  textContent = '',
  subject,
  recipientEmail,
  variables = {},
  className
}: EnhancedEmailPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [contentMode, setContentMode] = useState<'html' | 'text'>('html')
  const [isLoading, setIsLoading] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Process variables in content
  const processVariables = (content: string) => {
    let processed = content
    
    // Default variables
    const defaultVars = {
      firstName: 'John',
      lastName: 'Doe',
      email: recipientEmail || 'john.doe@example.com',
      fullName: 'John Doe',
      ...variables
    }
    
    // Replace all variables
    Object.entries(defaultVars).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      processed = processed.replace(regex, value)
    })
    
    return processed
  }
  
  // Fetch preview from API if campaign ID is provided
  const fetchPreview = async () => {
    if (!campaignId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const url = new URL(`/api/admin/campaigns/${campaignId}/preview`, baseUrl)
      if (recipientEmail) {
        url.searchParams.set('email', recipientEmail)
      }
      
      const response = await fetch(url.toString())
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch preview')
      }
      
      if (data.success && data.preview) {
        setPreviewData(data.preview)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preview')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Use API preview if available, otherwise process locally
  const displayContent = previewData || {
    subject: processVariables(subject),
    html: processVariables(htmlContent),
    text: processVariables(textContent),
    recipient: {
      email: recipientEmail || 'john.doe@example.com',
      firstName: variables.firstName || 'John',
      lastName: variables.lastName || 'Doe'
    }
  }
  
  useEffect(() => {
    if (campaignId) {
      fetchPreview()
    }
  }, [campaignId, recipientEmail])
  
  const openInNewTab = () => {
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${displayContent.subject}</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            ${displayContent.html}
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }
  
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200', className)}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">
            Email Preview
          </h3>
          <div className="flex items-center gap-2">
            {campaignId && (
              <button
                onClick={fetchPreview}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Refresh preview"
              >
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              </button>
            )}
            <button
              onClick={openInNewTab}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* View Mode */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded">
            <button
              onClick={() => setViewMode('desktop')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                viewMode === 'desktop'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Monitor className="h-4 w-4" />
              Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                viewMode === 'mobile'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Smartphone className="h-4 w-4" />
              Mobile
            </button>
          </div>
          
          {/* Content Mode */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded">
            <button
              onClick={() => setContentMode('html')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                contentMode === 'html'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Eye className="h-4 w-4" />
              HTML
            </button>
            <button
              onClick={() => setContentMode('text')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                contentMode === 'text'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <EyeOff className="h-4 w-4" />
              Text
            </button>
          </div>
        </div>
        
        {/* Subject Line */}
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="text-xs text-gray-500 mb-1">Subject:</div>
          <div className="font-medium text-gray-900">
            {displayContent.subject}
          </div>
        </div>
        
        {/* Recipient Info */}
        <div className="mt-2 text-xs text-gray-500">
          Preview for: {displayContent.recipient.email}
          {(displayContent.recipient.firstName || displayContent.recipient.lastName) && (
            <span>
              {' '}({displayContent.recipient.firstName} {displayContent.recipient.lastName})
            </span>
          )}
        </div>
      </div>
      
      {/* Preview Content */}
      <div className="p-4">
        {error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">Preview Error</div>
            <div className="text-sm text-gray-500">{error}</div>
            <button
              onClick={fetchPreview}
              className="mt-2 px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-600"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
            <div className="text-sm text-gray-500">Loading preview...</div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded p-4">
            <div
              className={cn(
                'bg-white rounded shadow-sm mx-auto transition-all duration-200',
                viewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
              )}
            >
              <div className="p-6">
                {contentMode === 'html' ? (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: displayContent.html
                    }}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {displayContent.text}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Variables Help */}
      {Object.keys(variables).length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-2">
            Variables used in preview:
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(variables).map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono"
              >
                {`{{${key}}}`} → {value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}