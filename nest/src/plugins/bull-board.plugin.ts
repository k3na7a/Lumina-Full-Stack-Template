import { INestApplication } from '@nestjs/common';

import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

import { LogService } from 'src/app/modules/log/services/log.service';

export class BullBoardPlugin {
  public static init(app: INestApplication, path: string): void {
    const logService: LogService = app.get(LogService);

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath(path);
    
    createBullBoard({
      queues: [new BullMQAdapter(logService.logQueue)],
      serverAdapter,
    });

    app.use(path, serverAdapter.getRouter());
  }
}
