import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Create a Supabase client with service role key for admin operations
 * This client bypasses RLS and can access all data
 * ONLY use this in server-side code, NEVER expose to client
 */
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables for service role client')
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}