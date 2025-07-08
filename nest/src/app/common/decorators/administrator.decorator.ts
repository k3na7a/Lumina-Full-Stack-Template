import { applyDecorators, UseGuards } from '@nestjs/common';

import { Role } from 'src/library/enums/role.enum';

import { Roles } from './roles.decorator';
import { RolesGuard } from '../guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export function IsAdministrator() {
  return applyDecorators(
    Roles([Role.ADMIN]),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth('access-token'),
  );
}
