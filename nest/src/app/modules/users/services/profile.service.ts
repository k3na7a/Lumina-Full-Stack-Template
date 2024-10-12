import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateUserProfile } from 'src/app/modules/users/interfaces/user.interfaces';
import { ProfileEntity } from '../entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private repository: Repository<ProfileEntity>,
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

  public remove(profile: ProfileEntity): Promise<ProfileEntity> {
    return this.repository.remove(profile);
  }
}
