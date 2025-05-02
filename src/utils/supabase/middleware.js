import { createServerClient } from '@supabase/ssr'
import { NextResponse, } from 'next/server'

export async function updateSession(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return Array.from(request.cookies.getAll()).map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll(cookiesList) {
          // Create a new response with the updated cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          cookiesList.forEach(cookie => {
            // Set cookies on both the request and response
            request.cookies.set({
              name: cookie.name,
              value: cookie.value,
              ...cookie.options,
            })
            
            response.cookies.set({
              name: cookie.name,
              value: cookie.value,
              ...cookie.options,
            })
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}