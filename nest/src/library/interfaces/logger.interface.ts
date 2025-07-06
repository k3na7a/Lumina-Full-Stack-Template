import { RequestContextStore } from 'src/app/common/middleware/request-context.middleware';
import { LoggerActions } from '../enums/logger-actions.enum';

export interface jobtype {
  type: LoggerActions;
  message: string;
  context: string;
  requestInfo?: RequestContextStore;
}
