import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Adjust based on guard's user property structure, e.g. user.userEntity
    return request.user?.userEntity ?? request.user;
  },
);
