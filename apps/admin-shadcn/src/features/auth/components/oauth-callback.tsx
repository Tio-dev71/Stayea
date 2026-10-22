'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { setToken, setRefreshToken } from '@/lib/token'

export function OAuthCallbackPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const refreshToken = searchParams.get('refreshToken')

    if (token && refreshToken) {
      setToken(token)
      setRefreshToken(refreshToken)
      if (typeof window !== 'undefined') {
        localStorage.setItem('stayea_token', token)
        localStorage.setItem('stayea_auth_state', 'logged_in')
      }
      const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirectTo') || '/'
      // Retrieve user profile to store user cookie with role (e.g. ADMIN)
      import('@/lib/stayea-api-service').then(({ stayeaApi }) => {
        stayeaApi.getProfile().then((profile) => {
          if (profile && typeof window !== 'undefined') {
            const isProd = window.location.hostname.endsWith('stayea.com')
            const domainPart = isProd ? '; domain=.stayea.com' : ''
            localStorage.setItem('stayea_user', JSON.stringify(profile))
            document.cookie = `user=${encodeURIComponent(JSON.stringify(profile))}; path=/${domainPart}; max-age=604800; SameSite=Lax`
          }
        }).finally(() => {
          window.location.href = returnUrl
        })
      }).catch(() => {
        window.location.href = returnUrl
      })
    } else {
      window.location.href = '/login'
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Đang hoàn tất đăng nhập STAYEA...</p>
    </div>
  )
}
