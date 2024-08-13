import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserProfile } from 'src/library/interfaces/user.interfaces';
import { ProfileEntity } from 'src/library/entities/profile.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private userProfileRepository: Repository<ProfileEntity>,
  ) {}

  public async findOneById(id: string): Promise<ProfileEntity | null> {
    return this.userProfileRepository.findOne({ where: { $id: id } });
  }

  public async update(
    id: string,
    dto: CreateUserProfile,
  ): Promise<ProfileEntity> {
    const profile = await this.findOneById(id);
    if (!profile) throw new NotFoundException();
    return this.userProfileRepository.save({ ...profile, ...dto });
  }

  public remove(profile: ProfileEntity): Promise<ProfileEntity> {
    return this.userProfileRepository.remove(profile);
  }
}
