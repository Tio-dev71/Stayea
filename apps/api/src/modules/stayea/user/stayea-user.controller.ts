import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"

import { UseEnvelope } from "@/shared-kernel/infrastructure/decorators/use-envelope.decorator"

import {
  ClaimVoucherDto,
  CreatePlanDto,
  CreateReviewDto,
  FavoriteItemDto,
  UpdateUserSettingsDto,
} from "@/modules/stayea/user/dtos/user-activity.dto"
import { StayeaUserService } from "@/modules/stayea/user/stayea-user.service"

@ApiTags("Stayea - User Activity & Wallet")
@Controller("stayea/user")
@ApiBearerAuth()
export class StayeaUserController {
  constructor(private readonly userService: StayeaUserService) {}

  // ---- Vouchers ----
  @Get("vouchers")
  @UseEnvelope()
  @ApiOperation({ summary: "Get user personal voucher wallet" })
  async getVouchers(@Request() req: { user: { id: string } }) {
    return this.userService.getUserVouchers(req.user.id)
  }

  @Post("vouchers/claim")
  @ApiOperation({ summary: "Claim promo code into user personal wallet" })
  async claimVoucher(
    @Request() req: { user: { id: string } },
    @Body() dto: ClaimVoucherDto
  ) {
    return this.userService.claimVoucher(req.user.id, dto)
  }

  // ---- Trip Plans ----
  @Get("plans")
  @UseEnvelope()
  @ApiOperation({ summary: "Get user customized trip plans and itineraries" })
  async getPlans(@Request() req: { user: { id: string } }) {
    return this.userService.getUserPlans(req.user.id)
  }

  @Post("plans")
  @ApiOperation({ summary: "Create a new customized trip plan" })
  async createPlan(
    @Request() req: { user: { id: string } },
    @Body() dto: CreatePlanDto
  ) {
    return this.userService.createPlan(req.user.id, dto)
  }

  @Delete("plans/:id")
  @ApiOperation({ summary: "Delete trip plan by ID" })
  async deletePlan(
    @Request() req: { user: { id: string } },
    @Param("id") id: string
  ) {
    return this.userService.deletePlan(req.user.id, id)
  }

  // ---- Favorites ----
  @Get("favorites")
  @UseEnvelope()
  @ApiOperation({ summary: "Get user favorites / wishlist" })
  async getFavorites(
    @Request() req: { user: { id: string } },
    @Query("itemType") itemType?: string
  ) {
    return this.userService.getFavorites(req.user.id, itemType)
  }

  @Post("favorites")
  @ApiOperation({ summary: "Add or toggle item in wishlist" })
  async addFavorite(
    @Request() req: { user: { id: string } },
    @Body() dto: FavoriteItemDto
  ) {
    return this.userService.addFavorite(req.user.id, dto)
  }

  @Delete("favorites/:idOrItemId")
  @ApiOperation({ summary: "Remove item from wishlist" })
  async removeFavorite(
    @Request() req: { user: { id: string } },
    @Param("idOrItemId") idOrItemId: string
  ) {
    return this.userService.removeFavorite(req.user.id, idOrItemId)
  }

  // ---- Reviews ----
  @Get("reviews")
  @UseEnvelope()
  @ApiOperation({ summary: "Get user submitted reviews" })
  async getReviews(@Request() req: { user: { id: string } }) {
    return this.userService.getUserReviews(req.user.id)
  }

  @Post("reviews")
  @ApiOperation({ summary: "Submit a new rating and review" })
  async createReview(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateReviewDto
  ) {
    return this.userService.createReview(req.user.id, dto)
  }

  // ---- Settings ----
  @Get("settings")
  @ApiOperation({ summary: "Get user notifications and account preferences" })
  async getSettings(@Request() req: { user: { id: string } }) {
    return this.userService.getUserSettings(req.user.id)
  }

  @Patch("settings")
  @ApiOperation({ summary: "Update user notifications and preferences" })
  async updateSettings(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateUserSettingsDto
  ) {
    return this.userService.updateUserSettings(req.user.id, dto)
  }
}
