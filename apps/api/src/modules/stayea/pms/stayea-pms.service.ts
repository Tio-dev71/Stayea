import { randomUUID } from "node:crypto"
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import {
  partnerOrdersTable,
  stayeaPmsAuditLogsTable,
  stayeaPmsFolioItemsTable,
  stayeaPmsFolioPaymentsTable,
  stayeaPmsFoliosTable,
  stayeaPmsInventoryTransactionsTable,
  stayeaPmsReservationsTable,
  stayeaPmsRoomsTable,
  stayeaPmsRoomTypesTable,
  stayeaPmsServiceItemsTable,
  stayeaPmsStaffRolesTable,
} from "@workspace/database"
import { and, desc, eq, gte, inArray, lte, or, sql } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import type { DrizzleDb } from "@/app/database/db.port"
import type {
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

function generateUid(prefix: string) {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 16)}`
}

function generateCode(prefix: string) {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "")
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${dateStr}-${rand}`
}

@Injectable()
export class StayeaPmsService {
  private readonly logger = new Logger(StayeaPmsService.name)

  constructor(
    @Inject(DB_TOKEN) private readonly db: DrizzleDb,
    @Optional() private readonly eventEmitter?: EventEmitter2
  ) {}

  // -------------------------------------------------------------
  // 1. Room Types & Physical Rooms
  // -------------------------------------------------------------

  async getRoomTypes(partnerId: string) {
    return this.db
      .select()
      .from(stayeaPmsRoomTypesTable)
      .where(eq(stayeaPmsRoomTypesTable.partnerId, partnerId))
      .orderBy(stayeaPmsRoomTypesTable.name)
  }

  async createRoomType(partnerId: string, dto: CreateRoomTypeDto) {
    const id = generateUid("rt")
    const [created] = await this.db
      .insert(stayeaPmsRoomTypesTable)
      .values({
        id,
        partnerId,
        serviceId: dto.serviceId || null,
        name: dto.name,
        code: dto.code.toUpperCase(),
        basePrice: dto.basePrice.toString(),
        hourlyPrice: (dto.hourlyPrice || 0).toString(),
        maxOccupancy: dto.maxOccupancy ?? 2,
        maxAdults: dto.maxAdults ?? 2,
        maxChildren: dto.maxChildren ?? 1,
        amenities: dto.amenities || [],
        description: dto.description || null,
      })
      .returning()

    return created
  }

  async getRooms(
    partnerId: string,
    query?: { floor?: string; status?: string; housekeepingStatus?: string }
  ) {
    const conditions = [eq(stayeaPmsRoomsTable.partnerId, partnerId)]

    if (query?.floor) conditions.push(eq(stayeaPmsRoomsTable.floor, query.floor))
    if (query?.status) conditions.push(eq(stayeaPmsRoomsTable.status, query.status as any))
    if (query?.housekeepingStatus) {
      conditions.push(
        eq(stayeaPmsRoomsTable.housekeepingStatus, query.housekeepingStatus as any)
      )
    }

    const rooms = await this.db
      .select({
        room: stayeaPmsRoomsTable,
        roomType: stayeaPmsRoomTypesTable,
      })
      .from(stayeaPmsRoomsTable)
      .innerJoin(
        stayeaPmsRoomTypesTable,
        eq(stayeaPmsRoomsTable.roomTypeId, stayeaPmsRoomTypesTable.id)
      )
      .where(and(...conditions))
      .orderBy(stayeaPmsRoomsTable.floor, stayeaPmsRoomsTable.roomNumber)

    return rooms.map((r) => ({
      ...r.room,
      roomTypeName: r.roomType.name,
      roomTypeCode: r.roomType.code,
      basePrice: r.roomType.basePrice,
      maxOccupancy: r.roomType.maxOccupancy,
    }))
  }

