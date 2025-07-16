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
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { IsAdministrator } from 'src/app/common/decorators/administrator.decorator';

import {
  PaginationDto,
  PaginationOptions,
} from 'src/library/dto/pagination.dto';

import { RoleAdminService } from '../services/role.service';
import { RoleEntity } from 'src/app/modules/users/entities/role.entity';
import { CreateRoleDto } from '../dto/role.dto';

@ApiTags('Administration / User Management / Roles')
@Controller('roles')
@IsAdministrator()
@UseInterceptors(ClassSerializerInterceptor)
class RoleAdminController {
  constructor(private readonly service: RoleAdminService) {}

  @Put('')
  @ApiBody({ type: CreateRoleDto })
  @ApiOkResponse({ type: RoleEntity })
  async create(@Body() dto: CreateRoleDto): Promise<RoleEntity> {
    return this.service.create(dto);
  }

  @Get('')
  @ApiOkResponse({ type: PaginationDto<RoleEntity> })
  async paginate(
    @Query() params: PaginationOptions,
  ): Promise<PaginationDto<RoleEntity>> {
    return this.service.paginate(params);
  }

  @Get('/:id')
  @ApiOkResponse({ type: RoleEntity })
  async getSingle(@Param('id') id: string): Promise<RoleEntity> {
    return this.service.findOneById(id);
  }

  @Patch('/:id')
  @ApiBody({ type: CreateRoleDto })
  @ApiOkResponse({ type: RoleEntity })
  async update(
    @Param('id') id: string,
    @Body() dto: CreateRoleDto,
  ): Promise<RoleEntity> {
    return this.service.update(id, dto);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: RoleEntity })
  async delete(@Param('id') id: string): Promise<RoleEntity> {
    return this.service.remove(id);
  }
}

export { RoleAdminController };
