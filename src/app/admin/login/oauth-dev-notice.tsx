'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'

export function OAuthDevNotice() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Alert className="mt-4 border-yellow-200 bg-yellow-50">
      <InfoIcon className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-900">Local Development Notice</AlertTitle>
      <AlertDescription className="text-yellow-800">
        <p className="mb-2">
          Google OAuth in development requires one of these options:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>
            <strong>Recommended:</strong> Create a separate Supabase project for development with Site URL set to http://localhost:3000
          </li>
          <li>
            Temporarily update your Supabase Site URL to http://localhost:3000 (remember to change back for production)
          </li>
          <li>
            Add &quot;127.0.0.1 www.domani-app.com&quot; to /etc/hosts and access via http://www.domani-app.com:3000
          </li>
        </ol>
        <p className="mt-2 text-xs">
          Current Supabase project appears to be configured for production (https://www.domani-app.com)
        </p>
      </AlertDescription>
    </Alert>
  )
}