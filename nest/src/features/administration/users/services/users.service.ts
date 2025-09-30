import { Injectable } from '@nestjs/common';
import { ImageEntity } from 'src/modules/media/entities/image.entity';
import { ImageService } from 'src/modules/media/services/image.service';

import { UserEntity } from 'src/modules/users/entities/user.entity';
import { ProfileService } from 'src/modules/users/services/profile.service';
import { UserService } from 'src/modules/users/services/users.service';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  UserPaginationOptions,
  UpdateUserDto,
} from 'src/modules/users/dto/user.dto';
import { IMAGE_TYPE } from 'src/modules/media/enums/image-routes.enum';
import { RoleService } from 'src/modules/users/services/roles.service';
import { iaudit } from 'src/modules/audit/dto/audit.dto';
import { AuditEntity } from 'src/modules/audit/entities/audit.entity';
import {
  buildAuditSnapshotsAndDiff,
  redactHeaders,
} from '@lib/utilities/object.util';
import { AuditService } from 'src/modules/audit/service/audit.service';
import { RequestContext } from 'src/common/providers/request-context.provider';
import {
  Action,
  ActorType,
  Domain,
  SourceType,
  SUB_DOMAIN,
} from '@lib/dto/audit.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserAdminService {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly imageService: ImageService,
    private readonly roleService: RoleService,
    private readonly auditService: AuditService,
    private readonly requestContext: RequestContext,
  ) {}

  private async handleAvatar(
    user: UserEntity,
    file?: Express.Multer.File,
    removeAvatar?: boolean,
  ): Promise<ImageEntity | null> {
    const { avatar, id: profileId } = user.profile;
    const type = IMAGE_TYPE.AVATARS;

    if (removeAvatar) {
      if (avatar) await this.imageService.remove(avatar.id);
      return null;
    }

    if (!file) return null;

    return avatar
      ? this.imageService.update(avatar.id, {
          file,
          type,
          altText: avatar.altText,
        })
      : this.imageService.create({
          file,
          altText: `Avatar for profile ID ${profileId}`,
          type,
        });
  }

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
      await this.imageService.remove(user.profile.avatar.id);

    await this.audit({
      action: Action.DELETE,
      entityId: user.id,
      entityDisplay: user.email,
      before: instanceToPlain(user),
      after: instanceToPlain({}),
      reason: 'User account permanently deleted by administrator.',
    });

    return this.userService.remove(id);
  }

  public async update(
    id: string,
    dto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<UserEntity> {
    const user = await this.userService.findOneById(id);

    const { email, firstname, lastname } = dto;
    const name = { first: firstname, last: lastname };

    const avatar = file
      ? await this.handleAvatar(user, file, dto['remove-avatar'])
      : user.profile.avatar;
    await this.profileService.update(user.profile, { name, avatar });

    const roles = await this.roleService.findManyById(dto.roles);
    await this.userService.update(user.id, { email, roles });

    const updatedUser = await this.userService.findOneById(user.id);

    await this.audit({
      action: Action.UPDATE,
      entityId: updatedUser.id,
      entityDisplay: updatedUser.email,
      before: instanceToPlain(user),
      after: instanceToPlain(updatedUser),
      reason: 'User account details updated by administrator.',
    });

    return updatedUser;
  }

  private async audit(payload: iaudit): Promise<AuditEntity> {
    const { diff, beforeRedacted, afterRedacted } = buildAuditSnapshotsAndDiff(
      payload.before,
      payload.after,
      ['password', 'refreshToken', 'resetToken'],
      ['roles'],
    );

    const { request } = this.requestContext.getStore() ?? {};
    const { url, method, headers } = request ?? {};

    return this.auditService.create({
      ...payload,
      actorType: ActorType.USER,
      source: SourceType.ADMIN_UI,
      domain: Domain.USER_MANAGEMENT,
      subDomain: SUB_DOMAIN.USER,
      before: beforeRedacted,
      after: afterRedacted,
      diff: diff,
      metadata: {
        path: url,
        method,
        headers: headers ? redactHeaders(headers) : undefined,
      },
    });
  }
}
