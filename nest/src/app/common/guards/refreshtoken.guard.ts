import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestContext } from '../providers/request-context.provider';

@Injectable()
class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly requestContext: RequestContext) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = await super.canActivate(context);

    const req = context.switchToHttp().getRequest();
    if (req.user) this.requestContext.set('userId', req.user.id);

    return result as boolean;
  }
}

export { RefreshTokenGuard };
