import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from '../entities/game.entity';
import { Not, Repository } from 'typeorm';
import { CreateGameDto, GamePaginationOptions } from '../dto/game.dto';
import {
  PaginationDto,
  PaginationMeta,
} from 'src/library/data/dto/pagination.dto';
import { AssetsService } from './assets.service';
import { AssetsEntity } from '../entities/assets.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly repository: Repository<GameEntity>,
    private readonly assetsService: AssetsService,
  ) {}

  public async findOneById(id: string): Promise<GameEntity> {
    const game = await this.repository.findOne({ where: { id } });
    if (!game) throw new NotFoundException(`Game with ID ${id} not found`);

    return game;
  }

  public async findOneBySlug(slug: string): Promise<GameEntity | null> {
    return this.repository.findOne({ where: { slug } });
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

  public async create(dto: CreateGameDto): Promise<GameEntity> {
    const game = this.repository.create({ ...dto, assets: new AssetsEntity() });
    return this.repository.save(game);
  }

  public async paginate(
    pageOptions: GamePaginationOptions,
  ): Promise<PaginationDto<GameEntity>> {
    const { sort, search, order, take, skip } = pageOptions;
    const [games, itemCount] = await this.repository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.assets', 'assets')
      .leftJoinAndSelect('assets.coverLarge', 'cover')
      .where('game.name like :query', { query: `%${search}%` })
      .orderBy({ [sort]: order })
      .take(take)
      .offset(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(games, meta);
  }

  public async update(id: string, dto: CreateGameDto): Promise<GameEntity> {
    const game = await this.findOneById(id);

    if (dto.slug && dto.slug !== game.slug)
      await this.ensureSlugIsUnique(dto.slug, id);

    const updated = await this.repository.preload({ id, ...dto });
    if (!updated) throw new NotFoundException(`Game with ID ${id} not found`);

    return this.repository.save(updated);
  }

  public async delete(id: string): Promise<GameEntity> {
    const game = await this.findOneById(id);

    await this.assetsService.remove(game.assets);

    return this.repository.remove(game);
  }
}
