import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/app/authentication/decorators/roles.decorator';
import { RefreshTokenGuard } from 'src/app/authentication/guards/refreshtoken.guard';
import { RolesGuard } from 'src/app/authentication/guards/role.guard';
import { Role } from 'src/library/data/enums/role.enum';

export function Administrator() {
  return applyDecorators(
    Roles([Role.ADMIN]),
    UseGuards(RefreshTokenGuard, RolesGuard),
    ApiBearerAuth('access-token'),
  );
}
