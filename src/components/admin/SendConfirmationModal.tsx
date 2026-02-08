'use client'

import { useState, useEffect } from 'react'
import { X, Send, AlertTriangle, Users, Mail, Eye, TestTube } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmailCampaign } from '@/types/email'

interface SendConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (type: 'send' | 'test', testEmail?: string) => void
  campaign: EmailCampaign
  isLoading?: boolean
}

export function SendConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  campaign,
  isLoading = false
}: SendConfirmationModalProps) {
  const [sendType, setSendType] = useState<'send' | 'test'>('send')
  const [testEmail, setTestEmail] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSendType('send')
      setTestEmail('')
      setShowPreview(false)
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const handleConfirm = () => {
    if (sendType === 'test' && !testEmail) return
    onConfirm(sendType, sendType === 'test' ? testEmail : undefined)
  }
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Send Email Campaign
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {campaign.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Campaign Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Campaign Summary
              </h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">Subject:</dt>
                  <dd className="font-medium text-gray-900">{campaign.subject}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Recipients:</dt>
                  <dd className="font-medium text-gray-900 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {campaign.recipientCount?.toLocaleString() || 0} people
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Type:</dt>
                  <dd className="font-medium text-gray-900">{campaign.type}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Status:</dt>
                  <dd className="font-medium text-gray-900">{campaign.status}</dd>
                </div>
              </dl>
            </div>
            
            {/* Send Options */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Send Options</h3>
              <div className="space-y-3">
                {/* Send to All */}
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="sendType"
                    value="send"
                    checked={sendType === 'send'}
                    onChange={(e) => setSendType(e.target.value as 'send')}
                    className="mt-0.5 h-4 w-4 text-primary"
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send to All Recipients
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Send this campaign to all {campaign.recipientCount || 0} recipients immediately.
                      This action cannot be undone.
                    </div>
                  </div>
                </label>
                
                {/* Send Test */}
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="sendType"
                    value="test"
                    checked={sendType === 'test'}
                    onChange={(e) => setSendType(e.target.value as 'test')}
                    className="mt-0.5 h-4 w-4 text-primary"
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      <TestTube className="h-4 w-4" />
                      Send Test Email
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Send a test email to yourself to preview how it looks.
                    </div>
                    
                    {sendType === 'test' && (
                      <div className="mt-3">
                        <input
                          type="email"
                          placeholder="your-email@example.com"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={isLoading}
                        />
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
            
            {/* Preview Option */}
            <div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-primary hover:text-primary-600 text-sm font-medium"
                disabled={isLoading}
              >
                <Eye className="h-4 w-4" />
                {showPreview ? 'Hide' : 'Show'} Email Preview
              </button>
              
              {showPreview && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Subject:</strong> {campaign.subject}
                  </div>
                  <div className="border border-gray-200 rounded bg-white max-h-32 overflow-y-auto">
                    <div 
                      className="p-3 text-sm text-gray-700"
                      dangerouslySetInnerHTML={{ 
                        __html: campaign.htmlContent?.substring(0, 200) + '...' || 'No content'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Warning for actual send */}
            {sendType === 'send' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">
                      Please confirm before sending
                    </p>
                    <p className="text-yellow-700 mt-1">
                      This will immediately send emails to {campaign.recipientCount || 0} recipients. 
                      Make sure your content is correct and your audience is properly targeted.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={isLoading || (sendType === 'test' && !testEmail)}
              className={cn(
                'flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors',
                sendType === 'send'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-primary hover:bg-primary-600 text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  {sendType === 'send' ? 'Sending...' : 'Sending Test...'}
                </>
              ) : (
                <>
                  {sendType === 'send' ? (
                    <>
                      <Send className="h-4 w-4" />
                      Send to {campaign.recipientCount || 0} Recipients
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4" />
                      Send Test Email
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}