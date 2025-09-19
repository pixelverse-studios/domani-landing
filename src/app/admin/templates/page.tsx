'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTemplates, useDeleteTemplate } from '@/hooks/useCampaigns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Eye,
  Mail,
  Tag,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmailTemplate } from '@/types/email'

function TemplateCard({ template }: { template: EmailTemplate }) {
  const router = useRouter()
  const deleteTemplate = useDeleteTemplate()
  const [showActions, setShowActions] = useState(false)
  
  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      await deleteTemplate.mutateAsync(template.id)
    }
  }
  
  const handleDuplicate = () => {
    // Navigate to create page with template data
    router.push(`/admin/templates/new?duplicate=${template.id}`)
  }
  
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg line-clamp-1">
              {template.name}
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {template.description || 'No description'}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[140px]">
                <button
                  onClick={() => router.push(`/admin/templates/${template.id}`)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button
                  onClick={() => router.push(`/admin/templates/${template.id}/edit`)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={handleDuplicate}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </button>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-left"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Template Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Category</span>
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {template.category || 'General'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Subject</span>
            <span className="font-medium line-clamp-1 max-w-[180px]">
              {template.subject}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Created</span>
            <span>
              {new Date(template.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {/* Template Preview */}
        <div className="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Preview:</p>
          <div 
            className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: template.htmlContent?.substring(0, 150) + '...' || 'No content'
            }}
          />
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => router.push(`/admin/campaigns/new?template=${template.id}`)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary-600 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Use Template
          </button>
          <button
            onClick={() => router.push(`/admin/templates/${template.id}`)}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [page, setPage] = useState(1)
  
  const { data, isLoading } = useTemplates({
    page,
    limit: 12, // 3x4 grid
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    search: searchQuery,
  })
  
  const templates = data?.templates || []
  const total = data?.total || 0
  
  // Calculate stats
  const stats = {
    total: total,
    byCategory: {
      welcome: templates.filter(t => t.category === 'welcome').length,
      newsletter: templates.filter(t => t.category === 'newsletter').length,
      promotion: templates.filter(t => t.category === 'promotion').length,
      system: templates.filter(t => t.category === 'system').length,
    }
  }
  
  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Email Templates
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Create and manage reusable email templates
          </p>
        </div>
        <Link
          href="/admin/templates/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create Template
        </Link>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Welcome
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.byCategory.welcome}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Newsletter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.byCategory.newsletter}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Promotion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.byCategory.promotion}</div>
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
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {['all', 'welcome', 'newsletter', 'promotion', 'system'].map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize',
                categoryFilter === category
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="flex gap-2">
                  <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery || categoryFilter !== 'all' 
                ? 'No templates match your search' 
                : 'No templates found'
              }
            </p>
            <Link
              href="/admin/templates/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Your First Template
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {total > 12 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm">
            Page {page} of {Math.ceil(total / 12)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 12)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}