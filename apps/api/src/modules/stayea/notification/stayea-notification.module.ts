import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { StayeaNotificationController } from "@/modules/stayea/notification/stayea-notification.controller"
import { StayeaNotificationService } from "@/modules/stayea/notification/stayea-notification.service"

@Module({
  imports: [ConfigModule],
  controllers: [StayeaNotificationController],
  providers: [StayeaNotificationService],
  exports: [StayeaNotificationService],
})
export class StayeaNotificationModule {}
