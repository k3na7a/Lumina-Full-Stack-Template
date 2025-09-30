import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Permissions } from 'src/common/decorators/permissions.decorator';

import { PaginationDto } from 'src/common/dto/pagination.dto';

import { PermissionAdminService } from '../services/permission.service';
import {
  CreatePermissionDto,
  PermissionPaginationOptions,
} from 'src/modules/users/dto/permission.dto';
import { PermissionEntity } from 'src/modules/users/entities/permission.entity';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  PERMISSION_MATRIX,
  PermissionDomain,
} from '@lib/constants/permissions.constants';

@ApiTags('Administration / User Management / Permissions')
@Controller('permissions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
class PermissionAdminController {
  constructor(private readonly service: PermissionAdminService) {}

  @Put('')
  @ApiBody({ type: CreatePermissionDto })
  @ApiOkResponse({ type: PermissionEntity })
  @Permissions(
    PERMISSION_MATRIX[PermissionDomain.PERMISSION_MANAGEMENT].CREATE_PERMISSION,
  )
  async create(@Body() dto: CreatePermissionDto): Promise<PermissionEntity> {
    return this.service.create(dto);
  }

  @Get('')
  @ApiOkResponse({ type: PaginationDto<PermissionEntity> })
  @Permissions(
    PERMISSION_MATRIX[PermissionDomain.PERMISSION_MANAGEMENT].READ_PERMISSION,
  )
  async paginate(
    @Query() params: PermissionPaginationOptions,
  ): Promise<PaginationDto<PermissionEntity>> {
    return this.service.paginate(params);
  }

  @Get('/:id')
  @ApiOkResponse({ type: PermissionEntity })
  @Permissions(
    PERMISSION_MATRIX[PermissionDomain.PERMISSION_MANAGEMENT].READ_PERMISSION,
  )
  async getSingle(@Param('id') id: string): Promise<PermissionEntity> {
    return this.service.findOneById(id);
  }

  @Patch('/:id')
  @ApiBody({ type: CreatePermissionDto })
  @ApiOkResponse({ type: PermissionEntity })
  @Permissions(
    PERMISSION_MATRIX[PermissionDomain.PERMISSION_MANAGEMENT].UPDATE_PERMISSION,
  )
  async update(
    @Param('id') id: string,
    @Body() dto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    return this.service.update(id, dto);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: PermissionEntity })
  @Permissions(
    PERMISSION_MATRIX[PermissionDomain.PERMISSION_MANAGEMENT].DELETE_PERMISSION,
  )
  async delete(@Param('id') id: string): Promise<PermissionEntity> {
    return this.service.remove(id);
  }
}

export { PermissionAdminController };
