import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator"

export class CreateRoomTypeDto {
  @ApiProperty({ example: "Phòng Deluxe King Ban Công" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: "DLX-KING" })
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty({ example: 1200000 })
  @IsNumber()
  @Min(0)
  basePrice: number

  @ApiPropertyOptional({ example: 150000 })
  @IsNumber()
  @IsOptional()
  hourlyPrice?: number

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  maxOccupancy?: number

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  maxAdults?: number

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  maxChildren?: number

  @ApiPropertyOptional({ example: ["Wifi tốc độ cao", "Ban công", "Bồn tắm nằm", "Smart TV"] })
  @IsArray()
  @IsOptional()
  amenities?: string[]

  @ApiPropertyOptional({ example: "Phòng view biển cao cấp tầng 2" })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ example: "service-uuid-123" })
  @IsString()
  @IsOptional()
  serviceId?: string
}

export class CreateRoomDto {
  @ApiProperty({ example: "room-type-uuid" })
  @IsString()
  @IsNotEmpty()
  roomTypeId: string

  @ApiProperty({ example: "101" })
  @IsString()
  @IsNotEmpty()
  roomNumber: string

  @ApiPropertyOptional({ example: "1" })
  @IsString()
  @IsOptional()
  floor?: string

  @ApiPropertyOptional({
    enum: ["vacant_clean", "vacant_dirty", "occupied", "reserved", "maintenance"],
    default: "vacant_clean",
  })
  @IsEnum(["vacant_clean", "vacant_dirty", "occupied", "reserved", "maintenance"])
  @IsOptional()
  status?: "vacant_clean" | "vacant_dirty" | "occupied" | "reserved" | "maintenance"

  @ApiPropertyOptional({ example: "Gần thang máy" })
  @IsString()
  @IsOptional()
  note?: string
}

export class UpdateRoomStatusDto {
  @ApiPropertyOptional({
    enum: ["vacant_clean", "vacant_dirty", "occupied", "reserved", "maintenance"],
  })
  @IsEnum(["vacant_clean", "vacant_dirty", "occupied", "reserved", "maintenance"])
  @IsOptional()
  status?: "vacant_clean" | "vacant_dirty" | "occupied" | "reserved" | "maintenance"

  @ApiPropertyOptional({
    enum: ["clean", "dirty", "cleaning", "inspecting"],
  })
  @IsEnum(["clean", "dirty", "cleaning", "inspecting"])
  @IsOptional()
  housekeepingStatus?: "clean" | "dirty" | "cleaning" | "inspecting"

  @ApiPropertyOptional({ example: "Nguyễn Thị Hoa" })
  @IsString()
  @IsOptional()
  housekeepingAssignedTo?: string

  @ApiPropertyOptional({ example: "Đã thay ga giường và bổ sung minibar" })
  @IsString()
  @IsOptional()
  note?: string
}

export class CreateReservationDto {
  @ApiPropertyOptional({ example: "room-uuid-101" })
  @IsString()
  @IsOptional()
  roomId?: string

  @ApiProperty({ example: "room-type-uuid" })
  @IsString()
  @IsNotEmpty()
  roomTypeId: string

  @ApiPropertyOptional({
    enum: ["direct_walkin", "direct_phone", "stayea_marketplace", "ota_other"],
    default: "direct_walkin",
  })
  @IsEnum(["direct_walkin", "direct_phone", "stayea_marketplace", "ota_other"])
  @IsOptional()
  channel?: "direct_walkin" | "direct_phone" | "stayea_marketplace" | "ota_other"

  @ApiProperty({ example: "Nguyễn Văn Tuấn" })
  @IsString()
  @IsNotEmpty()
  guestName: string

  @ApiProperty({ example: "0912345678" })
  @IsString()
  @IsNotEmpty()
  guestPhone: string

  @ApiPropertyOptional({ example: "tuan.nguyen@gmail.com" })
  @IsString()
  @IsOptional()
  guestEmail?: string

