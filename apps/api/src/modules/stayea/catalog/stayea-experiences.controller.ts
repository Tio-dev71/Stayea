import { Controller, Get, Param, Query } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import { ExperiencesQueryDto } from "@/modules/stayea/catalog/dtos/catalog-query.dto"
import { StayeaCatalogService } from "@/modules/stayea/catalog/stayea-catalog.service"

@ApiTags("Stayea - Experiences")
@Controller("stayea/experiences")
export class StayeaExperiencesController {
  constructor(private readonly catalogService: StayeaCatalogService) {}

  @Get()
  @Public()
  @UseEnvelope()
  @ApiOperation({ summary: "List experiences (tours, diving, snorkeling, sunsets)" })
  async findAll(@Query() query: ExperiencesQueryDto) {
    return this.catalogService.findExperiences(query)
  }

  @Get(":idOrSlug")
  @Public()
  @ApiOperation({ summary: "Get experience details by ID or slug" })
  async findOne(@Param("idOrSlug") idOrSlug: string) {
    return this.catalogService.findExperienceById(idOrSlug)
  }
}
