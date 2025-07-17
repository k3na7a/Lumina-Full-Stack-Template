import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { readFile } from 'node:fs/promises';
import * as mime from 'mime-types';
import * as Path from 'path';

import { LogService } from 'src/app/queues/logging/services/log.service';
import { LoggerActions } from 'src/app/queues/logging/enums/logger-actions.enum';
import { createReadStream, statSync } from 'node:fs';
import { kilobyte } from '@lib/constants/size.constants';

@Injectable()
export class S3Service {
  constructor(private readonly logService: LogService) {}

  private readonly s3: S3Client = new S3Client({
    region: String(process.env.AWS_S3_REGION),
    credentials: {
      accessKeyId: String(process.env.AWS_ACCESS),
      secretAccessKey: String(process.env.AWS_SECRET),
    },
  });

  private get bucket(): string {
    return String(process.env.AWS_S3_BUCKET);
  }

  private get bucketPath(): string {
    return String(process.env.AWS_S3_URL);
  }

  private buildKey(path: string, filename: string): string {
    return `${path}/${filename}`;
  }

  public async uploadFile(
    file: Express.Multer.File,
    path: string,
  ): Promise<PutObjectCommandOutput> {
    const key = this.buildKey(path, file.filename);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: await readFile(file.path),
      ContentType: file.mimetype,
    });

    const result = await this.s3.send(command);

    await this.logService.log({
      type: LoggerActions.INFO,
      context: S3Service.name,
      message: {
        message: `Uploaded file to ${this.bucketPath}/${key}`,
        file: key,
        bucket: this.bucket,
        size: `${Number(file.size / kilobyte).toFixed(2)}kb`,
        mimetype: file.mimetype,
      },
    });

    return result;
  }

  async uploadFromDisk(
    localFilePath: string,
    path: string,
  ): Promise<PutObjectCommandOutput> {
    const fileStream = createReadStream(localFilePath);
    const mimetype = mime.lookup(localFilePath) || undefined;
    const { size } = statSync(localFilePath);

    const filename = Path.basename(localFilePath);
    const key = this.buildKey(path, filename);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: fileStream,
      ContentType: mimetype,
    });

    const result = await this.s3.send(command);

    await this.logService.log({
      type: LoggerActions.INFO,
      context: S3Service.name,
      message: {
        message: `Uploaded file to ${this.bucketPath}/${key}`,
        file: key,
        bucket: this.bucket,
        size: `${Number(size / kilobyte).toFixed(2)}kb`,
        mimetype,
      },
    });

    return result;
  }

  public async deleteFile(
    filename: string,
    path: string,
  ): Promise<DeleteObjectCommandOutput> {
    const key = this.buildKey(path, filename);
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const result = await this.s3.send(command);

    await this.logService.log({
      type: LoggerActions.INFO,
      context: S3Service.name,
      message: {
        message: `Deleted file from ${this.bucket}/${key}`,
        file: key,
        bucket: this.bucket,
      },
    });

    return result;
  }
}
