import {
  LoggerActions,
  LoggerPath,
} from 'src/app/queues/logging/enums/logger-actions.enum';

export interface jobtype {
  path: LoggerPath;
  type: LoggerActions;
  message: Record<string, unknown>;
  context: string;
  requestInfo?: Record<string, unknown>;
}
