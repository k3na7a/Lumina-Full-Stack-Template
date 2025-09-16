import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserPaginationOptions } from 'src/app/modules/users/dto/user.dto';
import {
  PaginationDto,
  PaginationMeta,
} from 'src/app/common/dto/pagination.dto';
import { CreateUserInterface } from 'src/app/common/interfaces/user.interfaces';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  public async create(dto: CreateUserInterface): Promise<UserEntity> {
    const user = this.repository.create({ ...dto });
    return this.repository.save(user);
  }

  public async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  public async findOneById(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  public async paginate(
    pageOptions: UserPaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    const { sort, search, order, take, skip } = pageOptions;
    const [users, itemCount] = await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('profile.avatar', 'avatar')
      .leftJoinAndSelect('user.roles', 'roles')
      .where(
        "user.email like :query OR CONCAT(profile.name.first, ' ', profile.name.last) like :query",
        { query: `%${search}%` },
      )
      .addSelect(
        "CONCAT_WS(' ', profile.name.first, profile.name.last)",
        'fullname',
      )
      .orderBy({ [sort]: order })
      .take(take)
      .skip(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(users, meta);
  }

  public async update(
    id: string,
    dto: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const updated = await this.repository.preload({ id, ...dto });
    if (!updated) throw new NotFoundException(`User with ID ${id} not found`);
    return this.repository.save(updated);
  }

  public async remove(id: string): Promise<UserEntity> {
    const user = await this.findOneById(id);
    return this.repository.remove(user);
  }
}
