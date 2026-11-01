import crypto from 'node:crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getServerUser } from './server-user'

// Mock next/headers cookies()
const mockGetCookie = vi.fn()
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: mockGetCookie,
  })),
}))

const TEST_SECRET = 'test-jwt-secret-key-32-bytes-long!!'

function createTestToken(payload: object, secret: string = TEST_SECRET): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${payloadB64}`).digest('base64url')
  return `${header}.${payloadB64}.${sig}`
}

describe('getServerUser Security Verification (SEC-001 Remediation)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env['JWT_SECRET'] = TEST_SECRET
  })

  it('rejects unauthenticated requests even if client injects forged user={"role":"ADMIN"} cookie', async () => {
    // Attack scenario: Attacker sets cookie 'user={"role":"ADMIN"}' but has no valid token cookie
    mockGetCookie.mockImplementation((name: string) => {
      if (name === 'user') {
        return { value: encodeURIComponent(JSON.stringify({ id: 'attacker', role: 'ADMIN' })) }
      }
      return undefined // No 'token' cookie
    })

    const user = await getServerUser()
    expect(user).toBeNull()
  })

  it('rejects tampered or forged JWT tokens', async () => {
    const fakeToken = createTestToken(
      { sub: 'hacker-1', email: 'hacker@evil.com', roles: ['ADMIN'] },
      'wrong-secret-signature'
    )

    mockGetCookie.mockImplementation((name: string) => {
      if (name === 'token') return { value: fakeToken }
      return undefined
    })

    const user = await getServerUser()
    expect(user).toBeNull()
  })

  it('rejects expired JWT tokens', async () => {
    const expiredToken = createTestToken({
      sub: 'user-old',
      email: 'old@example.com',
      roles: ['ADMIN'],
      exp: Math.floor(Date.now() / 1000) - 3600, // expired 1 hour ago
    })

    mockGetCookie.mockImplementation((name: string) => {
      if (name === 'token') return { value: expiredToken }
      return undefined
    })

    const user = await getServerUser()
    expect(user).toBeNull()
  })

  it('strictly enforces role from verified JWT, ignoring forged client cookie role', async () => {
    // Valid JWT belongs to regular USER
    const validUserToken = createTestToken({
      sub: 'customer-123',
      email: 'customer@stayea.com',
      roles: ['USER'],
      exp: Math.floor(Date.now() / 1000) + 3600,
    })

    // Attacker altered user cookie to role: "ADMIN"
    mockGetCookie.mockImplementation((name: string) => {
      if (name === 'token') return { value: validUserToken }
      if (name === 'user') {
        return { value: encodeURIComponent(JSON.stringify({ role: 'ADMIN', name: 'Altered Name' })) }
      }
      return undefined
    })

    const user = await getServerUser()
    expect(user).not.toBeNull()
    expect(user?.id).toBe('customer-123')
    expect(user?.role).toBe('USER') // Must remain USER, NOT ADMIN!
  })

  it('authenticates valid ADMIN JWT token correctly', async () => {
    const validAdminToken = createTestToken({
      sub: 'admin-master-1',
      email: 'admin@stayea.com',
      roles: ['ADMIN'],
      exp: Math.floor(Date.now() / 1000) + 3600,
    })

    mockGetCookie.mockImplementation((name: string) => {
      if (name === 'token') return { value: validAdminToken }
      return undefined
    })

    const user = await getServerUser()
    expect(user).not.toBeNull()
    expect(user?.id).toBe('admin-master-1')
    expect(user?.role).toBe('ADMIN')
  })
})
