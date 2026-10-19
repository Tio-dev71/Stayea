import { Controller, Get, Param, Query } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import { PackagesQueryDto } from "@/modules/stayea/catalog/dtos/catalog-query.dto"
import { StayeaCatalogService } from "@/modules/stayea/catalog/stayea-catalog.service"

@ApiTags("Stayea - Packages")
@Controller("stayea/packages")
export class StayeaPackagesController {
  constructor(private readonly catalogService: StayeaCatalogService) {}

  @Get()
  @Public()
  @UseEnvelope()
  @ApiOperation({ summary: "List travel combos and vacation packages (3D2N, All-Inclusive)" })
  async findAll(@Query() query: PackagesQueryDto) {
    return this.catalogService.findPackages(query)
  }

  @Get(":idOrSlug")
  @Public()
  @ApiOperation({ summary: "Get travel package details by ID or slug" })
  async findOne(@Param("idOrSlug") idOrSlug: string) {
    return this.catalogService.findPackageById(idOrSlug)
  }
}
