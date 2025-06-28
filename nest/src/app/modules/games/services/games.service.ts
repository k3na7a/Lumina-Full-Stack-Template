import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { GameEntity } from 'src/app/modules/games/entities/game.entity';
import { GamePaginationOptions } from 'src/library/dto/game.dto';
import { PaginationDto, PaginationMeta } from 'src/library/dto/pagination.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly repository: Repository<GameEntity>,
  ) {}

  public async findOneById(id: string): Promise<GameEntity> {
    const game = await this.repository.findOne({ where: { id } });
    if (!game) throw new NotFoundException(`Game with ID ${id} not found`);

    return game;
  }

  public async findOneBySlug(slug: string): Promise<GameEntity | null> {
    return this.repository.findOne({ where: { slug } });
  }

  public async findManyById(ids?: string[]): Promise<GameEntity[]> {
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
      throw new NotAcceptableException('A game with this slug already exists.');
  }

  public async create(dto: Partial<GameEntity>): Promise<GameEntity> {
    const game = this.repository.create({ ...dto });
    return this.repository.save(game);
  }

  public async paginate(
    pageOptions: GamePaginationOptions,
  ): Promise<PaginationDto<GameEntity>> {
    const { sort, search, order, take, skip } = pageOptions;
    const [games, itemCount] = await this.repository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.cover', 'cover')
      .leftJoinAndSelect('game.platforms', 'platform')
      .where('game.name like :query', { query: `%${search}%` })
      .orderBy({ [sort]: order })
      .take(take)
      .offset(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(games, meta);
  }

  public async update(
    id: string,
    dto: Partial<GameEntity>,
  ): Promise<GameEntity> {
    const game = await this.findOneById(id);

    if (dto.slug && dto.slug !== game.slug)
      await this.ensureSlugIsUnique(dto.slug, id);

    const updated = await this.repository.preload({ id, ...dto });
    if (!updated) throw new NotFoundException(`Game with ID ${id} not found`);

    return this.repository.save(updated);
  }

  public async delete(id: string): Promise<GameEntity> {
    const game = await this.findOneById(id);

    return this.repository.remove(game);
  }
}
