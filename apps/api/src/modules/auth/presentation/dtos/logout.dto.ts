import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class LogoutDto {
  @ApiPropertyOptional({ description: 'Refresh Token' })
  @IsString()
  @IsOptional()
  refreshToken?: string
}

export class LogoutResponseDto {
  @ApiProperty({ description: 'Whether the operation succeeded' })
  success: boolean

  @ApiProperty({ description: 'Response message' })
  message: string
}

export class LogoutAllResponseDto {
  @ApiProperty({ description: 'Number of sessions revoked' })
  revokedCount: number

  @ApiProperty({ description: 'Response message' })
  message: string
}
