# Admin Dashboard Integration Addendum

## Integration with Existing Codebase

This addendum updates the original implementation plan to properly integrate with your existing Domani landing page codebase, utilizing React Query for data fetching and building upon your current foundation.

## Current Codebase Analysis

### Existing Assets We'll Build Upon:
1. **Supabase Integration**: Already configured with admin client (`supabaseAdmin`) and basic client
2. **Styling System**: Tailwind CSS with custom dark mode implementation
3. **Form Handling**: Existing validation utilities and patterns from `WaitlistForm.tsx`
4. **API Structure**: Established patterns in `/api/waitlist/route.ts`
5. **Type Safety**: TypeScript already configured
6. **UI Components**: Theme provider, dark mode toggle, form components
7. **Utilities**: Validation helpers, rate limiting, utils functions

### Missing Dependencies to Add:
```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.59.0",
    "@tanstack/react-table": "^8.20.5",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "react-hook-form": "^7.53.2",
    "@hookform/resolvers": "^3.9.1",
    "zod": "^3.23.8",
    "sonner": "^1.7.1",
    "@tiptap/react": "^2.10.3",
    "@tiptap/starter-kit": "^2.10.3",
    "@tiptap/extension-link": "^2.10.3",
    "@tiptap/extension-placeholder": "^2.10.3",
    "date-fns": "^4.1.0",
    "cmdk": "^1.0.4"
  }
}
```

## React Query Integration

### 1. Provider Setup
```typescript
// src/providers/QueryProvider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
```

### 2. Update Root Layout
```typescript
// src/app/layout.tsx (modification)
import { QueryProvider } from '@/providers/QueryProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${abrilFatface.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-dark-gradient-from text-foreground transition-colors overflow-x-hidden">
        <ThemeProvider>
          <QueryProvider>  {/* Add this wrapper */}
            <div className="min-h-screen overflow-x-clip">
              {children}
            </div>
          </QueryProvider>
        </ThemeProvider>
        {/* Existing analytics scripts */}
      </body>
    </html>
  )
}
```

## Admin Authentication Hooks with React Query

### 1. Auth Hooks
```typescript
// src/hooks/useAdminAuth.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  permissions: Record<string, string[]>
}

export function useAdminUser() {
  return useQuery({
    queryKey: ['admin-user'],
    queryFn: async (): Promise<AdminUser | null> => {
      if (!supabase) return null

      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return null

      const response = await fetch('/api/admin/auth/me')
      if (!response.ok) return null

      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAdminLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!supabase) throw new Error('Supabase not initialized')

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Verify admin role
      const response = await fetch('/api/admin/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        await supabase.auth.signOut()
        throw new Error('Not authorized as admin')
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user'] })
      toast.success('Welcome back!')
      router.push('/admin')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useAdminLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      if (!supabase) throw new Error('Supabase not initialized')
      await supabase.auth.signOut()
    },
    onSuccess: () => {
      queryClient.clear()
      router.push('/admin/login')
      toast.success('Logged out successfully')
    },
  })
}
```

## Waitlist Data Fetching with React Query

### 1. Waitlist Hooks
```typescript
// src/hooks/useWaitlist.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface WaitlistUser {
  id: string
  email: string
  name: string
  created_at: string
  confirmed: boolean
  source: string
  metadata?: Record<string, any>
}

interface WaitlistFilters {
  search?: string
  confirmed?: boolean
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export function useWaitlistUsers(filters: WaitlistFilters = {}) {
  return useQuery({
    queryKey: ['waitlist-users', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value))
      })

      const response = await fetch(`/api/admin/waitlist?${params}`)
      if (!response.ok) throw new Error('Failed to fetch waitlist')

      return response.json() as Promise<{
        data: WaitlistUser[]
        total: number
        page: number
        limit: number
      }>
    },
  })
}

export function useExportWaitlist() {
  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const response = await fetch('/api/admin/waitlist/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds }),
      })

      if (!response.ok) throw new Error('Failed to export data')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `waitlist-export-${new Date().toISOString()}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    },
    onSuccess: () => {
      toast.success('Export completed')
    },
    onError: () => {
      toast.error('Export failed')
    },
  })
}

