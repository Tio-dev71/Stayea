import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

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

export class InitiatePaymentDto {
  @ApiProperty({ example: "bk-uuid-or-id" })
  @IsString()
  @IsNotEmpty()
  bookingId: string

  @ApiPropertyOptional({
    enum: ["vietqr", "payos", "vnpay", "momo", "credit_card", "sandbox"],
    default: "vietqr",
  })
  @IsOptional()
  @IsEnum(["vietqr", "payos", "vnpay", "momo", "credit_card", "sandbox"])
  gatewayProvider?: "vietqr" | "payos" | "vnpay" | "momo" | "credit_card" | "sandbox" = "vietqr"

  @ApiPropertyOptional({ example: "https://stayea.com/bookings/success" })
  @IsOptional()
  @IsString()
  returnUrl?: string

  @ApiPropertyOptional({ example: "https://stayea.com/bookings/cancel" })
  @IsOptional()
  @IsString()
  cancelUrl?: string
}

export class PaymentWebhookDto {
  @ApiProperty({ example: "STA-202610-8888" })
  @IsString()
  @IsNotEmpty()
  orderCode: string

  @ApiProperty({ example: "TX-20261020-123456" })
  @IsString()
  @IsNotEmpty()
  transactionRef: string

  @ApiProperty({ example: 2_500_000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number

  @ApiProperty({ enum: ["PAID", "FAILED", "CANCELLED"], example: "PAID" })
  @IsEnum(["PAID", "FAILED", "CANCELLED"])
  @IsNotEmpty()
  status: "PAID" | "FAILED" | "CANCELLED"

  @ApiPropertyOptional({ example: "payos" })
  @IsOptional()
  @IsString()
  gateway?: string

  @ApiPropertyOptional({ description: "Cryptographic signature sent by payment gateway for HMAC verification" })
  @IsOptional()
  @IsString()
  signature?: string
}
