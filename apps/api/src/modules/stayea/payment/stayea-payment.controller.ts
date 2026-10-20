import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Request,
} from "@nestjs/common"
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import {
  CheckoutBookingDto,
  CreatePaymentMethodDto,
  InitiatePaymentDto,
  PaymentWebhookDto,
} from "@/modules/stayea/payment/dtos/payment.dto"
import { StayeaPaymentService } from "@/modules/stayea/payment/stayea-payment.service"

@ApiTags("Stayea - Payment & Billing")
@Controller("stayea/payments")
@ApiBearerAuth()
export class StayeaPaymentController {
  constructor(private readonly paymentService: StayeaPaymentService) {}

  @Get("methods")
  @UseEnvelope()
  @ApiOperation({ summary: "Get current user saved cards, bank accounts, and wallets" })
  async getMethods(@Request() req: { user: { id: string } }) {
    return this.paymentService.getPaymentMethods(req.user.id)
  }

  @Post("methods")
  @ApiOperation({ summary: "Save a new payment method (credit card, bank, wallet)" })
  async addMethod(
    @Request() req: { user: { id: string } },
    @Body() dto: CreatePaymentMethodDto
  ) {
    return this.paymentService.addPaymentMethod(req.user.id, dto)
  }

  @Delete("methods/:id")
  @ApiOperation({ summary: "Delete a saved payment method" })
  async deleteMethod(
    @Request() req: { user: { id: string } },
    @Param("id") id: string
  ) {
    return this.paymentService.deletePaymentMethod(req.user.id, id)
  }

  @Patch("methods/:id/default")
  @ApiOperation({ summary: "Set payment method as default" })
  async setDefault(
    @Request() req: { user: { id: string } },
    @Param("id") id: string
  ) {
    return this.paymentService.setDefaultPaymentMethod(req.user.id, id)
  }

  @Post("initiate")
  @ApiOperation({ summary: "Initiate payment session (VietQR dynamic, PayOS, VNPay, MoMo)" })
  async initiate(
    @Request() req: { user: { id: string } },
    @Body() dto: InitiatePaymentDto
  ) {
    return this.paymentService.initiatePayment(req.user.id, dto)
  }

  @Post("webhook")
  @Public()
  @ApiOperation({ summary: "Payment Gateway Webhook IPN Callback (HMAC Verified, Public)" })
  @ApiHeader({
    name: "x-signature",
    description: "HMAC SHA-256 signature from payment gateway",
    required: false,
  })
  async webhook(
    @Body() dto: PaymentWebhookDto,
    @Headers("x-signature") signatureHeader?: string
  ) {
    return this.paymentService.handlePaymentWebhook(dto, signatureHeader)
  }

  @Post("checkout")
  @ApiOperation({ summary: "Process sandbox checkout for a booking" })
  async checkout(
    @Request() req: { user: { id: string } },
    @Body() dto: CheckoutBookingDto
  ) {
    return this.paymentService.processCheckout(req.user.id, dto)
  }
}
