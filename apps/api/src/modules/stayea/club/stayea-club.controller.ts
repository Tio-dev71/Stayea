import { Body, Controller, Get, Post, Request } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"

import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import { ClaimPerkDto } from "@/modules/stayea/club/dtos/club.dto"
import { StayeaClubService } from "@/modules/stayea/club/stayea-club.service"

@ApiTags("Stayea - Club Loyalty")
@Controller("stayea/club")
@ApiBearerAuth()
export class StayeaClubController {
  constructor(private readonly clubService: StayeaClubService) {}

  @Get("profile")
  @ApiOperation({ summary: "Get user Stayea Club loyalty profile and points balance" })
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.clubService.getProfile(req.user.id)
  }

  @Get("perks")
  @UseEnvelope()
  @ApiOperation({ summary: "Get user claimed perks and active benefits" })
  async getPerks(@Request() req: { user: { id: string } }) {
    return this.clubService.getPerks(req.user.id)
  }

  @Post("claim-perk")
  @ApiOperation({ summary: "Claim a Stayea Club exclusive offer" })
  async claimPerk(
    @Request() req: { user: { id: string } },
    @Body() dto: ClaimPerkDto
  ) {
    return this.clubService.claimPerk(req.user.id, dto)
  }

  @Get("history")
  @UseEnvelope()
  @ApiOperation({ summary: "Get Stayea Club points earning and redemption history" })
  async getHistory(@Request() req: { user: { id: string } }) {
    return this.clubService.getPointsHistory(req.user.id)
  }
}
