import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';

import { readFile } from 'node:fs/promises';

@Injectable()
export class S3Service {
  private readonly s3: S3Client = new S3Client({
    region: 'us-east-2',
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

    return this.s3.send(command);
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

    return this.s3.send(command);
  }
}
