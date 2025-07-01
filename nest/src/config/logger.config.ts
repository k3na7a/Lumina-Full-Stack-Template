export const LOG_QUEUE = 'log-queue';
export enum LoggerActions {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}
export interface jobtype {
  message: string;
  type: LoggerActions;
}
