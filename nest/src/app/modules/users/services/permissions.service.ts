import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import {
  PaginationDto,
  PaginationMeta,
  PaginationOptions,
} from 'src/library/dto/pagination.dto';
import { PermissionEntity } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly repository: Repository<PermissionEntity>,
  ) {}

  public async create(
    dto: Partial<PermissionEntity>,
  ): Promise<PermissionEntity> {
    const role = this.repository.create({ ...dto });
    return this.repository.save(role);
  }

  public async findOneById(id: string): Promise<PermissionEntity> {
    const role = await this.repository.findOne({ where: { id } });
    if (!role)
      throw new NotFoundException(`Permission with ID ${id} not found`);
    return role;
  }

  public async findManyById(ids?: string[]): Promise<PermissionEntity[]> {
    return this.repository.find({ where: { id: In(ids || []) } });
  }

  public async paginate(
    pageOptions: PaginationOptions,
  ): Promise<PaginationDto<PermissionEntity>> {
    const { search, order, take, skip } = pageOptions;
    const [permissions, itemCount] = await this.repository
      .createQueryBuilder('permission')
      .where(
        'permission.label like :query OR permission.name like :query OR permission.domain like :query',
        {
          query: `%${search}%`,
        },
      )
      .orderBy({ 'permission.label': order })
      .take(take)
      .skip(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(permissions, meta);
  }

  public async update(
    id: string,
    dto: Partial<PermissionEntity>,
  ): Promise<PermissionEntity> {
    const updated = await this.repository.preload({ id, ...dto });
    if (!updated)
      throw new NotFoundException(`Permission with ID ${id} not found`);
    return this.repository.save(updated);
  }

  public async remove(id: string): Promise<PermissionEntity> {
    const permission = await this.findOneById(id);
    return this.repository.remove(permission);
  }
}
