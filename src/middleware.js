import { NextResponse } from 'next/server'

export function middleware(request) {
  const host = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  const domainParts = host.split('.')
  const subdomain = domainParts.length > 2 ? domainParts[0] : null

  console.log(`[MIDDLEWARE] Host: ${host}, Subdomain: ${subdomain}, Path: ${url.pathname}`)

  // Check if it's a static asset (images, fonts, etc.)
  const isStaticAsset = /\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot|webp|avif)$/i.test(url.pathname)
  
  if (isStaticAsset) {
    console.log(`[MIDDLEWARE] Static asset detected: ${url.pathname}, allowing through`)
    return NextResponse.next()
  }

  // If it's the main domain (no subdomain)
  if (!subdomain || subdomain === 'www') {
    if (url.pathname === '/') {
      console.log('[MIDDLEWARE] Rewriting / to /site')
      url.pathname = '/site'
      return NextResponse.rewrite(url)
    }
    
    // Rewrite clean URLs to /site/* internally
    // e.g., /trips/... -> /site/trips/...
    // Exclude certain paths from rewriting
    const excludedPaths = ['/site', '/_next', '/api', '/favicon.ico', '/robots.txt', '/sitemap.xml']
    
    if (!excludedPaths.some(path => url.pathname.startsWith(path))) {
      const rewritePath = `/site${url.pathname}`
      console.log(`[MIDDLEWARE] Rewriting ${url.pathname} to ${rewritePath}`)
      url.pathname = rewritePath
      return NextResponse.rewrite(url)
    }
    
    // Handle direct /site/* paths (in case someone accesses them directly)
    if (url.pathname.startsWith('/site')) {
      console.log(`[MIDDLEWARE] Direct /site path access: ${url.pathname}`)
      return NextResponse.next()
    }
  }

  // If it's a subdomain like host.maindomain.com
  if (subdomain === 'host') {
    console.log('[MIDDLEWARE] Subdomain "host" detected, rewriting to /dashboard/home')
    url.pathname = '/dashboard/home'
    return NextResponse.rewrite(url)
  }

  // For any other subdomain trying to access /site/* paths, redirect to main domain
  if (url.pathname.startsWith('/site')) {
    console.log(`[MIDDLEWARE] Redirecting /site path from subdomain to main domain`)
    const mainDomainUrl = new URL(url.pathname, `https://${domainParts.slice(-2).join('.')}`)
    return NextResponse.redirect(mainDomainUrl)
  }

  console.log('[MIDDLEWARE] No rewrite, continuing...')
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}