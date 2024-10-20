import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaginationDto, PaginationMeta } from 'src/library/dto/pagination.dto';
import { SeriesEntity } from '../entities/series.entity';
import { SeriesDto, SeriesPaginationOptions } from '../dto/series.dto';

@Injectable()
class SeriesService {
  constructor(
    @InjectRepository(SeriesEntity)
    private repository: Repository<SeriesEntity>,
  ) {}

  public async create(dto: SeriesDto): Promise<SeriesEntity> {
    const platform = this.repository.create(dto);
    return this.repository.save(platform);
  }

  public async find(): Promise<Array<SeriesEntity>> {
    return this.repository.find();
  }

  public async paginate(
    pageOptions: SeriesPaginationOptions,
  ): Promise<PaginationDto<SeriesEntity>> {
    const { sort, search, order, take, skip } = pageOptions;
    const [series, itemCount] = await this.repository
      .createQueryBuilder('series')
      .where('series.name like :query', { query: `%${search}%` })
      .orderBy({ [sort]: order })
      .limit(take)
      .offset(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(series, meta);
  }

  public async findOneById(id: string): Promise<SeriesEntity> {
    const series = await this.repository.findOne({ where: { id } });
    if (!series) throw new NotFoundException();
    return series;
  }

  public async findManyById(ids?: Array<string>): Promise<Array<SeriesEntity>> {
    return this.repository.find({ where: { id: In(ids || []) } });
  }

  public async update(id: string, dto: SeriesDto): Promise<SeriesEntity> {
    const series = await this.findOneById(id);
    return this.repository.save({ ...series, ...dto });
  }

  public async remove(id: string): Promise<SeriesEntity> {
    const series = await this.findOneById(id);
    return this.repository.remove(series);
  }
}

export { SeriesService };
