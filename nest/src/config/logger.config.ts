export const LOG_QUEUE = 'LogQueue';

export enum LoggerActions {
  LOG = 'log',
  FATAL = 'fatal',
  INFO = 'info',
  DEBUG = 'debug',
  WARNING = 'warning',
  ERROR = 'error',
  VERBOSE = 'verbose',
}
export interface jobtype {
  message: string;
  type: LoggerActions;
  context: string;
}
