import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { StayeaPartnerModule } from "@/modules/stayea/partner/stayea-partner.module"
import { StayeaAiAgentController } from "@/modules/stayea/ai-agent/stayea-ai-agent.controller"
import { StayeaAiAgentService } from "@/modules/stayea/ai-agent/stayea-ai-agent.service"

@Module({
  imports: [ConfigModule, StayeaPartnerModule],
  controllers: [StayeaAiAgentController],
  providers: [StayeaAiAgentService],
  exports: [StayeaAiAgentService],
})
export class StayeaAiAgentModule {}
