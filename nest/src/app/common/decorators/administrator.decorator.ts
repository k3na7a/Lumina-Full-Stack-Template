import { applyDecorators, UseGuards } from '@nestjs/common';

import { Role } from 'src/library/enums/role.enum';

import { Roles } from './roles.decorator';
import { RolesGuard } from '../guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function IsAdministrator() {
  return applyDecorators(
    Roles([Role.ADMIN]),
    UseGuards(RolesGuard),
    ApiBearerAuth('access-token'),
  );
}
