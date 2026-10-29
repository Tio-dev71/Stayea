import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { IS_PUBLIC_KEY } from '@/shared-kernel/infrastructure/decorators/public.decorator'

import type { ExecutionContext } from '@nestjs/common'

/**
 * JWT authentication guard
 *
 * Applied globally via APP_GUARD. Routes marked with @Public() are skipped.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      const req = context.switchToHttp().getRequest()
      const authHeader = req?.headers?.authorization
      if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        // Attempt passport authentication so req.user gets populated if token is present
        return super.canActivate(context)
      }
      return true
    }

    return super.canActivate(context)
  }

  override handleRequest<TUser = any>(
    err: any,
    user: any,
    _info: any,
    context: ExecutionContext,
  ): TUser {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      // If public, never throw 401: attach user if found, or null if guest/invalid token
      return (user || null) as TUser
    }

    return super.handleRequest(err, user, _info, context)
  }
}
