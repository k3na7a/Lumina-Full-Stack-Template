import { RequestContextStore } from 'src/app/common/middleware/request-context.middleware';
import { LoggerActions } from 'src/app/queues/logging/enums/logger-actions.enum';

export interface jobtype {
  type: LoggerActions;
  message: Record<string, any>;
  context: string;
  requestInfo?: RequestContextStore;
}
