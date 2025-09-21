import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Simple debug endpoint to test the exact query used in callback
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  const userId = request.nextUrl.searchParams.get('userId') || 'f48d81d9-ab36-430b-b6bd-2e5f21e276a4'

  if (key !== 'debug-403-sami') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Test 1: Exact query from callback route
    const { data: test1, error: error1 } = await supabase
      .from('admin_users')
      .select('id, is_active')
      .eq('user_id', userId)
      .single()

    // Test 2: Without single()
    const { data: test2, error: error2 } = await supabase
      .from('admin_users')
      .select('id, is_active')
      .eq('user_id', userId)

    // Test 3: Select all fields
    const { data: test3, error: error3 } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)

    // Test 4: Try with string comparison
    const { data: test4, error: error4 } = await supabase
      .from('admin_users')
      .select('id, is_active')
      .eq('user_id', userId.toString())

    return NextResponse.json({
      userId,
      tests: {
        test1_withSingle: {
          data: test1,
          error: error1?.message,
          isAdmin: test1?.is_active === true
        },
        test2_withoutSingle: {
          data: test2,
          error: error2?.message,
          isAdmin: test2?.[0]?.is_active === true
        },
        test3_allFields: {
          data: test3,
          error: error3?.message,
          isAdmin: test3?.[0]?.is_active === true
        },
        test4_stringCompare: {
          data: test4,
          error: error4?.message,
          isAdmin: test4?.[0]?.is_active === true
        }
      },
      summary: {
        anyTestPassed: [test1, test2?.[0], test3?.[0], test4?.[0]].some(d => d?.is_active === true)
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Exception occurred',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}