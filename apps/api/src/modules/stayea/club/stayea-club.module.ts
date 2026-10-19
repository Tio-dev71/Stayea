import { Module } from "@nestjs/common"

import { StayeaClubController } from "@/modules/stayea/club/stayea-club.controller"
import { StayeaClubService } from "@/modules/stayea/club/stayea-club.service"

@Module({
  controllers: [StayeaClubController],
  providers: [StayeaClubService],
  exports: [StayeaClubService],
})
export class StayeaClubModule {}
