import { Module } from "@nestjs/common"

import { StayeaBookingController } from "@/modules/stayea/booking/stayea-booking.controller"
import { StayeaBookingService } from "@/modules/stayea/booking/stayea-booking.service"
import { StayeaNotificationModule } from "@/modules/stayea/notification/stayea-notification.module"

@Module({
  imports: [StayeaNotificationModule],
  controllers: [StayeaBookingController],
  providers: [StayeaBookingService],
  exports: [StayeaBookingService],
})
export class StayeaBookingModule {}
