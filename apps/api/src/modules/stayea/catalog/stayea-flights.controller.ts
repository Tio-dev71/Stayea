import { Controller, Get, Param, Query } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import { FlightsQueryDto } from "@/modules/stayea/catalog/dtos/catalog-query.dto"
import { StayeaCatalogService } from "@/modules/stayea/catalog/stayea-catalog.service"

@ApiTags("Stayea - Flights")
@Controller("stayea/flights")
export class StayeaFlightsController {
  constructor(private readonly catalogService: StayeaCatalogService) {}

  @Get("search")
  @Public()
  @UseEnvelope()
  @ApiOperation({ summary: "Search scheduled flights (SGN, HAN, DAD to PQC)" })
  async searchFlights(@Query() query: FlightsQueryDto) {
    return this.catalogService.findFlights(query)
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get flight details by ID" })
  async findOne(@Param("id") id: string) {
    return this.catalogService.findFlightById(id)
  }
}
