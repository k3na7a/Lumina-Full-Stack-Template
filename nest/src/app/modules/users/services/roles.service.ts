import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import {
  PaginationDto,
  PaginationMeta,
  PaginationOptions,
} from 'src/library/dto/pagination.dto';

import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: Repository<RoleEntity>,
  ) {}

  public async create(dto: Partial<RoleEntity>): Promise<RoleEntity> {
    const role = this.repository.create({ ...dto });
    return this.repository.save(role);
  }

  public async findOneById(id: string): Promise<RoleEntity> {
    const role = await this.repository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return role;
  }

  public async findManyById(ids?: string[]): Promise<RoleEntity[]> {
    return this.repository.find({ where: { id: In(ids || []) } });
  }

  public async paginate(
    pageOptions: PaginationOptions,
  ): Promise<PaginationDto<RoleEntity>> {
    const { search, order, take, skip } = pageOptions;
    const [roles, itemCount] = await this.repository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('role.name like :query OR role.label like :query', {
        query: `%${search}%`,
      })
      .orderBy({ 'role.label': order })
      .take(take)
      .skip(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(roles, meta);
  }

  public async update(
    id: string,
    dto: Partial<RoleEntity>,
  ): Promise<RoleEntity> {
    const updated = await this.repository.preload({ id, ...dto });
    if (!updated) throw new NotFoundException(`Role with ID ${id} not found`);
    return this.repository.save(updated);
  }

  public async remove(id: string): Promise<RoleEntity> {
    const role = await this.findOneById(id);
    return this.repository.remove(role);
  }
}
