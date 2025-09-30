import {
  LoggerActions,
  LoggerPath,
} from 'src/queues/logging/enums/logger-actions.enum';

export interface jobtype {
  path: LoggerPath;
  type: LoggerActions;
  message: Record<string, unknown>;
  context: string;
  requestInfo?: Record<string, unknown>;
}
