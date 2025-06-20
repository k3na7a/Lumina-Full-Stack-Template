import { Injectable } from '@nestjs/common';

import { UpdateUserProfile } from 'src/library/interfaces/user.interfaces';
import { updatePasswordDto } from 'src/library/dto/updatePassword.dto';
import { deleteAccountDto } from 'src/library/dto/deleteAccount.dto';
import { JWTDto } from 'src/library/dto/jwt.dto';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { ProfileService } from 'src/app/modules/users/services/profile.service';
import { UserService } from 'src/app/modules/users/services/users.service';
import { UserAccountService } from 'src/app/modules/users/services/users-account.service';

@Injectable()
export class SettingsService {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly accountService: UserAccountService,
  ) {}

  public async updateEmail(
    user: UserEntity,
    { password, new_email }: { password: string; new_email: string },
  ): Promise<JWTDto> {
    await this.accountService.validateUser(user.email, password);

    await this.userService.update(user.id, {
      email: new_email,
    });

    const updatedUser = await this.userService.findOneById(user.id);
    return this.accountService.issueTokens(updatedUser);
  }

  public async updatePassword(
    user: UserEntity,
    { old_password, new_password }: updatePasswordDto,
  ): Promise<JWTDto> {
    await this.accountService.validateUser(user.email, old_password);

    const hash = await this.accountService.hashPassword(new_password);
    await this.userService.update(user.id, {
      password: hash,
    });

    const updatedUser = await this.userService.findOneById(user.id);
    return this.accountService.issueTokens(updatedUser);
  }

  public async deleteAccount(
    user: UserEntity,
    { password }: deleteAccountDto,
  ): Promise<void> {
    const { profile } = user;
    
    await this.accountService.validateUser(user.email, password);

    if (profile.avatar) await this.profileService.removeAvatar(profile);

    await this.userService.remove(user.id);
  }

  public async updateProfile(
    user: UserEntity,
    profile: UpdateUserProfile,
  ): Promise<JWTDto> {
    await this.profileService.update(user.profile, profile);

    const updatedUser = await this.userService.findOneById(user.id);
    return this.accountService.issueTokens(updatedUser);
  }

  public async updateAvatar(
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<JWTDto> {
    await this.profileService.uploadAvatar(user.profile, file);

    const updatedUser = await this.userService.findOneById(user.id);
    return this.accountService.issueTokens(updatedUser);
  }

  public async removeAvatar(user: UserEntity) {
    await this.profileService.removeAvatar(user.profile);

    const updatedUser = await this.userService.findOneById(user.id);
    return this.accountService.issueTokens(updatedUser);
  }
}
