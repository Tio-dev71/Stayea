import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator"

export class RegisterPartnerDto {
  @ApiProperty({ example: "Phú Quốc Sunshine Homestay" })
  @IsString()
  @IsNotEmpty()
  businessName: string

  @ApiProperty({
    enum: ["homestay", "transport", "tour", "combo", "multi"],
    example: "homestay",
  })
  @IsEnum(["homestay", "transport", "tour", "combo", "multi"])
  businessType: "homestay" | "transport" | "tour" | "combo" | "multi"

  @ApiProperty({ example: "Nguyễn Văn Phát" })
  @IsString()
  @IsNotEmpty()
  contactName: string

  @ApiProperty({ example: "0912345678" })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ example: "phat.homestay@gmail.com" })
  @IsString()
  @IsNotEmpty()
  email: string

  @ApiPropertyOptional({ example: "Đường Trần Hưng Đạo, Dương Đông, Phú Quốc" })
  @IsString()
  @IsOptional()
  address?: string

  @ApiPropertyOptional({ example: "Phú Quốc" })
  @IsString()
  @IsOptional()
  city?: string

  @ApiPropertyOptional({ example: "0312456789" })
  @IsString()
  @IsOptional()
  taxId?: string

  @ApiPropertyOptional({ example: "Vietcombank" })
  @IsString()
  @IsOptional()
  bankName?: string

  @ApiPropertyOptional({ example: "0071001234567" })
  @IsString()
  @IsOptional()
  bankAccount?: string

  @ApiPropertyOptional({ example: "NGUYEN VAN PHAT" })
  @IsString()
  @IsOptional()
  bankAccountHolder?: string
}

export class UpdatePartnerProfileDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  businessName?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactName?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  taxId?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankName?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankAccount?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankAccountHolder?: string
}

export class CreatePartnerServiceDto {
  @ApiProperty({
    enum: ["stay", "transport", "experience", "package"],
    example: "stay",
  })
  @IsEnum(["stay", "transport", "experience", "package"])
  serviceType: "stay" | "transport" | "experience" | "package"

  @ApiProperty({ example: "Villa Biển Hoàng Hôn 3 Phòng Ngủ" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiPropertyOptional({ example: "Villa view biển ngắm hoàng hôn Bãi Trường Phú Quốc..." })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ example: "Bãi Trường, Dương Tơ, Phú Quốc" })
  @IsString()
  @IsNotEmpty()
  location: string

  @ApiProperty({ example: 2500000 })
  @IsNumber()
  @Min(0)
  price: number

  @ApiPropertyOptional({ example: 3200000 })
  @IsNumber()
  @IsOptional()
  originalPrice?: number

  @ApiPropertyOptional({ example: "đêm" })
  @IsString()
  @IsOptional()
  unit?: string

  @ApiPropertyOptional({ type: [String], example: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"] })
  @IsArray()
  @IsOptional()
  images?: string[]

  @ApiPropertyOptional({
    example: {
      bedrooms: 3,
      bathrooms: 3,
      maxGuests: 6,
      amenities: ["Hồ bơi riêng", "Bếp nấu", "BBQ ngoài trời", "Wifi tốc độ cao"],
    },
  })
  @IsOptional()
  attributes?: Record<string, unknown>
}

export class UpdatePartnerServiceDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  price?: number

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  originalPrice?: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unit?: string

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  images?: string[]

  @ApiPropertyOptional()
  @IsOptional()
  attributes?: Record<string, unknown>

  @ApiPropertyOptional({ enum: ["active", "inactive"] })
  @IsEnum(["active", "inactive"])
  @IsOptional()
  status?: "active" | "inactive"
}

export class BulkUpdateInventoryDto {
  @ApiProperty({ example: "svc_abc123" })
  @IsString()
  @IsNotEmpty()
  serviceId: string

  @ApiProperty({
    example: [
      { date: "2026-11-01", totalSlots: 2, isAvailable: true, priceOverride: 2800000 },
      { date: "2026-11-02", totalSlots: 0, isAvailable: false },
    ],
  })
  @IsArray()
  dates: {
    date: string
    totalSlots?: number
    isAvailable?: boolean
    priceOverride?: number
    note?: string
  }[]
}

export class CreateDraftOrderDto {
  @ApiProperty({ example: "partner_123" })
  @IsString()
  @IsNotEmpty()
  partnerId: string

  @ApiProperty({ example: "svc_abc123" })
  @IsString()
  @IsNotEmpty()
  serviceId: string

