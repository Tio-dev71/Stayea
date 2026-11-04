import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"

import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import {
  CreateNotificationDto,
  MarkReadDto,
} from "@/modules/stayea/notification/dtos/notification.dto"
import { StayeaNotificationService } from "@/modules/stayea/notification/stayea-notification.service"

@ApiTags("Stayea - Notification Center")
@Controller("stayea/notifications")
export class StayeaNotificationController {
  constructor(private readonly notifService: StayeaNotificationService) {}

  @Public()
  @ApiBearerAuth()
  @Post("broadcast")
  @UseEnvelope()
  @ApiOperation({
    summary: "Admin broadcast or send direct notification to Hub partners, Users, or All",
  })
  async createBroadcast(
    @Request() req: { user?: { id: string; name?: string } },
    @Body() dto: CreateNotificationDto
  ) {
    const senderId = req.user?.id || "admin"
    const senderName = dto.senderName || req.user?.name || "Ban Quản Trị STAYEA"
    return this.notifService.createNotification(senderId, senderName, dto)
  }

  @Public()
  @ApiBearerAuth()
  @Get("my")
  @UseEnvelope()
  @ApiOperation({
    summary: "Get notifications for current user or partner",
  })
  async getMyNotifications(
    @Request() req: { user?: { id: string } },
    @Query("readerId") readerId?: string,
    @Query("role") role: "user" | "partner" | "admin" = "user",
    @Query("limit") limit = "30"
  ) {
    const targetReaderId = readerId || req.user?.id || "guest"
    return this.notifService.getNotificationsForReader(
      targetReaderId,
      role,
      Number(limit) || 30
    )
  }

  @Public()
  @Post(":id/read")
  @UseEnvelope()
  @ApiOperation({ summary: "Mark a notification as read" })
  async markRead(
    @Param("id") id: string,
    @Body() body: MarkReadDto
  ) {
    return this.notifService.markAsRead(id, body.readerId, body.readerRole)
  }

  @Public()
  @Post("read-all")
  @UseEnvelope()
  @ApiOperation({ summary: "Mark all notifications as read" })
  async markAllRead(@Body() body: MarkReadDto) {
    return this.notifService.markAllAsRead(body.readerId, body.readerRole)
  }

  @Public()
  @ApiBearerAuth()
  @Get("admin/history")
  @UseEnvelope()
  @ApiOperation({ summary: "Admin view: Get all sent broadcast notifications" })
  async getAdminHistory(@Query("limit") limit = "50") {
    return this.notifService.getAdminBroadcastHistory(Number(limit) || 50)
  }

  @Public()
  @ApiBearerAuth()
  @Delete("admin/:id")
  @UseEnvelope()
  @ApiOperation({ summary: "Admin delete a notification" })
  async deleteNotification(@Param("id") id: string) {
    return this.notifService.deleteNotification(id)
  }
}

