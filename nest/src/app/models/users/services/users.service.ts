import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from 'src/library/entities/user.entity';
import {
  CreateUserInterface,
  UpdateUserInterface,
} from 'src/library/interfaces/user.interfaces';
import {
  PaginationDto,
  PaginationMeta,
  PaginationOptions,
} from 'src/library/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async create(dto: CreateUserInterface): Promise<UserEntity> {
    const salt: string = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(dto.password, salt);

    const user = this.userRepository.create({ ...dto, password: hash });

    return this.userRepository.save(user);
  }

  public async paginate(
    pageOptions: PaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    const [users, itemCount] = await this.userRepository.findAndCount({
      order: { $createdAt: pageOptions.order },
      take: pageOptions.take,
      skip: pageOptions.skip,
    });

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(users, meta);
  }

  public async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException();
    return user;
  }

  public async findOneById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { $id: id } });
    if (!user) throw new NotFoundException();
    return user;
  }

  public async update(
    id: string,
    dto: UpdateUserInterface,
  ): Promise<UserEntity> {
    const user = await this.findOneById(id);
    return this.userRepository.save({ ...user, ...dto });
  }

  public async remove(id: string): Promise<UserEntity> {
    const user = await this.findOneById(id);
    return this.userRepository.remove(user);
  }
}
