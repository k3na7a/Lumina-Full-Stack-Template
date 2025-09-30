export enum LoggerActions {
  INFO = 'information',
  WARN = 'warning',
  ERR = 'error',
}

export enum LoggerQueues {
  LOG_QUEUE = 'logger-queue',
  LOG_DLQ = 'logger-dlq',
}

export enum LoggerPath {
  AWS = 'aws',
  SYSTEM = 'system',
  SENDGRID = 'sendgrid',
  DEBUG = 'debug',
}
