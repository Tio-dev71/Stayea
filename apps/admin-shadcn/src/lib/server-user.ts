import crypto from 'node:crypto'
import { cookies } from 'next/headers'

import type { RoleType } from '@/lib/rbac'
import type { StoredUser } from '@/lib/token'

interface JwtPayload {
  sub: string
  email: string
  roles?: string[]
  role?: string
  sessionId?: string
  exp?: number
}

function verifyJwtPayload(token: string, secret?: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [headerB64, payloadB64, signatureB64] = parts
    if (!headerB64 || !payloadB64 || !signatureB64) return null

    if (secret) {
      const data = `${headerB64}.${payloadB64}`
      const hmac = crypto.createHmac('sha256', secret)
      hmac.update(data)
      const expectedSig = hmac.digest('base64url')
      if (signatureB64 !== expectedSig) {
        return null
      }
    }

    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8')
    const payload = JSON.parse(payloadJson) as JwtPayload
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

async function verifyTokenWithBackend(token: string): Promise<StoredUser | null> {
  try {
    const apiUrl =
      process.env['INTERNAL_API_URL'] ||
      process.env['NEXT_PUBLIC_API_URL'] ||
      'http://localhost:3000'

    const res = await fetch(`${apiUrl}/api/auth/session`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) return null
    const data = await res.json()
    if (!data?.user) return null

    return {
      id: data.user.id,
      email: data.user.email,
      role: (data.user.role as RoleType) ?? 'USER',
      displayName: data.user.email?.split('@')[0],
      name: data.user.email?.split('@')[0],
      avatarUrl: null,
    }
  } catch {
    return null
  }
}

export async function getServerUser(): Promise<StoredUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  // Security Gate: Reject unauthenticated requests immediately.
  // Never trust client-writable 'user' cookie alone without a valid JWT token.
  if (!token) {
    return null
  }

  const jwtSecret = process.env['JWT_SECRET']
  let verifiedUser: StoredUser | null = null

  // Fast-path: local cryptographic verification if secret is configured
  if (jwtSecret) {
    const payload = verifyJwtPayload(token, jwtSecret)
    if (payload) {
      const verifiedRole =
        (payload.roles && (payload.roles[0] as RoleType)) ||
        (payload.role as RoleType) ||
        'USER'

      verifiedUser = {
        id: payload.sub,
        email: payload.email,
        role: verifiedRole,
        displayName: payload.email?.split('@')[0],
        name: payload.email?.split('@')[0],
        avatarUrl: null,
      }
    }
  }

  // Fallback or full session check via NestJS API
  if (!verifiedUser) {
    verifiedUser = await verifyTokenWithBackend(token)
  }

  if (!verifiedUser) {
    return null
  }

  // Preserve non-sensitive cosmetic profile details if present in client cookie,
  // but strictly preserve cryptographically verified ID and ROLE
  const rawClientUser = cookieStore.get('user')?.value
  if (rawClientUser) {
    try {
      const clientProfile = JSON.parse(decodeURIComponent(rawClientUser))
      if (clientProfile && typeof clientProfile === 'object') {
        verifiedUser.displayName = clientProfile.displayName || clientProfile.name || verifiedUser.displayName
        verifiedUser.name = clientProfile.name || verifiedUser.name
        verifiedUser.avatarUrl = clientProfile.avatarUrl || null
      }
    } catch {
      // Ignore invalid JSON in client cookie
    }
  }

  return verifiedUser
}

