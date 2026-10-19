import { Module } from "@nestjs/common"

import { StayeaPaymentController } from "@/modules/stayea/payment/stayea-payment.controller"
import { StayeaPaymentService } from "@/modules/stayea/payment/stayea-payment.service"

@Module({
  controllers: [StayeaPaymentController],
  providers: [StayeaPaymentService],
  exports: [StayeaPaymentService],
})
export class StayeaPaymentModule {}
