import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';

import { UpdateUserProfile } from 'src/app/common/interfaces/user.interfaces';
import { updatePasswordDto } from 'src/app/features/settings/dto/updatePassword.dto';
import { deleteAccountDto } from 'src/app/features/settings/dto/deleteAccount.dto';
import { JWTDto } from 'src/app/common/dto/jwt.dto';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { ProfileService } from 'src/app/modules/users/services/profile.service';
import { UserService } from 'src/app/modules/users/services/users.service';
import { UserAccountService } from 'src/app/modules/users/services/users-account.service';
import { ImageService } from 'src/app/modules/media/services/image.service';
import { IMAGE_TYPE } from 'src/app/modules/media/enums/image-routes.enum';
import { ImageEntity } from 'src/app/modules/media/entities/image.entity';
import { AuditService } from 'src/app/modules/audit/service/audit.service';
import {
  Action,
  ActorType,
  AuditEntity,
  Domain,
  SourceType,
  SUB_DOMAIN,
} from 'src/app/modules/audit/entities/audit.entity';
import { iaudit } from 'src/app/modules/audit/dto/audit.dto';

import {
  buildAuditSnapshotsAndDiff,
  redactHeaders,
} from '@lib/utilities/object.util';

@Injectable()
export class SettingsService {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly accountService: UserAccountService,
    private readonly imageService: ImageService,
    private readonly auditService: AuditService,
  ) {}

  public async updateEmail(
    user: UserEntity,
    { password, new_email }: { password: string; new_email: string },
    res: Response,
  ): Promise<JWTDto> {
    await this.accountService.validateUser(user.email, password);

    await this.userService.update(user.id, {
      email: new_email,
    });

    const updatedUser = await this.userService.findOneById(user.id);
    return this.accountService.issueTokens(updatedUser, res);
  }

  public async updatePassword(
    user: UserEntity,
    { old_password, new_password }: updatePasswordDto,
    res: Response,
  ): Promise<JWTDto> {
    await this.accountService.validateUser(user.email, old_password);

    const hash = await this.accountService.hashPassword(new_password);
    await this.userService.update(user.id, {
      password: hash,
    });

    const updatedUser = await this.userService.findOneById(user.id);
    return this.accountService.issueTokens(updatedUser, res);
  }

  public async deleteAccount(
    user: UserEntity,
    { password }: deleteAccountDto,
    res: Response,
  ): Promise<void> {
    const { profile } = user;

    await this.accountService.revokeTokens(user, res);

    await this.accountService.validateUser(user.email, password);

    if (profile.avatar) await this.imageService.remove(profile.avatar.id);

    await this.userService.remove(user.id);
  }

  public async updateProfile(
    user: UserEntity,
    profile: UpdateUserProfile,
    req: Request,
  ): Promise<UserEntity> {
    await this.profileService.update(user.profile, profile);

    const new_user = await this.userService.findOneById(user.id);

    await this.audit({
      action: Action.UPDATE,
      entityId: new_user.id,
      entityDisplay: new_user.email,
      before: instanceToPlain(user),
      after: instanceToPlain(new_user),
      reason: 'User initiated profile update.',
      metadata: {
        path: req.url,
        method: req.method,
        headers: redactHeaders(req.headers),
      },
    });

    return new_user;
  }

  public async updateAvatar(
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<UserEntity> {
    const avatar = await this.handleAvatar(user, file);
    await this.profileService.update(user.profile, { avatar });

    return this.userService.findOneById(user.id);
  }

  public async removeAvatar(user: UserEntity): Promise<UserEntity> {
    const avatar = user.profile.avatar;
    if (!avatar) throw new BadRequestException('No profile picture found');

    await this.imageService.remove(avatar.id);

    return this.userService.findOneById(user.id);
  }

  private async handleAvatar(
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<ImageEntity> {
    const { avatar, id: profileId } = user.profile;
    const type = IMAGE_TYPE.AVATARS;

    if (!avatar)
      return this.imageService.create({
        file,
        altText: `Avatar for profile ID ${profileId}`,
        type,
      });

    return this.imageService.update(avatar.id, { file, type });
  }

  private async audit(payload: iaudit): Promise<AuditEntity> {
    const { diff, beforeRedacted, afterRedacted } = buildAuditSnapshotsAndDiff(
      payload.before,
      payload.after,
      ['password', 'refreshToken', 'resetToken'],
    );

    return this.auditService.create({
      ...payload,
      actorType: ActorType.USER,
      source: SourceType.WEB,
      domain: Domain.USER_MANAGEMENT,
      subDomain: SUB_DOMAIN.USER,
      before: beforeRedacted,
      after: afterRedacted,
      diff,
    });
  }
}
