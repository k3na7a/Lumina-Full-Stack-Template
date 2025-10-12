import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink, readFile } from 'node:fs/promises';
import { imageSize } from 'image-size';
import { Repository } from 'typeorm';

import { ImageEntity } from 'src/modules/media/entities/image.entity';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { createImage } from 'src/common/interfaces/create-image.interface';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly repository: Repository<ImageEntity>,
    private readonly s3service: S3Service,
  ) {}

  public async findOneById(id: string): Promise<ImageEntity> {
    const image = await this.repository.findOne({ where: { id } });
    if (!image) throw new NotFoundException(`Image with ID ${id} not found`);

    return image;
  }

  private async getImageMetadata(file: Express.Multer.File) {
    const buffer = await readFile(file.path);
    const { width, height } = imageSize(buffer as unknown as Uint8Array);

    if (!width || !height)
      throw new NotAcceptableException('Could not determine image dimensions');

    return { buffer, width, height };
  }

  private async handleFileUpload(file: Express.Multer.File, type: string) {
    await this.s3service.uploadFile(file, type);
    await unlink(file.path);
  }

  public async create({
    file,
    altText,
    type,
  }: createImage): Promise<ImageEntity> {
    const { filename, size, mimetype } = file;
    const { width, height } = await this.getImageMetadata(file);

    const image = this.repository.create({
      filename,
      type,
      mimetype,
      size,
      altText,
      width,
      height,
    });

    await this.handleFileUpload(file, type);

    return this.repository.save(image);
  }

  public async update(id: string, payload: createImage): Promise<ImageEntity> {
    const image = await this.findOneById(id);
    const { file, altText, type } = payload;
    const { filename, size, mimetype } = file;
    const { width, height } = await this.getImageMetadata(file);

    await this.handleFileUpload(file, type);
    await this.s3service.deleteFile(image.filename, image.type);

    return this.repository.save({
      ...image,
      filename,
      type,
      altText,
      size,
      mimetype,
      width,
      height,
    });
  }

  public async remove(id: string): Promise<ImageEntity> {
    const image = await this.findOneById(id);
    await this.s3service.deleteFile(image.filename, image.type);
    return this.repository.remove(image);
  }
}
