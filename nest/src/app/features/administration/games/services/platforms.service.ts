import { Injectable } from '@nestjs/common';

import { PlatformEntity } from 'src/app/modules/games/entities/platform.entity';
import { PlatformService } from 'src/app/modules/games/services/platforms.service';

import { PaginationDto } from 'src/app/common/dto/pagination.dto';
import { CreatePlatformDto, PlatformPaginationOptions } from 'src/app/modules/games/dto/platform.dto';

@Injectable()
export class PlatformAdminService {
  constructor(private readonly service: PlatformService) {}

  public async create(dto: CreatePlatformDto): Promise<PlatformEntity> {
    return this.service.create(dto);
  }

  public async paginate(
    params: PlatformPaginationOptions,
  ): Promise<PaginationDto<PlatformEntity>> {
    return this.service.paginate(params);
  }

  public async findOne(id: string): Promise<PlatformEntity> {
    return this.service.findOneById(id);
  }

  public async update(
    id: string,
    dto: CreatePlatformDto,
  ): Promise<PlatformEntity> {
    return this.service.update(id, dto);
  }

  public async remove(id: string): Promise<PlatformEntity> {
    return this.service.delete(id);
  }
}
