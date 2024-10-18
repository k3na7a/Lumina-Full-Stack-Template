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
import { Roles } from 'src/app/authentication/decorators/roles.decorator';
import { RefreshTokenGuard } from 'src/app/authentication/guards/refreshtoken.guard';
import { RolesGuard } from 'src/app/authentication/guards/role.guard';
import {
  PlatformDto,
  PlatformPaginationOptions,
} from 'src/app/modules/games/dto/platform.dto';
import { PlatformEntity } from 'src/app/modules/games/entities/platform.entity';
import { Role } from 'src/library/enums/role.enum';

import { PlatformService } from 'src/app/modules/games/services/platform.service';
import { PaginationDto } from 'src/library/dto/pagination.dto';

@ApiTags('Administration / Game Library / Platforms')
@Controller('platforms')
@Roles([Role.ADMIN])
@UseGuards(RefreshTokenGuard, RolesGuard)
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Put('')
  @ApiBody({ type: PlatformDto })
  @ApiOkResponse({ type: PlatformEntity })
  async create(@Body() dto: PlatformDto): Promise<PlatformEntity> {
    return this.platformService.create(dto);
  }

  @Get('')
  @ApiOkResponse({ type: Array<PlatformEntity> })
  async getAll(): Promise<Array<PlatformEntity>> {
    return this.platformService.find();
  }

  @Get('paginated')
  @ApiOkResponse({ type: PaginationDto<PlatformEntity> })
  async paginate(
    @Query() params: PlatformPaginationOptions,
  ): Promise<PaginationDto<PlatformEntity>> {
    return this.platformService.paginate(params);
  }

  @Patch(':id')
  @ApiBody({ type: PlatformDto })
  @ApiOkResponse({ type: PlatformEntity })
  async update(
    @Param('id') id: string,
    @Body() dto: PlatformDto,
  ): Promise<PlatformEntity> {
    return this.platformService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: PlatformEntity })
  async delete(@Param('id') id: string): Promise<PlatformEntity> {
    return this.platformService.remove(id);
  }
}

export { PlatformController };
