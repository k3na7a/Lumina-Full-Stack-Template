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

import { PermissionAdminService } from '../services/permission.service';
import { CreatePermissionDto } from '../dto/permission.dto';
import { PermissionEntity } from 'src/app/modules/users/entities/permission.entity';

@ApiTags('Administration / User Management / Permissions')
@Controller('permissions')
@IsAdministrator()
@UseInterceptors(ClassSerializerInterceptor)
class PermissionAdminController {
  constructor(private readonly service: PermissionAdminService) {}

  @Put('')
  @ApiBody({ type: CreatePermissionDto })
  @ApiOkResponse({ type: PermissionEntity })
  async create(@Body() dto: CreatePermissionDto): Promise<PermissionEntity> {
    return this.service.create(dto);
  }

  @Get('')
  @ApiOkResponse({ type: PaginationDto<PermissionEntity> })
  async paginate(
    @Query() params: PaginationOptions,
  ): Promise<PaginationDto<PermissionEntity>> {
    return this.service.paginate(params);
  }

  @Get('/:id')
  @ApiOkResponse({ type: PermissionEntity })
  async getSingle(@Param('id') id: string): Promise<PermissionEntity> {
    return this.service.findOneById(id);
  }

  @Patch('/:id')
  @ApiBody({ type: CreatePermissionDto })
  @ApiOkResponse({ type: PermissionEntity })
  async update(
    @Param('id') id: string,
    @Body() dto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    return this.service.update(id, dto);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: PermissionEntity })
  async delete(@Param('id') id: string): Promise<PermissionEntity> {
    return this.service.remove(id);
  }
}

export { PermissionAdminController };
