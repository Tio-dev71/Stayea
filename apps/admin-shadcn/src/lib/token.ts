import type { RoleType } from '@/lib/rbac'

const ACCESS_TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'user'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function getCookie(name: string): string | null {
  if (!isBrowser()) return null
  return (
    document.cookie
      .split('; ')
      .find((r) => r.startsWith(`${name}=`))
      ?.split('=')
      .slice(1)
      .join('=') ?? null
  )
}

function getCookieDomains(): string[] {
  if (!isBrowser()) return ['']
  const hostname = window.location.hostname.toLowerCase()
  if (hostname.endsWith('stayea.com')) {
    return ['; domain=.stayea.com', '; domain=stayea.com', '']
  }
  return ['']
}

function setCookie(name: string, value: string): void {
  if (!isBrowser()) return
  const domains = getCookieDomains()
  // Set both domain-wide and host-only cookies with 7-day max-age
  for (const domainPart of domains) {
    document.cookie = `${name}=${value}; path=/${domainPart}; max-age=604800; SameSite=Lax`
  }
}

function removeCookie(name: string): void {
  if (!isBrowser()) return
  const domains = getCookieDomains()
  for (const domainPart of domains) {
    document.cookie = `${name}=; path=/${domainPart}; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
  document.cookie = `${name}=; path=/; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

function safeLocalStorageGet(key: string): string | null {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return null
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeLocalStorageSet(key: string, value: string): void {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return
    window.localStorage.setItem(key, value)
  } catch {}
}

function safeLocalStorageRemove(key: string): void {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return
    window.localStorage.removeItem(key)
  } catch {}
}

export function getToken(): string | null {
  if (!isBrowser()) return null
  return safeLocalStorageGet('stayea_token') || getCookie(ACCESS_TOKEN_KEY)
}

export function setToken(token: string): void {
  if (!isBrowser()) return
  setCookie(ACCESS_TOKEN_KEY, token)
  safeLocalStorageSet('stayea_token', token)
}

export function removeToken(): void {
  if (!isBrowser()) return
  removeCookie(ACCESS_TOKEN_KEY)
  safeLocalStorageRemove('stayea_token')
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null
  return safeLocalStorageGet('stayea_refresh_token') || getCookie(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token: string): void {
  if (!isBrowser()) return
  setCookie(REFRESH_TOKEN_KEY, token)
  safeLocalStorageSet('stayea_refresh_token', token)
}

export function removeRefreshToken(): void {
  if (!isBrowser()) return
  removeCookie(REFRESH_TOKEN_KEY)
  safeLocalStorageRemove('stayea_refresh_token')
}

export type StoredUser = {
  id: string
  email: string
  name?: string
  displayName?: string | null
  avatarUrl?: string | null
  role: RoleType | null
}

export function getUser(): StoredUser | null {
  if (!isBrowser()) return null
  try {
    const local = safeLocalStorageGet('stayea_user')
    if (local) {
      return JSON.parse(local) as StoredUser
    }
  } catch {}

  const raw = getCookie(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(decodeURIComponent(raw)) as StoredUser
  } catch {
    return null
  }
}

export function setUser(user: StoredUser): void {
  if (!isBrowser()) return
  setCookie(USER_KEY, encodeURIComponent(JSON.stringify(user)))
  safeLocalStorageSet('stayea_user', JSON.stringify(user))
  safeLocalStorageSet('stayea_auth_state', 'logged_in')
  try {
    window.dispatchEvent(new CustomEvent('stayea-auth-change', { detail: user }))
  } catch {}
}

export function removeUser(): void {
  if (!isBrowser()) return
  removeCookie(USER_KEY)
  safeLocalStorageRemove('stayea_user')
  safeLocalStorageRemove('stayea_auth_state')
  try {
    window.dispatchEvent(new CustomEvent('stayea-auth-change', { detail: null }))
  } catch {}
}

export function clearAllAuth(): void {
  removeToken()
  removeRefreshToken()
  removeUser()
}
