'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  EmailCampaign,
  EmailTemplate,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignListResponse,
  TemplateListResponse,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
} from '@/types/email'

// ============================================
// Campaign API Functions
// ============================================

async function fetchCampaigns(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
}): Promise<CampaignListResponse> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.status) queryParams.append('status', params.status)
  if (params?.search) queryParams.append('search', params.search)

  const response = await fetch(`/api/admin/campaigns?${queryParams}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch campaigns' }))
    throw new Error(error.message || 'Failed to fetch campaigns')
  }

  return response.json()
}

async function fetchCampaign(id: string): Promise<EmailCampaign> {
  const response = await fetch(`/api/admin/campaigns/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch campaign' }))
    throw new Error(error.message || 'Failed to fetch campaign')
  }

  return response.json()
}

async function createCampaign(data: CreateCampaignRequest): Promise<EmailCampaign> {
  const response = await fetch('/api/admin/campaigns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create campaign' }))
    throw new Error(error.message || 'Failed to create campaign')
  }

  return response.json()
}

async function updateCampaign(id: string, data: UpdateCampaignRequest): Promise<EmailCampaign> {
  const response = await fetch(`/api/admin/campaigns/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update campaign' }))
    throw new Error(error.message || 'Failed to update campaign')
  }

  return response.json()
}

async function deleteCampaign(id: string): Promise<void> {
  const response = await fetch(`/api/admin/campaigns/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete campaign' }))
    throw new Error(error.message || 'Failed to delete campaign')
  }
}

async function sendCampaign(id: string): Promise<void> {
  const response = await fetch(`/api/admin/campaigns/${id}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to send campaign' }))
    throw new Error(error.message || 'Failed to send campaign')
  }
}

// ============================================
// Template API Functions
// ============================================

async function fetchTemplates(params?: {
  page?: number
  limit?: number
  category?: string
  search?: string
}): Promise<TemplateListResponse> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.category) queryParams.append('category', params.category)
  if (params?.search) queryParams.append('search', params.search)

  const response = await fetch(`/api/admin/templates?${queryParams}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch templates' }))
    throw new Error(error.message || 'Failed to fetch templates')
  }

  return response.json()
}

async function fetchTemplate(id: string): Promise<EmailTemplate> {
  const response = await fetch(`/api/admin/templates/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch template' }))
    throw new Error(error.message || 'Failed to fetch template')
  }

  return response.json()
}

async function createTemplate(data: CreateEmailTemplateRequest): Promise<EmailTemplate> {
  const response = await fetch('/api/admin/templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create template' }))
    throw new Error(error.message || 'Failed to create template')
  }

  return response.json()
}

async function updateTemplate(id: string, data: UpdateEmailTemplateRequest): Promise<EmailTemplate> {
  const response = await fetch(`/api/admin/templates/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update template' }))
    throw new Error(error.message || 'Failed to update template')
  }

  return response.json()
}

async function deleteTemplate(id: string): Promise<void> {
  const response = await fetch(`/api/admin/templates/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete template' }))
    throw new Error(error.message || 'Failed to delete template')
  }
}

// ============================================
// Campaign Hooks
// ============================================

export function useCampaigns(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: () => fetchCampaigns(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => fetchCampaign(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create campaign')
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignRequest }) =>
      updateCampaign(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.id] })
      toast.success('Campaign updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update campaign')
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete campaign')
    },
  })
}

export function useSendCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign sent successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send campaign')
    },
  })
}

// ============================================
// Template Hooks
// ============================================

export function useTemplates(params?: {
  page?: number
  limit?: number
  category?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['templates', params],
    queryFn: () => fetchTemplates(params),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => fetchTemplate(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useCreateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      toast.success('Template created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create template')
    },
  })
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmailTemplateRequest }) =>
      updateTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      queryClient.invalidateQueries({ queryKey: ['template', variables.id] })
      toast.success('Template updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update template')
    },
  })
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      toast.success('Template deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete template')
    },
  })
}