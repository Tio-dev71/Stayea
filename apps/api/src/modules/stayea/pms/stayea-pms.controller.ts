import {
  BadRequestException,
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
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import { StayeaPartnerService } from "@/modules/stayea/partner/stayea-partner.service"
import {
  CancelFolioItemDto,
  CheckInDto,
  CheckOutDto,
  CreatePmsServiceItemDto,
  CreateReservationDto,
  CreateRoomDto,
  CreateRoomTypeDto,
  PostServiceItemDto,
  RecordFolioPaymentDto,
  StockAdjustmentDto,
  TransferRoomDto,
  UpdateRoomStatusDto,
} from "@/modules/stayea/pms/dtos/pms.dto"
import { StayeaPmsService } from "@/modules/stayea/pms/stayea-pms.service"

@ApiTags("Stayea - PMS & Hotel Operations")
@Controller("stayea/pms")
export class StayeaPmsController {
  constructor(
    private readonly pmsService: StayeaPmsService,
    private readonly partnerService: StayeaPartnerService
  ) {}

  private async resolvePartnerId(
    req: any,
    queryPartnerId?: string
  ): Promise<string> {
    if (queryPartnerId && queryPartnerId.trim().length > 0) {
      return queryPartnerId.trim()
    }
    if (req?.user?.id) {
      const profile = await this.partnerService.getProfileByUserId(req.user.id)
      if (profile?.id) return profile.id
    }
    const [first] = await this.partnerService.getAllPartnersForAdmin()
    if (first?.id) return first.id

    throw new BadRequestException("Chưa xác định cơ sở lưu trú (partnerId)")
  }

  private extractStaff(req: any) {
    const staffId = req?.user?.id || "staff_reception"
    const staffName =
      req?.user?.name || req?.user?.email || "Lễ tân ca trực"
    return { staffId, staffName }
  }

  // -------------------------------------------------------------
  // 1. Room Types & Physical Rooms
  // -------------------------------------------------------------

  @Public()
  @ApiBearerAuth()
  @Get("room-types")
  @UseEnvelope()
  @ApiOperation({ summary: "Lấy danh sách hạng phòng của cơ sở" })
  async getRoomTypes(
    @Request() req: any,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    return this.pmsService.getRoomTypes(pId)
  }

  @Public()
  @ApiBearerAuth()
  @Post("room-types")
  @UseEnvelope()
  @ApiOperation({ summary: "Tạo mới hạng phòng" })
  async createRoomType(
    @Request() req: any,
    @Body() dto: CreateRoomTypeDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    return this.pmsService.createRoomType(pId, dto)
  }

  @Public()
  @ApiBearerAuth()
  @Get("rooms")
  @UseEnvelope()
  @ApiOperation({ summary: "Lấy danh sách phòng vật lý kèm trạng thái & buồng phòng" })
  async getRooms(
    @Request() req: any,
    @Query("partnerId") partnerId?: string,
    @Query("floor") floor?: string,
    @Query("status") status?: string,
    @Query("housekeepingStatus") housekeepingStatus?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    return this.pmsService.getRooms(pId, { floor, status, housekeepingStatus })
  }

  @Public()
  @ApiBearerAuth()
  @Post("rooms")
  @UseEnvelope()
  @ApiOperation({ summary: "Tạo phòng vật lý mới" })
  async createRoom(
    @Request() req: any,
    @Body() dto: CreateRoomDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    return this.pmsService.createRoom(pId, dto)
  }

  @Public()
  @ApiBearerAuth()
  @Patch("rooms/:id/status")
  @UseEnvelope()
  @ApiOperation({ summary: "Cập nhật trạng thái phòng / buồng phòng (housekeeping)" })
  async updateRoom(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: UpdateRoomStatusDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    const { staffName } = this.extractStaff(req)
    return this.pmsService.updateRoom(pId, id, dto, staffName)
  }

  // -------------------------------------------------------------
  // 2. Reservations & Front Desk
  // -------------------------------------------------------------

  @Public()
  @ApiBearerAuth()
  @Get("reservations")
  @UseEnvelope()
  @ApiOperation({ summary: "Danh sách đặt phòng / lưu trú" })
  async getReservations(
    @Request() req: any,
    @Query("partnerId") partnerId?: string,
    @Query("status") status?: string,
    @Query("date") date?: string,
    @Query("roomId") roomId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    return this.pmsService.getReservations(pId, { status, date, roomId })
  }

  @Public()
  @ApiBearerAuth()
  @Post("reservations")
  @UseEnvelope()
  @ApiOperation({ summary: "Tạo lượt đặt phòng mới (walk-in, phone, online)" })
  async createReservation(
    @Request() req: any,
    @Body() dto: CreateReservationDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    const { staffName } = this.extractStaff(req)
    return this.pmsService.createReservation(pId, dto, staffName)
  }

  @Public()
  @ApiBearerAuth()
  @Post("reservations/:id/check-in")
  @UseEnvelope()
  @ApiOperation({ summary: "Nhận phòng (Check-in), tính phí đến sớm nếu có" })
  async checkIn(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: CheckInDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    const { staffName } = this.extractStaff(req)
    return this.pmsService.checkIn(pId, id, dto, staffName)
  }

  @Public()
  @ApiBearerAuth()
  @Post("reservations/:id/check-out")
  @UseEnvelope()
  @ApiOperation({ summary: "Trả phòng (Check-out), tất toán folio, chuyển phòng bẩn" })
  async checkOut(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: CheckOutDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    const { staffName } = this.extractStaff(req)
    return this.pmsService.checkOut(pId, id, dto, staffName)
  }

  @Public()
  @ApiBearerAuth()
  @Post("reservations/:id/transfer-room")
  @UseEnvelope()
  @ApiOperation({ summary: "Đổi phòng an toàn có transaction và audit log" })
  async transferRoom(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: TransferRoomDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    const { staffName } = this.extractStaff(req)
    return this.pmsService.transferRoom(pId, id, dto, staffName)
  }

  // -------------------------------------------------------------
  // 3. Folio & Incidental Services (Minibar, Laundry, F&B)
  // -------------------------------------------------------------

  @Public()
  @ApiBearerAuth()
  @Get("reservations/:id/folio")
  @UseEnvelope()
  @ApiOperation({ summary: "Lấy chi tiết Folio (hóa đơn phòng, dịch vụ, thanh toán)" })
  async getFolio(
    @Request() req: any,
    @Param("id") reservationId: string,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    return this.pmsService.getFolio(pId, reservationId)
  }

  @Public()
  @ApiBearerAuth()
  @Post("reservations/:id/folio/items")
  @UseEnvelope()
  @ApiOperation({ summary: "Ghi nhận dịch vụ/minibar vào hóa đơn phòng (tự trừ kho)" })
  async postFolioItem(
    @Request() req: any,
    @Param("id") reservationId: string,
    @Body() dto: PostServiceItemDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    const { staffName } = this.extractStaff(req)
    return this.pmsService.postServiceItem(pId, reservationId, dto, staffName)
  }

  @Public()
  @ApiBearerAuth()
  @Post("folio-items/:id/cancel")
  @UseEnvelope()
  @ApiOperation({ summary: "Hủy mềm dòng phí có lý do, hoàn kho và lưu audit log" })
  async cancelFolioItem(
    @Request() req: any,
    @Param("id") folioItemId: string,
    @Body() dto: CancelFolioItemDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    const { staffName } = this.extractStaff(req)
    return this.pmsService.cancelFolioItem(pId, folioItemId, dto.reason, staffName)
  }

  @Public()
  @ApiBearerAuth()
  @Post("folios/:id/payments")
  @UseEnvelope()
  @ApiOperation({ summary: "Ghi nhận thanh toán tiền mặt/chuyển khoản/thẻ vào folio" })
  async recordPayment(
    @Request() req: any,
    @Param("id") folioId: string,
    @Body() dto: RecordFolioPaymentDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    const { staffName } = this.extractStaff(req)
    return this.pmsService.recordFolioPayment(pId, folioId, dto, staffName)
  }

  // -------------------------------------------------------------
  // 4. Products, Minibar & Inventory
  // -------------------------------------------------------------

  @Public()
  @ApiBearerAuth()
  @Get("service-items")
  @UseEnvelope()
  @ApiOperation({ summary: "Lấy danh mục sản phẩm/dịch vụ/minibar" })
  async getServiceItems(
    @Request() req: any,
    @Query("partnerId") partnerId?: string,
    @Query("category") category?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    return this.pmsService.getServiceItems(pId, category)
  }

  @Public()
  @ApiBearerAuth()
  @Post("service-items")
  @UseEnvelope()
  @ApiOperation({ summary: "Thêm mặt hàng dịch vụ/minibar mới vào danh mục" })
  async createServiceItem(
    @Request() req: any,
    @Body() dto: CreatePmsServiceItemDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    return this.pmsService.createServiceItem(pId, dto)
  }

  @Public()
  @ApiBearerAuth()
  @Post("inventory/adjust")
  @UseEnvelope()
  @ApiOperation({ summary: "Điều chỉnh / nhập xuất tồn kho cơ sở" })
  async adjustStock(
    @Request() req: any,
    @Body() dto: StockAdjustmentDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    const { staffName } = this.extractStaff(req)
    return this.pmsService.adjustStock(pId, dto, staffName)
  }

  @Public()
  @ApiBearerAuth()
  @Get("inventory/transactions")
  @UseEnvelope()
  @ApiOperation({ summary: "Lịch sử xuất nhập tồn kho" })
  async getInventoryTransactions(
    @Request() req: any,
    @Query("partnerId") partnerId?: string,
    @Query("itemId") itemId?: string,
    @Query("limit") limit?: number
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    return this.pmsService.getInventoryTransactions(pId, itemId, limit)
  }

  // -------------------------------------------------------------
  // 5. Operational Reports & Staff
  // -------------------------------------------------------------

  @Public()
  @ApiBearerAuth()
  @Get("reports/operational")
  @UseEnvelope()
  @ApiOperation({ summary: "Báo cáo vận hành theo thời gian thực (tỷ lệ phòng, doanh thu, kho)" })
  async getOperationalReports(
    @Request() req: any,
    @Query("partnerId") partnerId?: string,
    @Query("fromDate") fromDate?: string,
    @Query("toDate") toDate?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    return this.pmsService.getOperationalReports(pId, fromDate, toDate)
  }

  @Public()
  @ApiBearerAuth()
  @Get("staff-roles")
  @UseEnvelope()
  @ApiOperation({ summary: "Danh sách nhân viên & phân quyền PMS của cơ sở" })
  async getStaffRoles(
    @Request() req: any,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    return this.pmsService.getStaffRoles(pId)
  }

  // -------------------------------------------------------------
  // 6. Order-Linked Folio & Incidental Services
  // -------------------------------------------------------------

  @Public()
  @ApiBearerAuth()
  @Get("orders/:orderId/folio")
  @UseEnvelope()
  @ApiOperation({ summary: "Lấy chi tiết Folio (hóa đơn phòng) liên kết với Đơn hàng" })
  async getOrderFolio(
    @Request() req: any,
    @Param("orderId") orderId: string,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    return this.pmsService.getOrCreateOrderFolio(pId, orderId)
  }

  @Public()
  @ApiBearerAuth()
  @Post("orders/:orderId/folio/items")
  @UseEnvelope()
  @ApiOperation({ summary: "Ghi nhận dịch vụ/trái cây/nước uống vào đơn hàng của khách" })
  async postOrderFolioItem(
    @Request() req: any,
    @Param("orderId") orderId: string,
    @Body() dto: PostServiceItemDto,
    @Query("partnerId") partnerId?: string
  ) {
    const pId = await this.resolvePartnerId(req, partnerId)
    const { staffName } = this.extractStaff(req)
    return this.pmsService.postOrderFolioItem(pId, orderId, dto, staffName)
  }
}
