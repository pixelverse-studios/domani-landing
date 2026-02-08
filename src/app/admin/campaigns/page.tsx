'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCampaigns } from '@/hooks/useCampaigns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Mail,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Edit,
  Eye,
  TrendingUp,
  MousePointerClick,
  Users,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CampaignStatus, formatCampaignType } from '@/types/email'

// Status badge component
function StatusBadge({ status }: { status: CampaignStatus }) {
  const statusConfig = {
    [CampaignStatus.Draft]: { icon: Edit, label: 'Draft', className: 'bg-gray-100 text-gray-700' },
    [CampaignStatus.Scheduled]: { icon: Clock, label: 'Scheduled', className: 'bg-blue-100 text-blue-700' },
    [CampaignStatus.Sending]: { icon: Send, label: 'Sending', className: 'bg-yellow-100 text-yellow-700' },
    [CampaignStatus.Sent]: { icon: CheckCircle, label: 'Sent', className: 'bg-green-100 text-green-700' },
    [CampaignStatus.Cancelled]: { icon: XCircle, label: 'Cancelled', className: 'bg-red-100 text-red-700' },
    [CampaignStatus.Failed]: { icon: XCircle, label: 'Failed', className: 'bg-red-100 text-red-700' },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
}

// Metric card component
function MetricCard({ icon: Icon, label, value, change }: {
  icon: React.ElementType
  label: string
  value: string | number
  change?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon className="h-4 w-4 text-gray-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
        {change && (
          <p className="text-xs text-green-600">{change}</p>
        )}
      </div>
    </div>
  )
}

export default function CampaignsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useCampaigns({
    page,
    limit: 9, // 3x3 grid
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery,
  })

  const campaigns = data?.campaigns || []
  const total = data?.total || 0

  // Calculate overall stats
  const stats = {
    total: total,
    sent: campaigns.filter(c => c.status === CampaignStatus.Sent).length,
    scheduled: campaigns.filter(c => c.status === CampaignStatus.Scheduled).length,
    draft: campaigns.filter(c => c.status === CampaignStatus.Draft).length,
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Email Campaigns
          </h1>
          <p className="text-gray-500 mt-1">
            Create and manage your email marketing campaigns
          </p>
        </div>
        <Link
          href="/admin/campaigns/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create Campaign
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {['all', 'draft', 'scheduled', 'sent'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize',
                statusFilter === status
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900:text-white'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-20 bg-gray-200 rounded" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-gray-200 rounded" />
                  <div className="h-12 bg-gray-200 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No campaigns found</p>
            <Link
              href="/admin/campaigns/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Your First Campaign
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {campaign.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {campaign.subject}
                    </p>
                  </div>
                  <StatusBadge status={campaign.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metrics */}
                {campaign.status === CampaignStatus.Sent && campaign.metrics && (
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                    <MetricCard
                      icon={Users}
                      label="Sent"
                      value={campaign.metrics.totalSent.toLocaleString()}
                    />
                    <MetricCard
                      icon={Eye}
                      label="Opened"
                      value={`${campaign.metrics.openRate?.toFixed(1) || 0}%`}
                    />
                    <MetricCard
                      icon={MousePointerClick}
                      label="Clicked"
                      value={`${campaign.metrics.clickRate?.toFixed(1) || 0}%`}
                    />
                    <MetricCard
                      icon={TrendingUp}
                      label="Delivered"
                      value={`${campaign.metrics.deliveryRate?.toFixed(1) || 0}%`}
                    />
                  </div>
                )}

                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium">{formatCampaignType(campaign.type)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Recipients</span>
                    <span className="font-medium">{campaign.recipientCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      {campaign.status === CampaignStatus.Sent ? 'Sent' : 'Created'}
                    </span>
                    <span className="font-medium">
                      {format(new Date(campaign.sentAt || campaign.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/admin/campaigns/${campaign.id}`)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200:bg-gray-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  {campaign.status === CampaignStatus.Draft && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/admin/campaigns/${campaign.id}/edit`)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 9 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded hover:bg-gray-100:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm">
            Page {page} of {Math.ceil(total / 9)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 9)}
            className="p-2 rounded hover:bg-gray-100:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}