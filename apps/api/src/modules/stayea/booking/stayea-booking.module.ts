import { Module } from "@nestjs/common"

import { StayeaBookingController } from "@/modules/stayea/booking/stayea-booking.controller"
import { StayeaBookingService } from "@/modules/stayea/booking/stayea-booking.service"

@Module({
  controllers: [StayeaBookingController],
  providers: [StayeaBookingService],
  exports: [StayeaBookingService],
})
export class StayeaBookingModule {}
