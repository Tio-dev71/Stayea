import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"

import { Roles } from "@/shared-kernel/infrastructure/decorators/roles.decorator"
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import {
  AdminApproveOrderDto,
  AdminUpdatePartnerStatusDto,
} from "@/modules/stayea/partner/dtos/partner.dto"
import { StayeaPartnerService } from "@/modules/stayea/partner/stayea-partner.service"

@ApiTags("Stayea - Admin Partner Management")
@Controller("stayea/admin/partners")
@ApiBearerAuth()
@Roles("ADMIN")
export class StayeaPartnerAdminController {
  constructor(private readonly partnerService: StayeaPartnerService) {}

  @Get()
  @UseEnvelope()
  @ApiOperation({ summary: "List all partner profiles with filter (Admin only)" })
  async getPartners(
    @Query("search") search?: string,
    @Query("status") status?: string,
    @Query("type") type?: string
  ) {
    return this.partnerService.getAllPartnersForAdmin({ search, status, type })
  }

  @Patch(":id/status")
  @UseEnvelope()
  @ApiOperation({ summary: "Approve, suspend or adjust partner commission rate" })
  async updatePartnerStatus(
    @Param("id") id: string,
    @Body() dto: AdminUpdatePartnerStatusDto
  ) {
    return this.partnerService.adminUpdatePartnerStatus(id, dto)
  }

  @Get("orders/queue")
  @UseEnvelope()
  @ApiOperation({ summary: "View orders in approval queue (e.g. pending_admin, sent_to_partner)" })
  async getOrders(
    @Query("status") status?: string,
    @Query("search") search?: string,
    @Query("partnerId") partnerId?: string
  ) {
    return this.partnerService.getAdminOrders({ status, search, partnerId })
  }

  @Patch("orders/:id/approve")
  @UseEnvelope()
  @ApiOperation({ summary: "Admin approves order and dispatches to partner (transitions to sent_to_partner)" })
  async approveOrder(
    @Param("id") orderId: string,
    @Body() dto: AdminApproveOrderDto
  ) {
    return this.partnerService.adminApproveOrder(orderId, dto)
  }

  @Patch("orders/:id/complete")
  @UseEnvelope()
  @ApiOperation({ summary: "Mark order as completed" })
  async completeOrder(@Param("id") orderId: string) {
    return this.partnerService.completeOrder(orderId)
  }
}
