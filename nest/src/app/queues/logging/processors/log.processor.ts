import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as path from 'path';
import * as moment from 'moment';

import { useFileManager } from 'src/app/common/utilities/fileManager.util';
import { LOG_QUEUE, logActionMap } from 'src/app/config/logger.config';
import { jobtype } from 'src/library/interfaces/logger.interface';
import { megabyte } from 'src/library/constants/size.constants';
import { Logger } from '@nestjs/common';

@Processor(LOG_QUEUE)
export class LogQueueProcessor extends WorkerHost {
  private readonly fileManager = useFileManager();
  private readonly MAX_SIZE_MB = 5 * megabyte;
  private readonly directory_name = 'logs';

  private readonly logger = new Logger(LogQueueProcessor.name);

  private buildLogPath(dateString: string, suffix: string): string {
    return path.join(
      process.cwd(),
      this.directory_name,
      `${dateString}${suffix}.log`,
    );
  }

  async process(job: Job<jobtype>) {
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

    while (await accessFile(srcPath)) {
      const size = await getFileSizeMB(srcPath);

      if (size < this.MAX_SIZE_MB) {
        exists = true;
        break;
      }

      suffix = suffix === '' ? '-1' : `-${parseInt(suffix.slice(1), 10) + 1}`;
      srcPath = this.buildLogPath(dateString, suffix);
    }

    if (exists) await appendFile(srcPath, `${new_message}\n`);
    else await appendFile(srcPath, log_start);

    logActionMap[type](message, context);
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.warn(`Graceful shutdown (${signal})...`);
    await Promise.allSettled([this.worker.close()]);
    this.logger.log('Shut down gracefully.');
  }
}
