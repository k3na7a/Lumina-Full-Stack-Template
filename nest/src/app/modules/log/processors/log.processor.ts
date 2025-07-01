import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import * as path from 'path';
import * as moment from 'moment';

import { useFileManager } from 'src/app/common/utilities/fileManager.util';
import { jobtype, LOG_QUEUE } from 'src/config/logger.config';

@Processor(LOG_QUEUE)
export class LogProcessor extends WorkerHost {
  private readonly FM = useFileManager();

  async process(job: Job<jobtype>) {
    const { message, type } = job.data;

    const now: moment.Moment = moment();
    const timeString: string = now.format('HH:mm');
    const dateString: string = now.format('YYYYMMDD');
    const calendar: string = now.format('L');

    const srcPath = path.join(process.cwd(), 'logs', `${dateString}.log`);
    const new_message: string = `[${timeString}] ${type}: ${message}`;

    let logs: string =
      this.FM.readFile(srcPath) || `[${timeString}] LOG START -- ${calendar}`;
    logs += `\n${new_message}`;

    await this.FM.writeFile(srcPath, logs);
    Logger.log(message);
  }
}
