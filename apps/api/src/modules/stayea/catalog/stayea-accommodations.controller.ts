import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import { AccommodationsQueryDto } from "@/modules/stayea/catalog/dtos/catalog-query.dto"
import {
  CreateAccommodationDto,
  UpdateAccommodationDto,
} from "@/modules/stayea/catalog/dtos/create-accommodation.dto"
import { StayeaCatalogService } from "@/modules/stayea/catalog/stayea-catalog.service"

@ApiTags("Stayea - Accommodations")
@Controller("stayea/accommodations")
export class StayeaAccommodationsController {
  constructor(private readonly catalogService: StayeaCatalogService) {}

  @Get()
  @Public()
  @UseEnvelope()
  @ApiOperation({ summary: "List accommodations with filters (villa, resort, hotel, etc.)" })
  async findAll(@Query() query: AccommodationsQueryDto) {
    return this.catalogService.findAccommodations(query)
  }

  @Get(":idOrSlug")
  @Public()
  @ApiOperation({ summary: "Get accommodation details by ID or slug" })
  async findOne(@Param("idOrSlug") idOrSlug: string) {
    return this.catalogService.findAccommodationById(idOrSlug)
  }

  @Post()
  @Public() // Allow admin form submission from client
  @ApiOperation({ summary: "Create new accommodation listing" })
  async create(@Body() dto: CreateAccommodationDto) {
    return this.catalogService.createAccommodation(dto)
  }

  @Patch(":id")
  @Public()
  @ApiOperation({ summary: "Update existing accommodation" })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateAccommodationDto
  ) {
    return this.catalogService.updateAccommodation(id, dto)
  }

  @Delete(":id")
  @Public()
  @ApiOperation({ summary: "Delete accommodation" })
  async remove(@Param("id") id: string) {
    return this.catalogService.deleteAccommodation(id)
  }
}
