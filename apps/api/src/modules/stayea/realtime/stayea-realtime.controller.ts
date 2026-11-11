import { Controller, Get, Query, Sse } from "@nestjs/common"
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger"
import { Observable } from "rxjs"
import { Public } from "@/shared-kernel/infrastructure/decorators/public.decorator"
import { StayeaRealtimeService } from "@/modules/stayea/realtime/stayea-realtime.service"

@ApiTags("Stayea Realtime Stream")
@Controller("stayea/realtime")
export class StayeaRealtimeController {
  constructor(private readonly realtimeService: StayeaRealtimeService) {}

  @Get("stream")
  @Public()
  @Sse()
  @ApiOperation({
    summary: "Establish real-time Server-Sent Events (SSE) stream for instant zero-F5 live updates",
  })
  @ApiQuery({
    name: "channel",
    required: false,
    description: "Channel identifier (e.g. partner:part-xxx, admin, user:usr-yyy, or global)",
  })
  stream(@Query("channel") channel?: string): Observable<MessageEvent> {
    const targetChannel = channel || "global"
    return this.realtimeService.getChannelStream(targetChannel)
  }
}

