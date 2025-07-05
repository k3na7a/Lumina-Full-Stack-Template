import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RequestContext } from '../providers/request-context.provider';
import { Observable } from 'rxjs';

@Injectable()
class JwtAuthGuard extends AuthGuard('jwt-access') {
  constructor(
    private readonly reflector: Reflector,
    private readonly requestContext: RequestContext,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const { user } = context.switchToHttp().getRequest();
    if (user?.sub) this.requestContext.set('userId', user.sub);

    return super.canActivate(context);
  }
}

export { JwtAuthGuard };
