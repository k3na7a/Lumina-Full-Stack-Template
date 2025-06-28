import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { PlatformEntity } from 'src/app/modules/games/entities/platform.entity';
import { PlatformPaginationOptions } from 'src/library/dto/platform.dto';
import { PaginationDto, PaginationMeta } from 'src/library/dto/pagination.dto';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(PlatformEntity)
    private readonly repository: Repository<PlatformEntity>,
  ) {}

  public async findOneById(id: string): Promise<PlatformEntity> {
    const game = await this.repository.findOne({ where: { id } });
    if (!game) throw new NotFoundException(`Platform with ID ${id} not found`);

    return game;
  }

  public async findOneBySlug(slug: string): Promise<PlatformEntity | null> {
    return this.repository.findOne({ where: { slug } });
  }

  public async findManyById(ids?: string[]): Promise<PlatformEntity[]> {
    return this.repository.find({ where: { id: In(ids || []) } });
  }

  public async ensureSlugIsUnique(
    slug: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.repository.findOne({
      where: {
        slug,
        ...(excludeId ? { id: Not(excludeId) } : {}),
      },
    });

    if (existing)
      throw new NotAcceptableException(
        'A platform with this slug already exists.',
      );
  }

  public async create(dto: Partial<PlatformEntity>): Promise<PlatformEntity> {
    const platform = this.repository.create({ ...dto });
    return this.repository.save(platform);
  }

  public async paginate(
    pageOptions: PlatformPaginationOptions,
  ): Promise<PaginationDto<PlatformEntity>> {
    const { sort, search, order, take, skip } = pageOptions;
    const [platforms, itemCount] = await this.repository
      .createQueryBuilder('platform')
      .where('platform.name like :query', { query: `%${search}%` })
      .loadRelationCountAndMap('platform.gameCount', 'platform.games')
      .orderBy({ [sort]: order })
      .take(take)
      .offset(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(platforms, meta);
  }

  public async update(
    id: string,
    dto: Partial<PlatformEntity>,
  ): Promise<PlatformEntity> {
    const platform = await this.findOneById(id);

    if (dto.slug && dto.slug !== platform.slug)
      await this.ensureSlugIsUnique(dto.slug, id);

    const updated = await this.repository.preload({ id, ...dto });
    if (!updated)
      throw new NotFoundException(`Platform with ID ${id} not found`);

    return this.repository.save(updated);
  }

  public async delete(id: string): Promise<PlatformEntity> {
    const game = await this.findOneById(id);

    return this.repository.remove(game);
  }
}
