import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator"

export class CreateAccommodationDto {
  @ApiProperty({ example: "Sunset Ocean Villa Phú Quốc" })
  @IsString()
  @IsNotEmpty()
  title!: string

  @ApiProperty({ example: "villa" })
  @IsString()
  @IsNotEmpty()
  category!: string

  @ApiProperty({ example: "Bãi Trường, Dương Tơ, Phú Quốc" })
  @IsString()
  @IsNotEmpty()
  location!: string

  @ApiProperty({ example: 3500000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerNight!: number

  @ApiPropertyOptional({ example: 4500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  originalPrice?: number

  @ApiPropertyOptional({ example: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b" })
  @IsOptional()
  @IsString()
  imageUrl?: string

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  gallery?: string[]

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bedrooms?: number

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bathrooms?: number

  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxGuests?: number

  @ApiPropertyOptional({ example: "STAYEA Premier Host" })
  @IsOptional()
  @IsString()
  hostName?: string

  @ApiPropertyOptional({ example: "Biệt thự view hoàng hôn Bãi Trường với hồ bơi vô cực riêng tư..." })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ example: "HOT DEAL" })
  @IsOptional()
  @IsString()
  badge?: string

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean

  @ApiPropertyOptional({ type: Array })
  @IsOptional()
  @IsArray()
  amenities?: { icon: string; label: string }[]
}

export class UpdateAccommodationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pricePerNight?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  originalPrice?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bedrooms?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bathrooms?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxGuests?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hostName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  badge?: string

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean
}

