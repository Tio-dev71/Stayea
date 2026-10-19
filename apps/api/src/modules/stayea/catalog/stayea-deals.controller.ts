import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import { ValidatePromoDto } from "@/modules/stayea/catalog/dtos/catalog-query.dto"
import { StayeaCatalogService } from "@/modules/stayea/catalog/stayea-catalog.service"

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
}
