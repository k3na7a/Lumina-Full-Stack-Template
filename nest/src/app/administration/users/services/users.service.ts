import { Injectable } from '@nestjs/common';
import {
  UpdateUserDto,
  UserPaginationOptions,
} from 'src/app/users/dto/user.dto';
import { UserEntity } from 'src/app/users/entities/user.entity';
import { ProfileService } from 'src/app/users/services/profile.service';
import { UserService } from 'src/app/users/services/users.service';
import { PaginationDto } from 'src/library/dto/pagination.dto';

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

  public async remove(id: string): Promise<UserEntity> {
    return this.userService.remove(id);
  }

  public async update(
    id: string,
    dto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<UserEntity> {
    const user = await this.userService.findOneById(id);
    const {
      email,
      role,
      firstname,
      lastname,
      ['remove-avatar']: removeAvatar,
    } = dto;
    const name = { first: firstname, last: lastname };

    if (file) {
      await this.profileService.handleAvatarUpload(user.profile, file);
    } else if (removeAvatar) {
      await this.profileService.removeAvatar(user.profile);
    }

    await this.profileService.update(user.profile, { name });
    await this.userService.update(user.id, { email, role });

    return this.userService.findOneById(user.id);
  }
}
