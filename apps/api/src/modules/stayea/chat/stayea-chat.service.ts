import { randomUUID } from "node:crypto"
import {
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import {
  partnerProfilesTable,
  stayeaChatConversationsTable,
  stayeaChatMessagesTable,
} from "@workspace/database"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import type { DrizzleDb } from "@/app/database/db.port"
import type { SendChatMessageDto, StartCustomerChatDto } from "@/modules/stayea/chat/dtos/chat.dto"

function generateUid(prefix: string) {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 12)}`
}

@Injectable()
export class StayeaChatService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDb) {}

  /**
   * Get all conversations (Admin view)
   */
  async getConversations(filter?: { type?: string; search?: string }) {
    const conditions = []

    if (filter?.type && filter.type !== "all") {
      conditions.push(eq(stayeaChatConversationsTable.type, filter.type as any))
    }

    if (filter?.search?.trim()) {
      const q = `%${filter.search.trim()}%`
      conditions.push(
        or(
          ilike(stayeaChatConversationsTable.participantName, q),
          ilike(stayeaChatConversationsTable.participantPhone, q),
          ilike(stayeaChatConversationsTable.participantEmail, q),
          ilike(stayeaChatConversationsTable.lastMessage, q)
        )
      )
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const conversations = await this.db
      .select()
      .from(stayeaChatConversationsTable)
      .where(whereClause)
      .orderBy(desc(stayeaChatConversationsTable.lastMessageAt))

    return conversations
  }

  /**
   * Get messages for a single conversation
   */
  async getMessages(conversationId: string, markReadBy?: "admin" | "participant") {
    const conv = await this.db
      .select()
      .from(stayeaChatConversationsTable)
      .where(eq(stayeaChatConversationsTable.id, conversationId))
      .limit(1)

    const currentConv = conv[0]
    if (!currentConv) {
      throw new NotFoundException("Không tìm thấy cuộc hội thoại.")
    }

    // Reset unread count if requested
    if (markReadBy === "admin") {
      await this.db
        .update(stayeaChatConversationsTable)
        .set({ unreadAdminCount: 0 })
        .where(eq(stayeaChatConversationsTable.id, conversationId))
    } else if (markReadBy === "participant") {
      await this.db
        .update(stayeaChatConversationsTable)
        .set({ unreadParticipantCount: 0 })
        .where(eq(stayeaChatConversationsTable.id, conversationId))
    }

    const messages = await this.db
      .select()
      .from(stayeaChatMessagesTable)
      .where(eq(stayeaChatMessagesTable.conversationId, conversationId))
      .orderBy(stayeaChatMessagesTable.createdAt)

    return {
      conversation: currentConv,
      messages,
    }
  }

  /**
   * Send a message to an existing conversation
   */
  async sendMessage(conversationId: string, dto: SendChatMessageDto) {
    const conv = await this.db
      .select()
      .from(stayeaChatConversationsTable)
      .where(eq(stayeaChatConversationsTable.id, conversationId))
      .limit(1)

    if (!conv || conv.length === 0) {
      throw new NotFoundException("Không tìm thấy cuộc hội thoại.")
    }

    const senderType = dto.senderType || "customer"
    const messageId = generateUid("msg")

    const newMsg = {
      id: messageId,
      conversationId,
      senderType,
      senderId: dto.senderId || null,
      senderName: dto.senderName || (senderType === "admin" ? "STAYEA CSKH VIP" : "Khách hàng"),
      senderAvatar: dto.senderAvatar || null,
      content: dto.content,
      metadata: dto.metadata || {},
      isRead: false,
    }

    await this.db.insert(stayeaChatMessagesTable).values(newMsg)

    // Update conversation last message & counters
    const updateData: any = {
      lastMessage: dto.content,
      lastMessageAt: new Date(),
    }

    if (senderType === "admin") {
      updateData.unreadParticipantCount = sql`${stayeaChatConversationsTable.unreadParticipantCount} + 1`
    } else {
      updateData.unreadAdminCount = sql`${stayeaChatConversationsTable.unreadAdminCount} + 1`
    }

    await this.db
      .update(stayeaChatConversationsTable)
      .set(updateData)
      .where(eq(stayeaChatConversationsTable.id, conversationId))

    return newMsg
  }

  /**
   * Customer initiates chat from AI Widget or website
   */
  async startCustomerChat(dto: StartCustomerChatDto, authenticatedUserId?: string) {
    const participantId =
      authenticatedUserId ||
      dto.sessionId ||
      dto.customerPhone ||
      dto.customerEmail ||
      generateUid("guest")

    // Check if open conversation already exists for this participant
    const existing = await this.db
      .select()
      .from(stayeaChatConversationsTable)
      .where(
        and(
          eq(stayeaChatConversationsTable.type, "customer"),
          or(
            eq(stayeaChatConversationsTable.participantId, participantId),
            dto.customerPhone
              ? eq(stayeaChatConversationsTable.participantPhone, dto.customerPhone)
              : sql`false`,
            dto.customerEmail
              ? eq(stayeaChatConversationsTable.participantEmail, dto.customerEmail)
              : sql`false`
          )
        )
      )
      .limit(1)

    let convId: string

    if (existing && existing.length > 0 && existing[0]) {
      const activeConv = existing[0]
      convId = activeConv.id
      // Update contact info if provided
      if (dto.customerName || dto.customerPhone || dto.customerEmail) {
        await this.db
          .update(stayeaChatConversationsTable)
          .set({
            participantName: dto.customerName || activeConv.participantName,
            participantPhone: dto.customerPhone || activeConv.participantPhone,
            participantEmail: dto.customerEmail || activeConv.participantEmail,
          })
          .where(eq(stayeaChatConversationsTable.id, activeConv.id))
      }
    } else {
      convId = generateUid("conv")
      const newConv = {
        id: convId,
        type: "customer" as const,
        participantId,
        participantName: dto.customerName || "Khách hàng STAYEA",
        participantPhone: dto.customerPhone || null,
        participantEmail: dto.customerEmail || null,
        participantAvatar: "/profile/profile-avatar.jpg",
        partnerId: null,
        lastMessage: dto.initialMessage || "Khách hàng yêu cầu kết nối chuyên viên tư vấn",
        unreadAdminCount: 1,
        unreadParticipantCount: 0,
        metadata: dto.metadata || {},
      }
      await this.db.insert(stayeaChatConversationsTable).values(newConv)
    }

    // Send initial message if provided
    if (dto.initialMessage?.trim()) {
      await this.sendMessage(convId, {
        content: dto.initialMessage.trim(),
        senderType: "customer",
        senderName: dto.customerName || "Khách hàng",
        senderId: participantId,
        metadata: dto.metadata,
      })
    }

    // Return conversation and messages
    return this.getMessages(convId, "participant")
  }

  /**
   * Get or create partner <-> admin conversation
   */
  async getOrCreatePartnerConversation(partnerId: string) {
    // 1. Fetch partner profile
    const partner = await this.db
      .select()
      .from(partnerProfilesTable)
      .where(eq(partnerProfilesTable.id, partnerId))
      .limit(1)

    const p = partner[0]
    if (!p) {
      throw new NotFoundException(`Không tìm thấy đối tác với mã: ${partnerId}`)
    }

    // 2. Look for existing conversation
    const existing = await this.db
      .select()
      .from(stayeaChatConversationsTable)
      .where(
        and(
          eq(stayeaChatConversationsTable.type, "partner"),
          eq(stayeaChatConversationsTable.partnerId, partnerId)
        )
      )
      .limit(1)

    let convId = existing && existing.length > 0 && existing[0] ? existing[0].id : null

    if (!convId) {
      convId = generateUid("conv_partner")
      const newConv = {
        id: convId,
        type: "partner" as const,
        participantId: p.userId || partnerId,
        participantName: p.businessName || p.contactName,
        participantPhone: p.phone,
        participantEmail: p.email,
        participantAvatar: "/avatars/avatar-1.jpg",
        partnerId: p.id,
        lastMessage: "Kênh kết nối trực tiếp STAYEA Admin & Đối tác cơ sở",
        unreadAdminCount: 0,
        unreadParticipantCount: 0,
        metadata: {
          businessType: p.businessType,
          address: p.address,
          city: p.city,
          contactName: p.contactName,
        },
      }
      await this.db.insert(stayeaChatConversationsTable).values(newConv)

      // Insert welcome message
      await this.db.insert(stayeaChatMessagesTable).values({
        id: generateUid("msg"),
        conversationId: convId,
        senderType: "admin",
        senderName: "Hệ thống STAYEA Admin",
        content: `Chào ${p.contactName} (${p.businessName})! Đây là kênh liên lạc và điều phối đơn trực tiếp với Ban Quản trị STAYEA. Mọi yêu cầu kiểm tra phòng trống, xác nhận đơn hoặc hỗ trợ thanh toán sẽ được trao đổi tại đây.`,
        isRead: false,
      })
    }

    return this.getMessages(convId)
  }
}
