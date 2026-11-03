import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class SendChatMessageDto {
  @ApiProperty({ description: "Message content" })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiPropertyOptional({ description: "Sender type: customer | partner | admin | ai" })
  @IsString()
  @IsOptional()
  senderType?: "customer" | "partner" | "admin" | "ai"

  @ApiPropertyOptional({ description: "Sender display name" })
  @IsString()
  @IsOptional()
  senderName?: string

  @ApiPropertyOptional({ description: "Sender avatar URL" })
  @IsString()
  @IsOptional()
  senderAvatar?: string

  @ApiPropertyOptional({ description: "Sender user ID or partner ID" })
  @IsString()
  @IsOptional()
  senderId?: string

  @ApiPropertyOptional({ description: "Arbitrary metadata (JSON)" })
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class StartCustomerChatDto {
  @ApiPropertyOptional({ description: "Client session ID or user ID" })
  @IsString()
  @IsOptional()
  sessionId?: string

  @ApiPropertyOptional({ description: "Customer full name" })
  @IsString()
  @IsOptional()
  customerName?: string

  @ApiPropertyOptional({ description: "Customer phone number" })
  @IsString()
  @IsOptional()
  customerPhone?: string

  @ApiPropertyOptional({ description: "Customer email" })
  @IsString()
  @IsOptional()
  customerEmail?: string

  @ApiPropertyOptional({ description: "Initial message from customer" })
  @IsString()
  @IsOptional()
  initialMessage?: string

  @ApiPropertyOptional({ description: "Contextual metadata (current room, service ID, etc.)" })
  @IsOptional()
  metadata?: Record<string, unknown>
}

