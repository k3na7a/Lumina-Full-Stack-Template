import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProfileEntity } from 'src/modules/users/entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repository: Repository<ProfileEntity>,
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
}
