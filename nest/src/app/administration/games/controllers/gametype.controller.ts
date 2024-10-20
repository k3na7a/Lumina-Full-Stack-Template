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

import { GametypeEntity } from 'src/app/modules/games/entities/gametype.entity';
import {
  GametypeDto,
  GametypePaginationOptions,
} from 'src/app/modules/games/dto/gametype.dto';
import { GametypeService } from 'src/app/modules/games/services/gametype.service';
import { PaginationDto } from 'src/library/dto/pagination.dto';

@ApiTags('Administration / Game Library / Gametypes')
@Controller('gametypes')
@Roles([Role.ADMIN])
@UseGuards(RefreshTokenGuard, RolesGuard)
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
class GametypeController {
  constructor(private readonly gametypeService: GametypeService) {}

  @Put('')
  @ApiBody({ type: GametypeDto })
  @ApiOkResponse({ type: GametypeEntity })
  async create(@Body() dto: GametypeDto): Promise<GametypeEntity> {
    return this.gametypeService.create(dto);
  }

  @Get('')
  @ApiOkResponse({ type: Array<GametypeEntity> })
  async getAll(): Promise<Array<GametypeEntity>> {
    return this.gametypeService.find();
  }

  @Get('paginated')
  @ApiOkResponse({ type: PaginationDto<GametypeEntity> })
  async paginate(
    @Query() params: GametypePaginationOptions,
  ): Promise<PaginationDto<GametypeEntity>> {
    return this.gametypeService.paginate(params);
  }

  @Patch(':id')
  @ApiOkResponse({ type: GametypeEntity })
  @ApiBody({ type: GametypeDto })
  async update(
    @Param('id') id: string,
    @Body() dto: GametypeDto,
  ): Promise<GametypeEntity> {
    return this.gametypeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: GametypeEntity })
  async delete(@Param('id') id: string): Promise<GametypeEntity> {
    return this.gametypeService.remove(id);
  }
}

export { GametypeController };
