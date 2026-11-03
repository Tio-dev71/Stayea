import { randomUUID } from "node:crypto"
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { articlesTable } from "@workspace/database"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import type { DrizzleDb } from "@/app/database/db.port"
import type { CreateBlogDto, UpdateBlogDto } from "@/modules/stayea/blog/dtos/blog.dto"

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

@Injectable()
export class StayeaBlogService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDb) {}

  /**
   * 1. Get published blog articles for public exploration
   */
  async getPublishedBlogs(query?: {
    category?: string
    search?: string
    partnerId?: string
    limit?: number
    offset?: number
  }) {
    const conditions = [eq(articlesTable.status, "published")]

    if (query?.category && query.category !== "all") {
      conditions.push(eq(articlesTable.category, query.category))
    }

    if (query?.partnerId) {
      conditions.push(eq(articlesTable.partnerId, query.partnerId))
    }

    if (query?.search && query.search.trim()) {
      const term = `%${query.search.trim()}%`
      conditions.push(
        or(
          ilike(articlesTable.title, term),
          ilike(articlesTable.content, term),
          ilike(articlesTable.author, term)
        )!
      )
    }

    const limit = Math.min(query?.limit || 20, 100)
    const offset = query?.offset || 0

    const list = await this.db
      .select()
      .from(articlesTable)
      .where(and(...conditions))
      .orderBy(desc(articlesTable.isPinned), desc(articlesTable.createdAt))
      .limit(limit)
      .offset(offset)

    return list
  }

  /**
   * 2. Get blog article by ID or Slug with view increment
   */
  async getBlogByIdOrSlug(idOrSlug: string, incrementView = true) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrSlug
      )

    const [article] = await this.db
      .select()
      .from(articlesTable)
      .where(
        isUuid
          ? eq(articlesTable.id, idOrSlug)
          : eq(articlesTable.slug, idOrSlug)
      )
      .limit(1)

    if (!article) {
      throw new NotFoundException("Không tìm thấy bài viết blog yêu cầu")
    }

    if (incrementView) {
      try {
        await this.db
          .update(articlesTable)
          .set({
            viewCount: sql`${articlesTable.viewCount} + 1`,
          })
          .where(eq(articlesTable.id, article.id))
      } catch {}
    }

    return article
  }

  /**
   * 3. Get all blogs for Admin (Drafts, Published, Archived)
   */
  async getAllBlogsForAdmin(query?: {
    search?: string
    status?: string
    category?: string
  }) {
    const conditions = []

    if (query?.status && query.status !== "all") {
      conditions.push(eq(articlesTable.status, query.status as any))
    }

    if (query?.category && query.category !== "all") {
      conditions.push(eq(articlesTable.category, query.category))
    }

    if (query?.search && query.search.trim()) {
      const term = `%${query.search.trim()}%`
      conditions.push(
        or(
          ilike(articlesTable.title, term),
          ilike(articlesTable.content, term),
          ilike(articlesTable.author, term)
        )!
      )
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    return this.db
      .select()
      .from(articlesTable)
      .where(whereClause)
      .orderBy(desc(articlesTable.isPinned), desc(articlesTable.createdAt))
  }

  /**
   * 4. Get blogs authored by a specific Partner
   */
  async getPartnerBlogs(partnerId: string) {
    if (!partnerId) return []

    return this.db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.partnerId, partnerId))
      .orderBy(desc(articlesTable.createdAt))
  }

  /**
   * 5. Create a new blog article (Admin or Partner)
   */
  async createBlog(
    dto: CreateBlogDto,
    partnerId?: string,
    defaultAuthor?: string
  ) {
    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException("Tiêu đề bài viết không được để trống")
    }

    const baseSlug = toSlug(dto.title)
    const uniqueSuffix = randomUUID().replace(/-/g, "").slice(0, 6)
    const slug = `${baseSlug}-${uniqueSuffix}`

    const status = dto.status || "published"
    const author =
      dto.author?.trim() || defaultAuthor || (partnerId ? "Đối tác STAYEA" : "Ban Quản Trị STAYEA")
    const publishedAt = status === "published" ? new Date() : null

    const [article] = await this.db
      .insert(articlesTable)
      .values({
        title: dto.title.trim(),
        content: dto.content || "",
        slug,
        status: status as any,
        category: dto.category || "cam-nang",
        imageUrl: dto.imageUrl || null,
        tags: dto.tags || ["PhuQuoc", "CamNang"],
        author,
        partnerId: partnerId || dto.partnerId || null,
        isPinned: Boolean(dto.isPinned),
        viewCount: 0,
        publishedAt,
      })
      .returning()

    return article
  }

  /**
   * 6. Update a blog article
   */
  async updateBlog(id: string, dto: UpdateBlogDto, partnerId?: string) {
    const [existing] = await this.db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.id, id))
      .limit(1)

    if (!existing) {
      throw new NotFoundException("Bài viết không tồn tại")
    }

    if (partnerId && existing.partnerId !== partnerId) {
      throw new BadRequestException("Bạn không có quyền chỉnh sửa bài viết này")
    }

    let publishedAt = existing.publishedAt
    if (dto.status === "published" && !existing.publishedAt) {
      publishedAt = new Date()
    }

    const [updated] = await this.db
      .update(articlesTable)
      .set({
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.content !== undefined ? { content: dto.content } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
        ...(dto.tags !== undefined ? { tags: dto.tags } : {}),
        ...(dto.author !== undefined ? { author: dto.author.trim() } : {}),
        ...(dto.status !== undefined ? { status: dto.status as any, publishedAt } : {}),
        ...(dto.isPinned !== undefined ? { isPinned: dto.isPinned } : {}),
        updatedAt: new Date(),
      })
      .where(eq(articlesTable.id, id))
      .returning()

    return updated
  }

  /**
   * 7. Delete a blog article
   */
  async deleteBlog(id: string, partnerId?: string) {
    const [existing] = await this.db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.id, id))
      .limit(1)

    if (!existing) {
      throw new NotFoundException("Bài viết không tồn tại")
    }

    if (partnerId && existing.partnerId !== partnerId) {
      throw new BadRequestException("Bạn không có quyền xóa bài viết này")
    }

    await this.db.delete(articlesTable).where(eq(articlesTable.id, id))
    return { success: true, message: "Đã xóa bài viết thành công" }
  }
}
