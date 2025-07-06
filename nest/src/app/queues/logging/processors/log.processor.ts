import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as path from 'path';
import * as moment from 'moment';

import { useFileManager } from 'src/app/common/utilities/fileManager.util';
import { jobtype } from 'src/library/interfaces/logger.interface';
import { megabyte } from 'src/library/constants/size.constants';
import { LoggerQueues } from 'src/library/enums/logger-actions.enum';

@Processor(LoggerQueues.LOG_QUEUE)
export class LogQueueProcessor extends WorkerHost {
  private readonly fileManager = useFileManager();
  private readonly MAX_SIZE_MB = 10 * megabyte;
  private readonly directory_name = 'logs';

  private buildLogPath(dateString: string, suffix: string): string {
    return path.join(
      process.cwd(),
      this.directory_name,
      `${dateString}${suffix}.log`,
    );
  }

  async process(job: Job<jobtype>): Promise<void> {
    const { message, type, context, requestInfo: req } = job.data;
    const { appendFile, accessFile, getFileSizeMB, createDirectory } =
      this.fileManager;

    const now: moment.Moment = moment();
    const dateString: string = now.format('YYYYMMDD');
    const timeString: string = now.format('HH:mm');
    const calendar: string = now.format('L');

    const requestContext: string = `RequestID: ${req?.requestId || 'SYSTEM'} | IP: ${req?.ipAddress || '-'} | UserID: ${req?.userId || '-'}`;

    const new_message: string = `[${timeString}] ${type.toUpperCase()} [${context}] ${requestContext} | ${message}`;
    const log_start: string = `[${timeString}] LOG START -- ${calendar}\n${new_message}\n`;

    let suffix: string = '';
    let exists: boolean = false;
    let srcPath: string = this.buildLogPath(dateString, suffix);

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
  }

  async onApplicationShutdown(): Promise<void> {
    await Promise.allSettled([this.worker.close()]);
  }
}
