import { Logger } from '@nestjs/common';
import { LoggerActions } from 'src/library/enums/logger-actions.enum';

export const LOG_QUEUE = 'logger-queue';
export const LOG_DLQ = 'logger-dlq';

export const logActionMap: Record<
  string,
  (message: string, context: string) => void
> = {
  [LoggerActions.INFO]: Logger.log.bind(Logger),
  [LoggerActions.WARN]: Logger.warn.bind(Logger),
  [LoggerActions.ERR]: Logger.error.bind(Logger),
};
