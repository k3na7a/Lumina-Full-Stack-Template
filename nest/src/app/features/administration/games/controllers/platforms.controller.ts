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

import { PlatformAdminService } from 'src/app/features/administration/games/services/platforms.service';
import { PlatformEntity } from 'src/app/modules/games/entities/platform.entity';
import { Permissions } from 'src/app/common/decorators/permissions.decorator';

import {
  CreatePlatformDto,
  PlatformPaginationOptions,
} from 'src/app/features/administration/games/dto/platform.dto';
import { PaginationDto } from 'src/app/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/app/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/app/common/guards/permissions.guard';
import {
  PERMISSION_MATRIX,
  PermissionDomain,
} from '@lib/constants/permissions.constants';

@ApiTags('Administration / Games & Software / Platforms')
@Controller('platforms')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
class PlatformAdminController {
  constructor(private readonly service: PlatformAdminService) {}

  @Put('')
  @ApiBody({ type: CreatePlatformDto })
  @ApiOkResponse({ type: PlatformEntity })
  @Permissions(
    PERMISSION_MATRIX[PermissionDomain.PLATFORM_MANAGEMENT].CREATE_PLATFORM,
  )
  async create(@Body() dto: CreatePlatformDto): Promise<PlatformEntity> {
    return this.service.create(dto);
  }

  @Get('')
  @ApiOkResponse({ type: PaginationDto<PlatformEntity> })
  @Permissions(
    PERMISSION_MATRIX[PermissionDomain.PLATFORM_MANAGEMENT].READ_PLATFORM,
  )
  async paginate(
    @Query() params: PlatformPaginationOptions,
  ): Promise<PaginationDto<PlatformEntity>> {
    return this.service.paginate(params);
  }

  @Get('/:id')
  @ApiOkResponse({ type: PlatformEntity })
  @Permissions(
    PERMISSION_MATRIX[PermissionDomain.PLATFORM_MANAGEMENT].READ_PLATFORM,
  )
  async getSingle(@Param('id') id: string): Promise<PlatformEntity> {
    return this.service.findOne(id);
  }

  @Patch('/:id')
  @ApiOkResponse({ type: PlatformEntity })
  @Permissions(
    PERMISSION_MATRIX[PermissionDomain.PLATFORM_MANAGEMENT].UPDATE_PLATFORM,
  )
  async update(
    @Param('id') id: string,
    @Body() dto: CreatePlatformDto,
  ): Promise<PlatformEntity> {
    return this.service.update(id, dto);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: PlatformEntity })
  @Permissions(
    PERMISSION_MATRIX[PermissionDomain.PLATFORM_MANAGEMENT].DELETE_PLATFORM,
  )
  async delete(@Param('id') id: string): Promise<PlatformEntity> {
    return this.service.remove(id);
  }
}

export { PlatformAdminController };
