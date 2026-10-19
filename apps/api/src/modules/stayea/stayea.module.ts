import { Module } from "@nestjs/common"

import { StayeaBookingModule } from "@/modules/stayea/booking/stayea-booking.module"
import { StayeaCatalogModule } from "@/modules/stayea/catalog/stayea-catalog.module"
import { StayeaClubModule } from "@/modules/stayea/club/stayea-club.module"
import { StayeaPaymentModule } from "@/modules/stayea/payment/stayea-payment.module"
import { StayeaUserModule } from "@/modules/stayea/user/stayea-user.module"

@Module({
  imports: [
    StayeaCatalogModule,
    StayeaBookingModule,
    StayeaClubModule,
    StayeaPaymentModule,
    StayeaUserModule,
  ],
  exports: [
    StayeaCatalogModule,
    StayeaBookingModule,
    StayeaClubModule,
    StayeaPaymentModule,
    StayeaUserModule,
  ],
})
export class StayeaModule {}
