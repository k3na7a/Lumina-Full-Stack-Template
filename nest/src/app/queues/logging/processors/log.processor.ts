import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import * as path from 'path';
import * as moment from 'moment';

import { useFileManager } from 'src/app/common/utilities/fileManager.util';
import { jobtype, LOG_QUEUE, LoggerActions } from 'src/config/logger.config';

@Processor(LOG_QUEUE)
export class LogProcessor extends WorkerHost {
  private readonly fileManager = useFileManager();
  private readonly logActionMap: Record<
    string,
    (message: string, context: string) => void
  > = {
    [LoggerActions.LOG]: Logger.log.bind(Logger),
    [LoggerActions.INFO]: Logger.log.bind(Logger),
    [LoggerActions.WARNING]: Logger.warn.bind(Logger),
    [LoggerActions.ERROR]: Logger.error.bind(Logger),
  };

  async process(job: Job<jobtype>) {
    const { message, type, context } = job.data;

    const { appendFile, accessFile } = this.fileManager;

    const now: moment.Moment = moment();
    const timeString: string = now.format('HH:mm');
    const dateString: string = now.format('YYYYMMDD');
    const calendar: string = now.format('L');

    const srcPath = path.join(process.cwd(), 'logs', `${dateString}.log`);

    const new_message: string = `[${timeString}] ${type}: ${message}`;
    const log_start = `[${timeString}] LOG START -- ${calendar}\n${new_message}\n`;

    await accessFile(srcPath)
      .then(async () => await appendFile(srcPath, `${new_message}\n`))
      .catch(async () => await appendFile(srcPath, log_start));

    this.logActionMap[type](message, context);
  }
}
