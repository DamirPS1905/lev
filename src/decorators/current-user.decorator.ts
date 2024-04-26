import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from 'src/web_auth/interfaces';

export const CurrentUser = createParamDecorator(
  (key: keyof JwtPayload, ctx: ExecutionContext): JwtPayload | Partial<JwtPayload> => {
    const request = ctx.switchToHttp().getRequest();
    return key && request.users ? request.user[key] : request.user;
  },
);
