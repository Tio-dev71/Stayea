import { Module } from "@nestjs/common"

import { StayeaPartnerAdminController } from "@/modules/stayea/partner/stayea-partner-admin.controller"
import { StayeaPartnerController } from "@/modules/stayea/partner/stayea-partner.controller"
import { StayeaPartnerService } from "@/modules/stayea/partner/stayea-partner.service"

@Module({
  controllers: [StayeaPartnerController, StayeaPartnerAdminController],
  providers: [StayeaPartnerService],
  exports: [StayeaPartnerService],
})
export class StayeaPartnerModule {}
