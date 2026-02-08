'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { EmailComposer } from '@/components/admin/EmailComposer'
import { useCreateCampaign } from '@/hooks/useCampaigns'
import { useWaitlist } from '@/hooks/useWaitlist'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Send,
  Save,
  Calendar,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { CampaignType, CampaignStatus } from '@/types/email'

// Form validation schema
const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  subject: z.string().min(1, 'Email subject is required'),
  type: z.nativeEnum(CampaignType),
  scheduledFor: z.string().optional(),
  recipientType: z.enum(['all', 'selected']),
  selectedRecipients: z.array(z.string()).optional(),
})

type CampaignFormData = z.infer<typeof campaignSchema>

export default function NewCampaignPage() {
  const router = useRouter()
  const createCampaign = useCreateCampaign()
  const { data: waitlistData } = useWaitlist({ page: 1, limit: 1000 }) // Get all for selection
  
  const [emailContent, setEmailContent] = useState({ html: '', text: '' })
  const [currentStep, setCurrentStep] = useState(1)
  const [isScheduling, setIsScheduling] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      type: CampaignType.Manual,
      recipientType: 'all',
      selectedRecipients: [],
    },
  })
  
  const recipientType = watch('recipientType')
  const selectedRecipients = watch('selectedRecipients') || []
  const campaignType = watch('type')
  
  // Calculate recipient count
  const recipientCount = recipientType === 'all' 
    ? waitlistData?.total || 0 
    : selectedRecipients.length
  
  const handleEmailChange = (html: string, text: string) => {
    setEmailContent({ html, text })
  }
  
  const onSubmit = async (data: CampaignFormData) => {
    try {
      const recipients = data.recipientType === 'all'
        ? waitlistData?.entries.map(e => e.id) || []
        : data.selectedRecipients || []
      
      await createCampaign.mutateAsync({
        name: data.name,
        subject: data.subject,
        htmlContent: emailContent.html,
        textContent: emailContent.text,
        type: data.type,
        status: isScheduling ? CampaignStatus.Scheduled : CampaignStatus.Draft,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor).toISOString() : undefined,
        recipientIds: recipients,
        settings: {
          trackOpens: true,
          trackClicks: true,
        },
      })
      
      toast.success(isScheduling ? 'Campaign scheduled successfully!' : 'Campaign saved as draft!')
      router.push('/admin/campaigns')
    } catch {
      toast.error('Failed to create campaign')
    }
  }
  
  const steps = [
    { number: 1, label: 'Details', icon: FileText },
    { number: 2, label: 'Content', icon: FileText },
    { number: 3, label: 'Recipients', icon: Users },
    { number: 4, label: 'Review', icon: CheckCircle },
  ]
  
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/campaigns')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">
          Create New Campaign
        </h1>
        <p className="text-gray-500 mt-1">
          Compose and send emails to your waitlist subscribers
        </p>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.number)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === step.number
                    ? 'bg-primary text-white'
                    : currentStep > step.number
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <step.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.number}</span>
              </button>
              {index < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Campaign Details */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>
                Set up the basic information for your campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Campaign Name
                </label>
                <input
                  {...register('name')}
                  placeholder="e.g., Welcome Email, Product Update"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Subject
                </label>
                <input
                  {...register('subject')}
                  placeholder="e.g., Welcome to Domani!"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.subject && (
                  <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Campaign Type
                </label>
                <select
                  {...register('type')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={CampaignType.Manual}>Manual</option>
                  <option value={CampaignType.Automated}>Automated</option>
                  <option value={CampaignType.Triggered}>Triggered</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!watch('name') || !watch('subject')}
                >
                  Next: Content
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Step 2: Email Content */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Email Content</CardTitle>
              <CardDescription>
                Compose your email message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailComposer
                content={emailContent.html}
                onChange={handleEmailChange}
                variables={['firstName', 'email', 'signupDate']}
              />
              
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!emailContent.html}
                >
                  Next: Recipients
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Step 3: Recipients */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Recipients</CardTitle>
              <CardDescription>
                Choose who will receive this campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-4">
                  Recipient Selection
                </label>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50:bg-gray-800">
                    <input
                      type="radio"
                      {...register('recipientType')}
                      value="all"
                      className="h-4 w-4 text-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium">All Waitlist Subscribers</div>
                      <div className="text-sm text-gray-500">
                        Send to all {waitlistData?.total || 0} subscribers
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50:bg-gray-800">
                    <input
                      type="radio"
                      {...register('recipientType')}
                      value="selected"
                      className="h-4 w-4 text-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Selected Recipients</div>
                      <div className="text-sm text-gray-500">
                        Choose specific subscribers to target
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              {recipientType === 'selected' && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Select recipients from the list:
                  </p>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {waitlistData?.entries.map((entry) => (
                      <label
                        key={entry.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50:bg-gray-800 rounded"
                      >
                        <input
                          type="checkbox"
                          value={entry.id}
                          checked={selectedRecipients.includes(entry.id)}
                          onChange={(e) => {
                            const current = selectedRecipients || []
                            if (e.target.checked) {
                              setValue('selectedRecipients', [...current, entry.id])
                            } else {
                              setValue('selectedRecipients', current.filter(id => id !== entry.id))
                            }
                          }}
                          className="h-4 w-4 text-primary"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {entry.firstName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {entry.email}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  disabled={recipientType === 'selected' && selectedRecipients.length === 0}
                >
                  Next: Review
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Step 4: Review & Send */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Campaign</CardTitle>
                <CardDescription>
                  Review your campaign before sending
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Campaign Details
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Name:</dt>
                        <dd className="font-medium">{watch('name')}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Subject:</dt>
                        <dd className="font-medium">{watch('subject')}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Type:</dt>
                        <dd className="font-medium">{watch('type')}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Recipients
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Total Recipients:</dt>
                        <dd className="font-medium">{recipientCount}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Selection:</dt>
                        <dd className="font-medium">
                          {recipientType === 'all' ? 'All Subscribers' : 'Selected Recipients'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                {/* Schedule Options */}
                {campaignType === CampaignType.Manual && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Send Options
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50:bg-gray-800">
                        <input
                          type="radio"
                          checked={!isScheduling}
                          onChange={() => setIsScheduling(false)}
                          className="h-4 w-4 text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Save as Draft</div>
                          <div className="text-sm text-gray-500">
                            Save campaign and send later
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50:bg-gray-800">
                        <input
                          type="radio"
                          checked={isScheduling}
                          onChange={() => setIsScheduling(true)}
                          className="h-4 w-4 text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Schedule Send</div>
                          <div className="text-sm text-gray-500">
                            Set a specific date and time to send
                          </div>
                        </div>
                      </label>
                      
                      {isScheduling && (
                        <div className="ml-7">
                          <input
                            type="datetime-local"
                            {...register('scheduledFor')}
                            min={new Date().toISOString().slice(0, 16)}
                            className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">
                        Please review carefully
                      </p>
                      <p className="text-yellow-700 mt-1">
                        Once sent, emails cannot be recalled. Make sure your content is correct and your recipients are properly selected.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(3)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      variant="outline"
                      onClick={() => setIsScheduling(false)}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </Button>
                    {isScheduling ? (
                      <Button
                        type="submit"
                        className="bg-primary text-white"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Schedule Campaign
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          if (confirm('Are you sure you want to send this campaign now?')) {
                            handleSubmit((_data) => {
                              // TODO: Implement immediate send
                              toast.info('Immediate send will be implemented in Phase 9')
                            })()
                          }
                        }}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </form>
    </div>
  )
}