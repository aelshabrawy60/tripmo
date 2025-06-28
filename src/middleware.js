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

  // Clone the request headers to add pathname
  const requestHeaders = new Headers(request.headers)
  
  // Add the original pathname to headers (before any rewrites)
  requestHeaders.set('x-pathname', url.pathname)
  
  // If it's a subdomain like admin.maindomain.com
  if (subdomain === 'admin') {
    // Handle root path for admin subdomain
    if (url.pathname === '/') {
      console.log('[MIDDLEWARE] Admin subdomain root, rewriting to /admin')
      url.pathname = '/admin'
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      })
    }
    
    // For other paths under admin subdomain, prepend /admin if not already there
    if (!url.pathname.startsWith('/admin')) {
      console.log(`[MIDDLEWARE] Admin subdomain, rewriting ${url.pathname} to /admin${url.pathname}`)
      url.pathname = `/admin${url.pathname}`
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      })
    }
    
    console.log(`[MIDDLEWARE] Admin subdomain detected, allowing path: ${url.pathname}`)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  // If it's a subdomain like host.maindomain.com
  if (subdomain === 'host') {
    // Handle root path for host subdomain
    if (url.pathname === '/') {
      console.log('[MIDDLEWARE] Host subdomain root, rewriting to /dashboard/home')
      url.pathname = '/dashboard/home'
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      })
    }
    
    // For other paths under host subdomain, let them pass through normally
    console.log(`[MIDDLEWARE] Host subdomain detected, allowing path: ${url.pathname}`)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // If it's the main domain (no subdomain)
  if (!subdomain || subdomain === 'www') {
    if (url.pathname === '/') {
      console.log('[MIDDLEWARE] Rewriting / to /site')
      url.pathname = '/site'
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      })
    }
    
    // Rewrite clean URLs to /site/* internally
    // e.g., /trips/... -> /site/trips/...
    // Exclude certain paths from rewriting
    const excludedPaths = ['/site', '/_next', '/api', '/favicon.ico', '/robots.txt', '/sitemap.xml', '/admin']
    
    if (!excludedPaths.some(path => url.pathname.startsWith(path))) {
      const rewritePath = `/site${url.pathname}`
      console.log(`[MIDDLEWARE] Rewriting ${url.pathname} to ${rewritePath}`)
      url.pathname = rewritePath
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      })
    }
    
    // Handle direct /site/* paths (in case someone accesses them directly)
    if (url.pathname.startsWith('/site')) {
      console.log(`[MIDDLEWARE] Direct /site path access: ${url.pathname}`)
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }

  // For any other subdomain trying to access /site/* paths, redirect to main domain
  if (url.pathname.startsWith('/site')) {
    console.log(`[MIDDLEWARE] Redirecting /site path from subdomain to main domain`)
    const mainDomainUrl = new URL(url.pathname, `https://${domainParts.slice(-2).join('.')}`)
    return NextResponse.redirect(mainDomainUrl)
  }

  // Block /admin/* paths on non-admin subdomains (let them 404 naturally)
  if (url.pathname.startsWith('/admin') && subdomain !== 'admin') {
    console.log(`[MIDDLEWARE] Blocking /admin path on non-admin subdomain, allowing to 404`)
    // Don't rewrite or redirect, just let it pass through to naturally 404
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  console.log('[MIDDLEWARE] No rewrite, continuing...')
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
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