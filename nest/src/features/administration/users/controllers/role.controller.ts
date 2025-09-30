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

import { PaginationDto } from 'src/common/dto/pagination.dto';

import { RoleAdminService } from '../services/role.service';
import { RoleEntity } from 'src/modules/users/entities/role.entity';
import {
  CreateRoleDto,
  RolePaginationOptions,
} from 'src/modules/users/dto/role.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import {
  PERMISSION_MATRIX,
  PermissionDomain,
} from '@lib/constants/permissions.constants';

@ApiTags('Administration / User Management / Roles')
@Controller('roles')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
class RoleAdminController {
  constructor(private readonly service: RoleAdminService) {}

  @Put('')
  @ApiBody({ type: CreateRoleDto })
  @ApiOkResponse({ type: RoleEntity })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.ROLE_MANAGEMENT].CREATE_ROLE)
  async create(@Body() dto: CreateRoleDto): Promise<RoleEntity> {
    return this.service.create(dto);
  }

  @Get('')
  @ApiOkResponse({ type: PaginationDto<RoleEntity> })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.ROLE_MANAGEMENT].READ_ROLE)
  async paginate(
    @Query() params: RolePaginationOptions,
  ): Promise<PaginationDto<RoleEntity>> {
    return this.service.paginate(params);
  }

  @Get('/:id')
  @ApiOkResponse({ type: RoleEntity })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.ROLE_MANAGEMENT].READ_ROLE)
  async getSingle(@Param('id') id: string): Promise<RoleEntity> {
    return this.service.findOneById(id);
  }

  @Patch('/:id')
  @ApiBody({ type: CreateRoleDto })
  @ApiOkResponse({ type: RoleEntity })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.ROLE_MANAGEMENT].UPDATE_ROLE)
  async update(
    @Param('id') id: string,
    @Body() dto: CreateRoleDto,
  ): Promise<RoleEntity> {
    return this.service.update(id, dto);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: RoleEntity })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.ROLE_MANAGEMENT].DELETE_ROLE)
  async delete(@Param('id') id: string): Promise<RoleEntity> {
    return this.service.remove(id);
  }
}

export { RoleAdminController };
