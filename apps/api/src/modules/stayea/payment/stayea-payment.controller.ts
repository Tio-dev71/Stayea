import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from "@nestjs/common"
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { Roles } from "@/shared-kernel/infrastructure/decorators/roles.decorator"
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import {
  AdminUpdatePayoutStatusDto,
  CheckoutBookingDto,
  CreatePaymentMethodDto,
  InitiatePaymentDto,
  PaymentWebhookDto,
  RequestPayoutDto,
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

  @Get("sepay-webhook")
  @Public()
  @ApiOperation({ summary: "Health check / ping for SePay Webhook endpoint" })
  async sepayWebhookPing() {
    return {
      status: "ready",
      gateway: "SePay MBBank",
      endpoint: "https://stayea.com/api/stayea/payments/sepay-webhook",
      timestamp: new Date().toISOString(),
    }
  }

  @Post("sepay-webhook")
  @Public()
  @ApiOperation({ summary: "SePay Banking Webhook Notification (Automatic Order Confirmation)" })
  async sepayWebhook(
    @Body() payload: any,
    @Headers("authorization") authHeader?: string
  ) {
    return this.paymentService.handleSepayWebhook(payload, authHeader)
  }

  @Post("checkout")
  @ApiOperation({ summary: "Process sandbox checkout for a booking" })
  async checkout(
    @Request() req: { user: { id: string } },
    @Body() dto: CheckoutBookingDto
  ) {
    return this.paymentService.processCheckout(req.user.id, dto)
  }

  @Post("payouts/request")
  @UseEnvelope()
  @ApiOperation({ summary: "Partner requests a payout withdrawal" })
  async requestPayout(
    @Request() req: { user: { id: string } },
    @Body() dto: RequestPayoutDto
  ) {
    return this.paymentService.requestPartnerPayout(req.user.id, dto)
  }

  @Get("payouts/overview")
  @UseEnvelope()
  @ApiOperation({ summary: "Get partner settlement overview (available balance, history)" })
  async getPayoutOverview(@Request() req: { user: { id: string } }) {
    return this.paymentService.getPartnerPayoutOverview(req.user.id)
  }

  @Get("admin/payouts")
  @Roles("ADMIN")
  @UseEnvelope()
  @ApiOperation({ summary: "Admin lists all partner payout requests" })
  async getAdminPayouts(
    @Query("status") status?: "pending" | "approved" | "processing" | "paid" | "rejected"
  ) {
    return this.paymentService.getAllPayoutsForAdmin(status)
  }

  @Patch("admin/payouts/:id/status")
  @Roles("ADMIN")
  @UseEnvelope()
  @ApiOperation({ summary: "Admin updates payout status (approve, mark paid, reject)" })
  async updateAdminPayout(
    @Param("id") id: string,
    @Body() dto: AdminUpdatePayoutStatusDto
  ) {
    return this.paymentService.updatePayoutStatus(id, dto)
  }
}
