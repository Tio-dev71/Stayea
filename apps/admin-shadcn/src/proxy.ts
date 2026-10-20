import { NextResponse } from 'next/server'
import type { NextProxy, ProxyConfig, NextRequest } from 'next/server'

const PUBLIC_ROUTES = new Set([
  '/',
  '/about',
  '/host',
  '/partner',
  '/stayea-club',
  '/stayea-club-claimed',
  '/stay',
  '/experience',
  '/packages',
  '/transport',
  '/phu-quoc',
  '/deals',
  '/profile',
  '/bookings',
  '/plans',
  '/favorites',
  '/reviews',
  '/payment',
  '/settings',
  '/flight-booking',
  '/my-deals',
  '/account-info',
  '/new-booking',
  '/add-payment',
  '/login',
  '/register',
  '/oauth/callback',
])

export const proxy: NextProxy = (request: NextRequest) => {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Allow static assets, public pages, and all customer portal routes
  if (
    pathname === '/' ||
    PUBLIC_ROUTES.has(pathname) ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?)$/i.test(pathname)
  ) {
    return NextResponse.next()
  }

  // If visiting protected admin pages without token, redirect to login
  if (!token) {
    const loginUrl = new URL(`/login?redirectTo=${encodeURIComponent(pathname)}`, request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config: ProxyConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
