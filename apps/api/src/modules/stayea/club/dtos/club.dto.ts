import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class ClaimPerkDto {
  @ApiProperty({ example: "offer-fnb-15" })
  @IsString()
  @IsNotEmpty()
  offerId: string

  @ApiProperty({ example: "Giảm 15% Ẩm Thực Nhà Hàng Biển" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: "-15%" })
  @IsString()
  @IsNotEmpty()
  discount: string
}

export class AddPointsDto {
  @ApiProperty({ example: 250 })
  @IsNumber()
  points: number

  @ApiProperty({
    enum: ["earned", "redeemed", "bonus", "tier_upgrade"],
    example: "earned",
  })
  @IsEnum(["earned", "redeemed", "bonus", "tier_upgrade"])
  type: "earned" | "redeemed" | "bonus" | "tier_upgrade"

  @ApiProperty({ example: "Điểm thưởng hoàn thành chuyến đi" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiPropertyOptional({ example: "Chuyến bay VN-1234 SGN - PQC" })
  @IsOptional()
  @IsString()
  description?: string
}
