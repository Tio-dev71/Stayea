'use client'

import * as React from 'react'
import { notFound, useRouter } from 'next/navigation'

import { useCurrentUser, useHasRole } from '@/hooks/use-has-role'

import type { RoleType } from '@/lib/rbac'

interface Props {
  role: RoleType
  children: React.ReactNode
}

/**
 * Page-level guard.
 *
 * Renders `children` when the current user satisfies `role`; otherwise
 * redirects to `/login` if not authenticated, or `notFound()` if unauthorized.
 */
export function RequireRole({ role, children }: Props): React.ReactNode {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const allowed = useHasRole(role)

  React.useEffect(() => {
    if (!currentUser) {
      router.replace('/login')
    }
  }, [currentUser, router])

  if (!currentUser) return null
  if (!allowed) notFound()
  return children
}

/**
 * Element-level visibility hint.
 *
 * Renders `children` when allowed, otherwise null. Use for buttons,
 * menu items, and table columns that should disappear for unauthorized users.
 */
export function ShowForRole({ role, children }: Props): React.ReactNode {
  const allowed = useHasRole(role)
  return allowed ? children : null
}