  @ApiPropertyOptional({ example: "079090001234" })
  @IsString()
  @IsOptional()
  guestIdNumber?: string

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  guestCount?: number

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  adultsCount?: number

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  childrenCount?: number

  @ApiProperty({ example: "2026-11-05T14:00:00.000Z" })
  @IsString()
  @IsNotEmpty()
  expectedCheckIn: string

  @ApiProperty({ example: "2026-11-07T12:00:00.000Z" })
  @IsString()
  @IsNotEmpty()
  expectedCheckOut: string

  @ApiProperty({ example: 1200000 })
  @IsNumber()
  @Min(0)
  roomRate: number

  @ApiPropertyOptional({ example: 500000 })
  @IsNumber()
  @IsOptional()
  depositAmount?: number

  @ApiPropertyOptional({ enum: ["cash", "bank_transfer", "credit_card", "stayea_prepaid"] })
  @IsEnum(["cash", "bank_transfer", "credit_card", "stayea_prepaid"])
  @IsOptional()
  depositPaymentMethod?: "cash" | "bank_transfer" | "credit_card" | "stayea_prepaid"

  @ApiPropertyOptional({ example: "Khách yêu cầu phòng yên tĩnh" })
  @IsString()
  @IsOptional()
  specialRequests?: string

  @ApiPropertyOptional({ example: "Khách quen" })
  @IsString()
  @IsOptional()
  internalNotes?: string

  @ApiPropertyOptional({ example: true, description: "Check-in immediately if room is ready" })
  @IsBoolean()
  @IsOptional()
  isCheckInImmediately?: boolean

  @ApiPropertyOptional({ example: "booking-uuid" })
  @IsString()
  @IsOptional()
  bookingId?: string
}

export class CheckInDto {
  @ApiPropertyOptional({ example: "room-uuid-101" })
  @IsString()
  @IsOptional()
  roomId?: string

  @ApiPropertyOptional({ example: "079090001234" })
  @IsString()
  @IsOptional()
  guestIdNumber?: string

  @ApiPropertyOptional({ example: 100000 })
  @IsNumber()
  @IsOptional()
  earlyCheckinFee?: number

  @ApiPropertyOptional({ example: 500000 })
  @IsNumber()
  @IsOptional()
  depositAmount?: number

  @ApiPropertyOptional({ enum: ["cash", "bank_transfer", "credit_card", "stayea_prepaid"] })
  @IsEnum(["cash", "bank_transfer", "credit_card", "stayea_prepaid"])
  @IsOptional()
  paymentMethod?: "cash" | "bank_transfer" | "credit_card" | "stayea_prepaid"
}

export class CheckOutDto {
  @ApiPropertyOptional({ example: 150000 })
  @IsNumber()
  @IsOptional()
  lateCheckoutFee?: number

  @ApiPropertyOptional({ example: 50000 })
  @IsNumber()
  @IsOptional()
  discountAmount?: number

  @ApiPropertyOptional({
    enum: ["cash", "bank_transfer", "credit_card", "stayea_prepaid"],
    default: "cash",
  })
  @IsEnum(["cash", "bank_transfer", "credit_card", "stayea_prepaid"])
  @IsOptional()
  paymentMethod?: "cash" | "bank_transfer" | "credit_card" | "stayea_prepaid"

  @ApiPropertyOptional({ example: 2150000 })
  @IsNumber()
  @IsOptional()
  paymentAmount?: number

  @ApiPropertyOptional({ example: "Khách thanh toán hết bằng chuyển khoản" })
  @IsString()
  @IsOptional()
  note?: string
}

export class TransferRoomDto {
  @ApiProperty({ example: "new-room-uuid" })
  @IsString()
  @IsNotEmpty()
  targetRoomId: string

  @ApiProperty({ example: "Điều hòa phòng cũ trục trặc" })
  @IsString()
  @IsNotEmpty()
  reason: string
}

