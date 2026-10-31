import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"
import { Roles } from "@/shared-kernel/infrastructure/decorators/roles.decorator"

import { ValidatePromoDto } from "@/modules/stayea/catalog/dtos/catalog-query.dto"
import { StayeaCatalogService } from "@/modules/stayea/catalog/stayea-catalog.service"
import { CreatePromotionDto, UpdatePromotionDto } from "@/modules/stayea/catalog/dtos/promotion.dto"

@ApiTags("Stayea - Deals & Promotions")
@Controller("stayea/deals")
export class StayeaDealsController {
  constructor(private readonly catalogService: StayeaCatalogService) {}

  @Get()
  @Public()
  @UseEnvelope()
  @ApiOperation({ summary: "Get all active promotional deals & vouchers" })
  async getPromotions(@Query("category") category?: string) {
    return this.catalogService.findPromotions(category)
  }

  @Post("validate")
  @Public()
  @ApiOperation({ summary: "Validate promo code and calculate discount amount" })
  async validatePromo(@Body() dto: ValidatePromoDto) {
    return this.catalogService.validatePromoCode(dto)
  }

  @Get("admin")
  @Roles("ADMIN")
  @UseEnvelope()
  @ApiOperation({ summary: "List all promotional campaigns for admin" })
  async getAdminPromotions() {
    return this.catalogService.findAdminPromotions()
  }

  @Post("admin")
  @Roles("ADMIN")
  @UseEnvelope()
  @ApiOperation({ summary: "Create promotional campaign" })
  async createPromotion(@Body() dto: CreatePromotionDto) {
    return this.catalogService.createPromotion(dto)
  }

  @Patch("admin/:id")
  @Roles("ADMIN")
  @UseEnvelope()
  @ApiOperation({ summary: "Update promotional campaign" })
  async updatePromotion(@Param("id") id: string, @Body() dto: UpdatePromotionDto) {
    return this.catalogService.updatePromotion(id, dto)
  }
}
