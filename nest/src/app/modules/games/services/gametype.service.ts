import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GametypeEntity } from '../entities/gametype.entity';
import { PaginationDto, PaginationMeta } from 'src/library/dto/pagination.dto';
import { GametypeDto, GametypePaginationOptions } from '../dto/gametype.dto';

@Injectable()
class GametypeService {
  constructor(
    @InjectRepository(GametypeEntity)
    private repository: Repository<GametypeEntity>,
  ) {}

  public async create(dto: GametypeDto): Promise<GametypeEntity> {
    const gametype = this.repository.create(dto);
    return this.repository.save(gametype);
  }

  public async find(): Promise<Array<GametypeEntity>> {
    return this.repository.find();
  }

  public async findOneById(id: string): Promise<GametypeEntity> {
    const gametype = await this.repository.findOne({ where: { id } });
    if (!gametype) throw new NotFoundException();
    return gametype;
  }

  public async findManyById(
    ids?: Array<string>,
  ): Promise<Array<GametypeEntity>> {
    return this.repository.find({ where: { id: In(ids || []) } });
  }

  public async paginate(
    pageOptions: GametypePaginationOptions,
  ): Promise<PaginationDto<GametypeEntity>> {
    const { sort, search, order, take, skip } = pageOptions;
    const [platforms, itemCount] = await this.repository
      .createQueryBuilder('gametype')
      .where('gametype.name like :query', { query: `%${search}%` })
      .orderBy({ [sort]: order })
      .take(take)
      .skip(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(platforms, meta);
  }

  public async update(id: string, dto: GametypeDto): Promise<GametypeEntity> {
    const gametype = await this.findOneById(id);
    return this.repository.save({ ...gametype, ...dto });
  }

  public async remove(id: string): Promise<GametypeEntity> {
    const gametype = await this.findOneById(id);
    return this.repository.remove(gametype);
  }
}

export { GametypeService };
