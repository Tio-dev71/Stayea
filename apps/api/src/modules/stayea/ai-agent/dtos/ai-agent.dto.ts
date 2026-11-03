import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator"

export class ChatMessageDto {
  @ApiProperty({ enum: ["system", "user", "assistant", "tool"] })
  @IsString()
  role!: "system" | "user" | "assistant" | "tool"

  @ApiProperty()
  @IsString()
  content!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tool_call_id?: string

  @ApiPropertyOptional()
  @IsOptional()
  tool_calls?: any[]
}

export class CustomerContextDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string
}

export class AiChatRequestDto {
  @ApiProperty({ type: [ChatMessageDto] })
  @IsArray()
  messages!: ChatMessageDto[]

  @ApiPropertyOptional({ type: CustomerContextDto })
  @IsOptional()
  customerContext?: CustomerContextDto

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  stream?: boolean
}

export type ChatMessage = ChatMessageDto
export type CustomerContext = CustomerContextDto

export interface BookingPreviewCard {
  orderCode: string
  serviceTitle: string
  serviceType: string
  customerName: string
  customerPhone: string
  startDate: string
  endDate?: string | null
  quantity: number
  totalAmount: number
  status: "pending_admin"
  note?: string
}

export interface AiChatResponse {
  reply: string
  bookingCreated?: BookingPreviewCard | null
  suggestedActions?: string[]
}

export class UpdateAiConfigDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  systemPrompt?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  greetingMessage?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tone?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string

  @ApiPropertyOptional()
  @IsOptional()
  temperature?: number

  @ApiPropertyOptional()
  @IsOptional()
  maxTokens?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoInjectCatalog?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  customRules?: string[]

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AiTestPromptDto {
  @ApiProperty()
  @IsString()
  message!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  systemPrompt?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string

  @ApiPropertyOptional()
  @IsOptional()
  temperature?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoInjectCatalog?: boolean
}

