import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"

export class CreateNotificationDto {
  @ApiProperty({
    enum: ["all", "all_partners", "all_users", "partner", "user"],
    example: "all_partners",
    description: "Target group or individual for notification",
  })
  @IsEnum(["all", "all_partners", "all_users", "partner", "user"])
  recipientType: "all" | "all_partners" | "all_users" | "partner" | "user"

  @ApiPropertyOptional({
    example: "partner-123456",
    description: "Partner ID or User ID if recipientType is partner or user",
  })
  @IsString()
  @IsOptional()
  recipientId?: string

  @ApiPropertyOptional({
    example: "STAYEA Ban Quản Trị",
    description: "Display name of sender",
  })
  @IsString()
  @IsOptional()
  senderName?: string

  @ApiProperty({
    example: "Bảo trì nâng cấp hệ thống thanh toán tự động",
    description: "Notification title",
  })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({
    example: "Hệ thống sẽ bảo trì từ 00:00 đến 02:00 sáng ngày mai. Vui lòng hoàn tất các đơn hàng trước thời điểm trên.",
    description: "Notification content body",
  })
  @IsString()
  @IsNotEmpty()
  message: string

  @ApiPropertyOptional({
    enum: ["system", "order", "payout", "promotion", "announcement"],
    example: "announcement",
    default: "system",
  })
  @IsEnum(["system", "order", "payout", "promotion", "announcement"])
  @IsOptional()
  type?: "system" | "order" | "payout" | "promotion" | "announcement"

  @ApiPropertyOptional({
    enum: ["normal", "high", "urgent"],
    example: "high",
    default: "normal",
  })
  @IsEnum(["normal", "high", "urgent"])
  @IsOptional()
  priority?: "normal" | "high" | "urgent"

  @ApiPropertyOptional({
    example: "/hub?tab=orders",
    description: "Action URL when user clicks notification",
  })
  @IsString()
  @IsOptional()
  actionUrl?: string

  @ApiPropertyOptional({
    example: { campaignId: "pq-summer-2026" },
    description: "Custom metadata payload",
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class MarkReadDto {
  @ApiProperty({ example: "partner-uuid-123" })
  @IsString()
  @IsNotEmpty()
  readerId: string

  @ApiProperty({ enum: ["user", "partner", "admin"], example: "partner" })
  @IsEnum(["user", "partner", "admin"])
  readerRole: "user" | "partner" | "admin"
}
