import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformEntity } from '../entities/platform.entity';
import { In, Repository } from 'typeorm';
import { PlatformDto, PlatformPaginationOptions } from '../dto/platform.dto';
import { PaginationDto, PaginationMeta } from 'src/library/dto/pagination.dto';

@Injectable()
class PlatformService {
  constructor(
    @InjectRepository(PlatformEntity)
    private repository: Repository<PlatformEntity>,
  ) {}

  public async create(dto: PlatformDto): Promise<PlatformEntity> {
    const platform = this.repository.create(dto);
    return this.repository.save(platform);
  }

  public async find(): Promise<Array<PlatformEntity>> {
    return this.repository.find();
  }

  public async paginate(
    pageOptions: PlatformPaginationOptions,
  ): Promise<PaginationDto<PlatformEntity>> {
    const { sort, search, order, take, skip } = pageOptions;
    const [platforms, itemCount] = await this.repository
      .createQueryBuilder('platform')
      .where('platform.name like :query', { query: `%${search}%` })
      .orderBy({ [sort]: order })
      .take(take)
      .skip(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(platforms, meta);
  }

  public async findOneById(id: string): Promise<PlatformEntity> {
    const platform = await this.repository.findOne({ where: { id } });
    if (!platform) throw new NotFoundException();
    return platform;
  }

  public async findManyById(
    ids?: Array<string>,
  ): Promise<Array<PlatformEntity>> {
    return this.repository.find({ where: { id: In(ids || []) } });
  }

  public async update(id: string, dto: PlatformDto): Promise<PlatformEntity> {
    const platform = await this.findOneById(id);
    return this.repository.save({ ...platform, ...dto });
  }

  public async remove(id: string): Promise<PlatformEntity> {
    const platform = await this.findOneById(id);
    return this.repository.remove(platform);
  }
}

export { PlatformService };
