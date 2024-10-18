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

import { GenreEntity } from 'src/app/modules/games/entities/genre.entity';
import {
  GenreDto,
  GenrePaginationOptions,
} from 'src/app/modules/games/dto/genre.dto';
import { GenreService } from 'src/app/modules/games/services/genre.service';
import { PaginationDto } from 'src/library/dto/pagination.dto';

@ApiTags('Administration / Game Library / Genres')
@Controller('genres')
@Roles([Role.ADMIN])
@UseGuards(RefreshTokenGuard, RolesGuard)
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Put('')
  @ApiBody({ type: GenreDto })
  @ApiOkResponse({ type: GenreEntity })
  async create(@Body() dto: GenreDto): Promise<GenreEntity> {
    return this.genreService.create(dto);
  }

  @Get('')
  @ApiOkResponse({ type: Array<GenreEntity> })
  async getAll(): Promise<Array<GenreEntity>> {
    return this.genreService.find();
  }

  @Get('paginated')
  @ApiOkResponse({ type: PaginationDto<GenreEntity> })
  async paginate(
    @Query() params: GenrePaginationOptions,
  ): Promise<PaginationDto<GenreEntity>> {
    return this.genreService.paginate(params);
  }

  @Patch(':id')
  @ApiOkResponse({ type: GenreEntity })
  @ApiBody({ type: GenreDto })
  async update(
    @Param('id') id: string,
    @Body() dto: GenreDto,
  ): Promise<GenreEntity> {
    return this.genreService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: GenreEntity })
  async delete(@Param('id') id: string): Promise<GenreEntity> {
    return this.genreService.remove(id);
  }
}

export { GenreController };
