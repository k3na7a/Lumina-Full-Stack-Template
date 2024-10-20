import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PublisherEntity } from '../entities/publisher.entity';
import { PaginationDto, PaginationMeta } from 'src/library/dto/pagination.dto';
import { PublisherDto, PublisherPaginationOptions } from '../dto/publisher.dto';

@Injectable()
class PublisherService {
  constructor(
    @InjectRepository(PublisherEntity)
    private repository: Repository<PublisherEntity>,
  ) {}

  public async create(dto: PublisherDto): Promise<PublisherEntity> {
    const publisher = this.repository.create(dto);
    return this.repository.save(publisher);
  }

  public async find(): Promise<Array<PublisherEntity>> {
    return this.repository.find();
  }

  public async findOneById(id: string): Promise<PublisherEntity> {
    const publisher = await this.repository.findOne({ where: { id } });
    if (!publisher) throw new NotFoundException();
    return publisher;
  }

  public async findManyById(
    ids?: Array<string>,
  ): Promise<Array<PublisherEntity>> {
    return this.repository.find({ where: { id: In(ids || []) } });
  }

  public async paginate(
    pageOptions: PublisherPaginationOptions,
  ): Promise<PaginationDto<PublisherEntity>> {
    const { sort, search, order, take, skip } = pageOptions;
    const [platforms, itemCount] = await this.repository
      .createQueryBuilder('publisher')
      .where('publisher.name like :query', { query: `%${search}%` })
      .orderBy({ [sort]: order })
      .limit(take)
      .offset(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(platforms, meta);
  }

  public async update(id: string, dto: PublisherDto): Promise<PublisherEntity> {
    const publisher = await this.findOneById(id);
    return this.repository.save({ ...publisher, ...dto });
  }

  public async remove(id: string): Promise<PublisherEntity> {
    const publisher = await this.findOneById(id);
    return this.repository.remove(publisher);
  }
}

export { PublisherService };
