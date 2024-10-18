import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GenreEntity } from '../entities/genre.entity';
import { GenreDto, GenrePaginationOptions } from '../dto/genre.dto';
import { PaginationDto, PaginationMeta } from 'src/library/dto/pagination.dto';

@Injectable()
class GenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private repository: Repository<GenreEntity>,
  ) {}

  public async create(dto: GenreDto): Promise<GenreEntity> {
    const genre = this.repository.create(dto);
    return this.repository.save(genre);
  }

  public async find(): Promise<Array<GenreEntity>> {
    return this.repository.find();
  }

  public async findOneById(id: string): Promise<GenreEntity> {
    const genre = await this.repository.findOne({ where: { id } });
    if (!genre) throw new NotFoundException();
    return genre;
  }

  public async findManyById(ids?: Array<string>): Promise<Array<GenreEntity>> {
    return this.repository.find({ where: { id: In(ids || []) } });
  }

  public async paginate(
    pageOptions: GenrePaginationOptions,
  ): Promise<PaginationDto<GenreEntity>> {
    const { sort, search, order, take, skip } = pageOptions;
    const [platforms, itemCount] = await this.repository
      .createQueryBuilder('genre')
      .where('genre.name like :query', { query: `%${search}%` })
      .orderBy({ [sort]: order })
      .limit(take)
      .offset(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(platforms, meta);
  }

  public async update(id: string, dto: GenreDto): Promise<GenreEntity> {
    const genre = await this.findOneById(id);
    return this.repository.save({ ...genre, ...dto });
  }

  public async remove(id: string): Promise<GenreEntity> {
    const genre = await this.findOneById(id);
    return this.repository.remove(genre);
  }
}

export { GenreService };
