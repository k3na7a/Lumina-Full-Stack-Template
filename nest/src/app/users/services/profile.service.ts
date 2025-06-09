import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileEntity } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageService } from 'src/app/media/services/image.service';
import { IMAGE_TYPE } from 'src/app/media/constants/image-routes.constants';
import { ImageEntity } from 'src/app/media/entities/image.entity';
import { UpdateUserProfile } from '../interfaces/user.interfaces';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repository: Repository<ProfileEntity>,
    private readonly imageService: ImageService,
  ) {}

  private async updateAvatar(
    { avatar }: ProfileEntity,
    file: Express.Multer.File,
  ): Promise<ImageEntity> {
    if (!avatar) throw new NotFoundException('Avatar not found');

    return this.imageService.update(avatar.id, {
      file,
      type: IMAGE_TYPE.AVATARS,
    });
  }

  private async createAvatar(
    profile: ProfileEntity,
    file: Express.Multer.File,
  ): Promise<ImageEntity> {
    return this.imageService.create({
      file,
      altText: `Avatar for profile ID ${profile.id}`,
      type: IMAGE_TYPE.AVATARS,
    });
  }

  public async handleAvatarUpload(
    profile: ProfileEntity,
    file: Express.Multer.File,
  ): Promise<ProfileEntity> {
    const avatar = profile.avatar
      ? await this.updateAvatar(profile, file)
      : await this.createAvatar(profile, file);

    return this.update(profile, { avatar });
  }

  public async removeAvatar(profile: ProfileEntity): Promise<ProfileEntity> {
    if (!profile.avatar) throw new NotFoundException('Avatar not found');

    const { avatar } = profile;
    await this.imageService.remove(avatar.id);

    return this.update(profile, { avatar: null });
  }

  public async update(
    profile: ProfileEntity,
    dto: UpdateUserProfile,
  ): Promise<ProfileEntity> {
    const updated = await this.repository.preload({
      id: profile.id,
      ...dto,
    });

    if (!updated) throw new NotFoundException('Profile not found');

    return this.repository.save(updated);
  }
}
