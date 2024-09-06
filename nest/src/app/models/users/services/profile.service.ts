import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserProfile } from 'src/library/interfaces/user.interfaces';
import { ProfileEntity } from 'src/library/entities/profile.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
  ) {}

  public async findOneById(id: string): Promise<ProfileEntity> {
    const profile = await this.profileRepository.findOne({
      where: { $id: id },
    });
    if (!profile) throw new NotFoundException();
    return profile;
  }

  public async update(
    id: string,
    dto: CreateUserProfile,
  ): Promise<ProfileEntity> {
    const profile = await this.findOneById(id);
    return this.profileRepository.save({ ...profile, ...dto });
  }

  public remove(profile: ProfileEntity): Promise<ProfileEntity> {
    return this.profileRepository.remove(profile);
  }
}
