import { Module } from "@nestjs/common"

import { StayeaPartnerModule } from "@/modules/stayea/partner/stayea-partner.module"
import { StayeaPmsController } from "@/modules/stayea/pms/stayea-pms.controller"
import { StayeaPmsService } from "@/modules/stayea/pms/stayea-pms.service"

@Module({
  imports: [StayeaPartnerModule],
  controllers: [StayeaPmsController],
  providers: [StayeaPmsService],
  exports: [StayeaPmsService],
})
export class StayeaPmsModule {}
