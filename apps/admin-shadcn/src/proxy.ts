import { NextResponse } from 'next/server'

import type { NextProxy, ProxyConfig, NextRequest } from 'next/server'

export const proxy: NextProxy = (request: NextRequest) => {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  if (!token) {
    if (pathname === "/" || /\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?)$/i.test(pathname)) {
      return NextResponse.next()
    }
    const loginUrl = new URL(`/login?redirectTo=${encodeURIComponent(pathname)}`, request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config: ProxyConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|register).*)'],
}
