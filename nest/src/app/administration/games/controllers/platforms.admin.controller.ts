import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { GameEntity } from 'src/app/games/entities/game.entity';
import { GamePaginationOptions } from 'src/app/games/dto/game.dto';
import { PaginationDto } from 'src/library/dto/pagination.dto';
import { GamesAdminService } from '../services/games.admin.service';
import { PlatformEntity } from 'src/app/games/entities/platform.entity';

@ApiTags('Administration / Games & Software / Platforms')
@Controller('platforms')
@UseInterceptors(ClassSerializerInterceptor)
class PlatformAdminController {
  constructor(private readonly service: GamesAdminService) {}

  @Get('')
  @ApiOkResponse({ type: PaginationDto<PlatformEntity> })
  async paginate(
    @Query() params: GamePaginationOptions,
  ): Promise<PaginationDto<GameEntity>> {
    return this.service.paginate(params);
  }
}

export { PlatformAdminController };
