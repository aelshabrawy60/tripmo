// lib/auth.js
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { createClient } from "@/utils/supabase/server";

export async function getAuthenticatedUser() {
  const supabase = await createClient()
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('Unauthorized')
  }
  
  return {
    user,
    groupId: user.user_metadata?.group_id,
    supabase
  }
}

export function withAuth(handler) {
  return async (request, context) => {
    try {
      const { user, groupId, supabase } = await getAuthenticatedUser()
      
      // Add auth data to request
      request.auth = { user, groupId, supabase }
      
      return await handler(request, context)
    } catch (error) {
      console.error('Auth error in API route:', error)
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }
  }
}

// For server components
export async function requireAuth() {
  try {
    return await getAuthenticatedUser()
  } catch (error) {
    console.error('Auth error in server component:', error)
    redirect('/signin')
  }
}

// Usage examples:

// API routes:
// export const GET = withAuth(async (request) => {
//   const { user, groupId, supabase } = request.auth
//   // Your logic here
// })

// Server components:
// const { user, groupId, supabase } = await requireAuth()