import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as path from 'path';
import * as moment from 'moment';

import { useFileManager } from 'src/app/common/utilities/fileManager.util';
import { jobtype } from 'src/library/interfaces/logger.interface';
import { megabyte } from 'src/library/constants/size.constants';
import { Logger } from '@nestjs/common';
import {
  LoggerActions,
  LoggerQueues,
} from 'src/library/enums/logger-actions.enum';
import { S3Service } from 'src/app/common/services/s3.service';

@Processor(LoggerQueues.LOG_QUEUE)
export class LogQueueProcessor extends WorkerHost {
  private readonly fileManager = useFileManager();
  private readonly MAX_SIZE_MB = 1 * megabyte;
  private readonly directory_name = 'logs';

  private readonly logger = new Logger(LogQueueProcessor.name);
  private readonly logActionMap: Record<
    string,
    (message: string, context: string) => void
  > = {
    [LoggerActions.INFO]: Logger.log.bind(Logger),
    [LoggerActions.WARN]: Logger.warn.bind(Logger),
    [LoggerActions.ERR]: Logger.error.bind(Logger),
  };

  constructor(private readonly s3Service: S3Service) {
    super();
  }

  private buildLogPath(dateString: string, suffix: string): string {
    return path.join(
      process.cwd(),
      this.directory_name,
      `${dateString}${suffix}.log`,
    );
  }

  async process(job: Job<jobtype>): Promise<void> {
    const { message, type, context } = job.data;
    const { appendFile, accessFile, getFileSizeMB, createDirectory } =
      this.fileManager;

    const now: moment.Moment = moment();
    const dateString: string = now.format('YYYYMMDD');
    const timeString: string = now.format('HH:mm');
    const calendar: string = now.format('L');

    const new_message: string = `[${timeString}] ${type}: [${context}] ${message}`;
    const log_start = `[${timeString}] LOG START -- ${calendar}\n${new_message}\n`;

    let suffix = '';
    let exists = false;
    let srcPath = this.buildLogPath(dateString, suffix);

    await createDirectory(this.directory_name);

    let rotatedFilePath: string | null = null;
    while (await accessFile(srcPath)) {
      const size = await getFileSizeMB(srcPath);

      if (size < this.MAX_SIZE_MB) {
        exists = true;
        break;
      }

      rotatedFilePath = srcPath;

      suffix = suffix === '' ? '-1' : `-${parseInt(suffix.slice(1), 10) + 1}`;
      srcPath = this.buildLogPath(dateString, suffix);
    }

    if (exists) await appendFile(srcPath, `${new_message}\n`);
    else await appendFile(srcPath, log_start);

    if (rotatedFilePath) {
      this.logger.log(`Rotated log file: ${rotatedFilePath}`);

      await this.s3Service.uploadFromDisk(rotatedFilePath, 'logs');
      await this.fileManager.removeFile(rotatedFilePath);

      this.logger.log(
        `Uploaded & deleted local rotated file: ${rotatedFilePath}`,
      );
    }

    this.logActionMap[type](message, context);
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.warn(`Graceful shutdown (${signal})...`);
    await Promise.allSettled([this.worker.close()]);
    this.logger.log('Shut down gracefully.');
  }
}
