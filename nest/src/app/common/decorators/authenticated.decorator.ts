import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RefreshTokenGuard } from '../guards/refreshtoken.guard';

export function Authenticated() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    UseGuards(RefreshTokenGuard),
  );
}
