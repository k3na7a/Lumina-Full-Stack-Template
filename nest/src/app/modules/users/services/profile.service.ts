import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProfileEntity } from 'src/app/modules/users/entities/profile.entity';
import { IMAGE_TYPE } from 'src/library/enums/image-routes.enum';
import { ImageService } from 'src/app/modules/media/services/image.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repository: Repository<ProfileEntity>,
    private readonly imageService: ImageService,
  ) {}

  public async update(
    profile: ProfileEntity,
    dto: Partial<ProfileEntity>,
  ): Promise<ProfileEntity> {
    const updated = await this.repository.preload({
      id: profile.id,
      ...dto,
    });

    if (!updated) throw new NotFoundException('Profile not found');

    return this.repository.save(updated);
  }

  public async uploadAvatar(
    profile: ProfileEntity,
    file: Express.Multer.File,
  ): Promise<ProfileEntity> {
    const avatar = profile.avatar
      ? await this.imageService.update(profile.avatar.id, {
          file,
          type: IMAGE_TYPE.AVATARS,
        })
      : await this.imageService.create({
          file,
          altText: `Avatar for profile ID ${profile.id}`,
          type: IMAGE_TYPE.AVATARS,
        });

    return this.update(profile, { avatar });
  }

  public async removeAvatar(profile: ProfileEntity): Promise<ProfileEntity> {
    if (!profile.avatar) throw new NotFoundException('Avatar not found');

    const { avatar } = profile;
    await this.imageService.remove(avatar.id);

    return this.update(profile, { avatar: null });
  }
}
