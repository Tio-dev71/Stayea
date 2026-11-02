import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { SendChatMessageDto, StartCustomerChatDto } from "@/modules/stayea/chat/dtos/chat.dto"
import { StayeaChatService } from "@/modules/stayea/chat/stayea-chat.service"

@ApiTags("Stayea - Realtime Chat & Messages")
@Controller("stayea/chat")
export class StayeaChatController {
  constructor(private readonly chatService: StayeaChatService) {}

  // -------------------------------------------------------------
  // Public Customer Chat (STAYEA AI Widget / Mobile Web)
  // -------------------------------------------------------------

  @Public()
  @Post("customer/start")
  @ApiOperation({ summary: "Customer starts chat with consultant from STAYEA AI widget" })
  async startCustomerChat(@Body() dto: StartCustomerChatDto, @Request() req: any) {
    const userId = req?.user?.id || req?.user?.sub
    return this.chatService.startCustomerChat(dto, userId)
  }

  // -------------------------------------------------------------
  // General Conversation Messages
  // -------------------------------------------------------------

  @Public()
  @Get("conversations/:id/messages")
  @ApiOperation({ summary: "Get message history of a conversation" })
  async getMessages(
    @Param("id") id: string,
    @Query("markReadBy") markReadBy?: "admin" | "participant"
  ) {
    return this.chatService.getMessages(id, markReadBy)
  }

  @Public()
  @Post("conversations/:id/messages")
  @ApiOperation({ summary: "Send a message into conversation" })
  async sendMessage(
    @Param("id") id: string,
    @Body() dto: SendChatMessageDto
  ) {
    return this.chatService.sendMessage(id, dto)
  }

  // -------------------------------------------------------------
  // Admin View: List all conversations
  // -------------------------------------------------------------

  @Public()
  @Get("conversations")
  @ApiOperation({ summary: "Admin list conversations with filter and search" })
  async getConversations(
    @Query("type") type?: string,
    @Query("search") search?: string
  ) {
    return this.chatService.getConversations({ type, search })
  }

  // -------------------------------------------------------------
  // Partner Hub & Host Chat Endpoints
  // -------------------------------------------------------------

  @Public()
  @Get("partner/:partnerId")
  @ApiOperation({ summary: "Get or create partner conversation with admin" })
  async getPartnerConversation(@Param("partnerId") partnerId: string) {
    return this.chatService.getOrCreatePartnerConversation(partnerId)
  }

  @Public()
  @Post("partner/:partnerId/messages")
  @ApiOperation({ summary: "Send message in partner-admin conversation" })
  async sendPartnerMessage(
    @Param("partnerId") partnerId: string,
    @Body() dto: SendChatMessageDto
  ) {
    const chat = await this.chatService.getOrCreatePartnerConversation(partnerId)
    return this.chatService.sendMessage(chat.conversation.id, {
      ...dto,
      senderType: dto.senderType || "partner",
    })
  }
}
