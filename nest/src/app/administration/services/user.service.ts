import { Injectable } from '@nestjs/common';
import { UserService } from '../../modules/users/services/users.service';
import { ProfileService } from 'src/app/modules/users/services/profile.service';
import { AvatarService } from 'src/app/modules/users/services/avatar.service';
import { PaginationDto } from 'src/library/dto/pagination.dto';
import { UserEntity } from 'src/library/entities/user/user.entity';
import { UpdateUserDto, UserPaginationOptions } from 'src/library/dto/user.dto';

@Injectable()
class UserAdminService {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly avatarService: AvatarService,
  ) {}

  public async getUsersPaginated(
    options: UserPaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    return this.userService.paginate(options);
  }

  public async getUserCount(): Promise<number> {
    return this.userService.getUserCount();
  }

  public async findOneById(id: string): Promise<UserEntity> {
    return this.userService.findOneById(id);
  }

  public async updateUser(
    id: string,
    dto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<UserEntity> {
    const user = await this.findOneById(id);

    const { email, role, firstname, lastname } = dto;
    const { profile } = user;

    const name = { first: firstname, last: lastname };

    if (file) {
      if (profile.avatar)
        await this.avatarService.update(profile.avatar.id, file);
      else {
        const avatar = await this.avatarService.create(file);
        await this.profileService.update(profile.id, { avatar });
      }
    }

    if (dto['remove-avatar']) {
      if (profile.avatar) await this.avatarService.remove(profile.avatar.id);
    }

    await this.profileService.update(profile.id, { name });
    return this.userService.update(user.id, { email, role });
  }

  public async deleteUser(id: string): Promise<UserEntity> {
    return this.userService.remove(id);
  }
}

export { UserAdminService };
