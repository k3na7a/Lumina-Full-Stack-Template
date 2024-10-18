import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import {
  CreateUserInterface,
  UpdateUserInterface,
} from 'src/app/modules/users/interfaces/user.interfaces';
import { PaginationDto, PaginationMeta } from 'src/library/dto/pagination.dto';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDto, UserPaginationOptions } from '../dto/user.dto';
import { ProfileService } from './profile.service';
import { AvatarService } from './avatar.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly profileService: ProfileService,
    private readonly avatarService: AvatarService,
  ) {}

  public async create(dto: CreateUserInterface): Promise<UserEntity> {
    const salt: string = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(dto.password, salt);

    const user = this.repository.create({ ...dto, password: hash });
    return this.repository.save(user);
  }

  public async paginate(
    pageOptions: UserPaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    const { sort, search, order, take, skip } = pageOptions;
    const [users, itemCount] = await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('profile.avatar', 'avatar')
      .where(
        "user.email like :query OR CONCAT(profile.name.first, ' ', profile.name.last) like :query",
        { query: `%${search}%` },
      )
      .orderBy({ [sort]: order })
      .limit(take)
      .offset(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(users, meta);
  }

  public async getUserCount(): Promise<number> {
    return this.repository.count();
  }

  public async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { email } });
    if (!user) throw new NotFoundException();
    return user;
  }

  public async findOneById(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    return user;
  }

  public async update(
    id: string,
    dto: UpdateUserInterface,
  ): Promise<UserEntity> {
    const user = await this.findOneById(id);
    return this.repository.save({ ...user, ...dto });
  }

  public async remove(id: string): Promise<UserEntity> {
    const user = await this.findOneById(id);
    const { profile } = user;

    if (profile.avatar) {
      await this.avatarService.remove(profile.avatar.id);
    }

    return this.repository.remove(user);
  }

  public async edit(
    id: string,
    dto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<UserEntity> {
    const user = await this.findOneById(id);

    const { email, role, firstname, lastname } = dto;
    const { profile } = user;

    const name = { first: firstname, last: lastname };

    if (file && profile.avatar) {
      await this.avatarService.update(profile.avatar.id, file);
    } else if (file) {
      const avatar = await this.avatarService.create(file);
      await this.profileService.update(profile.id, { avatar });
    } else if (dto['remove-avatar'] && profile.avatar) {
      await this.avatarService.remove(profile.avatar.id);
    }

    await this.profileService.update(profile.id, { name });
    return this.update(user.id, { email, role });
  }
}