export function useDeleteWaitlistUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const response = await fetch('/api/admin/waitlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds }),
      })

      if (!response.ok) throw new Error('Failed to delete users')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist-users'] })
      toast.success('Users removed from waitlist')
    },
    onError: () => {
      toast.error('Failed to remove users')
    },
  })
}
```

## Email Campaign Hooks

### 1. Campaign Management with React Query
```typescript
// src/hooks/useCampaigns.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface EmailCampaign {
  id: string
  name: string
  subject: string
  template_id?: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  recipient_count: number
  sent_count: number
  opened_count: number
  clicked_count: number
  created_at: string
  scheduled_at?: string
  sent_at?: string
}

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await fetch('/api/admin/campaigns')
      if (!response.ok) throw new Error('Failed to fetch campaigns')
      return response.json() as Promise<EmailCampaign[]>
    },
  })
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/campaigns/${id}`)
      if (!response.ok) throw new Error('Failed to fetch campaign')
      return response.json() as Promise<EmailCampaign>
    },
    enabled: !!id,
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (campaign: Partial<EmailCampaign>) => {
      const response = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      })

      if (!response.ok) throw new Error('Failed to create campaign')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign created')
    },
    onError: () => {
      toast.error('Failed to create campaign')
    },
  })
}

export function useSendCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      campaignId,
      recipientIds
    }: {
      campaignId: string
      recipientIds: string[]
    }) => {
      const response = await fetch(`/api/admin/campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientIds }),
      })

      if (!response.ok) throw new Error('Failed to send campaign')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign sent successfully')
    },
    onError: () => {
      toast.error('Failed to send campaign')
    },
  })
}
```

## Updated Admin Components Building on Existing Patterns

### 1. Enhanced DataTable using Existing Styles
```typescript
// src/components/admin/DataTable.tsx
'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
} from '@tanstack/react-table'
import { clsx } from 'clsx' // Already in dependencies

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowSelectionChange?: (selectedRows: TData[]) => void
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowSelectionChange,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // Notify parent of selection changes
  useMemo(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original)
      onRowSelectionChange(selectedRows)
    }
  }, [rowSelection, table, onRowSelectionChange])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters - Using existing input styles */}
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm px-4 py-2 border rounded-lg outline-none transition-all duration-200
                     bg-white dark:bg-dark-card text-gray-900 dark:text-white
                     border-gray-300 dark:border-gray-600
                     focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400"
        />

        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{table.getFilteredSelectedRowModel().rows.length} selected</span>
            <button
              onClick={() => setRowSelection({})}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Table - Using existing dark mode patterns */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-elevated">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={clsx(
                    'hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors',
                    row.getIsSelected() && 'bg-primary-50 dark:bg-primary-900/20'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Using existing button styles */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors"
          >
            First
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors"
          >
            Next
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  )
}
```

### 2. Admin Sidebar Building on Existing Header Pattern
```typescript
// src/components/admin/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/Logo' // Reuse existing Logo
import { ThemeToggle } from '@/components/ThemeToggle' // Reuse existing
import { clsx } from 'clsx'
import {
  LayoutDashboard,
  Users,
  Mail,
  FileText,
  Settings,
  LogOut
} from 'lucide-react'
import { useAdminLogout } from '@/hooks/useAdminAuth'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Waitlist', href: '/admin/waitlist', icon: Users },
  { name: 'Campaigns', href: '/admin/campaigns', icon: Mail },
  { name: 'Templates', href: '/admin/templates', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const logout = useAdminLogout()

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <Logo />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-elevated'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.role}
            </p>
          </div>
          <ThemeToggle />
        </div>

        <button
          onClick={() => logout.mutate()}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-dark-elevated rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
```

## API Routes Building on Existing Patterns

### 1. Enhanced Admin API Routes
```typescript
// src/app/api/admin/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/admin/middleware' // New middleware

export const GET = withAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)

  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '0')
  const limit = parseInt(searchParams.get('limit') || '50')
  const confirmed = searchParams.get('confirmed')

  let query = supabaseAdmin!
    .from('waitlist')
    .select('*', { count: 'exact' })

  // Apply filters
  if (search) {
    query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`)
  }

  if (confirmed !== null) {
    query = query.eq('confirmed', confirmed === 'true')
  }

  // Apply pagination
  const from = page * limit
  const to = from + limit - 1

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    data,
    total: count,
    page,
    limit,
  })
}, { resource: 'waitlist', action: 'read' })

export const DELETE = withAdminAuth(async (request: NextRequest) => {
  const { userIds } = await request.json()

  const { error } = await supabaseAdmin!
    .from('waitlist')
    .delete()
    .in('id', userIds)

  if (error) {
    return NextResponse.json(
      { error: 'Failed to delete users' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}, { resource: 'waitlist', action: 'delete' })
```

## File Structure Integration

Instead of creating a completely new app, we're extending the existing structure:

```
src/
├── app/
│   ├── admin/                    # NEW: Admin section
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── waitlist/
│   │   └── campaigns/
│   ├── api/
│   │   ├── admin/                # NEW: Admin API routes
│   │   │   ├── auth/
│   │   │   ├── waitlist/
│   │   │   └── campaigns/
│   │   └── waitlist/             # EXISTING: Keep current
├── components/
│   ├── admin/                    # NEW: Admin components
│   │   ├── DataTable.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── EmailComposer.tsx
│   └── [existing components]     # KEEP ALL EXISTING
├── hooks/
│   ├── useABTest.ts              # EXISTING
│   ├── useAdminAuth.ts           # NEW
│   ├── useWaitlist.ts            # NEW
│   └── useCampaigns.ts           # NEW
├── lib/
│   ├── admin/                    # NEW: Admin utilities
│   │   ├── auth.ts
│   │   ├── middleware.ts
│   │   └── permissions.ts
│   └── [existing files]          # KEEP ALL EXISTING
└── providers/
    └── QueryProvider.tsx          # NEW: React Query provider
```

## Implementation Order (Revised)

### Phase 1: Foundation & React Query Setup
1. Install new dependencies
2. Set up React Query provider
3. Add to existing layout
4. Create admin auth middleware

### Phase 2: Admin Authentication
1. Create admin tables in Supabase
2. Build login page using existing form patterns
3. Implement auth hooks with React Query
4. Set up protected routes

### Phase 3: Admin Layout
1. Create admin layout with sidebar
2. Reuse existing Logo and ThemeToggle
3. Implement navigation
4. Add responsive design

### Phase 4: Waitlist Management
1. Create DataTable with React Query integration
2. Build waitlist page with search/filter
3. Add bulk selection capabilities
4. Implement export functionality

### Phase 5: Email Campaigns
1. Create email composer with rich text editor
2. Build campaign management with React Query
3. Integrate Resend (already in dependencies)
4. Add template system

### Phase 6: Testing & Polish
1. Add error boundaries
2. Implement loading states
3. Add optimistic updates
4. Test with existing dark mode

## Key Integration Points

### 1. Maintain Existing User Experience
- Keep all current landing page functionality
- Admin section is completely separate at `/admin`
- No modifications to existing public routes

### 2. Reuse Existing Components
- Use existing validation utilities
- Leverage current Tailwind configuration
- Maintain dark mode consistency
- Reuse form patterns from WaitlistForm

### 3. Build on Current API Patterns
- Follow existing error handling patterns
- Use similar rate limiting approach
- Maintain consistent response formats

### 4. Leverage Existing Supabase Setup
- Use `supabaseAdmin` for server-side operations
- Extend current database schema
- Add new tables without modifying existing ones

## Benefits of This Approach

1. **Minimal Disruption**: Landing page continues to work unchanged
2. **Consistent Design**: Uses existing design system and patterns
3. **Faster Development**: Reuses existing utilities and components
4. **Better Performance**: React Query provides caching and optimistic updates
5. **Type Safety**: Maintains TypeScript throughout
6. **Maintainability**: Clear separation between public and admin sections

## Next Steps

1. Review this integration plan
2. Install React Query and other dependencies
3. Begin implementation following the revised phases
4. Test admin features without affecting public site
5. Deploy admin section behind authentication

This approach ensures we're building on your existing foundation rather than creating a separate application, while adding powerful admin capabilities with React Query for optimal data fetching and state management.