import { Injectable } from '@nestjs/common';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { ProfileService } from 'src/app/modules/users/services/profile.service';
import { UserService } from 'src/app/modules/users/services/users.service';

import { PaginationDto } from 'src/library/dto/pagination.dto';
import { UserPaginationOptions, UpdateUserDto } from 'src/library/dto/user.dto';

@Injectable()
export class UserAdminService {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  public async paginate(
    params: UserPaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    return this.userService.paginate(params);
  }

  public async findOneById(id: string): Promise<UserEntity> {
    return this.userService.findOneById(id);
  }

  public async remove(id: string): Promise<UserEntity> {
    const user = await this.userService.findOneById(id);

    if (user.profile.avatar)
      await this.profileService.removeAvatar(user.profile);

    return this.userService.remove(id);
  }

  public async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userService.findOneById(id);

    const { email, role, firstname, lastname } = dto;
    const name = { first: firstname, last: lastname };

    await this.profileService.update(user.profile, { name });
    await this.userService.update(user.id, { email, role });

    return this.userService.findOneById(user.id);
  }

  public async uploadAvatar(
    id: string,
    file: Express.Multer.File,
  ): Promise<UserEntity> {
    const user = await this.userService.findOneById(id);

    await this.profileService.uploadAvatar(user.profile, file);

    return this.userService.findOneById(user.id);
  }

  public async removeAvatar(id: string): Promise<UserEntity> {
    const user = await this.userService.findOneById(id);

    await this.profileService.removeAvatar(user.profile);

    return this.userService.findOneById(user.id);
  }
}
