import { Injectable } from '@nestjs/common';
import { GamePaginationOptions } from 'src/app/games/dto/game.dto';
import { PlatformEntity } from 'src/app/games/entities/platform.entity';
import { PlatformService } from 'src/app/games/services/platforms.service';
import { PaginationDto } from 'src/library/dto/pagination.dto';

@Injectable()
export class PlatformAdminService {
  constructor(private readonly platformService: PlatformService) {}

  public async paginate(
    params: GamePaginationOptions,
  ): Promise<PaginationDto<PlatformEntity>> {
    return this.platformService.paginate(params);
  }
}
