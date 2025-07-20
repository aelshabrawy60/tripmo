import { NextResponse } from 'next/server'

// Language configuration
const supportedLocales = ['en', 'ar'] // Add your supported languages
const defaultLocale = 'en'

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

  // MAIN DOMAIN LOGIC WITH LANGUAGE SUPPORT
  if (!subdomain || subdomain === 'www') {
    // Check if pathname has a locale prefix
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const potentialLocale = pathSegments[0]
    const hasLocale = supportedLocales.includes(potentialLocale)
    
    // Handle root path
    if (url.pathname === '/') {
      const detectedLocale = detectLocale(request)
      console.log(`[MIDDLEWARE] Root path, redirecting to /${detectedLocale}`)
      url.pathname = `/${detectedLocale}`
      return NextResponse.redirect(url)
    }
    
    // Handle locale-only paths (e.g., /en, /ar)
    if (hasLocale && pathSegments.length === 1) {
      console.log(`[MIDDLEWARE] Locale-only path /${potentialLocale}, rewriting to /${potentialLocale}/site`)
      url.pathname = `/${potentialLocale}/site`
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      })
    }
    
    // Handle paths without locale (e.g., /about, /contact)
    if (!hasLocale) {
      const excludedPaths = ['/site', '/_next', '/api', '/favicon.ico', '/robots.txt', '/sitemap.xml', '/admin', '/manifest.json']
      
      if (!excludedPaths.some(path => url.pathname.startsWith(path))) {
        const detectedLocale = detectLocale(request)
        console.log(`[MIDDLEWARE] Path without locale ${url.pathname}, redirecting to /${detectedLocale}${url.pathname}`)
        url.pathname = `/${detectedLocale}${url.pathname}`
        return NextResponse.redirect(url)
      }
    }
    
    // Handle paths with locale (e.g., /en/about, /ar/contact)
    if (hasLocale && pathSegments.length > 1) {
      const restPath = pathSegments.slice(1).join('/')
      const excludedPaths = ['site', '_next', 'api', 'favicon.ico', 'robots.txt', 'sitemap.xml', 'admin', 'manifest.json']
      
      if (!excludedPaths.some(path => restPath.startsWith(path))) {
        const rewritePath = `/${potentialLocale}/site/${restPath}`
        console.log(`[MIDDLEWARE] Localized path ${url.pathname}, rewriting to ${rewritePath}`)
        url.pathname = rewritePath
        return NextResponse.rewrite(url, {
          request: {
            headers: requestHeaders,
          },
        })
      }
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
    
    // Handle direct localized /site paths (e.g., /en/site/about)
    if (hasLocale && url.pathname.startsWith(`/${potentialLocale}/site`)) {
      console.log(`[MIDDLEWARE] Direct localized /site path access: ${url.pathname}`)
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

function detectLocale(request) {
  // 1. Check for locale preference in cookies
  const localeCookie = request.cookies.get('preferred-locale')?.value
  if (localeCookie && supportedLocales.includes(localeCookie)) {
    console.log(`[MIDDLEWARE] Locale from cookie: ${localeCookie}`)
    return localeCookie
  }

  // 2. Parse Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    const preferredLocale = parseAcceptLanguage(acceptLanguage)
    if (preferredLocale) {
      console.log(`[MIDDLEWARE] Locale from Accept-Language: ${preferredLocale}`)
      return preferredLocale
    }
  }

  // 3. Fallback to default locale
  console.log(`[MIDDLEWARE] Using default locale: ${defaultLocale}`)
  return defaultLocale
}

function parseAcceptLanguage(acceptLanguage) {
  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,ar;q=0.8,es;q=0.7")
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const parts = lang.trim().split(';')
      const code = parts[0].toLowerCase()
      const quality = parts[1] ? parseFloat(parts[1].split('=')[1]) : 1.0
      return { code, quality }
    })
    .sort((a, b) => b.quality - a.quality)

  // Find the first supported language
  for (const lang of languages) {
    // Check exact match first (e.g., 'en')
    if (supportedLocales.includes(lang.code)) {
      return lang.code
    }
    
    // Check language without region (e.g., 'en-US' -> 'en')
    const langCode = lang.code.split('-')[0]
    if (supportedLocales.includes(langCode)) {
      return langCode
    }
  }

  return null
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