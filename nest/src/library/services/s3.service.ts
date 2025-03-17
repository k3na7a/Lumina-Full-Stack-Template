import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  DeleteObjectCommandInput,
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

  public async uploadFile(
    file: Express.Multer.File,
    path: string,
  ): Promise<PutObjectCommandOutput> {
    const { filename, mimetype } = file;

    const params: PutObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: path + filename,
      Body: await readFile(file.path),
      ContentType: mimetype,
    };

    const command = new PutObjectCommand(params);
    return this.s3.send(command);
  }

  public async deleteFile(
    filename: string,
    path: string,
  ): Promise<DeleteObjectCommandOutput> {
    const params: DeleteObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: path + filename,
    };

    const command = new DeleteObjectCommand(params);
    return this.s3.send(command);
  }
}
