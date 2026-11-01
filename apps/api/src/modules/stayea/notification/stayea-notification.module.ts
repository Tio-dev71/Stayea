import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { StayeaNotificationService } from "@/modules/stayea/notification/stayea-notification.service"

@Module({
  imports: [ConfigModule],
  providers: [StayeaNotificationService],
  exports: [StayeaNotificationService],
})
export class StayeaNotificationModule {}
