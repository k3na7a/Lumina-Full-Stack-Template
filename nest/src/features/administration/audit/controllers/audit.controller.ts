import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import {
  PERMISSION_MATRIX,
  PermissionDomain,
} from '@lib/constants/permissions.constants';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { AuditPaginationOptions } from 'src/modules/audit/dto/audit.dto';
import { AuditService } from 'src/modules/audit/service/audit.service';
import { AuditEntity } from 'src/modules/audit/entities/audit.entity';

@ApiTags('Administration / Audit Events')
@Controller('')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AuditAdminController {
  constructor(private readonly service: AuditService) {}

  @Get('')
  @ApiOkResponse({ type: PaginationDto<AuditEntity> })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.AUDIT_MANAGEMENT].READ_AUDIT)
  async paginate(
    @Query() params: AuditPaginationOptions,
  ): Promise<PaginationDto<AuditEntity>> {
    return this.service.paginate(params);
  }
}
