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

import { PlatformAdminService } from 'src/app/features/administration/games/services/platforms.service';
import { IsAdministrator } from 'src/app/common/decorators/administrator.decorator';
import { PlatformEntity } from 'src/app/modules/games/entities/platform.entity';

import {
  CreatePlatformDto,
  PlatformPaginationOptions,
} from 'src/app/features/administration/games/dto/platform.dto';
import { PaginationDto } from 'src/library/dto/pagination.dto';

@ApiTags('Administration / Games & Software / Platforms')
@Controller('platforms')
@IsAdministrator()
@UseInterceptors(ClassSerializerInterceptor)
class PlatformAdminController {
  constructor(private readonly service: PlatformAdminService) {}

  @Put('')
  @ApiBody({ type: CreatePlatformDto })
  @ApiOkResponse({ type: PlatformEntity })
  async create(@Body() dto: CreatePlatformDto): Promise<PlatformEntity> {
    return this.service.create(dto);
  }

  @Get('')
  @ApiOkResponse({ type: PaginationDto<PlatformEntity> })
  async paginate(
    @Query() params: PlatformPaginationOptions,
  ): Promise<PaginationDto<PlatformEntity>> {
    return this.service.paginate(params);
  }

  @Get('/:id')
  @ApiOkResponse({ type: PlatformEntity })
  async getSingle(@Param('id') id: string): Promise<PlatformEntity> {
    return this.service.findOne(id);
  }

  @Patch('/:id')
  @ApiOkResponse({ type: PlatformEntity })
  async update(
    @Param('id') id: string,
    @Body() dto: CreatePlatformDto,
  ): Promise<PlatformEntity> {
    return this.service.update(id, dto);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: PlatformEntity })
  async delete(@Param('id') id: string): Promise<PlatformEntity> {
    return this.service.remove(id);
  }
}

export { PlatformAdminController };
