import { Body, Controller, Get, Post } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { AiChatRequestDto } from "@/modules/stayea/ai-agent/dtos/ai-agent.dto"
import { StayeaAiAgentService } from "@/modules/stayea/ai-agent/stayea-ai-agent.service"

@ApiTags("Stayea AI Concierge Agent")
@Controller("stayea/ai")
export class StayeaAiAgentController {
  constructor(private readonly aiService: StayeaAiAgentService) {}

  @Public()
  @Post("chat")
  @ApiOperation({
    summary:
      "Gửi tin nhắn tới AI Concierge (Tư vấn, tra cứu lịch trống và tạo đơn draft gửi Admin)",
  })
  @ApiResponse({ status: 200, description: "Phản hồi từ AI và thông tin đơn draft nếu có" })
  async chat(@Body() dto: AiChatRequestDto) {
    return this.aiService.processChat(dto)
  }

  @Public()
  @Get("health")
  @ApiOperation({ summary: "Kiểm tra kết nối tới hệ thống STAYEA AI Engine" })
  async health() {
    return this.aiService.checkHealth()
  }
}
