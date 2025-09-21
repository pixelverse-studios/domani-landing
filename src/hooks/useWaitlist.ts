'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface WaitlistEntry {
  id: string
  email: string
  firstName: string
  referralType?: string
  referrer?: string
  status: 'pending' | 'invited' | 'registered'
  createdAt: string
  invitedAt?: string
  metadata?: Record<string, any>
}

export interface WaitlistResponse {
  entries: WaitlistEntry[]
  total: number
  page: number
  limit: number
  totalPages: number
  stats: {
    pending: number
    invited: number
    confirmed: number
    registered: number
  }
}

// Fetch waitlist entries
async function fetchWaitlist(params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
}): Promise<WaitlistResponse> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.search) queryParams.append('search', params.search)
  if (params?.status) queryParams.append('status', params.status)

  const response = await fetch(`/api/admin/waitlist?${queryParams}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch waitlist' }))
    throw new Error(error.message || 'Failed to fetch waitlist')
  }

  return response.json()
}

// Delete waitlist entries
async function deleteWaitlistEntries(ids: string[]) {
  const response = await fetch('/api/admin/waitlist', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete entries' }))
    throw new Error(error.message || 'Failed to delete entries')
  }

  return response.json()
}

// Update waitlist entry status
async function updateWaitlistStatus(data: { ids: string[]; status: string }) {
  const response = await fetch('/api/admin/waitlist/status', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update status' }))
    throw new Error(error.message || 'Failed to update status')
  }

  return response.json()
}

// Update referral type for multiple entries
async function updateReferralType(data: { ids: string[]; referralType: string }) {
  const response = await fetch('/api/admin/waitlist/referral-type', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update referral type' }))
    throw new Error(error.message || 'Failed to update referral type')
  }

  return response.json()
}

// Export waitlist to CSV
async function exportWaitlist(params?: {
  search?: string
  status?: string
}) {
  const queryParams = new URLSearchParams()
  if (params?.search) queryParams.append('search', params.search)
  if (params?.status) queryParams.append('status', params.status)

  const response = await fetch(`/api/admin/waitlist/export?${queryParams}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to export waitlist' }))
    throw new Error(error.message || 'Failed to export waitlist')
  }

  // Get the CSV content
  const blob = await response.blob()

  // Create download link
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }, 100)

  return true
}

// Hooks
export function useWaitlist(params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
}) {
  return useQuery({
    queryKey: ['waitlist', params],
    queryFn: () => fetchWaitlist(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  })
}

export function useDeleteWaitlistEntries() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteWaitlistEntries,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] })
      toast.success('Entries deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete entries')
    },
  })
}

export function useUpdateWaitlistStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateWaitlistStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] })
      toast.success('Status updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update status')
    },
  })
}

export function useUpdateReferralType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateReferralType,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] })
      const count = variables.ids.length
      toast.success(`Referral type updated for ${count} ${count === 1 ? 'entry' : 'entries'}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update referral type')
    },
  })
}

export function useExportWaitlist() {
  return useMutation({
    mutationFn: exportWaitlist,
    onSuccess: () => {
      toast.success('Waitlist exported successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to export waitlist')
    },
  })
}