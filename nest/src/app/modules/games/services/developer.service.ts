import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DeveloperEntity } from '../entities/developer.entity';
import { PaginationDto, PaginationMeta } from 'src/library/dto/pagination.dto';
import { DeveloperDto, DeveloperPaginationOptions } from '../dto/developer.dto';

@Injectable()
class DeveloperService {
  constructor(
    @InjectRepository(DeveloperEntity)
    private repository: Repository<DeveloperEntity>,
  ) {}

  public async create(dto: DeveloperDto): Promise<DeveloperEntity> {
    const developer = this.repository.create(dto);
    return this.repository.save(developer);
  }

  public async find(): Promise<Array<DeveloperEntity>> {
    return this.repository.find();
  }

  public async findOneById(id: string): Promise<DeveloperEntity> {
    const developer = await this.repository.findOne({ where: { id } });
    if (!developer) throw new NotFoundException();
    return developer;
  }

  public async findManyById(
    ids?: Array<string>,
  ): Promise<Array<DeveloperEntity>> {
    return this.repository.find({ where: { id: In(ids || []) } });
  }

  public async paginate(
    pageOptions: DeveloperPaginationOptions,
  ): Promise<PaginationDto<DeveloperEntity>> {
    const { sort, search, order, take, skip } = pageOptions;
    const [platforms, itemCount] = await this.repository
      .createQueryBuilder('developer')
      .where('developer.name like :query', { query: `%${search}%` })
      .orderBy({ [sort]: order })
      .take(take)
      .offset(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(platforms, meta);
  }

  public async update(id: string, dto: DeveloperDto): Promise<DeveloperEntity> {
    const developer = await this.findOneById(id);
    return this.repository.save({ ...developer, ...dto });
  }

  public async remove(id: string): Promise<DeveloperEntity> {
    const developer = await this.findOneById(id);
    return this.repository.remove(developer);
  }
}

export { DeveloperService };
