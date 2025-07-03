import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { readFile } from 'node:fs/promises';

import { LogService } from 'src/app/queues/logging/services/log.service';
import { LoggerActions } from 'src/library/enums/logger-actions.enum';

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
      message: `Uploaded file to ${this.bucket}/${key} | size=${file.size} | type=${file.mimetype}`,
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
      message: `Deleted file from ${this.bucket}/${key}`,
    });

    return result;
  }
}