export class PostServiceItemDto {
  @ApiPropertyOptional({ example: "item-service-uuid" })
  @IsString()
  @IsOptional()
  serviceItemId?: string

  @ApiProperty({ example: "2x Nước suối Lavie 500ml" })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0.1)
  quantity: number

  @ApiProperty({ example: 20000 })
  @IsNumber()
  @Min(0)
  unitPrice: number

  @ApiProperty({
    enum: ["minibar", "laundry", "fnb", "spa", "surcharge", "discount", "custom"],
    example: "minibar",
  })
  @IsEnum(["minibar", "laundry", "fnb", "spa", "surcharge", "discount", "custom"])
  itemType: "minibar" | "laundry" | "fnb" | "spa" | "surcharge" | "discount" | "custom"

  @ApiPropertyOptional({ example: "Khách dùng lúc 20h" })
  @IsString()
  @IsOptional()
  note?: string
}

export class CancelFolioItemDto {
  @ApiProperty({ example: "Nhập nhầm số lượng phòng khác" })
  @IsString()
  @IsNotEmpty()
  reason: string
}

export class RecordFolioPaymentDto {
  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(1)
  amount: number

  @ApiProperty({
    enum: ["cash", "bank_transfer", "credit_card", "stayea_prepaid"],
    example: "cash",
  })
  @IsEnum(["cash", "bank_transfer", "credit_card", "stayea_prepaid"])
  paymentMethod: "cash" | "bank_transfer" | "credit_card" | "stayea_prepaid"

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isDeposit?: boolean

  @ApiPropertyOptional({ example: "VIB-FT123456" })
  @IsString()
  @IsOptional()
  referenceCode?: string

  @ApiPropertyOptional({ example: "Thu cọc trước" })
  @IsString()
  @IsOptional()
  note?: string
}

export class CreatePmsServiceItemDto {
  @ApiProperty({
    enum: [
      "minibar_drink",
      "minibar_food",
      "laundry",
      "fnb",
      "spa",
      "transport",
      "surcharge",
      "other",
    ],
    example: "minibar_drink",
  })
  @IsEnum([
    "minibar_drink",
    "minibar_food",
    "laundry",
    "fnb",
    "spa",
    "transport",
    "surcharge",
    "other",
  ])
  category:
    | "minibar_drink"
    | "minibar_food"
    | "laundry"
    | "fnb"
    | "spa"
    | "transport"
    | "surcharge"
    | "other"

  @ApiProperty({ example: "Nước suối Aquafina 500ml" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: "AQF-500" })
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty({ example: "chai" })
  @IsString()
  @IsNotEmpty()
  unit: string

  @ApiProperty({ example: 20000 })
  @IsNumber()
  @Min(0)
  sellingPrice: number

  @ApiPropertyOptional({ example: 8000 })
  @IsNumber()
  @IsOptional()
  costPrice?: number

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  trackInventory?: boolean

  @ApiPropertyOptional({ example: 48 })
  @IsNumber()
  @IsOptional()
  currentStock?: number

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  minStockAlert?: number
}

export class StockAdjustmentDto {
  @ApiProperty({ example: "item-uuid" })
  @IsString()
  @IsNotEmpty()
  itemId: string

  @ApiProperty({
    enum: ["in", "out_sale", "out_loss", "adjustment"],
    example: "in",
  })
  @IsEnum(["in", "out_sale", "out_loss", "adjustment"])
  transactionType: "in" | "out_sale" | "out_loss" | "adjustment"

  @ApiProperty({ example: 24, description: "Positive number for in/out/adjust" })
  @IsNumber()
  quantity: number

  @ApiPropertyOptional({ example: 8000 })
  @IsNumber()
  @IsOptional()
  unitCost?: number

  @ApiProperty({ example: "Nhập thùng 24 chai từ đại lý" })
  @IsString()
  @IsNotEmpty()
  reason: string
}

