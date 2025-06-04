import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {} from '../entities/game.entity';
import { ImageService } from 'src/app/media/services/image.service';
import { Repository } from 'typeorm';

import { AssetsEntity } from '../entities/assets.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(AssetsEntity)
    private readonly repository: Repository<AssetsEntity>,
    private readonly imageService: ImageService,
  ) {}

  public async findOneById(id: string): Promise<AssetsEntity> {
    const assets = await this.repository.findOne({ where: { id } });
    if (!assets) throw new NotFoundException(`Assets with ID ${id} not found`);

    return assets;
  }

  public async update(
    id: string,
    dto: Partial<AssetsEntity>,
  ): Promise<AssetsEntity> {
    const updated = await this.repository.preload({ id, ...dto });
    if (!updated) throw new NotFoundException(`Assets with ID ${id} not found`);

    return this.repository.save(updated);
  }

  public async remove(assets: AssetsEntity): Promise<void> {
    if (assets.coverLarge) {
      await this.imageService.remove(assets.coverLarge.id);
      await this.repository.save({ ...assets, coverLarge: null });
    }
  }
}