  @ApiProperty({ example: "Nguyễn Thu Hà" })
  @IsString()
  @IsNotEmpty()
  customerName: string

  @ApiProperty({ example: "0987654321" })
  @IsString()
  @IsNotEmpty()
  customerPhone: string

  @ApiPropertyOptional({ example: "thuha@gmail.com" })
  @IsString()
  @IsOptional()
  customerEmail?: string

  @ApiProperty({ example: "Villa Biển Hoàng Hôn 3 Phòng Ngủ" })
  @IsString()
  @IsNotEmpty()
  serviceTitle: string

  @ApiProperty({ example: "stay" })
  @IsString()
  @IsNotEmpty()
  serviceType: string

  @ApiProperty({ example: "2026-11-05" })
  @IsString()
  @IsNotEmpty()
  startDate: string

  @ApiPropertyOptional({ example: "2026-11-08" })
  @IsString()
  @IsOptional()
  endDate?: string

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsOptional()
  quantity?: number

  @ApiProperty({ example: 2500000 })
  @IsNumber()
  unitPrice: number

  @ApiProperty({ example: 7500000 })
  @IsNumber()
  totalAmount: number

  @ApiPropertyOptional({
    enum: ["ai_agent", "direct_customer", "admin_manual"],
    default: "direct_customer",
  })
  @IsEnum(["ai_agent", "direct_customer", "admin_manual"])
  @IsOptional()
  source?: "ai_agent" | "direct_customer" | "admin_manual"

  @ApiPropertyOptional({ example: "Khách cần xe đưa đón sân bay lúc 14:00" })
  @IsString()
  @IsOptional()
  adminNotes?: string
}

export class PartnerOrderRespondDto {
  @ApiProperty({ enum: ["accept", "reject"], example: "accept" })
  @IsEnum(["accept", "reject"])
  action: "accept" | "reject"

  @ApiPropertyOptional({ example: "Đã chuẩn bị xe/phòng sẵn sàng đón khách" })
  @IsString()
  @IsOptional()
  note?: string
}

export class AdminApproveOrderDto {
  @ApiPropertyOptional({ example: "Đã duyệt thông tin khách, chuyển đơn tới đối tác" })
  @IsString()
  @IsOptional()
  adminNotes?: string

  @ApiPropertyOptional({ example: "ptn_carrent_02" })
  @IsString()
  @IsOptional()
  reassignPartnerId?: string
}

export class AdminUpdatePartnerStatusDto {
  @ApiProperty({ enum: ["pending", "approved", "rejected", "suspended"] })
  @IsEnum(["pending", "approved", "rejected", "suspended"])
  status: "pending" | "approved" | "rejected" | "suspended"

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  commissionRate?: number
}

export class AdminCreatePartnerDto {
  @ApiProperty({ example: "Phú Quốc Sunshine Homestay" })
  @IsString()
  @IsNotEmpty()
  businessName: string

  @ApiPropertyOptional({
    enum: ["homestay", "transport", "tour", "combo", "multi"],
    example: "homestay",
  })
  @IsEnum(["homestay", "transport", "tour", "combo", "multi"])
  @IsOptional()
  businessType?: "homestay" | "transport" | "tour" | "combo" | "multi"

  @ApiProperty({ example: "Nguyễn Văn Phát" })
  @IsString()
  @IsNotEmpty()
  contactName: string

  @ApiProperty({ example: "0912345678" })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ example: "phat.homestay@gmail.com" })
  @IsString()
  @IsNotEmpty()
  email: string

  @ApiPropertyOptional({ example: "Đường Trần Hưng Đạo, Dương Đông, Phú Quốc" })
  @IsString()
  @IsOptional()
  address?: string

  @ApiPropertyOptional({ example: "Phú Quốc" })
  @IsString()
  @IsOptional()
  city?: string

  @ApiPropertyOptional({ example: "0312456789" })
  @IsString()
  @IsOptional()
  taxId?: string

  @ApiPropertyOptional({ example: "Vietcombank" })
  @IsString()
  @IsOptional()
  bankName?: string

  @ApiPropertyOptional({ example: "0071001234567" })
  @IsString()
  @IsOptional()
  bankAccount?: string

  @ApiPropertyOptional({ example: "NGUYEN VAN PHAT" })
  @IsString()
  @IsOptional()
  bankAccountHolder?: string

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  commissionRate?: number

  @ApiPropertyOptional({ example: "approved" })
  @IsString()
  @IsOptional()
  status?: "pending" | "approved" | "rejected" | "suspended"
}
