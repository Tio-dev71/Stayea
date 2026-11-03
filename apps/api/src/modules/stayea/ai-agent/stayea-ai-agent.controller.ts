import { Body, Controller, Get, Patch, Post, Request } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Throttle } from "@nestjs/throttler"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { Roles } from "@/shared-kernel/infrastructure/decorators/roles.decorator"
import {
  AiChatRequestDto,
  AiTestPromptDto,
  UpdateAiConfigDto,
} from "@/modules/stayea/ai-agent/dtos/ai-agent.dto"
import { StayeaAiAgentService } from "@/modules/stayea/ai-agent/stayea-ai-agent.service"

@ApiTags("Stayea AI Concierge Agent")
@Controller("stayea/ai")
export class StayeaAiAgentController {
  constructor(private readonly aiService: StayeaAiAgentService) {}

  @Public()
  @Throttle({ default: { limit: 20, ttl: 300000 } })
  @Post("chat")
  @ApiOperation({
    summary:
      "Gửi tin nhắn tới AI Concierge (Tư vấn, tra cứu lịch trống và tạo đơn draft gửi Admin)",
  })
  @ApiResponse({ status: 200, description: "Phản hồi từ AI và thông tin đơn draft nếu có" })
  async chat(@Body() dto: AiChatRequestDto) {
    return this.aiService.processChat(dto)
  }

  @ApiBearerAuth()
  @Roles("ADMIN")
  @Get("config")
  @ApiOperation({ summary: "Lấy cấu hình Prompt và tham số mô hình của STAYEA AI (Admin Only)" })
  async getConfig() {
    return this.aiService.getAiConfig()
  }

  @ApiBearerAuth()
  @Roles("ADMIN")
  @Patch("config")
  @ApiOperation({ summary: "Quản trị viên cập nhật Prompt và tham số STAYEA AI (Admin Only)" })
  async updateConfig(@Body() dto: UpdateAiConfigDto, @Request() req: any) {
    const updatedBy = req?.user?.email || req?.user?.name || "Admin"
    return this.aiService.updateAiConfig(dto, updatedBy)
  }

  @ApiBearerAuth()
  @Roles("ADMIN")
  @Post("config/reset")
  @ApiOperation({ summary: "Khôi phục cấu hình Prompt AI về mặc định của hệ thống (Admin Only)" })
  async resetConfig(@Request() req: any) {
    const updatedBy = req?.user?.email || req?.user?.name || "Admin"
    return this.aiService.resetAiConfig(updatedBy)
  }

  @ApiBearerAuth()
  @Roles("ADMIN")
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @Post("test")
  @ApiOperation({ summary: "Thử nghiệm Prompt AI trực tiếp trong Sandbox (Admin test)" })
  async testPrompt(@Body() dto: AiTestPromptDto) {
    return this.aiService.testPrompt(dto)
  }

  @Public()
  @Get("health")
  @ApiOperation({ summary: "Kiểm tra kết nối tới hệ thống STAYEA AI Engine" })
  async health() {
    return this.aiService.checkHealth()
  }
}
