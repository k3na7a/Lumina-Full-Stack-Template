import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RefreshTokenGuard } from '../guards/refreshtoken.guard';
import { CsrfGuard } from '../guards/csrf.guard';

export function RequiresRefreshToken() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    UseGuards(CsrfGuard, RefreshTokenGuard),
  );
}
