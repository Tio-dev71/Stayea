import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { OAuthService } from '@/modules/auth/application/services/oauth.service'
import { Public } from '@/shared-kernel/infrastructure/decorators/public.decorator'

import type { Env } from '@/app/config/env.schema'
import type { OAuthUserProfile } from '@/modules/auth/application/ports/oauth.port'
import type { Request, Response } from 'express'

type OAuthRequest = Request & { user?: OAuthUserProfile }

@ApiTags('auth')
@Controller('auth/oauth')
@Public()
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name)

  constructor(
    private readonly oauthService: OAuthService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  // ── Direct Social Login (Google / Facebook / Apple) ──────────────────────

  @Post('social-login')
  @ApiOperation({ summary: 'Login or register with social account (Google, Facebook, etc.)' })
  async socialLogin(
    @Body()
    dto: {
      provider?: 'google' | 'github'
      email: string
      name?: string
      providerId?: string
      avatarUrl?: string
    },
  ) {
    if (!dto.email || !dto.email.trim()) {
      throw new BadRequestException('Email is required for social login')
    }

    const provider = dto.provider === 'github' ? 'github' : 'google'
    const cleanEmail = dto.email.toLowerCase().trim()
    const cleanName = (dto.name && dto.name.trim()) || cleanEmail.split('@')[0] || 'User'
    const providerId = dto.providerId || `google_${cleanEmail.replaceAll(/[^a-z0-9]/g, '_')}`

    const userProfile: OAuthUserProfile = {
      provider,
      providerId,
      email: cleanEmail,
      name: cleanName,
      accessToken: 'social_verified_token',
    }

    const result = await this.oauthService.findOrCreateUser(userProfile)
    return result
  }

  // ── Google Server OAuth ──────────────────────────────────────────────────

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  initiateGoogle() {
    // Passport AuthGuard('google') handles the redirect — this method is never reached
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Req() req: OAuthRequest, @Res() res: Response) {
    await this.handleCallback(req, res)
  }

  // ── GitHub Server OAuth ──────────────────────────────────────────────────

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Initiate GitHub OAuth login' })
  initiateGithub() {
    // Passport AuthGuard('github') handles the redirect — this method is never reached
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubCallback(@Req() req: OAuthRequest, @Res() res: Response) {
    await this.handleCallback(req, res)
  }

  // ── Shared ────────────────────────────────────────────────────────────────

  private async handleCallback(req: OAuthRequest, res: Response) {
    const frontendUrl =
      this.configService.get('FRONTEND_URL', { infer: true }) || 'https://stayea.com'

    try {
      if (!req.user) {
        return res.redirect(`${frontendUrl}/login?error=oauth_failed`)
      }

      const { accessToken, refreshToken } = await this.oauthService.findOrCreateUser(req.user)
      const callbackUrl = `${frontendUrl}/oauth/callback?token=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`
      return res.redirect(callbackUrl)
    } catch (error: unknown) {
      const err = error as Error
      this.logger.error(`OAuth callback failed: ${err?.message}`, err?.stack)
      return res.redirect(`${frontendUrl}/login?error=oauth_error`)
    }
  }
}
