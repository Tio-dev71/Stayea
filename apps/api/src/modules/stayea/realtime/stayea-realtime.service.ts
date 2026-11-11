import { Injectable, Logger } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { Observable, Subject, interval, map, merge } from "rxjs"

export interface StayeaRealtimeMessage {
  type: string
  channel: string
  data: any
  timestamp: number
}

@Injectable()
export class StayeaRealtimeService {
  private readonly logger = new Logger(StayeaRealtimeService.name)
  private readonly eventBus$ = new Subject<StayeaRealtimeMessage>()

  /**
   * Get an observable SSE stream for a specific channel (e.g. 'partner:uuid', 'admin', 'user:uuid', or 'global')
   */
  getChannelStream(targetChannel: string): Observable<MessageEvent> {
    const channelLower = (targetChannel || "global").toLowerCase().trim()

    // 1. Filtered events stream
    const events$ = this.eventBus$.pipe(
      map((msg) => {
        // Match specific channel, wildcard prefix, or global broadcast
        const msgChannel = (msg.channel || "").toLowerCase().trim()
        const isMatch =
          msgChannel === "global" ||
          msgChannel === channelLower ||
          channelLower === "global" ||
          (channelLower === "admin" && msgChannel.startsWith("admin")) ||
          msgChannel.startsWith(channelLower)

        if (!isMatch) {
          return null
        }

        return {
          data: JSON.stringify({
            event: msg.type,
            channel: msg.channel,
            payload: msg.data,
            timestamp: msg.timestamp,
          }),
        } as MessageEvent
      })
    )

    // 2. Keep-alive heartbeat ping every 20 seconds so reverse proxies (Nginx) never drop connection
    const heartbeat$ = interval(20000).pipe(
      map(
        () =>
          ({
            data: JSON.stringify({
              event: "ping",
              channel: channelLower,
              payload: { alive: true },
              timestamp: Date.now(),
            }),
          }) as MessageEvent
      )
    )

    return merge(events$, heartbeat$).pipe(
      // Filter out null events that were not destined for this channel
      map((evt) => evt as MessageEvent)
    )
  }

  /**
   * Broadcast message to a specific channel
   */
  broadcast(channel: string, event: string, data: any) {
    const payload: StayeaRealtimeMessage = {
      type: event,
      channel: channel || "global",
      data,
      timestamp: Date.now(),
    }
    this.logger.debug(`[Realtime Broadcast] Channel: ${channel} | Event: ${event}`)
    this.eventBus$.next(payload)
  }

  // -------------------------------------------------------------
  // Domain Event Listeners (NestJS EventEmitter2)
  // -------------------------------------------------------------

  @OnEvent("stayea.booking.created")
  handleBookingCreated(payload: any) {
    // Notify admin
    this.broadcast("admin", "booking:created", payload)
    // Notify guest
    if (payload?.userId) {
      this.broadcast(`user:${payload.userId}`, "booking:created", payload)
    }
    // Notify targeted partner if assigned
    if (payload?.partnerId) {
      this.broadcast(`partner:${payload.partnerId}`, "partner:order:created", payload)
    }
  }

  @OnEvent("stayea.booking.updated")
  handleBookingUpdated(payload: any) {
    this.broadcast("admin", "booking:updated", payload)
    if (payload?.userId) {
      this.broadcast(`user:${payload.userId}`, "booking:updated", payload)
    }
    if (payload?.partnerId) {
      this.broadcast(`partner:${payload.partnerId}`, "booking:updated", payload)
    }
  }

  @OnEvent("stayea.partner.order.created")
  handlePartnerOrderCreated(payload: any) {
    if (payload?.partnerId) {
      this.broadcast(`partner:${payload.partnerId}`, "partner:order:created", payload)
    }
    this.broadcast("admin", "partner:order:created", payload)
  }

  @OnEvent("stayea.partner.order.updated")
  handlePartnerOrderUpdated(payload: any) {
    if (payload?.partnerId) {
      this.broadcast(`partner:${payload.partnerId}`, "partner:order:updated", payload)
    }
    this.broadcast("admin", "partner:order:updated", payload)
    if (payload?.userId) {
      this.broadcast(`user:${payload.userId}`, "booking:updated", payload)
    }
  }

  @OnEvent("stayea.pms.room.updated")
  handlePmsRoomUpdated(payload: any) {
    if (payload?.partnerId) {
      this.broadcast(`partner:${payload.partnerId}`, "pms:room:updated", payload)
    }
  }

  @OnEvent("stayea.pms.reservation.created")
  handlePmsReservationCreated(payload: any) {
    if (payload?.partnerId) {
      this.broadcast(`partner:${payload.partnerId}`, "pms:reservation:created", payload)
      this.broadcast(`partner:${payload.partnerId}`, "pms:room:updated", payload)
    }
  }

  @OnEvent("stayea.pms.reservation.updated")
  handlePmsReservationUpdated(payload: any) {
    if (payload?.partnerId) {
      this.broadcast(`partner:${payload.partnerId}`, "pms:reservation:updated", payload)
      this.broadcast(`partner:${payload.partnerId}`, "pms:room:updated", payload)
    }
  }

  @OnEvent("stayea.pms.folio.updated")
  handlePmsFolioUpdated(payload: any) {
    if (payload?.partnerId) {
      this.broadcast(`partner:${payload.partnerId}`, "pms:folio:updated", payload)
    }
  }

  @OnEvent("stayea.pms.stock.updated")
  handlePmsStockUpdated(payload: any) {
    if (payload?.partnerId) {
      this.broadcast(`partner:${payload.partnerId}`, "pms:stock:updated", payload)
    }
  }

  @OnEvent("stayea.notification.created")
  handleNotificationCreated(payload: any) {
    if (payload?.recipientType === "partner" && payload?.recipientId) {
      this.broadcast(`partner:${payload.recipientId}`, "notification:new", payload)
    } else if (payload?.recipientType === "user" && payload?.recipientId) {
      this.broadcast(`user:${payload.recipientId}`, "notification:new", payload)
    } else if (payload?.recipientType === "admin") {
      this.broadcast("admin", "notification:new", payload)
    } else {
      // Broadcast to all
      this.broadcast("global", "notification:new", payload)
    }
  }
}
