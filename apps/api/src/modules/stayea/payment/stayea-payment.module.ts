import { Module } from "@nestjs/common"

import { StayeaNotificationModule } from "@/modules/stayea/notification/stayea-notification.module"
import { StayeaPaymentController } from "@/modules/stayea/payment/stayea-payment.controller"
import { StayeaPaymentService } from "@/modules/stayea/payment/stayea-payment.service"

@Module({
  imports: [StayeaNotificationModule],
  controllers: [StayeaPaymentController],
  providers: [StayeaPaymentService],
  exports: [StayeaPaymentService],
})
export class StayeaPaymentModule {}
