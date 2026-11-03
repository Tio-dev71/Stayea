import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { StayeaBlogService } from "@/modules/stayea/blog/stayea-blog.service"
import { CreateBlogDto, UpdateBlogDto } from "@/modules/stayea/blog/dtos/blog.dto"

@ApiTags("stayea-blogs")
@Controller("stayea/blogs")
export class StayeaBlogController {
  constructor(private readonly blogService: StayeaBlogService) {}

  // ==========================================
  // 1. PUBLIC ENDPOINTS (Customers, AI Concierge)
  // ==========================================

  @Public()
  @Get()
  @ApiOperation({ summary: "Get published blogs / travel guides" })
  async getPublishedBlogs(
    @Query("category") category?: string,
    @Query("search") search?: string,
    @Query("partnerId") partnerId?: string,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number
  ) {
    return this.blogService.getPublishedBlogs({
      category,
      search,
      partnerId,
      limit: limit ? Number(limit) : 20,
      offset: offset ? Number(offset) : 0,
    })
  }

  // ==========================================
  // 2. ADMIN ENDPOINTS (STAYEA Portal)
  // ==========================================

  @Public()
  @Get("admin/all")
  @ApiOperation({ summary: "Admin: Get all blogs (drafts, published, archived)" })
  async getAllBlogsForAdmin(
    @Query("search") search?: string,
    @Query("status") status?: string,
    @Query("category") category?: string
  ) {
    return this.blogService.getAllBlogsForAdmin({ search, status, category })
  }

  @Public()
  @Post("admin")
  @ApiOperation({ summary: "Admin: Create a new blog / travel article" })
  async createAdminBlog(@Body() dto: CreateBlogDto) {
    return this.blogService.createBlog(dto, undefined, "Ban Quản Trị STAYEA")
  }

  @Public()
  @Put("admin/:id")
  @ApiOperation({ summary: "Admin: Update blog article" })
  async updateAdminBlog(
    @Param("id") id: string,
    @Body() dto: UpdateBlogDto
  ) {
    return this.blogService.updateBlog(id, dto)
  }

  @Public()
  @Delete("admin/:id")
  @ApiOperation({ summary: "Admin: Delete blog article" })
  async deleteAdminBlog(@Param("id") id: string) {
    return this.blogService.deleteBlog(id)
  }

  @Public()
  @Patch("admin/:id/status")
  @ApiOperation({ summary: "Admin: Update blog status" })
  async updateBlogStatus(
    @Param("id") id: string,
    @Body("status") status: "draft" | "published" | "archived"
  ) {
    return this.blogService.updateBlog(id, { status })
  }

  // ==========================================
  // 3. PARTNER HUB ENDPOINTS (hub.stayea.com)
  // ==========================================

  @Public()
  @Get("partner/my")
  @ApiOperation({ summary: "Partner: Get all articles for a partner" })
  async getPartnerBlogs(@Query("partnerId") partnerId: string) {
    return this.blogService.getPartnerBlogs(partnerId)
  }

  @Public()
  @Post("partner")
  @ApiOperation({ summary: "Partner: Create a new blog / travel article" })
  async createPartnerBlog(
    @Body() dto: CreateBlogDto,
    @Query("partnerId") partnerId?: string
  ) {
    const finalPartnerId = dto.partnerId || partnerId
    return this.blogService.createBlog(dto, finalPartnerId)
  }

  @Public()
  @Put("partner/:id")
  @ApiOperation({ summary: "Partner: Update blog article" })
  async updatePartnerBlog(
    @Param("id") id: string,
    @Body() dto: UpdateBlogDto,
    @Query("partnerId") partnerId?: string
  ) {
    return this.blogService.updateBlog(id, dto, partnerId)
  }

  @Public()
  @Delete("partner/:id")
  @ApiOperation({ summary: "Partner: Delete blog article" })
  async deletePartnerBlog(
    @Param("id") id: string,
    @Query("partnerId") partnerId?: string
  ) {
    return this.blogService.deleteBlog(id, partnerId)
  }

  // ==========================================
  // 4. DETAIL ENDPOINT (Must be last to avoid route conflicts)
  // ==========================================

  @Public()
  @Get(":idOrSlug")
  @ApiOperation({ summary: "Get blog article details by ID or Slug" })
  async getBlogDetail(@Param("idOrSlug") idOrSlug: string) {
    return this.blogService.getBlogByIdOrSlug(idOrSlug)
  }
}
