import { Module } from "@nestjs/common"

import { StayeaChatController } from "@/modules/stayea/chat/stayea-chat.controller"
import { StayeaChatService } from "@/modules/stayea/chat/stayea-chat.service"

@Module({
  controllers: [StayeaChatController],
  providers: [StayeaChatService],
  exports: [StayeaChatService],
})
export class StayeaChatModule {}
