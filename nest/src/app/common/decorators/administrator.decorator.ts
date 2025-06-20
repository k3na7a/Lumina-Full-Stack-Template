import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Role } from 'src/library/enums/role.enum';

import { Roles } from './roles.decorator';
import { RefreshTokenGuard } from '../guards/refreshtoken.guard';
import { RolesGuard } from '../guards/role.guard';

export function Administrator() {
  return applyDecorators(
    Roles([Role.ADMIN]),
    UseGuards(RefreshTokenGuard, RolesGuard),
    ApiBearerAuth('access-token'),
  );
}
