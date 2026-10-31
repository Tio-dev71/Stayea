import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator"

export class CreatePromotionDto {
  @IsString() code: string
  @IsString() title: string
  @IsString() description: string
  @IsEnum(["percentage", "fixed"]) discountType: "percentage" | "fixed"
  @Type(() => Number) @IsNumber() @Min(0) discountValue: number
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) maxDiscount?: number
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) minSpend?: number
  @IsOptional() @IsString() category?: string
  @IsOptional() @IsString() badge?: string
  @IsOptional() @IsString() imageUrl?: string
  @IsOptional() @IsArray() terms?: string[]
  @IsOptional() @IsString() startDate?: string
  @IsOptional() @IsString() endDate?: string
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) usageLimit?: number
  @IsOptional() @Type(() => Boolean) @IsBoolean() isActive?: boolean
}

export class UpdatePromotionDto {
  @IsOptional() @IsString() title?: string
  @IsOptional() @IsString() description?: string
  @IsOptional() @IsEnum(["percentage", "fixed"]) discountType?: "percentage" | "fixed"
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) discountValue?: number
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) maxDiscount?: number
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) minSpend?: number
  @IsOptional() @IsString() category?: string
  @IsOptional() @IsString() badge?: string
  @IsOptional() @IsString() imageUrl?: string
  @IsOptional() @IsArray() terms?: string[]
  @IsOptional() @IsString() startDate?: string
  @IsOptional() @IsString() endDate?: string
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) usageLimit?: number
  @IsOptional() @Type(() => Boolean) @IsBoolean() isActive?: boolean
}
