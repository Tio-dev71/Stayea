import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { Roles } from "@/shared-kernel/infrastructure/decorators/roles.decorator"
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import {
  BookingQueryDto,
  CreateBookingDto,
  UpdateBookingStatusDto,
} from "@/modules/stayea/booking/dtos/booking.dto"
import { StayeaBookingService } from "@/modules/stayea/booking/stayea-booking.service"

@ApiTags("Stayea - Bookings")
@Controller("stayea/bookings")
@ApiBearerAuth()
export class StayeaBookingController {
  constructor(private readonly bookingService: StayeaBookingService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: "Create a new booking (stay, flight, tour, combo)" })
  async create(
    @Request() req: { user?: { id?: string } },
    @Body() dto: CreateBookingDto
  ) {
    const userId = req.user?.id || (dto.details?.contactInfo?.email
      ? `guest_${dto.details.contactInfo.email.toLowerCase().replaceAll(/[^a-z0-9]/g, '_')}`
      : `guest_${Date.now()}`)
    return this.bookingService.createBooking(userId, dto)
  }

  @Get()
  @UseEnvelope()
  @ApiOperation({ summary: "Get current user booking history" })
  async findUserBookings(
    @Request() req: { user: { id: string } },
    @Query() query: BookingQueryDto
  ) {
    return this.bookingService.findUserBookings(req.user.id, query)
  }

  @Get("admin/all")
  @Roles("ADMIN")
  @UseEnvelope()
  @ApiOperation({ summary: "Get all bookings across platform (Admin only)" })
  async findAllBookingsForAdmin(
    @Query() query: BookingQueryDto & { search?: string }
  ) {
    return this.bookingService.findAllBookingsForAdmin(query)
  }

  @Get("admin/:idOrCode")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get any booking details (Admin only)" })
  async findOneForAdmin(@Param("idOrCode") idOrCode: string) {
    return this.bookingService.findBookingByIdForAdmin(idOrCode)
  }

  @Get(":idOrCode")
  @ApiOperation({ summary: "Get booking details by ID or bookingCode" })
  async findOne(
    @Request() req: { user: { id: string } },
    @Param("idOrCode") idOrCode: string
  ) {
    return this.bookingService.findBookingById(req.user.id, idOrCode)
  }

  @Patch(":id/cancel")
  @ApiOperation({ summary: "Cancel booking by ID" })
  async cancel(
    @Request() req: { user: { id: string } },
    @Param("id") id: string
  ) {
    return this.bookingService.cancelBooking(req.user.id, id)
  }

  @Patch(":id/status")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Update booking status (Admin only)" })
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateBookingStatusDto
  ) {
    return this.bookingService.updateStatus(id, dto.status)
  }
}
