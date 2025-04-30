import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMAGE_TYPE, ImageEntity } from '../entities/image.entity';
import { S3Service } from 'src/app/media/services/s3.service';
import { unlink } from 'node:fs/promises';
import { STORAGE } from 'src/library/data/enums/files.enum';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private repository: Repository<ImageEntity>,
    private readonly s3service: S3Service,
  ) {}

  public async create(
    file: Express.Multer.File,
    type: IMAGE_TYPE,
  ): Promise<ImageEntity> {
    const { filename, path } = file;
    const image = this.repository.create({ filename, type });

    await this.s3service.uploadFile(file, STORAGE.AVATARS);

    unlink(path);

    return this.repository.save(image);
  }

  public async findOneById(id: string): Promise<ImageEntity> {
    const image = await this.repository.findOne({ where: { id } });
    if (!image) throw new NotFoundException();

    return image;
  }

  public async update(
    id: string,
    file: Express.Multer.File,
    type?: IMAGE_TYPE,
  ): Promise<ImageEntity> {
    const image = await this.findOneById(id);
    const { filename, path } = file;

    await this.s3service.uploadFile(file, STORAGE.AVATARS);
    await this.s3service.deleteFile(image.filename, STORAGE.AVATARS);

    unlink(path);

    return this.repository.save({ ...image, filename, type });
  }

  public async remove(id: string): Promise<ImageEntity> {
    const avatar = await this.findOneById(id);

    await this.s3service.deleteFile(avatar.filename, STORAGE.AVATARS);

    return this.repository.remove(avatar);
  }
}
