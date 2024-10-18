import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { PaginationDto, PaginationMeta } from 'src/library/dto/pagination.dto';
import { GameDto, GamePaginationOptions } from '../dto/game.dto';
import { PlatformService } from './platform.service';
import { GenreService } from './genre.service';
import { CoverService } from './cover.service';

@Injectable()
class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly repository: Repository<GameEntity>,
    private readonly platformService: PlatformService,
    private readonly genreService: GenreService,
    private readonly coverService: CoverService,
  ) {}

  public async create(
    dto: GameDto,
    file?: Express.Multer.File,
  ): Promise<GameEntity> {
    let cover = null;
    if (file) cover = await this.coverService.create(file);

    const platforms = await this.platformService.findManyById(dto.platform_ids);
    const genres = await this.genreService.findManyById(dto.genre_ids);
    const game = this.repository.create({
      ...dto,
      platforms: platforms,
      genres: genres,
      cover,
    });

    return this.repository.save(game);
  }

  public async paginate(
    pageOptions: GamePaginationOptions,
  ): Promise<PaginationDto<GameEntity>> {
    const { sort, search, order, take, skip } = pageOptions;
    const [games, itemCount] = await this.repository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.platforms', 'platform')
      .leftJoinAndSelect('game.genres', 'genre')
      .leftJoinAndSelect('game.cover', 'cover')
      .where('game.name like :query', { query: `%${search}%` })
      .orderBy({ [sort]: order })
      .limit(take)
      .offset(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(games, meta);
  }

  public async findOneById(id: string): Promise<GameEntity> {
    const game = await this.repository.findOne({ where: { id } });
    if (!game) throw new NotFoundException();
    return game;
  }

  public async remove(id: string): Promise<GameEntity> {
    const game = await this.findOneById(id);

    const { cover } = game;
    if (cover) await this.coverService.remove(cover.id);

    return this.repository.remove(game);
  }
}

export { GameService };
