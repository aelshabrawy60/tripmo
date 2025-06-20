import { NextResponse } from 'next/server'

export function middleware(request) {
  const host = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  const domainParts = host.split('.')
  const subdomain = domainParts.length > 2 ? domainParts[0] : null

  console.log(`[MIDDLEWARE] Host: ${host}, Subdomain: ${subdomain}, Path: ${url.pathname}`)

  // If it's the main domain (no subdomain)
  if (!subdomain || subdomain === 'www') {
    if (url.pathname === '/') {
      console.log('[MIDDLEWARE] Rewriting / to /site')
      url.pathname = '/site'
      return NextResponse.rewrite(url)
    }
  }

  // If it's a subdomain like host.maindomain.com
  if (subdomain === 'host') {
    console.log('[MIDDLEWARE] Subdomain "host" detected, rewriting to /dashboard/home')
    url.pathname = '/dashboard/home'
    return NextResponse.rewrite(url)
  }

  console.log('[MIDDLEWARE] No rewrite, continuing...')
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
