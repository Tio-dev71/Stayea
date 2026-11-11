import { Module } from "@nestjs/common"
import { StayeaRealtimeController } from "@/modules/stayea/realtime/stayea-realtime.controller"
import { StayeaRealtimeService } from "@/modules/stayea/realtime/stayea-realtime.service"

@Module({
  controllers: [StayeaRealtimeController],
  providers: [StayeaRealtimeService],
  exports: [StayeaRealtimeService],
})
export class StayeaRealtimeModule {}

