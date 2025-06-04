import { applyDecorators, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '../guards/refreshtoken.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Authenticated() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    UseGuards(RefreshTokenGuard),
  );
}
