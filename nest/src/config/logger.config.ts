export const LOG_QUEUE = 'logger-queue';
export const LOG_DLQ = 'logger-dlq';

export enum LoggerActions {
  INFO = 'information',
  WARN = 'warning',
  ERR = 'error',
}

export interface jobtype {
  message: string;
  type: LoggerActions;
  context: string;
}
