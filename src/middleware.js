// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const host = req.headers.get('host') || '';
  const currentHost = host.split(':')[0]; // remove port in dev

  const isLocalhost = currentHost.endsWith('localhost') || currentHost.endsWith('lvh.me');
  const mainDomain = isLocalhost ? 'lvh.me' : 'yourdomain.com';

  const parts = currentHost.split('.');

  // Handle subdomain.lvh.me or subdomain.yourdomain.com
  let subdomain = null;
  if (isLocalhost && parts.length === 3) {
    // e.g., tripmo.lvh.me
    subdomain = parts[0];
  } else if (!isLocalhost && parts.length === 3) {
    // e.g., tripmo.yourdomain.com
    subdomain = parts[0];
  }

  // Rewrite only if there's a valid subdomain
  if (subdomain && subdomain !== 'www') {
    const url = req.nextUrl.clone();
    url.pathname = `/sites/${subdomain}${url.pathname}`;
    console.log("Rewriting to:", url.pathname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes EXCEPT:
    // - _next
    // - favicon.ico
    // - static files (by extension)
    // - /api
    // - /app/api
    "/((?!_next|favicon.ico|api|app/api|.*\\.(?:jpg|jpeg|png|svg|webp|gif|ico|js|css|json|txt|map|woff|woff2|ttf|eot)).*)"
  ],
};
