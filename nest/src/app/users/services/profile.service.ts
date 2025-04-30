import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateUserProfile } from 'src/app/users/interfaces/user.interfaces';
import { ProfileEntity } from '../entities/profile.entity';
import { ImageService } from 'src/app/media/services/image.service';
import { IMAGE_TYPE } from 'src/app/media/entities/image.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private repository: Repository<ProfileEntity>,
    private readonly imageService: ImageService,
  ) {}

  public async findOneById(id: string): Promise<ProfileEntity> {
    const profile = await this.repository.findOne({
      where: { id },
    });
    if (!profile) throw new NotFoundException();
    return profile;
  }

  public async update(
    id: string,
    dto: UpdateUserProfile,
  ): Promise<ProfileEntity> {
    const profile = await this.findOneById(id);
    return this.repository.save({ ...profile, ...dto });
  }

  public async handleAvatarUpload(
    profile: ProfileEntity,
    file: Express.Multer.File,
  ): Promise<void> {
    if (profile.avatar) {
      await this.imageService.update(profile.avatar.id, file);
    } else {
      const avatar = await this.imageService.create(file, IMAGE_TYPE.AVATARS);
      await this.update(profile.id, { avatar });
    }
  }

  public async removeAvatar(id: string): Promise<ProfileEntity> {
    const profile = await this.findOneById(id);
    if (!profile.avatar?.id) return profile;

    const update = await this.repository.save({ ...profile, avatar: null });
    await this.imageService.remove(profile.avatar?.id);

    return update;
  }
}
