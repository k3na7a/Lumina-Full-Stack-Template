import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'node:fs/promises';
import { STORAGE } from 'src/library/enums/files.enum';
import { Repository } from 'typeorm';
import { CoverEntity } from '../entities/cover.entity';
import { S3Service } from 'src/app/services/s3.service';

@Injectable()
export class CoverService {
  constructor(
    @InjectRepository(CoverEntity)
    private repository: Repository<CoverEntity>,
    private readonly s3service: S3Service,
  ) {}

  public async create(file: Express.Multer.File): Promise<CoverEntity> {
    const { filename, path } = file;
    const avatar = this.repository.create({ filename });

    await this.s3service.uploadFile(file, STORAGE.COVERS);

    unlink(path);

    return this.repository.save(avatar);
  }

  public async findOneById(id: string): Promise<CoverEntity> {
    const avatar = await this.repository.findOne({ where: { id } });
    if (!avatar) throw new NotFoundException();

    return avatar;
  }

  public async update(
    id: string,
    file: Express.Multer.File,
  ): Promise<CoverEntity> {
    const avatar = await this.findOneById(id);
    const { filename, path } = file;

    await this.s3service.uploadFile(file, STORAGE.COVERS);
    await this.s3service.deleteFile(avatar.filename, STORAGE.COVERS);

    unlink(path);

    return this.repository.save({ ...avatar, filename });
  }

  public async remove(id: string): Promise<CoverEntity> {
    const cover = await this.findOneById(id);

    await this.s3service.deleteFile(cover.filename, STORAGE.COVERS);

    return this.repository.remove(cover);
  }
}
