import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator"

export class CreateBookingDto {
  @ApiProperty({
    enum: ["stay", "flight", "experience", "package", "combo", "transport"],
    example: "stay",
  })
  @IsEnum(["stay", "flight", "experience", "package", "combo", "transport"])
  @IsNotEmpty()
  bookingType: "stay" | "flight" | "experience" | "package" | "combo" | "transport"

  @ApiProperty({ example: "Premier Village Phu Quoc Resort - Eden Bay Villa" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: "Mũi Ông Đội, An Thới, Phú Quốc" })
  @IsString()
  @IsNotEmpty()
  destination: string

  @ApiProperty({ example: "2026-11-10" })
  @IsString()
  @IsNotEmpty()
  startDate: string

  @ApiProperty({ example: "2026-11-14" })
  @IsString()
  @IsNotEmpty()
  endDate: string

  @ApiPropertyOptional({ example: 2, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  guestCount?: number = 1

  @ApiProperty({ example: 8_500_000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount: number

  @ApiPropertyOptional({ example: "STAYEA10AIR" })
  @IsOptional()
  @IsString()
  voucherCode?: string

  @ApiPropertyOptional({ example: 500, description: "Points to redeem for discount (1 point = 1,000 VND)" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pointsToRedeem?: number

  @ApiPropertyOptional({ example: "credit_card" })
  @IsOptional()
  @IsString()
  paymentMethod?: string

  @ApiPropertyOptional({
    description: "Detailed service metadata (roomType, flightSegments, guestList, contactInfo)",
  })
  @IsOptional()
  details?: {
    stayId?: string
    roomType?: string
    nightCount?: number
    flightId?: string
    flightNumber?: string
    seatClass?: string
    experienceId?: string
    packageId?: string
    passengers?: { fullName: string; idNumber?: string; type: "adult" | "child" }[]
    contactInfo?: { fullName: string; email: string; phone: string; note?: string }
    metadata?: Record<string, unknown>
  }
}

export class UpdateBookingStatusDto {
  @ApiProperty({
    enum: ["pending", "confirmed", "completed", "cancelled", "refunded"],
    example: "confirmed",
  })
  @IsEnum(["pending", "confirmed", "completed", "cancelled", "refunded"])
  @IsNotEmpty()
  status: "pending" | "confirmed" | "completed" | "cancelled" | "refunded"
}

export class BookingQueryDto {
  @ApiPropertyOptional({ description: "Filter by status: all, pending, confirmed, completed, cancelled" })
  @IsOptional()
  @IsString()
  status?: string

  @ApiPropertyOptional({ description: "Filter by type: stay, flight, experience, package, combo" })
  @IsOptional()
  @IsString()
  bookingType?: string

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number = 0
}
