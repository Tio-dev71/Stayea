import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator"

export class ClaimVoucherDto {
  @ApiProperty({ example: "STAYEA10AIR" })
  @IsString()
  @IsNotEmpty()
  code: string
}

export class CreatePlanDto {
  @ApiProperty({ example: "Kỳ Nghỉ Phú Quốc 4N3Đ Cùng Gia Đình" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: "Phú Quốc, Kiên Giang" })
  @IsString()
  @IsNotEmpty()
  destination: string

  @ApiProperty({ example: "15/11 - 18/11/2026" })
  @IsString()
  @IsNotEmpty()
  dates: string

  @ApiProperty({ example: "https://images.unsplash.com/photo-1540555700478-4be289fbecef" })
  @IsString()
  @IsNotEmpty()
  coverImage: string

  @ApiPropertyOptional({
    description: "Daily scheduled activities and booked services",
  })
  @IsOptional()
  itinerary?: {
    day: number
    date: string
    title: string
    activities: { time: string; activity: string; location?: string; icon?: string }[]
    bookedServices?: { id: string; type: string; title: string; status: string }[]
    notes?: string
  }[]
}

export class FavoriteItemDto {
  @ApiProperty({ enum: ["stay", "experience", "package", "flight"], example: "stay" })
  @IsEnum(["stay", "experience", "package", "flight"])
  @IsNotEmpty()
  itemType: "stay" | "experience" | "package" | "flight"

  @ApiProperty({ example: "stay-1" })
  @IsString()
  @IsNotEmpty()
  itemId: string

  @ApiProperty({ example: "Premier Village Phu Quoc Resort" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiPropertyOptional({ example: "Mũi Ông Đội, An Thới, Phú Quốc" })
  @IsOptional()
  @IsString()
  location?: string

  @ApiProperty({ example: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b" })
  @IsString()
  @IsNotEmpty()
  imageUrl: string

  @ApiProperty({ example: 8_500_000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number

  @ApiPropertyOptional({ example: 4.95 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rating?: number
}

export class CreateReviewDto {
  @ApiProperty({ enum: ["stay", "experience", "package"], example: "stay" })
  @IsEnum(["stay", "experience", "package"])
  @IsNotEmpty()
  itemType: "stay" | "experience" | "package"

  @ApiProperty({ example: "stay-1" })
  @IsString()
  @IsNotEmpty()
  itemId: string

  @ApiProperty({ example: "Premier Village Phu Quoc Resort" })
  @IsString()
  @IsNotEmpty()
  itemTitle: string

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @ApiProperty({ example: "Biệt thự view hoàng hôn cực đẹp, dịch vụ quản gia chu đáo và đẳng cấp!" })
  @IsString()
  @IsNotEmpty()
  comment: string
}

export class UpdateUserSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  emailNotifications?: {
    bookingConfirmations: boolean
    promotionsAndDiscounts: boolean
    travelReminders: boolean
    newsletter: boolean
  }

  @ApiPropertyOptional()
  @IsOptional()
  pushNotifications?: {
    orderStatus: boolean
    priceDropAlerts: boolean
    specialOffers: boolean
  }

  @ApiPropertyOptional({ example: "vi" })
  @IsOptional()
  @IsString()
  language?: string

  @ApiPropertyOptional({ example: "VND" })
  @IsOptional()
  @IsString()
  currency?: string

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean
}
