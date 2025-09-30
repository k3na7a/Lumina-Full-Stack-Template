import { INestApplication } from '@nestjs/common';

import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { LogService } from 'src/queues/logging/services/log.service';
import { EmailService } from 'src/queues/email/services/email.service';

export class BullBoardPlugin {
  public static init(app: INestApplication, path: string): void {
    const logService: LogService = app.get(LogService);
    const emailService: EmailService = app.get(EmailService);

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath(path);

    createBullBoard({
      queues: [
        new BullMQAdapter(logService.logQueue),
        new BullMQAdapter(logService.deadLetterQueue),
        new BullMQAdapter(emailService.emailQueue),
        new BullMQAdapter(emailService.deadLetterQueue),
      ],
      serverAdapter,
    });

    app.use(path, serverAdapter.getRouter());
  }
}
