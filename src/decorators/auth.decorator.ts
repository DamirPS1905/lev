import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const AuthInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    return req.user ? req.user : null
  }
)