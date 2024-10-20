import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvatarEntity } from '../entities/avatar.entity';
import { S3Service } from 'src/app/services/s3.service';
import { unlink } from 'node:fs/promises';
import { STORAGE } from 'src/library/enums/files.enum';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(AvatarEntity)
    private repository: Repository<AvatarEntity>,
    private readonly s3service: S3Service,
  ) {}

  public async create(file: Express.Multer.File): Promise<AvatarEntity> {
    const { filename, path } = file;
    const avatar = this.repository.create({ filename });

    await this.s3service.uploadFile(file, STORAGE.AVATARS);

    unlink(path);

    return this.repository.save(avatar);
  }

  public async findOneById(id: string): Promise<AvatarEntity> {
    const avatar = await this.repository.findOne({ where: { id } });
    if (!avatar) throw new NotFoundException();

    return avatar;
  }

  public async update(
    id: string,
    file: Express.Multer.File,
  ): Promise<AvatarEntity> {
    const avatar = await this.findOneById(id);
    const { filename, path } = file;

    await this.s3service.uploadFile(file, STORAGE.AVATARS);
    await this.s3service.deleteFile(avatar.filename, STORAGE.AVATARS);

    unlink(path);

    return this.repository.save({ ...avatar, filename });
  }

  public async remove(id: string): Promise<AvatarEntity> {
    const avatar = await this.findOneById(id);

    await this.s3service.deleteFile(avatar.filename, STORAGE.AVATARS);

    return this.repository.remove(avatar);
  }
}
