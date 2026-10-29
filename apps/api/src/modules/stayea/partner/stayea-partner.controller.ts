import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import {
  BulkUpdateInventoryDto,
  CreateDraftOrderDto,
  CreatePartnerServiceDto,
  PartnerOrderRespondDto,
  RegisterPartnerDto,
  UpdatePartnerProfileDto,
  UpdatePartnerServiceDto,
} from "@/modules/stayea/partner/dtos/partner.dto"
import { StayeaPartnerService } from "@/modules/stayea/partner/stayea-partner.service"

@ApiTags("Stayea - Partner Hub")
@Controller("stayea/partner")
export class StayeaPartnerController {
  constructor(private readonly partnerService: StayeaPartnerService) {}

  // -------------------------------------------------------------
  // Public / AI Agent Endpoints
  // -------------------------------------------------------------

  @Public()
  @Post("orders/draft")
  @ApiOperation({
    summary: "AI Agent or Customer creates draft order for Admin review (Status: pending_admin)",
  })
  async createDraftOrder(@Body() dto: CreateDraftOrderDto) {
    return this.partnerService.createDraftOrder(dto)
  }

  @Public()
  @Get("catalog/services")
  @ApiOperation({ summary: "Get all active services across partners for discovery / AI catalog" })
  async getCatalogServices(
    @Query("type") type?: string,
    @Query("search") search?: string,
    @Query("location") location?: string
  ) {
    return this.partnerService.getAllActiveServices({ type, search, location })
  }

  @Public()
  @Get("catalog/inventory")
  @ApiOperation({ summary: "Check service calendar availability by service ID" })
  async checkAvailability(
    @Query("serviceId") serviceId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    return this.partnerService.getInventory(serviceId, startDate, endDate)
  }

  // -------------------------------------------------------------
  // Partner Authenticated / Self-Service Endpoints
  // -------------------------------------------------------------

  @ApiBearerAuth()
  @Post("register")
  @ApiOperation({ summary: "Register current authenticated user as a STAYEA Partner" })
  async register(
    @Request() req: { user: { id: string } },
    @Body() dto: RegisterPartnerDto
  ) {
    return this.partnerService.registerPartner(req.user.id, dto)
  }

  @ApiBearerAuth()
  @Get("profile")
  @UseEnvelope()
  @ApiOperation({ summary: "Get partner profile for current user" })
  async getProfile(@Request() req: { user: { id: string } }) {
    const profile = await this.partnerService.getProfileByUserId(req.user.id)
    return profile
  }

  @ApiBearerAuth()
  @Patch("profile")
  @UseEnvelope()
  @ApiOperation({ summary: "Update partner profile" })
  async updateProfile(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdatePartnerProfileDto
  ) {
    return this.partnerService.updateProfile(req.user.id, dto)
  }

  @ApiBearerAuth()
  @Get("summary")
  @UseEnvelope()
  @ApiOperation({ summary: "Get partner dashboard KPIs, recent orders and metrics" })
  async getSummary(@Request() req: { user: { id: string } }) {
    const profile = await this.partnerService.getProfileByUserId(req.user.id)
    if (!profile) return null
    return this.partnerService.getPartnerSummary(profile.id)
  }

  @ApiBearerAuth()
  @Get("services")
  @UseEnvelope()
  @ApiOperation({ summary: "Get all services of current partner" })
  async getMyServices(@Request() req: { user: { id: string } }) {
    const profile = await this.partnerService.getProfileByUserId(req.user.id)
    if (!profile) return []
    return this.partnerService.getPartnerServices(profile.id)
  }

  @ApiBearerAuth()
  @Post("services")
  @UseEnvelope()
  @ApiOperation({ summary: "Create a new partner service (Homestay, Car fleet, Tour)" })
  async createService(
    @Request() req: { user: { id: string } },
    @Body() dto: CreatePartnerServiceDto
  ) {
    const profile = await this.partnerService.getProfileByUserId(req.user.id)
    if (!profile) throw new Error("Vui lòng đăng ký hồ sơ đối tác trước khi tạo dịch vụ")
    return this.partnerService.createService(profile.id, dto)
  }

  @ApiBearerAuth()
  @Patch("services/:id")
  @UseEnvelope()
  @ApiOperation({ summary: "Update service details, price, images" })
  async updateService(
    @Request() req: { user: { id: string } },
    @Param("id") serviceId: string,
    @Body() dto: UpdatePartnerServiceDto
  ) {
    const profile = await this.partnerService.getProfileByUserId(req.user.id)
    if (!profile) throw new Error("Chưa có hồ sơ đối tác")
    return this.partnerService.updateService(profile.id, serviceId, dto)
  }

  @ApiBearerAuth()
  @Delete("services/:id")
  @UseEnvelope()
  @ApiOperation({ summary: "Delete service" })
  async deleteService(
    @Request() req: { user: { id: string } },
    @Param("id") serviceId: string
  ) {
    const profile = await this.partnerService.getProfileByUserId(req.user.id)
    if (!profile) throw new Error("Chưa có hồ sơ đối tác")
    return this.partnerService.deleteService(profile.id, serviceId)
  }

  @ApiBearerAuth()
  @Post("inventory/bulk")
  @UseEnvelope()
  @ApiOperation({ summary: "Bulk update availability / prices for date ranges" })
  async bulkUpdateInventory(
    @Request() req: { user: { id: string } },
    @Body() dto: BulkUpdateInventoryDto
  ) {
    const profile = await this.partnerService.getProfileByUserId(req.user.id)
    if (!profile) throw new Error("Chưa có hồ sơ đối tác")
    return this.partnerService.bulkUpdateInventory(profile.id, dto)
  }

  @ApiBearerAuth()
  @Get("orders")
  @UseEnvelope()
  @ApiOperation({ summary: "Get all orders assigned to current partner" })
  async getMyOrders(
    @Request() req: { user: { id: string } },
    @Query("status") status?: string
  ) {
    const profile = await this.partnerService.getProfileByUserId(req.user.id)
    if (!profile) return []
    return this.partnerService.getPartnerOrders(profile.id, status)
  }

  @ApiBearerAuth()
  @Patch("orders/:id/respond")
  @UseEnvelope()
  @ApiOperation({ summary: "Partner accepts or declines order sent from Admin" })
  async respondOrder(
    @Request() req: { user: { id: string } },
    @Param("id") orderId: string,
    @Body() dto: PartnerOrderRespondDto
  ) {
    const profile = await this.partnerService.getProfileByUserId(req.user.id)
    if (!profile) throw new Error("Chưa có hồ sơ đối tác")
    return this.partnerService.partnerRespondOrder(profile.id, orderId, dto)
  }
}
