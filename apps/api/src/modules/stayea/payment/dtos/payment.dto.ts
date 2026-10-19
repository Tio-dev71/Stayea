import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreatePaymentMethodDto {
  @ApiProperty({
    enum: ["credit_card", "bank_account", "e_wallet"],
    example: "credit_card",
  })
  @IsEnum(["credit_card", "bank_account", "e_wallet"])
  @IsNotEmpty()
  type: "credit_card" | "bank_account" | "e_wallet"

  @ApiProperty({ example: "visa" })
  @IsString()
  @IsNotEmpty()
  brand: string

  @ApiProperty({ example: "Thẻ Visa Platinum •••• 8899" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false

  @ApiPropertyOptional({
    description: "Instrument parameters (cardNumber, bankName, accountNumber, etc.)",
  })
  @IsOptional()
  details?: {
    cardHolder?: string
    cardNumber?: string
    expDate?: string
    bankName?: string
    accountNumber?: string
    walletProvider?: string
    phoneNumber?: string
  }
}

export class CheckoutBookingDto {
  @ApiProperty({ example: "bk-uuid-or-id" })
  @IsString()
  @IsNotEmpty()
  bookingId: string

  @ApiPropertyOptional({ example: "pm-1" })
  @IsOptional()
  @IsString()
  paymentMethodId?: string

  @ApiPropertyOptional({ example: "credit_card", default: "credit_card" })
  @IsOptional()
  @IsString()
  paymentMethodType?: string = "credit_card"
}
