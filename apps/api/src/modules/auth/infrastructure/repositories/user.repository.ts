import { Inject, Injectable } from '@nestjs/common'
import { usersTable } from '@workspace/database'
import { and, eq, or, ilike } from 'drizzle-orm'

import { DB_TOKEN } from '@/app/database/db.port'

import type { DrizzleDb } from '@/app/database/db.port'
import type {
  User,
  UserRepository,
  CreateUserData,
} from '@/modules/auth/application/ports/user.repository.port'

/**
 * Drizzle User Repository implementation
 *
 * Manages persistence of core user data.
 * Adapts to the better-auth schema.
 */
@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @Inject(DB_TOKEN)
    private readonly db: DrizzleDb,
  ) {}

  async create(data: CreateUserData): Promise<User> {
    const now = new Date()
    const cleanEmail = data.email.toLowerCase().trim()
    const baseUsername =
      cleanEmail.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user'
    let uniqueUsername = await this.generateUniqueUsername(baseUsername)

    try {
      const result = await this.db
        .insert(usersTable)
        .values({
          id: data.id,
          name: data.name,
          email: cleanEmail,
          username: uniqueUsername,
          displayUsername: data.name || uniqueUsername,
          role: data.role ?? 'USER',
          emailVerified: true,
          banned: false,
          createdAt: now,
          updatedAt: now,
        })
        .returning()

      return this.toEntity(result[0]!)
    } catch (err: any) {
      if (err?.code === '23505' && err?.constraint?.includes('username')) {
        // Fallback with timestamp-based unique username
        uniqueUsername = `${baseUsername}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`
        const retryResult = await this.db
          .insert(usersTable)
          .values({
            id: data.id,
            name: data.name,
            email: cleanEmail,
            username: uniqueUsername,
            displayUsername: data.name || uniqueUsername,
            role: data.role ?? 'USER',
            emailVerified: true,
            banned: false,
            createdAt: now,
            updatedAt: now,
          })
          .returning()

        return this.toEntity(retryResult[0]!)
      }
      throw err
    }
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1)

    if (result.length === 0) {
      return null
    }

    return this.toEntity(result[0]!)
  }

  async findByEmail(email: string): Promise<User | null> {
    const cleanEmail = email.toLowerCase().trim()
    const result = await this.db
      .select()
      .from(usersTable)
      .where(or(eq(usersTable.email, cleanEmail), ilike(usersTable.email, cleanEmail)))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return this.toEntity(result[0]!)
  }

  async findByUsername(username: string): Promise<User | null> {
    const cleanUsername = username.toLowerCase().trim()
    const result = await this.db
      .select()
      .from(usersTable)
      .where(or(eq(usersTable.username, cleanUsername), ilike(usersTable.username, cleanUsername)))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return this.toEntity(result[0]!)
  }

  private async generateUniqueUsername(base: string): Promise<string> {
    let candidate = base
    let attempts = 0
    while (attempts < 10) {
      const existing = await this.findByUsername(candidate)
      if (!existing) {
        return candidate
      }
      attempts++
      candidate = `${base}_${Math.floor(1000 + Math.random() * 9000)}`
    }
    return `${base}_${Date.now().toString(36)}`
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1)

    return result.length > 0
  }

  async existsAndActive(id: string): Promise<boolean> {
    const result = await this.db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(and(eq(usersTable.id, id), eq(usersTable.banned, false)))
      .limit(1)

    return result.length > 0
  }

  private toEntity(record: typeof usersTable.$inferSelect): User {
    return {
      id: record.id,
      name: record.name,
      email: record.email,
      emailVerified: record.emailVerified,
      image: record.image,
      role: record.role,
      banned: record.banned ?? false,
      banReason: record.banReason,
      banExpires: record.banExpires,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }
  }
}
