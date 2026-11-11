import { Module } from "@nestjs/common"

import { StayeaBlogModule } from "@/modules/stayea/blog/stayea-blog.module"
import { StayeaBookingModule } from "@/modules/stayea/booking/stayea-booking.module"
import { StayeaCatalogModule } from "@/modules/stayea/catalog/stayea-catalog.module"
import { StayeaClubModule } from "@/modules/stayea/club/stayea-club.module"
import { StayeaAiAgentModule } from "@/modules/stayea/ai-agent/stayea-ai-agent.module"
import { StayeaChatModule } from "@/modules/stayea/chat/stayea-chat.module"
import { StayeaNotificationModule } from "@/modules/stayea/notification/stayea-notification.module"
import { StayeaPartnerModule } from "@/modules/stayea/partner/stayea-partner.module"
import { StayeaPaymentModule } from "@/modules/stayea/payment/stayea-payment.module"
import { StayeaPmsModule } from "@/modules/stayea/pms/stayea-pms.module"
import { StayeaRealtimeModule } from "@/modules/stayea/realtime/stayea-realtime.module"
import { StayeaUserModule } from "@/modules/stayea/user/stayea-user.module"

@Module({
  imports: [
    StayeaNotificationModule,
    StayeaCatalogModule,
    StayeaBookingModule,
    StayeaClubModule,
    StayeaPaymentModule,
    StayeaUserModule,
    StayeaPartnerModule,
    StayeaAiAgentModule,
    StayeaChatModule,
    StayeaBlogModule,
    StayeaPmsModule,
    StayeaRealtimeModule,
  ],
  exports: [
    StayeaNotificationModule,
    StayeaCatalogModule,
    StayeaBookingModule,
    StayeaClubModule,
    StayeaPaymentModule,
    StayeaUserModule,
    StayeaPartnerModule,
    StayeaAiAgentModule,
    StayeaChatModule,
    StayeaBlogModule,
    StayeaPmsModule,
    StayeaRealtimeModule,
  ],
})
export class StayeaModule {}