  async createRoom(partnerId: string, dto: CreateRoomDto) {
    // Check duplicate room number in property
    const existing = await this.db
      .select({ id: stayeaPmsRoomsTable.id })
      .from(stayeaPmsRoomsTable)
      .where(
        and(
          eq(stayeaPmsRoomsTable.partnerId, partnerId),
          eq(stayeaPmsRoomsTable.roomNumber, dto.roomNumber)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      throw new ConflictException(`Phòng số ${dto.roomNumber} đã tồn tại trong cơ sở này`)
    }

    const id = generateUid("rm")
    const [created] = await this.db
      .insert(stayeaPmsRoomsTable)
      .values({
        id,
        partnerId,
        roomTypeId: dto.roomTypeId,
        roomNumber: dto.roomNumber,
        floor: dto.floor || "1",
        status: dto.status || "vacant_clean",
        housekeepingStatus: "clean",
        note: dto.note || null,
      })
      .returning()

    return created
  }

  async updateRoom(
    partnerId: string,
    roomId: string,
    dto: UpdateRoomStatusDto,
    staffName: string
  ) {
    const [room] = await this.db
      .select()
      .from(stayeaPmsRoomsTable)
      .where(
        and(eq(stayeaPmsRoomsTable.id, roomId), eq(stayeaPmsRoomsTable.partnerId, partnerId))
      )
      .limit(1)

    if (!room) throw new NotFoundException(`Không tìm thấy phòng #${roomId}`)

    const updateData: Partial<typeof stayeaPmsRoomsTable.$inferInsert> = {}

    if (dto.status) updateData.status = dto.status
    if (dto.housekeepingStatus) {
      updateData.housekeepingStatus = dto.housekeepingStatus
      updateData.housekeepingUpdatedAt = new Date()
      if (dto.housekeepingAssignedTo) {
        updateData.housekeepingAssignedTo = dto.housekeepingAssignedTo
      }
      // If room is cleaned, change to vacant_clean if vacant_dirty
      if (dto.housekeepingStatus === "clean" && room.status === "vacant_dirty") {
        updateData.status = "vacant_clean"
      }
    }
    if (dto.note !== undefined) updateData.note = dto.note

    const [updated] = await this.db
      .update(stayeaPmsRoomsTable)
      .set(updateData)
      .where(eq(stayeaPmsRoomsTable.id, roomId))
      .returning()

    this.logger.log(`Room #${roomId} updated by ${staffName}`)

    await this.db.insert(stayeaPmsAuditLogsTable).values({
      id: generateUid("audit"),
      partnerId,
      action: "update_room_status",
      entityType: "room",
      entityId: roomId,
      oldValues: { status: room.status, housekeepingStatus: room.housekeepingStatus },
      newValues: updateData as Record<string, unknown>,
      reason: dto.note || "Cập nhật trạng thái phòng",
      performedBy: staffName,
    })

    if (this.eventEmitter && updated) {
      this.eventEmitter.emit("stayea.pms.room.updated", {
        partnerId,
        roomId: updated.id,
        roomNumber: updated.roomNumber,
        status: updated.status,
        housekeepingStatus: updated.housekeepingStatus,
      })
    }

    return updated
  }

  // -------------------------------------------------------------
  // 2. Reservations & Front Desk Operations
  // -------------------------------------------------------------

  async getReservations(
    partnerId: string,
    query?: { status?: string; date?: string; roomId?: string }
  ) {
    const conditions = [eq(stayeaPmsReservationsTable.partnerId, partnerId)]

    if (query?.status) {
      conditions.push(eq(stayeaPmsReservationsTable.status, query.status as any))
    }
    if (query?.roomId) {
      conditions.push(eq(stayeaPmsReservationsTable.roomId, query.roomId))
    }

    const reservations = await this.db
      .select({
        reservation: stayeaPmsReservationsTable,
        room: stayeaPmsRoomsTable,
        roomType: stayeaPmsRoomTypesTable,
        folio: stayeaPmsFoliosTable,
      })
      .from(stayeaPmsReservationsTable)
      .leftJoin(
        stayeaPmsRoomsTable,
        eq(stayeaPmsReservationsTable.roomId, stayeaPmsRoomsTable.id)
      )
      .innerJoin(
        stayeaPmsRoomTypesTable,
        eq(stayeaPmsReservationsTable.roomTypeId, stayeaPmsRoomTypesTable.id)
      )
      .leftJoin(
        stayeaPmsFoliosTable,
        eq(stayeaPmsReservationsTable.id, stayeaPmsFoliosTable.reservationId)
      )
      .where(and(...conditions))
      .orderBy(desc(stayeaPmsReservationsTable.createdAt))

    return reservations.map((r) => ({
      ...r.reservation,
      roomNumber: r.room?.roomNumber,
      roomTypeName: r.roomType.name,
      folioId: r.folio?.id,
      folioTotal: r.folio?.totalAmount,
      folioPaid: r.folio?.paidAmount,
      folioRemaining: r.folio?.remainingBalance,
    }))
  }

  /**
   * Safe transaction: Create reservation with overlap & concurrency checking
   */
  async createReservation(
    partnerId: string,
    dto: CreateReservationDto,
    staffName: string
  ) {
    const checkInDate = new Date(dto.expectedCheckIn)
    const checkOutDate = new Date(dto.expectedCheckOut)

    if (checkOutDate <= checkInDate) {
      throw new BadRequestException("Ngày trả phòng phải sau ngày nhận phòng")
    }

    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
    const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

    // If a physical room is specified, verify no overlapping active reservations
    if (dto.roomId) {
      const [targetRoom] = await this.db
        .select()
        .from(stayeaPmsRoomsTable)
        .where(
          and(
            eq(stayeaPmsRoomsTable.id, dto.roomId),
            eq(stayeaPmsRoomsTable.partnerId, partnerId)
          )
        )
        .limit(1)

      if (!targetRoom) {
        throw new NotFoundException(`Không tìm thấy phòng #${dto.roomId}`)
      }

      if (dto.isCheckInImmediately && targetRoom.status === "occupied") {
        throw new ConflictException(`Phòng ${targetRoom.roomNumber} đang có khách lưu trú`)
      }

      // Check conflict overlap
      const [conflictRes] = await this.db
        .select({ id: stayeaPmsReservationsTable.id, code: stayeaPmsReservationsTable.reservationCode })
        .from(stayeaPmsReservationsTable)
        .where(
          and(
            eq(stayeaPmsReservationsTable.partnerId, partnerId),
            eq(stayeaPmsReservationsTable.roomId, dto.roomId),
            inArray(stayeaPmsReservationsTable.status, ["confirmed", "checked_in"]),
            // (StartA <= EndB) and (EndA >= StartB)
            lte(stayeaPmsReservationsTable.expectedCheckIn, checkOutDate),
            gte(stayeaPmsReservationsTable.expectedCheckOut, checkInDate)
          )
        )
        .limit(1)

      if (conflictRes) {
        throw new ConflictException(
          `Phòng ${targetRoom.roomNumber} đã có lịch đặt trùng (${conflictRes.code}) trong khoảng thời gian này`
        )
      }
    }

    const reservationId = generateUid("res")
    const reservationCode = generateCode("RES")
    const isImmediateCheckIn = Boolean(dto.isCheckInImmediately && dto.roomId)
    const resStatus = isImmediateCheckIn ? "checked_in" : "confirmed"
    const actualCheckIn = isImmediateCheckIn ? new Date() : null

    const totalRoomCharges = dto.roomRate * totalNights
    const deposit = Number(dto.depositAmount || 0)
    const remainingBalance = Math.max(0, totalRoomCharges - deposit)
    const paymentStatus =
      deposit >= totalRoomCharges ? "paid" : deposit > 0 ? "partial" : "unpaid"

    // Execute within transaction
    const result = await this.db.transaction(async (tx) => {
      // 1. Insert reservation
      const [newRes] = await tx
        .insert(stayeaPmsReservationsTable)
        .values({
          id: reservationId,
          reservationCode,
          partnerId,
          roomId: dto.roomId || null,
          roomTypeId: dto.roomTypeId,
          bookingId: dto.bookingId || null,
          channel: dto.channel || "direct_walkin",
          guestName: dto.guestName,
          guestPhone: dto.guestPhone,
          guestEmail: dto.guestEmail || null,
          guestIdNumber: dto.guestIdNumber || null,
          guestCount: dto.guestCount || 1,
          adultsCount: dto.adultsCount || 1,
          childrenCount: dto.childrenCount || 0,
          expectedCheckIn: checkInDate,
          expectedCheckOut: checkOutDate,
          actualCheckIn,
          roomRate: dto.roomRate.toString(),
          totalNights,
          status: resStatus,
          depositAmount: deposit.toString(),
          paymentStatus,
          specialRequests: dto.specialRequests || null,
          internalNotes: dto.internalNotes || null,
          createdBy: staffName,
        })
        .returning()

      // 2. If immediate check-in, update room status to 'occupied'
      if (isImmediateCheckIn && dto.roomId) {
        await tx
          .update(stayeaPmsRoomsTable)
          .set({ status: "occupied" })
          .where(eq(stayeaPmsRoomsTable.id, dto.roomId))
      } else if (dto.roomId) {
        await tx
          .update(stayeaPmsRoomsTable)
          .set({ status: "reserved" })
          .where(eq(stayeaPmsRoomsTable.id, dto.roomId))
      }

      // 3. Create Folio
      const folioId = generateUid("fol")
      const folioNumber = generateCode("FOL")
      const [newFolio] = await tx
        .insert(stayeaPmsFoliosTable)
        .values({
          id: folioId,
          partnerId,
          reservationId,
          folioNumber,
          roomCharges: totalRoomCharges.toString(),
          serviceCharges: "0",
          surcharges: "0",
          discountAmount: "0",
          totalAmount: totalRoomCharges.toString(),
          paidAmount: deposit.toString(),
          remainingBalance: remainingBalance.toString(),
          status: "open",
        })
        .returning()

      // 4. Create base room charge line in folio
      await tx.insert(stayeaPmsFolioItemsTable).values({
        id: generateUid("fi"),
        partnerId,
        folioId,
        itemType: "room_charge",
        description: `Tiền phòng (${totalNights} đêm × ${dto.roomRate.toLocaleString("vi-VN")} ₫)`,
        quantity: totalNights.toString(),
        unitPrice: dto.roomRate.toString(),
        amount: totalRoomCharges.toString(),
        recordedBy: staffName,
      })

      // 5. If deposit paid, create folio payment record
      if (deposit > 0) {
        await tx.insert(stayeaPmsFolioPaymentsTable).values({
          id: generateUid("fp"),
          partnerId,
          folioId,
          paymentMethod: dto.depositPaymentMethod || "cash",
          amount: deposit.toString(),
          isDeposit: true,
          note: "Tiền đặt cọc khi tạo đặt phòng",
          recordedBy: staffName,
        })
      }

      return { reservation: newRes, folio: newFolio }
    })

    if (this.eventEmitter && result?.reservation) {
      this.eventEmitter.emit("stayea.pms.reservation.created", {
        partnerId,
        reservationId: result.reservation.id,
        reservationCode: result.reservation.reservationCode,
        guestName: result.reservation.guestName,
        roomId: result.reservation.roomId,
        status: result.reservation.status,
      })
    }

    return result
  }

  /**
   * Check-in guest to room
   */
  async checkIn(
    partnerId: string,
    reservationId: string,
    dto: CheckInDto,
    staffName: string
  ) {
    const [res] = await this.db
      .select()
      .from(stayeaPmsReservationsTable)
      .where(
        and(
          eq(stayeaPmsReservationsTable.id, reservationId),
          eq(stayeaPmsReservationsTable.partnerId, partnerId)
        )
      )
      .limit(1)

    if (!res) throw new NotFoundException(`Không tìm thấy lượt đặt #${reservationId}`)

    if (res.status === "checked_in") {
      throw new BadRequestException("Khách đã nhận phòng trước đó")
    }
    if (res.status === "checked_out" || res.status === "cancelled") {
      throw new BadRequestException("Lượt đặt phòng này đã kết thúc hoặc bị hủy")
    }

    const roomId = dto.roomId || res.roomId
    if (!roomId) {
      throw new BadRequestException("Vui lòng chọn phòng vật lý để tiến hành nhận phòng")
    }

    const result = await this.db.transaction(async (tx) => {
      // 1. Verify target room is ready
      const [room] = await tx
        .select()
        .from(stayeaPmsRoomsTable)
        .where(
          and(
            eq(stayeaPmsRoomsTable.id, roomId),
            eq(stayeaPmsRoomsTable.partnerId, partnerId)
          )
        )
        .limit(1)

      if (!room) throw new NotFoundException(`Không tìm thấy phòng`)
      if (room.status === "occupied") {
        throw new ConflictException(`Phòng ${room.roomNumber} hiện đang có khách ở`)
      }

      // 2. Update room to occupied
      await tx
        .update(stayeaPmsRoomsTable)
        .set({ status: "occupied" })
        .where(eq(stayeaPmsRoomsTable.id, roomId))

      // 3. Update reservation
      const earlyFee = Number(dto.earlyCheckinFee || 0)
      const [updatedRes] = await tx
        .update(stayeaPmsReservationsTable)
        .set({
          roomId,
          status: "checked_in",
          actualCheckIn: new Date(),
          guestIdNumber: dto.guestIdNumber || res.guestIdNumber,
          earlyCheckinFee: (Number(res.earlyCheckinFee) + earlyFee).toString(),
        })
        .where(eq(stayeaPmsReservationsTable.id, reservationId))
        .returning()

      // 4. Update Folio if early checkin fee or deposit
      const [folio] = await tx
        .select()
        .from(stayeaPmsFoliosTable)
        .where(eq(stayeaPmsFoliosTable.reservationId, reservationId))
        .limit(1)

      if (folio && earlyFee > 0) {
        await tx.insert(stayeaPmsFolioItemsTable).values({
          id: generateUid("fi"),
          partnerId,
          folioId: folio.id,
          itemType: "surcharge",
          description: "Phụ thu nhận phòng sớm (Early Check-in)",
          quantity: "1",
          unitPrice: earlyFee.toString(),
          amount: earlyFee.toString(),
          recordedBy: staffName,
        })

        const newSurcharges = Number(folio.surcharges) + earlyFee
        const newTotal = Number(folio.totalAmount) + earlyFee
        const newRemaining = Number(folio.remainingBalance) + earlyFee

        await tx
          .update(stayeaPmsFoliosTable)
          .set({
            surcharges: newSurcharges.toString(),
            totalAmount: newTotal.toString(),
            remainingBalance: newRemaining.toString(),
          })
          .where(eq(stayeaPmsFoliosTable.id, folio.id))
      }

      // Record additional deposit/payment at check-in
      if (folio && dto.depositAmount && dto.depositAmount > 0) {
        const dep = dto.depositAmount
        await tx.insert(stayeaPmsFolioPaymentsTable).values({
          id: generateUid("fp"),
          partnerId,
          folioId: folio.id,
          paymentMethod: dto.paymentMethod || "cash",
          amount: dep.toString(),
          isDeposit: true,
          note: "Đặt cọc tại quầy khi nhận phòng",
          recordedBy: staffName,
        })

        const [currentFolio] = await tx
          .select()
          .from(stayeaPmsFoliosTable)
          .where(eq(stayeaPmsFoliosTable.id, folio.id))
          .limit(1)

        const prevPaid = Number(currentFolio?.paidAmount || 0)
        const prevTotal = Number(currentFolio?.totalAmount || 0)
        const updatedPaid = prevPaid + dep
        const updatedRem = Math.max(0, prevTotal - updatedPaid)

        await tx
          .update(stayeaPmsFoliosTable)
          .set({
            paidAmount: updatedPaid.toString(),
            remainingBalance: updatedRem.toString(),
          })
          .where(eq(stayeaPmsFoliosTable.id, folio.id))
      }

      return updatedRes
    })

    if (this.eventEmitter && result) {
      this.eventEmitter.emit("stayea.pms.reservation.updated", {
        partnerId,
        reservationId: result.id,
        roomId: result.roomId,
        status: result.status,
      })
      if (result.roomId) {
        this.eventEmitter.emit("stayea.pms.room.updated", {
          partnerId,
          roomId: result.roomId,
          status: "occupied",
        })
      }
    }

    return result
  }

  /**
   * Check-out guest, settle folio and transition room to 'vacant_dirty'
   */
  async checkOut(
    partnerId: string,
    reservationId: string,
    dto: CheckOutDto,
    staffName: string
  ) {
    const [res] = await this.db
      .select()
      .from(stayeaPmsReservationsTable)
      .where(
        and(
          eq(stayeaPmsReservationsTable.id, reservationId),
          eq(stayeaPmsReservationsTable.partnerId, partnerId)
        )
      )
      .limit(1)

    if (!res) throw new NotFoundException(`Không tìm thấy lượt đặt #${reservationId}`)
    if (res.status !== "checked_in") {
      throw new BadRequestException("Chỉ có thể trả phòng cho lượt lưu trú đang ở")
    }

    const [folio] = await this.db
      .select()
      .from(stayeaPmsFoliosTable)
      .where(eq(stayeaPmsFoliosTable.reservationId, reservationId))
      .limit(1)

    if (!folio) throw new NotFoundException("Không tìm thấy hồ sơ thanh toán (folio)")

    const result = await this.db.transaction(async (tx) => {
      let currentTotal = Number(folio.totalAmount)
      let currentPaid = Number(folio.paidAmount)
      let lateFee = Number(dto.lateCheckoutFee || 0)
      let discount = Number(dto.discountAmount || 0)

      // Add late checkout fee
      if (lateFee > 0) {
        await tx.insert(stayeaPmsFolioItemsTable).values({
          id: generateUid("fi"),
          partnerId,
          folioId: folio.id,
          itemType: "surcharge",
          description: "Phụ thu trả phòng trễ (Late Check-out)",
          quantity: "1",
          unitPrice: lateFee.toString(),
          amount: lateFee.toString(),
          recordedBy: staffName,
        })
        currentTotal += lateFee
      }

      // Add discount if any
      if (discount > 0) {
        await tx.insert(stayeaPmsFolioItemsTable).values({
          id: generateUid("fi"),
          partnerId,
          folioId: folio.id,
          itemType: "discount",
          description: "Giảm giá / Ưu đãi khi trả phòng",
          quantity: "1",
          unitPrice: (-discount).toString(),
          amount: (-discount).toString(),
          recordedBy: staffName,
        })
        currentTotal -= discount
      }

      // Settle balance payment
      const remainingBeforePayment = Math.max(0, currentTotal - currentPaid)
      const payAmount =
        dto.paymentAmount !== undefined ? dto.paymentAmount : remainingBeforePayment

      if (payAmount > 0) {
        await tx.insert(stayeaPmsFolioPaymentsTable).values({
          id: generateUid("fp"),
          partnerId,
          folioId: folio.id,
          paymentMethod: dto.paymentMethod || "cash",
          amount: payAmount.toString(),
          isDeposit: false,
          note: dto.note || "Thanh toán quyết toán khi trả phòng",
          recordedBy: staffName,
        })
        currentPaid += payAmount
      }

      const finalRemaining = Math.max(0, currentTotal - currentPaid)

      // 1. Close folio
      await tx
        .update(stayeaPmsFoliosTable)
        .set({
          surcharges: (Number(folio.surcharges) + lateFee).toString(),
          discountAmount: (Number(folio.discountAmount) + discount).toString(),
          totalAmount: currentTotal.toString(),
          paidAmount: currentPaid.toString(),
          remainingBalance: finalRemaining.toString(),
          status: "closed",
          closedAt: new Date(),
          closedBy: staffName,
        })
        .where(eq(stayeaPmsFoliosTable.id, folio.id))

      // 2. Update reservation
      const [updatedRes] = await tx
        .update(stayeaPmsReservationsTable)
        .set({
          status: "checked_out",
          actualCheckOut: new Date(),
          paymentStatus: finalRemaining <= 0 ? "paid" : "partial",
          lateCheckoutFee: (Number(res.lateCheckoutFee) + lateFee).toString(),
          discountAmount: (Number(res.discountAmount) + discount).toString(),
        })
        .where(eq(stayeaPmsReservationsTable.id, reservationId))
        .returning()

      // 3. Mark room as vacant_dirty
      if (res.roomId) {
        await tx
          .update(stayeaPmsRoomsTable)
          .set({
            status: "vacant_dirty",
            housekeepingStatus: "dirty",
            housekeepingUpdatedAt: new Date(),
          })
          .where(eq(stayeaPmsRoomsTable.id, res.roomId))
      }

      return { reservation: updatedRes, folioTotal: currentTotal, finalRemaining }
    })

    if (this.eventEmitter && result?.reservation) {
      this.eventEmitter.emit("stayea.pms.reservation.updated", {
        partnerId,
        reservationId: result.reservation.id,
        roomId: result.reservation.roomId,
        status: "checked_out",
      })
      if (res.roomId) {
        this.eventEmitter.emit("stayea.pms.room.updated", {
          partnerId,
          roomId: res.roomId,
          status: "vacant_dirty",
          housekeepingStatus: "dirty",
        })
      }
      this.eventEmitter.emit("stayea.pms.folio.updated", {
        partnerId,
        reservationId,
      })
    }

    return result
  }

  /**
   * Room transfer (chuyển phòng) with audit log
   */
  async transferRoom(
    partnerId: string,
    reservationId: string,
    dto: TransferRoomDto,
    staffName: string
  ) {
    const [res] = await this.db
      .select()
      .from(stayeaPmsReservationsTable)
      .where(
        and(
          eq(stayeaPmsReservationsTable.id, reservationId),
          eq(stayeaPmsReservationsTable.partnerId, partnerId)
        )
      )
      .limit(1)

    if (!res) throw new NotFoundException(`Không tìm thấy lượt đặt #${reservationId}`)
    if (res.status !== "checked_in") {
      throw new BadRequestException("Chỉ có thể chuyển phòng cho khách đang lưu trú")
    }

    const [targetRoom] = await this.db
      .select()
      .from(stayeaPmsRoomsTable)
      .where(
        and(
          eq(stayeaPmsRoomsTable.id, dto.targetRoomId),
          eq(stayeaPmsRoomsTable.partnerId, partnerId)
        )
      )
      .limit(1)

    if (!targetRoom) throw new NotFoundException("Phòng chuyển đến không tồn tại")
    if (targetRoom.status === "occupied") {
      throw new ConflictException(`Phòng ${targetRoom.roomNumber} hiện đang có khách`)
    }

    const oldRoomId = res.roomId

    const result = await this.db.transaction(async (tx) => {
      // 1. Old room becomes vacant_dirty
      if (oldRoomId) {
        await tx
          .update(stayeaPmsRoomsTable)
          .set({ status: "vacant_dirty", housekeepingStatus: "dirty" })
          .where(eq(stayeaPmsRoomsTable.id, oldRoomId))
      }

      // 2. Target room becomes occupied
      await tx
        .update(stayeaPmsRoomsTable)
        .set({ status: "occupied" })
        .where(eq(stayeaPmsRoomsTable.id, dto.targetRoomId))

      // 3. Update reservation
      const [updatedRes] = await tx
        .update(stayeaPmsReservationsTable)
        .set({ roomId: dto.targetRoomId })
        .where(eq(stayeaPmsReservationsTable.id, reservationId))
        .returning()

      // 4. Audit log
      await tx.insert(stayeaPmsAuditLogsTable).values({
        id: generateUid("audit"),
        partnerId,
        action: "room_transfer",
        entityType: "reservation",
        entityId: reservationId,
        oldValues: { roomId: oldRoomId },
        newValues: { roomId: dto.targetRoomId, roomNumber: targetRoom.roomNumber },
        reason: dto.reason,
        performedBy: staffName,
      })

      return updatedRes
    })

    if (this.eventEmitter && result) {
      this.eventEmitter.emit("stayea.pms.reservation.updated", {
        partnerId,
        reservationId: result.id,
        roomId: result.roomId,
        status: result.status,
      })
      this.eventEmitter.emit("stayea.pms.room.updated", {
        partnerId,
        roomId: oldRoomId,
        status: "vacant_dirty",
      })
      this.eventEmitter.emit("stayea.pms.room.updated", {
        partnerId,
        roomId: dto.targetRoomId,
        status: "occupied",
      })
    }

    return result
  }

  // -------------------------------------------------------------
  // 3. Folio & Extra Services / Minibar
  // -------------------------------------------------------------

  async getFolio(partnerId: string, reservationId: string) {
    const [folio] = await this.db
      .select()
      .from(stayeaPmsFoliosTable)
      .where(
        and(
          eq(stayeaPmsFoliosTable.reservationId, reservationId),
          eq(stayeaPmsFoliosTable.partnerId, partnerId)
        )
      )
      .limit(1)

    if (!folio) throw new NotFoundException("Không tìm thấy hóa đơn cho lượt đặt này")

    const items = await this.db
      .select()
      .from(stayeaPmsFolioItemsTable)
      .where(eq(stayeaPmsFolioItemsTable.folioId, folio.id))
      .orderBy(stayeaPmsFolioItemsTable.recordedAt)

    const payments = await this.db
      .select()
      .from(stayeaPmsFolioPaymentsTable)
      .where(eq(stayeaPmsFolioPaymentsTable.folioId, folio.id))
      .orderBy(stayeaPmsFolioPaymentsTable.recordedAt)

    const [reservation] = await this.db
      .select({
        res: stayeaPmsReservationsTable,
        room: stayeaPmsRoomsTable,
        roomType: stayeaPmsRoomTypesTable,
      })
      .from(stayeaPmsReservationsTable)
      .leftJoin(
        stayeaPmsRoomsTable,
        eq(stayeaPmsReservationsTable.roomId, stayeaPmsRoomsTable.id)
      )
      .innerJoin(
        stayeaPmsRoomTypesTable,
        eq(stayeaPmsReservationsTable.roomTypeId, stayeaPmsRoomTypesTable.id)
      )
      .where(eq(stayeaPmsReservationsTable.id, reservationId))
      .limit(1)

    if (!reservation) {
      throw new NotFoundException(`Không tìm thấy thông tin đặt phòng #${reservationId}`)
    }

    return {
      folio,
      items,
      payments,
      reservation: {
        ...reservation.res,
        roomNumber: reservation.room?.roomNumber,
        roomTypeName: reservation.roomType.name,
      },
    }
  }

  /**
   * Post service or minibar item to room folio & automatically deduct inventory
   */
  async postServiceItem(
    partnerId: string,
    reservationId: string,
    dto: PostServiceItemDto,
    staffName: string
  ) {
    const [folio] = await this.db
      .select()
      .from(stayeaPmsFoliosTable)
      .where(
        and(
          eq(stayeaPmsFoliosTable.reservationId, reservationId),
          eq(stayeaPmsFoliosTable.partnerId, partnerId)
        )
      )
      .limit(1)

    if (!folio) throw new NotFoundException("Không tìm thấy hóa đơn")
    if (folio.status === "closed") {
      throw new BadRequestException("Hóa đơn đã đóng trả phòng. Không thể thêm khoản phí mới.")
    }

    const itemAmount = dto.quantity * dto.unitPrice

    const result = await this.db.transaction(async (tx) => {
      // 1. Insert folio item
      const itemId = generateUid("fi")
      const [item] = await tx
        .insert(stayeaPmsFolioItemsTable)
        .values({
          id: itemId,
          partnerId,
          folioId: folio.id,
          itemType: dto.itemType,
          serviceItemId: dto.serviceItemId || null,
          description: dto.description,
          quantity: dto.quantity.toString(),
          unitPrice: dto.unitPrice.toString(),
          amount: itemAmount.toString(),
          recordedBy: staffName,
          note: dto.note || null,
        })
        .returning()

      // 2. If item is tied to an inventory product, deduct stock
      if (dto.serviceItemId) {
        const [invItem] = await tx
          .select()
          .from(stayeaPmsServiceItemsTable)
          .where(
            and(
              eq(stayeaPmsServiceItemsTable.id, dto.serviceItemId),
              eq(stayeaPmsServiceItemsTable.partnerId, partnerId)
            )
          )
          .limit(1)

        if (invItem && invItem.trackInventory) {
          const qtyInt = Math.ceil(dto.quantity)
          const prev = invItem.currentStock
          const next = prev - qtyInt

          await tx
            .update(stayeaPmsServiceItemsTable)
            .set({ currentStock: next })
            .where(eq(stayeaPmsServiceItemsTable.id, dto.serviceItemId))

          await tx.insert(stayeaPmsInventoryTransactionsTable).values({
            id: generateUid("itx"),
            partnerId,
            itemId: dto.serviceItemId,
            transactionType: "out_sale",
            quantity: -qtyInt,
            unitCost: invItem.costPrice,
            previousStock: prev,
            newStock: next,
            referenceFolioId: folio.id,
            reason: `Bán minibar cho phòng (Folio #${folio.folioNumber})`,
            performedBy: staffName,
          })
        }
      }

      // 3. Recalculate Folio
      const newServiceCharges = Number(folio.serviceCharges) + itemAmount
      const newTotal = Number(folio.totalAmount) + itemAmount
      const newRemaining = Number(folio.remainingBalance) + itemAmount

      const [updatedFolio] = await tx
        .update(stayeaPmsFoliosTable)
        .set({
          serviceCharges: newServiceCharges.toString(),
          totalAmount: newTotal.toString(),
          remainingBalance: newRemaining.toString(),
        })
        .where(eq(stayeaPmsFoliosTable.id, folio.id))
        .returning()

      return { item, folio: updatedFolio }
    })

    if (this.eventEmitter && result?.folio) {
      this.eventEmitter.emit("stayea.pms.folio.updated", {
        partnerId,
        reservationId,
        folioId: result.folio.id,
      })
      if (dto.serviceItemId) {
        this.eventEmitter.emit("stayea.pms.stock.updated", {
          partnerId,
          itemId: dto.serviceItemId,
        })
      }
    }

    return result
  }

  /**
   * Cancel / void a folio item with reason and audit log (never hard delete)
   */
  async cancelFolioItem(
    partnerId: string,
    folioItemId: string,
    reason: string,
    staffName: string
  ) {
    const [item] = await this.db
      .select()
      .from(stayeaPmsFolioItemsTable)
      .where(
        and(
          eq(stayeaPmsFolioItemsTable.id, folioItemId),
          eq(stayeaPmsFolioItemsTable.partnerId, partnerId)
        )
      )
      .limit(1)

    if (!item) throw new NotFoundException("Không tìm thấy dòng phí")
    if (item.isCancelled) throw new BadRequestException("Dòng phí này đã được hủy trước đó")

    const [folio] = await this.db
      .select()
      .from(stayeaPmsFoliosTable)
      .where(eq(stayeaPmsFoliosTable.id, item.folioId))
      .limit(1)

    if (!folio) throw new NotFoundException("Không tìm thấy hóa đơn")
    if (folio.status === "closed") {
      throw new BadRequestException("Hóa đơn đã đóng. Không thể hủy dòng phí.")
    }

    const cancelAmount = Number(item.amount)

    const result = await this.db.transaction(async (tx) => {
      // 1. Mark item cancelled
      const [cancelledItem] = await tx
        .update(stayeaPmsFolioItemsTable)
        .set({
          isCancelled: true,
          cancellationReason: reason,
          cancelledBy: staffName,
          cancelledAt: new Date(),
        })
        .where(eq(stayeaPmsFolioItemsTable.id, folioItemId))
        .returning()

      // 2. Restore inventory if applicable
      if (item.serviceItemId) {
        const [invItem] = await tx
          .select()
          .from(stayeaPmsServiceItemsTable)
          .where(eq(stayeaPmsServiceItemsTable.id, item.serviceItemId))
          .limit(1)

        if (invItem && invItem.trackInventory) {
          const qtyInt = Math.ceil(Number(item.quantity))
          const prev = invItem.currentStock
          const next = prev + qtyInt

          await tx
            .update(stayeaPmsServiceItemsTable)
            .set({ currentStock: next })
            .where(eq(stayeaPmsServiceItemsTable.id, item.serviceItemId))

          await tx.insert(stayeaPmsInventoryTransactionsTable).values({
            id: generateUid("itx"),
            partnerId,
            itemId: item.serviceItemId,
            transactionType: "adjustment",
            quantity: qtyInt,
            unitCost: invItem.costPrice,
            previousStock: prev,
            newStock: next,
            referenceFolioId: folio.id,
            reason: `Hoàn kho do hủy dòng phí: ${reason}`,
            performedBy: staffName,
          })
        }
      }

      // 3. Recalculate Folio
      const newServiceCharges = Math.max(0, Number(folio.serviceCharges) - cancelAmount)
      const newTotal = Math.max(0, Number(folio.totalAmount) - cancelAmount)
      const newRemaining = Math.max(0, Number(folio.remainingBalance) - cancelAmount)

      const [updatedFolio] = await tx
        .update(stayeaPmsFoliosTable)
        .set({
          serviceCharges: newServiceCharges.toString(),
          totalAmount: newTotal.toString(),
          remainingBalance: newRemaining.toString(),
        })
        .where(eq(stayeaPmsFoliosTable.id, folio.id))
        .returning()

      // 4. Record audit log
      await tx.insert(stayeaPmsAuditLogsTable).values({
        id: generateUid("audit"),
        partnerId,
        action: "cancel_folio_item",
        entityType: "folio_item",
        entityId: folioItemId,
        oldValues: { amount: item.amount, description: item.description },
        newValues: { isCancelled: true },
        reason,
        performedBy: staffName,
      })

      return { cancelledItem, folio: updatedFolio }
    })

    if (this.eventEmitter && result?.folio) {
      this.eventEmitter.emit("stayea.pms.folio.updated", {
        partnerId,
        folioId: result.folio.id,
      })
      if (item.serviceItemId) {
        this.eventEmitter.emit("stayea.pms.stock.updated", {
          partnerId,
          itemId: item.serviceItemId,
        })
      }
    }

    return result
  }

  /**
   * Record standalone payment towards a folio
   */
  async recordFolioPayment(
    partnerId: string,
    folioId: string,
    dto: RecordFolioPaymentDto,
    staffName: string
  ) {
    const [folio] = await this.db
      .select()
      .from(stayeaPmsFoliosTable)
      .where(
        and(
          eq(stayeaPmsFoliosTable.id, folioId),
          eq(stayeaPmsFoliosTable.partnerId, partnerId)
        )
      )
      .limit(1)

    if (!folio) throw new NotFoundException("Không tìm thấy hóa đơn")

    const result = await this.db.transaction(async (tx) => {
      const payId = generateUid("fp")
      const [payment] = await tx
        .insert(stayeaPmsFolioPaymentsTable)
        .values({
          id: payId,
          partnerId,
          folioId,
          paymentMethod: dto.paymentMethod,
          amount: dto.amount.toString(),
          isDeposit: dto.isDeposit || false,
          referenceCode: dto.referenceCode || null,
          note: dto.note || null,
          recordedBy: staffName,
        })
        .returning()

      const newPaid = Number(folio.paidAmount) + dto.amount
      const newRemaining = Math.max(0, Number(folio.totalAmount) - newPaid)

      const [updatedFolio] = await tx
        .update(stayeaPmsFoliosTable)
        .set({
          paidAmount: newPaid.toString(),
          remainingBalance: newRemaining.toString(),
        })
        .where(eq(stayeaPmsFoliosTable.id, folioId))
        .returning()

      return { payment, folio: updatedFolio }
    })

    if (this.eventEmitter && result?.folio) {
      this.eventEmitter.emit("stayea.pms.folio.updated", {
        partnerId,
        folioId: result.folio.id,
      })
    }

    return result
  }

  // -------------------------------------------------------------
  // 4. Products, Minibar & Inventory Management
  // -------------------------------------------------------------

  async getServiceItems(partnerId: string, category?: string) {
    const conditions = [
      eq(stayeaPmsServiceItemsTable.partnerId, partnerId),
      eq(stayeaPmsServiceItemsTable.status, "active"),
    ]

    if (category) {
      conditions.push(eq(stayeaPmsServiceItemsTable.category, category as any))
    }

    return this.db
      .select()
      .from(stayeaPmsServiceItemsTable)
      .where(and(...conditions))
      .orderBy(stayeaPmsServiceItemsTable.category, stayeaPmsServiceItemsTable.name)
  }

  async createServiceItem(partnerId: string, dto: CreatePmsServiceItemDto) {
    const id = generateUid("psi")
    const [created] = await this.db
      .insert(stayeaPmsServiceItemsTable)
      .values({
        id,
        partnerId,
        category: dto.category,
        name: dto.name,
        code: dto.code.toUpperCase(),
        unit: dto.unit,
        sellingPrice: dto.sellingPrice.toString(),
        costPrice: (dto.costPrice || 0).toString(),
        trackInventory: dto.trackInventory ?? true,
        currentStock: dto.currentStock || 0,
        minStockAlert: dto.minStockAlert || 5,
        status: "active",
      })
      .returning()

    return created
  }

  /**
   * Adjust inventory stock (Nhập kho, Kiểm kê, Xuất hủy)
   */
  async adjustStock(
    partnerId: string,
    dto: StockAdjustmentDto,
    staffName: string
  ) {
    const [item] = await this.db
      .select()
      .from(stayeaPmsServiceItemsTable)
      .where(
        and(
          eq(stayeaPmsServiceItemsTable.id, dto.itemId),
          eq(stayeaPmsServiceItemsTable.partnerId, partnerId)
        )
      )
      .limit(1)

    if (!item) throw new NotFoundException("Không tìm thấy mặt hàng")

    const prevStock = item.currentStock
    let nextStock: number

    if (dto.transactionType === "in") {
      nextStock = prevStock + Math.abs(dto.quantity)
    } else if (dto.transactionType === "out_sale" || dto.transactionType === "out_loss") {
      nextStock = prevStock - Math.abs(dto.quantity)
    } else {
      // adjustment: sets stock directly or offsets
      nextStock = dto.quantity
    }

    const result = await this.db.transaction(async (tx) => {
      await tx
        .update(stayeaPmsServiceItemsTable)
        .set({ currentStock: nextStock })
        .where(eq(stayeaPmsServiceItemsTable.id, dto.itemId))

      const [txRecord] = await tx
        .insert(stayeaPmsInventoryTransactionsTable)
        .values({
          id: generateUid("itx"),
          partnerId,
          itemId: dto.itemId,
          transactionType: dto.transactionType,
          quantity: dto.quantity,
          unitCost: (dto.unitCost || Number(item.costPrice)).toString(),
          previousStock: prevStock,
          newStock: nextStock,
          reason: dto.reason,
          performedBy: staffName,
        })
        .returning()

      return { item: { ...item, currentStock: nextStock }, transaction: txRecord }
    })

    if (this.eventEmitter) {
      this.eventEmitter.emit("stayea.pms.stock.updated", {
        partnerId,
        itemId: dto.itemId,
        currentStock: nextStock,
      })
    }

    return result
  }

  async getInventoryTransactions(partnerId: string, itemId?: string, limit = 40) {
    const conditions = [eq(stayeaPmsInventoryTransactionsTable.partnerId, partnerId)]
    if (itemId) conditions.push(eq(stayeaPmsInventoryTransactionsTable.itemId, itemId))

    return this.db
      .select({
        tx: stayeaPmsInventoryTransactionsTable,
        item: stayeaPmsServiceItemsTable,
      })
      .from(stayeaPmsInventoryTransactionsTable)
      .innerJoin(
        stayeaPmsServiceItemsTable,
        eq(stayeaPmsInventoryTransactionsTable.itemId, stayeaPmsServiceItemsTable.id)
      )
      .where(and(...conditions))
      .orderBy(desc(stayeaPmsInventoryTransactionsTable.createdAt))
      .limit(limit)
  }

  // -------------------------------------------------------------
  // 5. Operational PMS Reports & Metrics
  // -------------------------------------------------------------

  async getOperationalReports(partnerId: string, fromDate?: string, toDate?: string) {
    // 1. Room status snapshot
    const rooms = await this.db
      .select()
      .from(stayeaPmsRoomsTable)
      .where(eq(stayeaPmsRoomsTable.partnerId, partnerId))

    const totalRooms = rooms.length
    const occupiedRooms = rooms.filter((r) => r.status === "occupied").length
    const vacantClean = rooms.filter((r) => r.status === "vacant_clean").length
    const vacantDirty = rooms.filter((r) => r.status === "vacant_dirty").length
    const reserved = rooms.filter((r) => r.status === "reserved").length
    const maintenance = rooms.filter((r) => r.status === "maintenance").length
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0

    // 2. Reservations snapshot (in-house, arrivals today, departures today)
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

    const allReservations = await this.db
      .select()
      .from(stayeaPmsReservationsTable)
      .where(eq(stayeaPmsReservationsTable.partnerId, partnerId))

    const inHouse = allReservations.filter((r) => r.status === "checked_in").length
    const arrivalsToday = allReservations.filter(
      (r) =>
        r.status === "confirmed" &&
        new Date(r.expectedCheckIn) >= todayStart &&
        new Date(r.expectedCheckIn) <= todayEnd
    ).length
    const departuresToday = allReservations.filter(
      (r) =>
        r.status === "checked_in" &&
        new Date(r.expectedCheckOut) >= todayStart &&
        new Date(r.expectedCheckOut) <= todayEnd
    ).length

    // 3. Folio Revenue Totals
    const folioConditions = [eq(stayeaPmsFoliosTable.partnerId, partnerId)]
    if (fromDate) {
      folioConditions.push(gte(stayeaPmsFoliosTable.createdAt, new Date(fromDate)))
    }
    if (toDate) {
      folioConditions.push(lte(stayeaPmsFoliosTable.createdAt, new Date(toDate)))
    }

    const folios = await this.db
      .select()
      .from(stayeaPmsFoliosTable)
      .where(and(...folioConditions))

    let totalRoomRevenue = 0
    let totalServiceRevenue = 0
    let totalSurcharges = 0
    let totalDiscounts = 0
    let totalRevenue = 0
    let totalCollected = 0
    let totalReceivables = 0

    for (const f of folios) {
      totalRoomRevenue += Number(f.roomCharges)
      totalServiceRevenue += Number(f.serviceCharges)
      totalSurcharges += Number(f.surcharges)
      totalDiscounts += Number(f.discountAmount)
      totalRevenue += Number(f.totalAmount)
      totalCollected += Number(f.paidAmount)
      totalReceivables += Number(f.remainingBalance)
    }

    // 4. Low stock alert items
    const lowStockItems = await this.db
      .select()
      .from(stayeaPmsServiceItemsTable)
      .where(
        and(
          eq(stayeaPmsServiceItemsTable.partnerId, partnerId),
          eq(stayeaPmsServiceItemsTable.trackInventory, true),
          lte(
            stayeaPmsServiceItemsTable.currentStock,
            stayeaPmsServiceItemsTable.minStockAlert
          )
        )
      )

    return {
      roomsSummary: {
        totalRooms,
        occupiedRooms,
        vacantClean,
        vacantDirty,
        reserved,
        maintenance,
        occupancyRate: Math.round(occupancyRate * 10) / 10,
      },
      todayOperations: {
        inHouse,
        arrivalsToday,
        departuresToday,
      },
      financialSummary: {
        totalRoomRevenue,
        totalServiceRevenue,
        totalSurcharges,
        totalDiscounts,
        totalRevenue,
        totalCollected,
        totalReceivables,
      },
      inventoryAlerts: {
        lowStockCount: lowStockItems.length,
        items: lowStockItems,
      },
    }
  }

  // -------------------------------------------------------------
  // 6. PMS Staff Roles
  // -------------------------------------------------------------

  async getStaffRoles(partnerId: string) {
    return this.db
      .select()
      .from(stayeaPmsStaffRolesTable)
      .where(eq(stayeaPmsStaffRolesTable.partnerId, partnerId))
  }

  // -------------------------------------------------------------
  // 7. Order-Linked Folio & Incidental Management
  // -------------------------------------------------------------

  /**
   * Get or create linked reservation and folio for a marketplace partner order
   */
  async getOrCreateOrderFolio(partnerId: string, orderId: string) {
    const orderMatch = or(
      eq(partnerOrdersTable.id, orderId),
      eq(partnerOrdersTable.orderCode, orderId)
    )

    let [order] = await this.db
      .select()
      .from(partnerOrdersTable)
      .where(
        partnerId
          ? and(orderMatch, eq(partnerOrdersTable.partnerId, partnerId))
          : orderMatch
      )
      .limit(1)

    // Fallback: If not matched with specific partnerId, resolve directly by ID/Code
    if (!order) {
      const [orderAny] = await this.db
        .select()
        .from(partnerOrdersTable)
        .where(orderMatch)
        .limit(1)
      if (orderAny) {
        order = orderAny
        partnerId = order.partnerId
      }
    }

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng #${orderId}`)
    }

    // 1. Look for existing linked reservation
    let [res] = await this.db
      .select()
      .from(stayeaPmsReservationsTable)
      .where(
        and(
          eq(stayeaPmsReservationsTable.partnerId, partnerId),
          or(
            eq(stayeaPmsReservationsTable.partnerOrderId, order.id),
            order.bookingId
              ? eq(stayeaPmsReservationsTable.bookingId, order.bookingId)
              : sql`false`,
            eq(stayeaPmsReservationsTable.reservationCode, order.orderCode)
          )
        )
      )
      .limit(1)

    // 2. If not found, auto-create reservation + folio
    let targetReservationId = res?.id

    if (!targetReservationId) {
      // Find or create default room type for this partner
      const [existingRoomType] = await this.db
        .select()
        .from(stayeaPmsRoomTypesTable)
        .where(eq(stayeaPmsRoomTypesTable.partnerId, partnerId))
        .limit(1)

      let roomTypeId = existingRoomType?.id

      if (!roomTypeId) {
        const rtId = generateUid("rt")
        const rtCode = generateCode("RT")
        const [createdRt] = await this.db
          .insert(stayeaPmsRoomTypesTable)
          .values({
            id: rtId,
            partnerId,
            name: order.serviceTitle || "Hạng phòng tiêu chuẩn",
            code: rtCode,
            basePrice: order.unitPrice || "0",
            maxOccupancy: 4,
            maxAdults: 2,
            maxChildren: 2,
          })
          .returning()
        roomTypeId = createdRt?.id || rtId
      }

      const resId = generateUid("res")
      targetReservationId = resId
      const folioId = generateUid("fol")
      const folioNumber = generateCode("FOL")
      const checkInDate = order.startDate ? new Date(order.startDate) : new Date()
      const checkOutDate = order.endDate
        ? new Date(order.endDate)
        : new Date(checkInDate.getTime() + 86400000)

      await this.db.transaction(async (tx) => {
        await tx.insert(stayeaPmsReservationsTable).values({
          id: resId,
          reservationCode: order.orderCode,
          partnerId,
          partnerOrderId: order.id,
          bookingId: order.bookingId || null,
          roomTypeId,
          channel: "stayea_marketplace",
          guestName: order.customerName,
          guestPhone: order.customerPhone,
          guestEmail: order.customerEmail || null,
          guestCount: order.quantity || 1,
          expectedCheckIn: checkInDate,
          expectedCheckOut: checkOutDate,
          actualCheckIn: new Date(),
          roomRate: order.unitPrice || "0",
          totalNights: 1,
          status: "checked_in",
          depositAmount: order.totalAmount || "0",
          paymentStatus: "paid",
          specialRequests: order.customerNote || null,
          createdBy: "STAYEA Marketplace",
        })

        // Create Folio
        await tx.insert(stayeaPmsFoliosTable).values({
          id: folioId,
          partnerId,
          reservationId: resId,
          folioNumber,
          roomCharges: order.totalAmount || "0",
          serviceCharges: "0",
          surcharges: "0",
          discountAmount: "0",
          totalAmount: order.totalAmount || "0",
          paidAmount: order.totalAmount || "0",
          remainingBalance: "0",
          status: "open",
        })

        // Insert initial room charge item
        await tx.insert(stayeaPmsFolioItemsTable).values({
          id: generateUid("fi"),
          partnerId,
          folioId,
          itemType: "room_charge",
          description: `Tiền phòng ${order.serviceTitle} (Đã bảo chứng thanh toán qua STAYEA)`,
          quantity: "1",
          unitPrice: order.totalAmount || "0",
          amount: order.totalAmount || "0",
          recordedBy: "Hệ thống STAYEA",
        })
      })
    }

    return this.getFolio(partnerId, targetReservationId)
  }

  /**
   * Post incidental service / minibar item directly to an order's folio
   */
  async postOrderFolioItem(
    partnerId: string,
    orderId: string,
    dto: PostServiceItemDto,
    staffName: string
  ) {
    const folioData = await this.getOrCreateOrderFolio(partnerId, orderId)
    return this.postServiceItem(partnerId, folioData.reservation.id, dto, staffName)
  }
}
