'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getQueryClient } from '@/lib/react-query/query-client'
import { useState } from 'react'

interface QueryProviderProps {
  children: React.ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
  // Using useState to ensure the query client is created only once per component lifecycle
  // This pattern is recommended by TanStack Query for Next.js App Router
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query DevTools - only included in development builds */}
      {/* DevTools are automatically tree-shaken in production builds */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
      {/* Note: Production DevTools can be added later when admin auth is implemented */}
      {/* This would allow super admins to debug production issues */}
    </QueryClientProvider>
  )
}