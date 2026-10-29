import { Module } from "@nestjs/common"

import { StayeaBookingModule } from "@/modules/stayea/booking/stayea-booking.module"
import { StayeaCatalogModule } from "@/modules/stayea/catalog/stayea-catalog.module"
import { StayeaClubModule } from "@/modules/stayea/club/stayea-club.module"
import { StayeaPartnerModule } from "@/modules/stayea/partner/stayea-partner.module"
import { StayeaPaymentModule } from "@/modules/stayea/payment/stayea-payment.module"
import { StayeaUserModule } from "@/modules/stayea/user/stayea-user.module"

@Module({
  imports: [
    StayeaCatalogModule,
    StayeaBookingModule,
    StayeaClubModule,
    StayeaPaymentModule,
    StayeaUserModule,
    StayeaPartnerModule,
  ],
  exports: [
    StayeaCatalogModule,
    StayeaBookingModule,
    StayeaClubModule,
    StayeaPaymentModule,
    StayeaUserModule,
    StayeaPartnerModule,
  ],
})
export class StayeaModule {}
