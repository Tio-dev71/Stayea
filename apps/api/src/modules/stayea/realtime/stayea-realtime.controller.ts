import { Controller, Get, Logger, Query, Req, Res } from "@nestjs/common"
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger"
import type { Request, Response } from "express"
import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { StayeaRealtimeService } from "@/modules/stayea/realtime/stayea-realtime.service"

@ApiTags("Stayea Realtime Stream")
@Controller("stayea/realtime")
export class StayeaRealtimeController {
  private readonly logger = new Logger(StayeaRealtimeController.name)

  constructor(private readonly realtimeService: StayeaRealtimeService) {}

  @Get("stream")
  @Public()
  @ApiOperation({
    summary: "Establish real-time Server-Sent Events (SSE) stream for instant zero-F5 live updates",
  })
  @ApiQuery({
    name: "channel",
    required: false,
    description: "Channel identifier (e.g. partner:part-xxx, admin, user:usr-yyy, or global)",
  })
  stream(
    @Query("channel") channel: string | undefined,
    @Req() req: Request,
    @Res() res: Response
  ): void {
    const targetChannel = (channel || "global").toLowerCase().trim()

    // Configure headers for SSE stream
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache, no-transform")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no")
    res.flushHeaders?.()

    // Send immediate connected handshake
    res.write(
      `data: ${JSON.stringify({
        event: "connected",
        channel: targetChannel,
        payload: { ready: true },
        timestamp: Date.now(),
      })}\n\n`
    )

    // Subscribe to domain event stream
    const subscription = this.realtimeService
      .getChannelStream(targetChannel)
      .subscribe({
        next: (msg) => {
          if (!res.writableEnded) {
            res.write(`data: ${msg.data}\n\n`)
          }
        },
        error: (err) => {
          this.logger.error(`SSE stream error on channel ${targetChannel}:`, err)
          if (!res.writableEnded) {
            res.end()
          }
        },
      })

    // Clean up subscription when client disconnects
    req.on("close", () => {
      subscription.unsubscribe()
      if (!res.writableEnded) {
        res.end()
      }
    })
  }
}

