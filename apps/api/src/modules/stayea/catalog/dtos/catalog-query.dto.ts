import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"

export class AccommodationsQueryDto {
  @ApiPropertyOptional({ description: "Filter by category: villa, resort, apartment, hotel, beachfront" })
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional({ description: "Search by title or location" })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ description: "Minimum price per night" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number

  @ApiPropertyOptional({ description: "Maximum price per night" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number

  @ApiPropertyOptional({ description: "Minimum bedrooms" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bedrooms?: number

  @ApiPropertyOptional({ description: "Filter featured accommodations only" })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean

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

export class ExperiencesQueryDto {
  @ApiPropertyOptional({ description: "Filter by category: tour, island, snorkeling, diving, cruise, food, spa" })
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional({ description: "Search by title or location" })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ description: "Filter by duration: e.g. 4 giờ, 1 ngày" })
  @IsOptional()
  @IsString()
  duration?: string

  @ApiPropertyOptional({ description: "Filter featured experiences only" })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean

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

export class PackagesQueryDto {
  @ApiPropertyOptional({ description: "Filter by audience: couple, family, luxury, wellness, all" })
  @IsOptional()
  @IsString()
  audience?: string

  @ApiPropertyOptional({ description: "Search by title or destination" })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ description: "Filter by duration: e.g. 3 ngày 2 đêm" })
  @IsOptional()
  @IsString()
  duration?: string

  @ApiPropertyOptional({ description: "Filter featured packages only" })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean

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

export class FlightsQueryDto {
  @ApiPropertyOptional({ description: "Departure Airport code, e.g. SGN, HAN, DAD" })
  @IsOptional()
  @IsString()
  fromAirport?: string

  @ApiPropertyOptional({ description: "Arrival Airport code, e.g. PQC" })
  @IsOptional()
  @IsString()
  toAirport?: string

  @ApiPropertyOptional({ description: "Departure date, e.g. 2026-10-25" })
  @IsOptional()
  @IsString()
  departureDate?: string

  @ApiPropertyOptional({ description: "Seat class: economy, business" })
  @IsOptional()
  @IsString()
  seatClass?: string

  @ApiPropertyOptional({ description: "Airline code: VN, VJ, QH, VU" })
  @IsOptional()
  @IsString()
  airline?: string

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20
}

export class ValidatePromoDto {
  @ApiPropertyOptional({ description: "Promo/Voucher code to validate, e.g. STAYEA10AIR" })
  @IsString()
  code: string

  @ApiPropertyOptional({ description: "Subtotal of the booking to calculate discount" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  subtotal?: number

  @ApiPropertyOptional({ description: "Booking category: stay, flight, tour, combo" })
  @IsOptional()
  @IsString()
  category?: string
}
