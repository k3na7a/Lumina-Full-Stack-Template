import { RequestContextStore } from 'src/app/common/middleware/request-context.middleware';
import {
  LoggerActions,
  LoggerPath,
} from 'src/app/queues/logging/enums/logger-actions.enum';

export interface jobtype {
  path: LoggerPath;
  type: LoggerActions;
  message: Record<string, any>;
  context: string;
  requestInfo?: RequestContextStore;
}
