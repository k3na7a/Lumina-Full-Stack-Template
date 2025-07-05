import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RefreshTokenGuard } from '../guards/refreshtoken.guard';
import { IS_PUBLIC_KEY } from './public.decorator';

export function RequiresRefreshToken() {
  return applyDecorators(
    SetMetadata(IS_PUBLIC_KEY, true),
    ApiBearerAuth('access-token'),
    UseGuards(RefreshTokenGuard),
  );
}
