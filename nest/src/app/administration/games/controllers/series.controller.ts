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
import { Role } from 'src/library/enums/role.enum';

import { PaginationDto } from 'src/library/dto/pagination.dto';
import { SeriesService } from 'src/app/modules/games/services/series.service';
import { SeriesEntity } from 'src/app/modules/games/entities/series.entity';
import {
  SeriesDto,
  SeriesPaginationOptions,
} from 'src/app/modules/games/dto/series.dto';

@ApiTags('Administration / Game Library / Series')
@Controller('series')
@Roles([Role.ADMIN])
@UseGuards(RefreshTokenGuard, RolesGuard)
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Put('')
  @ApiBody({ type: SeriesDto })
  @ApiOkResponse({ type: SeriesEntity })
  async create(@Body() dto: SeriesDto): Promise<SeriesEntity> {
    return this.seriesService.create(dto);
  }

  @Get('')
  @ApiOkResponse({ type: Array<SeriesEntity> })
  async getAll(): Promise<Array<SeriesEntity>> {
    return this.seriesService.find();
  }

  @Get('paginated')
  @ApiOkResponse({ type: PaginationDto<SeriesEntity> })
  async paginate(
    @Query() params: SeriesPaginationOptions,
  ): Promise<PaginationDto<SeriesEntity>> {
    return this.seriesService.paginate(params);
  }

  @Patch(':id')
  @ApiOkResponse({ type: SeriesEntity })
  @ApiBody({ type: SeriesDto })
  async update(
    @Param('id') id: string,
    @Body() dto: SeriesDto,
  ): Promise<SeriesEntity> {
    return this.seriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: SeriesEntity })
  async delete(@Param('id') id: string): Promise<SeriesEntity> {
    return this.seriesService.remove(id);
  }
}

export { SeriesController };
