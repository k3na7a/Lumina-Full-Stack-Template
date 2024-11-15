import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { PaginationDto, PaginationMeta } from 'src/library/dto/pagination.dto';
import { GameDto, GamePaginationOptions } from '../dto/game.dto';
import { PlatformService } from './platform.service';
import { GenreService } from './genre.service';
import { CoverService } from './cover.service';
import { SeriesService } from './series.service';
import { DeveloperService } from './developer.service';
import { PublisherService } from './publisher.service';
import { GametypeService } from './gametype.service';

@Injectable()
class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly repository: Repository<GameEntity>,
    private readonly platformService: PlatformService,
    private readonly genreService: GenreService,
    private readonly coverService: CoverService,
    private readonly seriesService: SeriesService,
    private readonly developerService: DeveloperService,
    private readonly publisherService: PublisherService,
    private readonly gametypeService: GametypeService,
  ) {}

  public async create(
    dto: GameDto,
    file?: Express.Multer.File,
  ): Promise<GameEntity> {
    const error_check = await this.findOne(dto.slug).catch(() => undefined);
    if (error_check) throw new ForbiddenException();

    let cover = null;
    if (file) cover = await this.coverService.create(file);

    const platforms = await this.platformService.findManyById(dto.platform_ids);
    const genres = await this.genreService.findManyById(dto.genre_ids);
    const series = await this.seriesService.findManyById(dto.series_ids);

    const developers = await this.developerService.findManyById(
      dto.developer_ids,
    );

    const publishers = await this.publisherService.findManyById(
      dto.publisher_ids,
    );

    const children = await this.findManyById(dto.related_ids);
    const gametype = await this.gametypeService.findOneById(dto.gametype_id);

    const game = this.repository.create({
      ...dto,
      platforms,
      genres,
      cover,
      series,
      developers,
      publishers,
      gametype,
      children,
    });

    return this.repository.save(game);
  }

  public async update(id: string, dto: GameDto): Promise<GameEntity> {
    const game = await this.findOneById(id);

    const error_check = await this.findOne(dto.slug).catch(() => undefined);
    if (dto.slug !== game.slug && error_check) throw new ForbiddenException();

    const platforms = await this.platformService.findManyById(dto.platform_ids);
    const genres = await this.genreService.findManyById(dto.genre_ids);
    const series = await this.seriesService.findManyById(dto.series_ids);

    const developers = await this.developerService.findManyById(
      dto.developer_ids,
    );

    const publishers = await this.publisherService.findManyById(
      dto.publisher_ids,
    );

    const children = await this.findManyById(dto.related_ids);
    const gametype = await this.gametypeService.findOneById(dto.gametype_id);

    return this.repository.save({
      ...game,
      ...dto,
      platforms,
      genres,
      series,
      developers,
      publishers,
      gametype,
      children,
    });
  }

  public async updateCover(
    id: string,
    file: Express.Multer.File,
  ): Promise<GameEntity> {
    const game = await this.findOneById(id);

    let cover;
    if (game.cover)
      cover = await this.coverService.update(game.cover.id as string, file);
    else cover = await this.coverService.create(file);

    return this.repository.save({
      ...game,
      cover,
    });
  }

  public async getSingle(slug: string): Promise<GameEntity> {
    const query = await this.repository
      .createQueryBuilder('game')
      .where('game.slug = :slug', { slug })
      .leftJoinAndSelect('game.cover', 'cover')
      .leftJoinAndSelect('game.gametype', 'gametype')
      .leftJoinAndSelect('game.platforms', 'platform')
      .leftJoinAndSelect('game.genres', 'genre')
      .leftJoinAndSelect('game.series', 'series')
      .leftJoinAndSelect('game.developers', 'developer')
      .leftJoinAndSelect('game.publishers', 'publisher')
      .leftJoinAndSelect('game.children', 'children')
      .leftJoinAndSelect('children.cover', 'ch_cover')
      .leftJoinAndSelect('children.gametype', 'ch_type')
      .getOne();

    if (!query) throw new NotFoundException();
    return query;
  }

  public async paginate(
    pageOptions: GamePaginationOptions,
  ): Promise<PaginationDto<GameEntity>> {
    const {
      sort,
      search,
      order,
      take,
      skip,
      expanded,
      platforms,
      genres,
      series,
      developers,
      publishers,
      gametypes,
    } = pageOptions;

    const query = this.repository
      .createQueryBuilder('game')
      .orderBy({ [sort]: order })
      .take(take)
      .skip(skip)
      .where('game.name like :query', { query: `%${search}%` })
      .leftJoinAndSelect('game.cover', 'cover')
      .leftJoinAndSelect('game.gametype', 'gametype');

    if (platforms.length)
      query.innerJoin('game.platforms', 'pf', 'pf.slug IN (:...pfm)', {
        pfm: platforms,
      });

    if (genres.length)
      query.innerJoin('game.genres', 'gn', 'gn.slug IN (:...gnr)', {
        gnr: genres,
      });

    if (series.length)
      query.innerJoin('game.series', 'sr', 'sr.slug IN (:...srs)', {
        srs: series,
      });

    if (developers.length)
      query.innerJoin('game.developers', 'dv', 'dv.slug IN (:...dvp)', {
        dvp: developers,
      });

    if (publishers.length)
      query.innerJoin('game.publishers', 'pb', 'pb.slug IN (:...pbl)', {
        pbl: publishers,
      });

    if (gametypes.length)
      query.innerJoin('game.gametype', 'gy', 'gy.slug IN (:...gty)', {
        gty: gametypes,
      });

    if (expanded)
      query
        .leftJoinAndSelect('game.platforms', 'platform')
        .leftJoinAndSelect('game.genres', 'genre')
        .leftJoinAndSelect('game.series', 'series');

    const [games, itemCount] = await query.getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(games, meta);
  }

  public async findOne(slug: string): Promise<GameEntity> {
    const game = await this.repository.findOne({
      where: [{ id: slug }, { slug }],
    });
    if (!game) throw new NotFoundException();
    return game;
  }

  public async findOneById(id: string): Promise<GameEntity> {
    const game = await this.repository.findOne({ where: { id } });
    if (!game) throw new NotFoundException();
    return game;
  }

  public async findManyById(ids?: Array<string>): Promise<Array<GameEntity>> {
    return this.repository.find({ where: { id: In(ids || []) } });
  }

  public async remove(id: string): Promise<GameEntity> {
    const game = await this.findOneById(id);

    const { cover } = game;
    if (cover) await this.coverService.remove(cover.id);

    return this.repository.remove(game);
  }
}

export { GameService };
