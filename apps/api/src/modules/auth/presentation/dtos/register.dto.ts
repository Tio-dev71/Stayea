import { ApiProperty } from '@nestjs/swagger'

import {
  IsEmailField,
  IsNotEmptyField,
  IsStringField,
  MaxLengthField,
  MinLengthField,
} from '@/shared-kernel/infrastructure/decorators/validators'

/**
 * Adapts better-auth schema - accepts standard human names & Vietnamese characters
 */
export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmailField({ message: 'Email không đúng định dạng' })
  email: string

  @ApiProperty({ example: 'Nguyễn Minh' })
  @IsStringField()
  @IsNotEmptyField({ message: 'Họ và tên không được để trống' })
  @MinLengthField(2, { message: 'Họ và tên phải có ít nhất 2 ký tự' })
  @MaxLengthField(100, { message: 'Họ và tên không được vượt quá 100 ký tự' })
  name: string

  @ApiProperty({ example: 'Pass123456' })
  @IsStringField()
  @IsNotEmptyField({ message: 'Mật khẩu không được để trống' })
  @MinLengthField(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @MaxLengthField(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' })
  password: string
}

export { LoginResponseDto as RegisterResponseDto, UserInfo } from './login.dto.js'
